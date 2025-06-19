import type { GadgetSettings } from "gadget-server";

export const settings: GadgetSettings = {
  type: "gadget/settings/v1",
  frameworkVersion: "v1.4.0",
  plugins: {
    authentications: {
      settings: {
        redirectOnSignIn: "/signed-in",
        signInPath: "/sign-in",
        unauthorizedUserRedirect: "signInPath",
        defaultSignedInRoles: ["signed-in"],
      },
      methods: {
        emailPassword: true,
        googleOAuth: {
          scopes: ["email", "profile"],
          offlineAccess: false,
          // These will be set via environment variables
          // clientId: process.env.GOOGLE_CLIENT_ID,
          // clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
      },
    },
  },
};
