import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

const PLAN_PRICE_IDS: Record<string, string | undefined> = {
  basic: process.env.STRIPE_PRICE_ID_BASIC,
  growth: process.env.STRIPE_PRICE_ID_GROWTH,
  max: process.env.STRIPE_PRICE_ID_MAX,
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const { plan } = req.body;
  const priceId = PLAN_PRICE_IDS[plan];
  if (!priceId) {
    return res.status(400).json({ error: 'Invalid plan' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.origin}/dev/subscription?success=true`,
      cancel_url: `${req.headers.origin}/dev/subscription?canceled=true`,
    });

    res.status(200).json({ id: session.id });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
} 