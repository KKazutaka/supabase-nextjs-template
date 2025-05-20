"use client";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function DevPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckout = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/create-checkout-session", { method: "POST" });
      const { id } = await res.json();
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe.jsの初期化に失敗しました");
      await stripe.redirectToCheckout({ sessionId: id });
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("決済ページへの遷移に失敗しました");
      }
    } finally {
      setLoading(false);
    }
  };

  // クエリパラメータで決済結果を表示
  let message = "";
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success")) message = "決済が完了しました！";
    if (params.get("canceled")) message = "決済がキャンセルされました。";
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Stripe シングル決済テスト</h1>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-primary-700 transition disabled:opacity-50"
      >
        {loading ? "リダイレクト中..." : "決済ページへ"}
      </button>
      {error && <div className="text-red-500 mt-4">{error}</div>}
      {message && <div className="mt-4 text-green-600 font-bold">{message}</div>}
    </div>
  );
} 