"use client";

import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

// Sheep icon component using the provided PNG image
const SheepIcon = () => (
  <img
    src="/Group 75.png"
    alt="Sheep Icon"
    style={{
      width: "32px",
      height: "32px",
      filter: "brightness(0) invert(1)", // Makes the image white
    }}
  />
);

export const LoginPage: React.FC = () => {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log("Login attempt:", { email, password });
  };

  const handleForgotPassword = () => {
    console.log("Forgot password clicked");
  };

  const handleContact = () => {
    console.log("Contact clicked");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: `linear-gradient(135deg, ${theme.colors.primary[600]} 0%, ${theme.colors.primary[700]} 100%)`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top Section - Welcome Text Centered */}
      <div
        style={{
          flex: "0.4",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: theme.getSpacing("xl"),
          paddingBottom: theme.getSpacing("l"),
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: theme.getSpacing("m"),
            textAlign: "center",
            maxWidth: "600px",
          }}
        >
          {/* Welcome Message */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: theme.getSpacing("s"),
            }}
          >
            <span
              style={{
                fontFamily: theme.getFontFamily("primary"),
                fontSize: theme.getFontSize("lg"),
                fontWeight: theme.getFontWeight("secondary"),
                color: theme.colors.neutrals[100],
                lineHeight: theme.getLineHeight("normal"),
              }}
            >
              Olá, seja muito bem-vindo!
            </span>
            <span
              style={{
                fontFamily: theme.getFontFamily("primary"),
                fontSize: theme.getFontSize("2xl"),
                fontWeight: theme.getFontWeight("bold"),
                color: theme.colors.baseWhite,
                lineHeight: theme.getLineHeight("tight"),
              }}
            >
              Insira seu usuário e senha e entre agora mesmo
            </span>
          </div>
        </div>
      </div>

      {/* Middle Section - Login Card */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: theme.getSpacing("xl"),
          flex: "1",
          position: "relative", // Added for absolute positioning of sheep icon
        }}
      >
        {/* Sheep Icon - Above Form Card */}
        <div
          style={{
            position: "absolute",
            top: `-${theme.getSpacing("xs")}`, // Reduced distance to be practically glued
            right: `calc(50% - 250px + ${theme.getSpacing("xl")})`, // Align with form card right edge
            zIndex: 10,
          }}
        >
          <SheepIcon />
        </div>

        <div
          style={{
            backgroundColor: theme.colors.baseWhite,
            borderRadius: theme.getRadius("lg"),
            padding: theme.getSpacing("xl"),
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
            width: "100%",
            maxWidth: "500px",
            display: "flex",
            flexDirection: "column",
            gap: theme.getSpacing("xl"),
          }}
        >
          {/* Title */}
          <h1
            style={{
              fontFamily: theme.getFontFamily("primary"),
              fontSize: theme.getFontSize("3xl"),
              fontWeight: theme.getFontWeight("bold"),
              color: theme.colors.baseBlack,
              textAlign: "center",
              margin: 0,
              marginBottom: theme.getSpacing("l"),
            }}
          >
            Faça seu login
          </h1>

          {/* Login Form */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: theme.getSpacing("l"),
            }}
          >
            {/* Email Input */}
            <Input
              id="email"
              name="email"
              type="email"
              label="Usuário"
              placeholder="Seu email"
              value={email}
              onChange={setEmail}
              size="lg"
              fullWidth
            />

            {/* Password Input */}
            <Input
              id="password"
              name="password"
              type="password"
              label="Senha"
              placeholder="Sua senha"
              value={password}
              onChange={setPassword}
              size="lg"
              fullWidth
            />

            {/* Login Button */}
            <Button
              variant="primary"
              size="lg"
              onClick={handleLogin}
              fullWidth
              style={{
                marginTop: theme.getSpacing("l"),
                minHeight: "56px",
                fontSize: theme.getFontSize("lg"),
              }}
            >
              Acessar
            </Button>

            {/* Forgot Password Link */}
            <button
              type="button"
              onClick={handleForgotPassword}
              style={{
                fontFamily: theme.getFontFamily("primary"),
                fontSize: theme.getFontSize("base"),
                fontWeight: theme.getFontWeight("secondary"),
                color: theme.colors.primary[600],
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                textDecoration: "underline",
                textAlign: "center",
                padding: theme.getSpacing("s"),
                marginTop: theme.getSpacing("m"),
              }}
            >
              Esqueci minha senha
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div
        style={{
          flex: "0.2",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          padding: theme.getSpacing("xl"),
          paddingTop: theme.getSpacing("m"),
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: theme.getSpacing("xs"),
          }}
        >
          <span
            style={{
              fontFamily: theme.getFontFamily("primary"),
              fontSize: theme.getFontSize("sm"),
              fontWeight: theme.getFontWeight("secondary"),
              color: theme.colors.neutrals[100],
              textAlign: "center",
            }}
          >
            Problemas?{" "}
            <button
              type="button"
              onClick={handleContact}
              style={{
                fontFamily: theme.getFontFamily("primary"),
                fontSize: theme.getFontSize("sm"),
                fontWeight: theme.getFontWeight("secondary"),
                color: theme.colors.primary[600],
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                textDecoration: "underline",
                padding: 0,
              }}
            >
              Entre em contato
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
