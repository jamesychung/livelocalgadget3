import React from "react";
import { useOutletContext } from 'react-router-dom';
import type { AuthOutletContext } from "./_app";
import { VenueDashboard } from "../components/venue/dashboard";

export default function VenueDashboardRoute() {
  return <VenueDashboard />;
}
