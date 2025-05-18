import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const {
    prompt,
    negative_prompt,
    width,
    height,
    num_outputs,
    guidance_scale,
    scheduler,
    seed,
    model
  } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "プロンプトが必要です" });
  }
  const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
  if (!REPLICATE_API_TOKEN) {
    return res.status(500).json({ error: "APIトークンが設定されていません" });
  }
  try {
    const input: Record<string, unknown> = {
      prompt,
      scheduler: scheduler || "K_EULER",
      width: width || 768,
      height: height || 768,
      num_outputs: num_outputs || 1,
      guidance_scale: guidance_scale || 7.5,
    };
    if (negative_prompt) input.negative_prompt = negative_prompt;
    if (seed !== undefined && seed !== "") input.seed = Number(seed);
    // 画像アップロード未対応

    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
        "Prefer": "wait"
      },
      body: JSON.stringify({
        version: model || "ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4",
        input
      })
    });
    const data = await response.json();
    if (data.error) {
      return res.status(500).json({ error: data.error });
    }
    // 画像URLはdata.outputに配列で入っていることが多い
    const imageUrls = Array.isArray(data.output) ? data.output : (data.output ? [data.output] : []);
    if (!imageUrls.length) {
      return res.status(500).json({ error: "画像URLが取得できませんでした" });
    }
    return res.status(200).json({ imageUrls });
  } catch {
    return res.status(500).json({ error: "APIリクエストに失敗しました" });
  }
} 