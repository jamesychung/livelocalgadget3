import { Link, useOutletContext } from 'react-router-dom';
import type { RootOutletContext } from "../root";
import { useEffect, useState } from "react";
import { api } from "../api";

export default function () {
  const { gadgetConfig } = useOutletContext<RootOutletContext>();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const verifyEmail = async () => {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");

      if (!code) {
        setError("No verification code provided");
        return;
      }

      try {
        await api.user.verifyEmail({ code });
        setSuccess(true);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    verifyEmail();
  }, [isClient]);

  // Show loading state during SSR
  if (!isClient) {
    return <p className="format-message">Loading...</p>;
  }

  if (error) {
    return <p className="format-message error">{error}</p>;
  }

  // Use the sign-in path from config or fallback to a default
  const signInPath = gadgetConfig?.authentication?.signInPath || "/sign-in";

  return success ? (
    <p className="format-message success">
      Email has been verified successfully. <Link to={signInPath}>Sign in now</Link>
    </p>
  ) : (
    <p className="format-message">Verifying your email...</p>
  );
}
