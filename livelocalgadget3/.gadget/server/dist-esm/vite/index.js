import { getHtmlTags, getViteConfig } from "./helpers.js";
import { patchOverlay } from "../core/errors/overlay.js";
/**
 * Vite plugin that is used to configure the Vite build process for the Gadget application.
 */ export const gadget = (options)=>{
    /**
   * Available frontend type:
   * - "remix"
   * - "react-router-framework"
   * - "vite"
   */ let frontendType;
    let command;
    return {
        name: "gadget-vite-plugin",
        config: async (config, env)=>{
            const result = await getViteConfig(config, env, {
                plugin: options,
                params: {
                    assetsBucketDomain: "app-assets.gadget.dev",
                    applicationId: "239221",
                    productionEnvironmentId: "481841",
                    developmentEnvironmentVariables: {
                        "GADGET_APP": "livelocalgadget3",
                        "GADGET_ENV": "development",
                        "GADGET_PUBLIC_APP_SLUG": "livelocalgadget3",
                        "GADGET_PUBLIC_APP_ENV": "development",
                        "GADGET_FLAG_ASSISTANT_ENABLED": "true"
                    },
                    productionEnvironmentVariables: {
                        "GADGET_APP": "livelocalgadget3",
                        "GADGET_ENV": "production",
                        "GADGET_PUBLIC_APP_SLUG": "livelocalgadget3",
                        "GADGET_PUBLIC_APP_ENV": "production"
                    }
                }
            });
            frontendType = result.type;
            command = result.command;
            return result.config;
        },
        transformIndexHtml: {
            order: "pre",
            handler: (html, { server })=>{
                if (frontendType !== "vite") {
                    return [];
                }
                const tags = getHtmlTags({
                    hasAppBridgeV4: false,
                    hasBigCommerceConnection: false,
                    assetsDomain: "assets.gadget.dev",
                    hasShopifyConnection: false
                }, !!server);
                return tags;
            }
        },
        transform (src, id, opts) {
            if (id.includes("vite/dist/client/client.mjs")) {
                if (opts.ssr) return;
                return {
                    code: patchOverlay(src, "development")
                };
            }
            if (frontendType !== "vite" && command === "serve" && (id.endsWith("/web/root.tsx") || id.endsWith("/web/root.jsx"))) {
                return {
                    code: src + `
if(typeof window !== "undefined") {
  const script = window.document.createElement("script");
  script.src = "https://assets.gadget.dev/assets/devHarness.min.js";
  window.document.head.appendChild(script);

  // We need to be able to access the Vite HMR object in dev harness, so we leak it into the window object with a proxy.
  window.__gadget_vite_hmr_connection = new Proxy(import.meta.hot, {
    get(target, prop) {
      return target[prop];
    },
    set() {
      return false;
    }
  });


}
`
                };
            }
        }
    };
};
