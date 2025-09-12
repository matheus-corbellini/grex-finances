"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "../../context/ThemeContext";
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
    try {
      console.log("Register attempt:", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      // TODO: Implementar chamada para API de registro
      // const response = await authService.register({
      //   firstName: formData.firstName,
      //   lastName: formData.lastName,
      //   email: formData.email,
      //   password: formData.password,
      // });

      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log("Registro realizado com sucesso!");
      // TODO: Redirecionar para wizard de configuração
      setTimeout(() => {
        router.push("/setup");
      }, 1000);
    } catch (error) {
      console.error("Erro no registro:", error);
      setErrors({ general: "Erro ao realizar registro. Tente novamente." });
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
