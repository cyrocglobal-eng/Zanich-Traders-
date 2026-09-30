CREATE TABLE IF NOT EXISTS inquiries (
  id uuid PRIMARY KEY,
  idempotency_key uuid NOT NULL UNIQUE,
  payload_hash text NOT NULL,
  reference text NOT NULL UNIQUE,
  kind text NOT NULL CHECK (kind IN ('quote', 'feedback')),
  payload jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notification_outbox (
  id uuid PRIMARY KEY,
  inquiry_id uuid NOT NULL UNIQUE REFERENCES inquiries(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'sent', 'failed')),
  attempts integer NOT NULL DEFAULT 0,
  next_attempt_at timestamptz NOT NULL DEFAULT now(),
  locked_at timestamptz,
  provider_id text,
  error_code text,
  sent_at timestamptz
);
CREATE INDEX IF NOT EXISTS outbox_pending ON notification_outbox(next_attempt_at) WHERE status = 'pending';

CREATE TABLE IF NOT EXISTS rate_limits (
  bucket text PRIMARY KEY,
  hits integer NOT NULL,
  expires_at timestamptz NOT NULL
);
