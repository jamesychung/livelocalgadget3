import { Provider as GadgetProvider } from "@gadgetinc/react";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { Suspense } from "react";
import { api } from "./api";
import "./app.css";
import { ProductionErrorBoundary, DevelopmentErrorBoundary } from "gadget-server/react-router";
import type { GadgetConfig } from "gadget-server";

export const links = () => [{ rel: "stylesheet", href: "https://assets.gadget.dev/assets/reset.min.css" }];

export const meta = () => [
  { charset: "utf-8" },
  { name: "viewport", content: "width=device-width, initial-scale=1" },
  { title: "Gadget React Router app" },
];

export type RootOutletContext = {
  gadgetConfig: GadgetConfig;
  csrfToken?: string;
};

export default function App() {
  // Create a proper gadget config object based on the settings
  const gadgetConfig: GadgetConfig = {
    authentication: {
      redirectOnSignIn: "/signed-in",
      redirectOnSuccessfulSignInPath: "/signed-in",
      signInPath: "/sign-in",
      unauthorizedUserRedirect: "signInPath",
      defaultSignedInRoles: ["signed-in"],
    },
  };

  return (
    <html lang="en" className="light">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Suspense>
          <GadgetProvider api={api}>
            <Outlet context={{ gadgetConfig, csrfToken: undefined }} />
          </GadgetProvider>
        </Suspense>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

// Default Gadget error boundary component
// This can be replaced with your own custom error boundary implementation
// For more info, checkout https://reactrouter.com/how-to/error-boundary#1-add-a-root-error-boundary
export const ErrorBoundary = import.meta.env.PROD ? ProductionErrorBoundary : DevelopmentErrorBoundary;