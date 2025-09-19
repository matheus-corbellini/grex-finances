"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

import { Footer } from "borderless";

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
  const { login, loginWithGoogle, loginWithFacebook } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError("");

    try {
      await loginWithGoogle();
      router.push("/dashboard");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setIsLoading(true);
    setError("");

    try {
      await loginWithFacebook();
      router.push("/dashboard");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push("/forgot-password");
  };

  const handleContact = () => {
    console.log("Contact clicked");
  };

  const handleGoToRegister = () => {
    console.log("Go to register clicked");
    router.push("/register");
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

            {/* Error Message */}
            {error && (
              <div
                style={{
                  padding: theme.getSpacing("m"),
                  backgroundColor: theme.colors.error[100],
                  border: `1px solid ${theme.colors.error[200]}`,
                  borderRadius: theme.getRadius("md"),
                  color: theme.colors.error[300],
                  fontSize: theme.getFontSize("sm"),
                  textAlign: "center",
                }}
              >
                {error}
              </div>
            )}

            {/* Login Button */}
            <Button
              variant="primary"
              size="lg"
              onClick={handleLogin}
              fullWidth
              disabled={isLoading}
              style={{
                marginTop: theme.getSpacing("l"),
                minHeight: "56px",
                fontSize: theme.getFontSize("lg"),
              }}
            >
              {isLoading ? "Entrando..." : "Acessar"}
            </Button>

            {/* Social Login Buttons */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: theme.getSpacing("m"),
                marginTop: theme.getSpacing("l"),
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: theme.getSpacing("m"),
                }}
              >
                <div
                  style={{
                    flex: 1,
                    height: "1px",
                    backgroundColor: theme.colors.neutrals[300],
                  }}
                />
                <span
                  style={{
                    fontSize: theme.getFontSize("sm"),
                    color: theme.colors.neutrals[500],
                    fontWeight: theme.getFontWeight("secondary"),
                  }}
                >
                  ou
                </span>
                <div
                  style={{
                    flex: 1,
                    height: "1px",
                    backgroundColor: theme.colors.neutrals[300],
                  }}
                />
              </div>

              {/* Google Login Button */}
              <Button
                variant="secondary"
                size="lg"
                onClick={handleGoogleLogin}
                fullWidth
                disabled={isLoading}
                style={{
                  minHeight: "56px",
                  fontSize: theme.getFontSize("lg"),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: theme.getSpacing("m"),
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continuar com Google
              </Button>

              {/* Facebook Login Button */}
              <Button
                variant="secondary"
                size="lg"
                onClick={handleFacebookLogin}
                fullWidth
                disabled={isLoading}
                style={{
                  minHeight: "56px",
                  fontSize: theme.getFontSize("lg"),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: theme.getSpacing("m"),
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Continuar com Facebook
              </Button>
            </div>

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

            {/* Register Link */}
            <div
              style={{
                textAlign: "center",
                paddingTop: theme.getSpacing("m"),
                borderTop: `1px solid ${theme.colors.neutrals[200]}`,
              }}
            >
              <span
                style={{
                  fontFamily: theme.getFontFamily("primary"),
                  fontSize: theme.getFontSize("base"),
                  fontWeight: theme.getFontWeight("secondary"),
                  color: theme.colors.neutrals[600],
                }}
              >
                Não tem uma conta?{" "}
              </span>
              <button
                type="button"
                onClick={handleGoToRegister}
                style={{
                  fontFamily: theme.getFontFamily("primary"),
                  fontSize: theme.getFontSize("base"),
                  fontWeight: theme.getFontWeight("secondary"),
                  color: theme.colors.primary[600],
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  textDecoration: "underline",
                  padding: 0,
                }}
              >
                Criar conta
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <Footer
        theme="dark"
        useGradient={true}
        gradientColors={[theme.colors.primary[600], theme.colors.primary[700]]}
        gradientDirection="135deg"
        backgroundColor={theme.colors.primary[600]}
        logoVariant="light"
      />

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
