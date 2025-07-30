import React from "react";
import { LoginPage } from "./LoginPage";

export default {
  title: "Layout/LoginPage",
  component: LoginPage,
  parameters: {
    layout: "fullscreen",
  },
};

export const Default = () => <LoginPage />;

export const WithThemeProvider = () => (
  <div style={{ height: "100vh" }}>
    <LoginPage />
  </div>
);
