import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { components } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import { betterAuth } from "better-auth/minimal";
import authConfig from "./auth.config";

const siteUrl = process.env.SITE_URL || process.env.CONVEX_SITE_URL;

export const authComponent = createClient<DataModel>(components.betterAuth);

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  if (!siteUrl) {
    console.error("🚨 Warning: SITE_URL or CONVEX_SITE_URL is not defined in Convex Environment Variables!");
  }

  return betterAuth({
    baseURL: siteUrl,
    database: authComponent.adapter(ctx),

    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    plugins: [
      convex({ authConfig }),
    ],
    trustedOrigins: [
      "https://blog-pro-x7zh.vercel.app"
    ],
    crossDomain: {
      enabled: true,
    },
    cookie: {
      sameSite: "none",
      secure: true,
    }
  })
}

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return authComponent.getAuthUser(ctx);
  },
});