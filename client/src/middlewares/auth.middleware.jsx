import React from "react";
import { Navigate } from "react-router-dom";

export function Protected({ role, children }) {
  let auth = JSON.parse(localStorage.getItem("auth") || "{}");

  auth["role"] = auth["role"] || {};

  if (role && auth["role"]["id"] === role) return children;

  return <Navigate to="/" replace />;
}
