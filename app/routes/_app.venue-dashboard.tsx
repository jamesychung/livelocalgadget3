import React from "react";
import { useOutletContext } from '@remix-run/react';
import type { AuthOutletContext } from "./_app";
import { VenueDashboard } from "../components/venue/dashboard";

export default function VenueDashboardRoute() {
  return <VenueDashboard />;
}
