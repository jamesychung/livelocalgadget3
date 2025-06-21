import { Link, useOutletContext } from "react-router";
import type { RootOutletContext } from "../root";
import { useEffect, useState } from "react";
import { api } from "../api";

export default function () {
  const { gadgetConfig } = useOutletContext<RootOutletContext>();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
  }, []);

  if (error) {
    return <p className="format-message error">{error}</p>;
  }

  return success ? (
    <p className="format-message success">
      Email has been verified successfully. <Link to={gadgetConfig.authentication!.signInPath}>Sign in now</Link>
    </p>
  ) : (
    <p className="format-message">Verifying your email...</p>
  );
}