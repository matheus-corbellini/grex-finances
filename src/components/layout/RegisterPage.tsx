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

export const RegisterPage: React.FC = () => {
  const theme = useTheme();
  const { register, loginWithGoogle, loginWithFacebook } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Nome é obrigatório";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Sobrenome é obrigatório";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.password) {
      newErrors.password = "Senha é obrigatória";
    } else if (formData.password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirme sua senha";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Senhas não coincidem";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      console.log("Registro realizado com sucesso!");
      router.push("/email-verification");
    } catch (error: any) {
      console.error("Erro no registro:", error);
      setErrors({ general: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setIsLoading(true);
    setErrors({});

    try {
      await loginWithGoogle();
      router.push("/setup");
    } catch (error: any) {
      console.error("Erro no registro com Google:", error);
      setErrors({ general: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookRegister = async () => {
    setIsLoading(true);
    setErrors({});

    try {
      await loginWithFacebook();
      router.push("/setup");
    } catch (error: any) {
      console.error("Erro no registro com Facebook:", error);
      setErrors({ general: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToLogin = () => {
    console.log("Go to login clicked");
    router.push("/login");
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
          flex: "0.3",
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
              Bem-vindo ao Grex Finances!
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
              Crie sua conta e comece a organizar suas finanças
            </span>
          </div>
        </div>
      </div>

      {/* Middle Section - Register Card */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: theme.getSpacing("xl"),
          flex: "1",
          position: "relative",
        }}
      >
        {/* Sheep Icon - Above Form Card */}
        <div
          style={{
            position: "absolute",
            top: `-${theme.getSpacing("xs")}`,
            right: `calc(50% - 250px + ${theme.getSpacing("xl")})`,
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
            Criar conta
          </h1>

          {/* Error Message */}
          {errors.general && (
            <div
              style={{
                backgroundColor: theme.colors.error[100],
                color: theme.colors.error[300],
                padding: theme.getSpacing("m"),
                borderRadius: theme.getRadius("s"),
                fontSize: theme.getFontSize("sm"),
                textAlign: "center",
              }}
            >
              {errors.general}
            </div>
          )}

          {/* Register Form */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: theme.getSpacing("l"),
            }}
          >
            {/* Name Fields */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: theme.getSpacing("m"),
              }}
            >
              {/* First Name Input */}
              <Input
                id="firstName"
                name="firstName"
                type="text"
                label="Nome"
                placeholder="Seu nome"
                value={formData.firstName}
                onChange={(value) => handleInputChange("firstName", value)}
                size="lg"
                fullWidth
                error={errors.firstName}
              />

              {/* Last Name Input */}
              <Input
                id="lastName"
                name="lastName"
                type="text"
                label="Sobrenome"
                placeholder="Seu sobrenome"
                value={formData.lastName}
                onChange={(value) => handleInputChange("lastName", value)}
                size="lg"
                fullWidth
                error={errors.lastName}
              />
            </div>

            {/* Email Input */}
            <Input
              id="email"
              name="email"
              type="email"
              label="Email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={(value) => handleInputChange("email", value)}
              size="lg"
              fullWidth
              error={errors.email}
            />

            {/* Password Input */}
            <Input
              id="password"
              name="password"
              type="password"
              label="Senha"
              placeholder="Sua senha"
              value={formData.password}
              onChange={(value) => handleInputChange("password", value)}
              size="lg"
              fullWidth
              error={errors.password}
            />

            {/* Confirm Password Input */}
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirmar Senha"
              placeholder="Confirme sua senha"
              value={formData.confirmPassword}
              onChange={(value) => handleInputChange("confirmPassword", value)}
              size="lg"
              fullWidth
              error={errors.confirmPassword}
            />

            {/* Error Message */}
            {errors.general && (
              <div
                style={{
                  padding: theme.getSpacing("m"),
                  backgroundColor: theme.colors.error[100],
                  border: `1px solid ${theme.colors.error[200]}`,
                  borderRadius: theme.getRadius("m"),
                  color: theme.colors.error[300],
                  fontSize: theme.getFontSize("sm"),
                  textAlign: "center",
                }}
              >
                {errors.general}
              </div>
            )}

            {/* Register Button */}
            <Button
              variant="primary"
              size="lg"
              onClick={handleRegister}
              fullWidth
              disabled={isLoading}
              style={{
                marginTop: theme.getSpacing("l"),
                minHeight: "56px",
                fontSize: theme.getFontSize("lg"),
              }}
            >
              {isLoading ? "Criando conta..." : "Criar conta"}
            </Button>

            {/* Social Register Buttons */}
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

              {/* Google Register Button */}
              <Button
                variant="secondary"
                size="lg"
                onClick={handleGoogleRegister}
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

              {/* Facebook Register Button */}
              <Button
                variant="secondary"
                size="lg"
                onClick={handleFacebookRegister}
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

            {/* Terms and Conditions */}
            <p
              style={{
                fontFamily: theme.getFontFamily("primary"),
                fontSize: theme.getFontSize("xs"),
                fontWeight: theme.getFontWeight("secondary"),
                color: theme.colors.neutrals[600],
                textAlign: "center",
                margin: 0,
                lineHeight: theme.getLineHeight("normal"),
              }}
            >
              Ao criar uma conta, você concorda com nossos{" "}
              <button
                type="button"
                style={{
                  color: theme.colors.primary[600],
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textDecoration: "underline",
                  fontFamily: "inherit",
                  fontSize: "inherit",
                }}
              >
                Termos de Uso
              </button>{" "}
              e{" "}
              <button
                type="button"
                style={{
                  color: theme.colors.primary[600],
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textDecoration: "underline",
                  fontFamily: "inherit",
                  fontSize: "inherit",
                }}
              >
                Política de Privacidade
              </button>
            </p>

            {/* Login Link */}
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
                Já tem uma conta?{" "}
              </span>
              <button
                type="button"
                onClick={handleGoToLogin}
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
                Faça login
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

export default RegisterPage;
