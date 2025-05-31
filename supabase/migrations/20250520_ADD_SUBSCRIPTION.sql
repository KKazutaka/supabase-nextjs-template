-- ユーザー
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- プラン情報（free, pro, etc）
CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, -- 'free','basic', 'growth','max'
  price INTEGER NOT NULL, -- in JPY or USD value
  currency TEXT NOT NULL DEFAULT 'USD', -- 'JPY','USD'
  billing_interval TEXT -- 'monthly', 'yearly'
);

INSERT INTO plans (name, price, currency, billing_interval)
VALUES 
('Basic',9,'USD','monthly'),
('Growth',19,'USD','monthly'),
('Max',29,'USD','monthly');

-- サブスクリプション（ユーザーの契約状態）
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  plan_id UUID REFERENCES plans(id),
  status TEXT, -- 'free','trial','active', 'to_be_cancelled','past_due', 'incomplete'
  start_at TIMESTAMP,
  end_at TIMESTAMP,
  trial_end_at TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);