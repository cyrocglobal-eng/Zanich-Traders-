type Environment = Record<string, string | undefined>;

export function validateDeployment(env: Environment) {
  const errors: string[] = [];
  const warnings: string[] = [];
  const stage = env.DEPLOYMENT_STAGE || "production";
  if (!["preview", "production"].includes(stage))
    errors.push("DEPLOYMENT_STAGE must be preview or production");
  let origin: URL | undefined;
  try {
    origin = new URL(env.NEXT_PUBLIC_SITE_URL || "");
    if (!["http:", "https:"].includes(origin.protocol) || origin.username || origin.password || origin.pathname !== "/" || origin.search || origin.hash)
      throw new Error("Invalid origin");
  } catch {
    errors.push("NEXT_PUBLIC_SITE_URL must be an HTTP(S) origin without credentials, path, query or fragment");
  }
  if (stage === "preview") {
    if (env.SITE_INDEXABLE !== "false") errors.push("Preview requires SITE_INDEXABLE=false");
    if (origin?.protocol === "http:" && (env.RESEND_API_KEY || env.EMAIL_FROM || env.OPENAI_API_KEY || env.OPENAI_MODEL))
      errors.push("Enable website intake and AI only after HTTPS is configured");
  } else {
    if (origin?.origin !== "https://zanichtraders.co.ke") errors.push("Production requires NEXT_PUBLIC_SITE_URL=https://zanichtraders.co.ke");
    if (env.SITE_INDEXABLE !== "true") errors.push("Set SITE_INDEXABLE=true when the production domain passes release checks");
  }
  const requireValues = (keys: string[]) => {
    for (const key of keys) if (!env[key]) errors.push(`${key} is required for the enabled integration`);
  };
  const intake = Boolean(env.RESEND_API_KEY || env.EMAIL_FROM);
  const agent = Boolean(env.OPENAI_API_KEY || env.OPENAI_MODEL);
  if (intake) requireValues(["DATABASE_URL", "RESEND_API_KEY", "EMAIL_FROM", "OUTBOX_SECRET"]);
  else warnings.push("Website submissions are disabled; WhatsApp remains available");
  if (agent) requireValues(["DATABASE_URL", "OPENAI_API_KEY", "OPENAI_MODEL"]);
  else warnings.push("AI support is deferred");
  if (intake || agent) {
    requireValues(["TRUSTED_IP_HEADER"]);
    if ((env.RATE_LIMIT_SALT?.length || 0) < 32) errors.push("RATE_LIMIT_SALT needs at least 32 characters");
  }
  if (intake && (env.OUTBOX_SECRET?.length || 0) < 32) errors.push("OUTBOX_SECRET needs at least 32 characters");
  if (intake && env.OUTBOX_SECRET === env.RATE_LIMIT_SALT) errors.push("OUTBOX_SECRET and RATE_LIMIT_SALT must differ");
  if (env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true") {
    if (!/^GTM-[A-Z0-9]+$/.test(env.NEXT_PUBLIC_GTM_ID || "")) errors.push("Enabled analytics requires a valid NEXT_PUBLIC_GTM_ID");
  } else warnings.push("Analytics is deferred");
  if (!env.GOOGLE_SITE_VERIFICATION) warnings.push("Search Console verification is deferred");
  if (env.BRANDS_SERVED_CONFIRMED !== "true") warnings.push("The unconfirmed brands-served count stays hidden");
  return { stage, errors, warnings };
}
