"use client";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const plans = [
  { key: "basic", name: "Basic", price: 9, description: "個人・お試し向け" },
  { key: "growth", name: "Growth", price: 19, description: "成長中のチーム向け" },
  { key: "max", name: "Max", price: 49, description: "ビジネス・大規模向け" },
];

export default function SubscriptionPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleSubscribe = async (plan: string) => {
    setLoading(plan);
    setError("");
    try {
      const res = await fetch("/api/create-subscription-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const { id, error } = await res.json();
      if (error) throw new Error(error);
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe.jsの初期化に失敗しました");
      await stripe.redirectToCheckout({ sessionId: id });
    } catch (e: unknown) {
      if (e instanceof Error) setError(e.message);
      else setError("決済ページへの遷移に失敗しました");
    } finally {
      setLoading(null);
    }
  };

  // クエリパラメータで決済結果を表示
  let message = "";
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success")) message = "サブスク決済が完了しました！";
    if (params.get("canceled")) message = "決済がキャンセルされました。";
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-10">
      <h1 className="text-2xl font-bold mb-8">サブスクリプションプラン</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {plans.map((plan) => (
          <div key={plan.key} className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <div className="text-xl font-bold mb-2">{plan.name}</div>
            <div className="text-3xl font-bold mb-2">${plan.price}<span className="text-base font-normal">/月</span></div>
            <div className="text-gray-500 mb-4">{plan.description}</div>
            <button
              onClick={() => handleSubscribe(plan.key)}
              disabled={loading === plan.key}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold w-full hover:bg-primary-700 transition disabled:opacity-50"
            >
              {loading === plan.key ? "リダイレクト中..." : `${plan.name}で申し込む`}
            </button>
          </div>
        ))}
      </div>
      {error && <div className="text-red-500 mt-4">{error}</div>}
      {message && <div className="mt-4 text-green-600 font-bold">{message}</div>}
    </div>
  );
} 