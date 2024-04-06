import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    BASE_URL:z.string(),
    NODE_ENV: z.enum(["development", "test", "production"]),
    JWT_SECRET:z.string(),
    RESEND_API_KEY:z.string(),
    UPSTASH_REDIS_REST_URL:z.string(),
    UPSTASH_REDIS_REST_TOKEN:z.string(),
    SECRET_COOKIE_PASSWORD:z.string(),
    CRYPTO_SECRET:z.string(),
    NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY:z.string(),
    NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT:z.string(),
    IMAGEKIT_PRIVATE_KEY:z.string(),
    PUSHER_APP_ID:z.string(),
    PUSHER_KEY:z.string(),
    PUSHER_SECRET:z.string(),
    PUSHER_CLUSTER:z.string()

  },
  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_BASE_URL:z.string(),
    NEXT_PUBLIC_GEO_API_KEY:z.string(),
    NEXT_PUBLIC_GEO_API_URL:z.string(),
    NEXT_PUBLIC_PUSHER_APP_KEY:z.string(),
    NEXT_PUBLIC_PUSHER_CLUSER:z.string(),
    NEXT_PUBLIC_RECAPCHA_SITEKEY:z.string(),
    NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY:z.string(),
    NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT:z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_BASE_URL:process.env.BASE_URL,
    BASE_URL:process.env.BASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    JWT_SECRET:process.env.JWT_SECRET,
    RESEND_API_KEY:process.env.RESEND_API_KEY,
    UPSTASH_REDIS_REST_URL:process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN:process.env.UPSTASH_REDIS_REST_TOKEN,
    SECRET_COOKIE_PASSWORD:process.env.SECRET_COOKIE_PASSWORD,
    CRYPTO_SECRET:process.env.CRYPTO_SECRET,
    NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY:process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
    IMAGEKIT_PRIVATE_KEY:process.env.IMAGEKIT_PRIVATE_KEY,
    NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT:process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
    PUSHER_APP_ID:process.env.PUSHER_APP_ID,
    PUSHER_KEY:process.env.PUSHER_KEY,
    PUSHER_SECRET:process.env.PUSHER_SECRET,
    PUSHER_CLUSTER:process.env.PUSHER_CLUSTER,
    NEXT_PUBLIC_PUSHER_APP_KEY:process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
    NEXT_PUBLIC_PUSHER_CLUSER:process.env.NEXT_PUBLIC_PUSHER_CLUSER,
    NEXT_PUBLIC_GEO_API_KEY:process.env.NEXT_PUBLIC_GEO_API_KEY,
    NEXT_PUBLIC_GEO_API_URL:process.env.NEXT_PUBLIC_GEO_API_URL,
    NEXT_PUBLIC_RECAPCHA_SITEKEY:process.env.NEXT_PUBLIC_RECAPCHA_SITEKEY
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
   * This is especially useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
