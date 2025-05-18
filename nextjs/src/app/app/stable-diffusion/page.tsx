"use client";
import React, { useState } from "react";

const SCHEDULERS = [
  "K_EULER",
  "DDIM",
  "DPMSolverMultistep",
  "PNDM",
  "KLMS",
  "Euler",
  "Euler a",
  "Heun",
  "DPM2",
  "DPM2 a",
];

const MODELS = [
  { label: "Stable Diffusion 2.1", value: "ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4" },
  { label: "Stable Diffusion 1.5", value: "b3d14e1cd1f9470bbb0bb68cac48e5f483e5be309551992cc33dc30654a82bb7" },
];

export default function StableDiffusionPage() {
  const [form, setForm] = useState({
    prompt: "",
    negative_prompt: "",
    width: 768,
    height: 768,
    num_outputs: 1,
    guidance_scale: 7.5,
    scheduler: "K_EULER",
    seed: "",
    model: MODELS[0].value,
  });
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value
    }));
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setImageUrls([]);
    try {
      // 画像アップロードは未対応（API拡張時に対応）
      const reqBody = { ...form, seed: form.seed === "" ? undefined : Number(form.seed) };
      const res = await fetch("/api/stable-diffusion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reqBody),
      });
      const data = await res.json();
      if (data.imageUrls) {
        setImageUrls(data.imageUrls);
      } else if (data.imageUrl) {
        setImageUrls([data.imageUrl]);
      } else {
        setError(data.error || "画像生成に失敗しました");
      }
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-5xl mx-auto py-10">
      {/* 左カラム：フォーム */}
      <div className="md:w-1/2 w-full space-y-4">
        <h1 className="text-2xl font-bold mb-2">Stable Diffusion 画像生成</h1>
        <label className="block font-semibold">prompt</label>
        <textarea
          className="w-full border rounded p-2"
          rows={3}
          name="prompt"
          placeholder="プロンプトを入力してください"
          value={form.prompt}
          onChange={handleChange}
        />
        <label className="block font-semibold">negative_prompt</label>
        <input
          className="w-full border rounded p-2"
          name="negative_prompt"
          placeholder="除外したい要素 (例: blurry, low quality)"
          value={form.negative_prompt}
          onChange={handleChange}
        />
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block font-semibold">width</label>
            <input
              type="number"
              className="w-full border rounded p-2"
              name="width"
              min={64}
              max={1024}
              step={64}
              value={form.width}
              onChange={handleChange}
            />
          </div>
          <div className="flex-1">
            <label className="block font-semibold">height</label>
            <input
              type="number"
              className="w-full border rounded p-2"
              name="height"
              min={64}
              max={1024}
              step={64}
              value={form.height}
              onChange={handleChange}
            />
          </div>
        </div>
        <label className="block font-semibold">num_outputs</label>
        <input
          type="number"
          className="w-full border rounded p-2"
          name="num_outputs"
          min={1}
          max={4}
          value={form.num_outputs}
          onChange={handleChange}
        />
        <label className="block font-semibold">guidance_scale</label>
        <input
          type="number"
          className="w-full border rounded p-2"
          name="guidance_scale"
          min={1}
          max={20}
          step={0.1}
          value={form.guidance_scale}
          onChange={handleChange}
        />
        <label className="block font-semibold">scheduler</label>
        <select
          className="w-full border rounded p-2"
          name="scheduler"
          value={form.scheduler}
          onChange={handleChange}
        >
          {SCHEDULERS.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <label className="block font-semibold">seed</label>
        <input
          type="number"
          className="w-full border rounded p-2"
          name="seed"
          placeholder="ランダムの場合は空欄"
          value={form.seed}
          onChange={handleChange}
        />
        <label className="block font-semibold">モデル選択</label>
        <select
          className="w-full border rounded p-2"
          name="model"
          value={form.model}
          onChange={handleChange}
        >
          {MODELS.map(m => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
        <button
          className="bg-primary-600 text-white px-4 py-2 rounded disabled:opacity-50 w-full mt-2"
          onClick={handleGenerate}
          disabled={loading || !form.prompt.trim()}
        >
          {loading ? "生成中..." : "画像を生成"}
        </button>
        {error && <div className="text-red-500 mt-4">{error}</div>}
      </div>
      {/* 右カラム：画像表示 */}
      <div className="md:w-1/2 w-full flex flex-col items-center justify-center min-h-[400px]">
        {imageUrls.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 w-full">
            {imageUrls.map((url, i) => (
              <img key={i} src={url} alt="生成画像" className="rounded shadow w-full" />
            ))}
          </div>
        ) : (
          <div className="text-gray-400">ここに生成画像が表示されます</div>
        )}
      </div>
    </div>
  );
} 