"use client";

import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Switch } from "../ui/Switch";
import { ProgressBar } from "../ui/ProgressBar";
import { Pagination } from "../ui/Pagination";
import { TextArea } from "../ui/TextArea";
import { Toast } from "../ui/Toast";
import { ToastContainer } from "../ui/ToastContainer";
import { NavigationMenuItem } from "../ui/NavigationMenuItem";

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
  const [switchValue, setSwitchValue] = useState(false);
  const [textAreaValue, setTextAreaValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showToast, setShowToast] = useState(false);

  const handleLogin = () => {
    console.log("Login attempt:", { email, password });
  };

  const handleForgotPassword = () => {
    console.log("Forgot password clicked");
  };

  const handleContact = () => {
    console.log("Contact clicked");
  };

  const handleShowToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
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

      {/* Components Demo Section */}
      <div
        style={{
          padding: theme.getSpacing("xl"),
          backgroundColor: theme.colors.baseWhite,
          margin: theme.getSpacing("xl"),
          borderRadius: theme.getRadius("lg"),
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2
          style={{
            fontFamily: theme.getFontFamily("primary"),
            fontSize: theme.getFontSize("2xl"),
            fontWeight: theme.getFontWeight("bold"),
            color: theme.colors.baseBlack,
            textAlign: "center",
            marginBottom: theme.getSpacing("xl"),
          }}
        >
          Demonstração dos Componentes
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: theme.getSpacing("xl"),
          }}
        >
          {/* Switch Component */}
          <div
            style={{
              padding: theme.getSpacing("l"),
              border: `1px solid ${theme.colors.neutrals[200]}`,
              borderRadius: theme.getRadius("md"),
            }}
          >
            <h3
              style={{
                fontFamily: theme.getFontFamily("primary"),
                fontSize: theme.getFontSize("lg"),
                fontWeight: theme.getFontWeight("bold"),
                color: theme.colors.baseBlack,
                marginBottom: theme.getSpacing("m"),
              }}
            >
              Switch Component
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: theme.getSpacing("m"),
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: theme.getSpacing("m"),
                }}
              >
                <Switch
                  checked={switchValue}
                  onChange={setSwitchValue}
                  size="md"
                />
                <span
                  style={{
                    fontFamily: theme.getFontFamily("primary"),
                    fontSize: theme.getFontSize("base"),
                    color: theme.colors.baseBlack,
                  }}
                >
                  {switchValue ? "Ativado" : "Desativado"}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: theme.getSpacing("m"),
                }}
              >
                <Switch
                  checked={false}
                  onChange={() => {}}
                  size="sm"
                  variant="success"
                />
                <span
                  style={{
                    fontFamily: theme.getFontFamily("primary"),
                    fontSize: theme.getFontSize("base"),
                    color: theme.colors.baseBlack,
                  }}
                >
                  Sucesso (Small)
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: theme.getSpacing("m"),
                }}
              >
                <Switch
                  checked={true}
                  onChange={() => {}}
                  size="lg"
                  variant="warning"
                />
                <span
                  style={{
                    fontFamily: theme.getFontFamily("primary"),
                    fontSize: theme.getFontSize("base"),
                    color: theme.colors.baseBlack,
                  }}
                >
                  Aviso (Large)
                </span>
              </div>
            </div>
          </div>

          {/* ProgressBar Component */}
          <div
            style={{
              padding: theme.getSpacing("l"),
              border: `1px solid ${theme.colors.neutrals[200]}`,
              borderRadius: theme.getRadius("md"),
            }}
          >
            <h3
              style={{
                fontFamily: theme.getFontFamily("primary"),
                fontSize: theme.getFontSize("lg"),
                fontWeight: theme.getFontWeight("bold"),
                color: theme.colors.baseBlack,
                marginBottom: theme.getSpacing("m"),
              }}
            >
              ProgressBar Component
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: theme.getSpacing("m"),
              }}
            >
              <ProgressBar value={75} size="md" />
              <ProgressBar value={45} size="md" variant="secondary" />
              <ProgressBar value={90} size="md" variant="success" />
            </div>
          </div>

          {/* Pagination Component */}
          <div
            style={{
              padding: theme.getSpacing("l"),
              border: `1px solid ${theme.colors.neutrals[200]}`,
              borderRadius: theme.getRadius("md"),
            }}
          >
            <h3
              style={{
                fontFamily: theme.getFontFamily("primary"),
                fontSize: theme.getFontSize("lg"),
                fontWeight: theme.getFontWeight("bold"),
                color: theme.colors.baseBlack,
                marginBottom: theme.getSpacing("m"),
              }}
            >
              Pagination Component
            </h3>
            <Pagination
              currentPage={currentPage}
              totalPages={10}
              onPageChange={setCurrentPage}
              size="md"
            />
          </div>

          {/* Input Component */}
          <div
            style={{
              padding: theme.getSpacing("l"),
              border: `1px solid ${theme.colors.neutrals[200]}`,
              borderRadius: theme.getRadius("md"),
            }}
          >
            <h3
              style={{
                fontFamily: theme.getFontFamily("primary"),
                fontSize: theme.getFontSize("lg"),
                fontWeight: theme.getFontWeight("bold"),
                color: theme.colors.baseBlack,
                marginBottom: theme.getSpacing("m"),
              }}
            >
              Input Component
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: theme.getSpacing("m"),
              }}
            >
              <Input
                id="demo-input-1"
                name="demo-input-1"
                label="Nome"
                placeholder="Digite seu nome"
                size="md"
                fullWidth
              />
              <Input
                id="demo-input-2"
                name="demo-input-2"
                type="email"
                label="Email"
                placeholder="Digite seu email"
                size="md"
                fullWidth
              />
              <Input
                id="demo-input-3"
                name="demo-input-3"
                type="password"
                label="Senha"
                placeholder="Digite sua senha"
                size="md"
                fullWidth
              />
            </div>
          </div>

          {/* TextArea Component */}
          <div
            style={{
              padding: theme.getSpacing("l"),
              border: `1px solid ${theme.colors.neutrals[200]}`,
              borderRadius: theme.getRadius("md"),
            }}
          >
            <h3
              style={{
                fontFamily: theme.getFontFamily("primary"),
                fontSize: theme.getFontSize("lg"),
                fontWeight: theme.getFontWeight("bold"),
                color: theme.colors.baseBlack,
                marginBottom: theme.getSpacing("m"),
              }}
            >
              TextArea Component
            </h3>
            <TextArea
              id="demo-textarea"
              name="demo-textarea"
              label="Comentário"
              placeholder="Digite seu comentário aqui..."
              value={textAreaValue}
              onChange={setTextAreaValue}
              size="md"
              rows={3}
            />
          </div>

          {/* Button Component */}
          <div
            style={{
              padding: theme.getSpacing("l"),
              border: `1px solid ${theme.colors.neutrals[200]}`,
              borderRadius: theme.getRadius("md"),
            }}
          >
            <h3
              style={{
                fontFamily: theme.getFontFamily("primary"),
                fontSize: theme.getFontSize("lg"),
                fontWeight: theme.getFontWeight("bold"),
                color: theme.colors.baseBlack,
                marginBottom: theme.getSpacing("m"),
              }}
            >
              Button Component
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: theme.getSpacing("m"),
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: theme.getSpacing("s"),
                  flexWrap: "wrap",
                }}
              >
                <Button variant="primary" size="sm">
                  Primary Small
                </Button>
                <Button variant="primary" size="md">
                  Primary Medium
                </Button>
                <Button variant="primary" size="lg">
                  Primary Large
                </Button>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: theme.getSpacing("s"),
                  flexWrap: "wrap",
                }}
              >
                <Button variant="secondary" size="md">
                  Secondary
                </Button>
                <Button variant="subtle" size="md">
                  Subtle
                </Button>
                <Button variant="ghost" size="md">
                  Ghost
                </Button>
              </div>
            </div>
          </div>

          {/* Toast Demo */}
          <div
            style={{
              padding: theme.getSpacing("l"),
              border: `1px solid ${theme.colors.neutrals[200]}`,
              borderRadius: theme.getRadius("md"),
            }}
          >
            <h3
              style={{
                fontFamily: theme.getFontFamily("primary"),
                fontSize: theme.getFontSize("lg"),
                fontWeight: theme.getFontWeight("bold"),
                color: theme.colors.baseBlack,
                marginBottom: theme.getSpacing("m"),
              }}
            >
              Toast Component
            </h3>
            <Button variant="secondary" size="md" onClick={handleShowToast}>
              Mostrar Toast
            </Button>
          </div>

          {/* NavigationMenuItem Component */}
          <div
            style={{
              padding: theme.getSpacing("l"),
              border: `1px solid ${theme.colors.neutrals[200]}`,
              borderRadius: theme.getRadius("md"),
            }}
          >
            <h3
              style={{
                fontFamily: theme.getFontFamily("primary"),
                fontSize: theme.getFontSize("lg"),
                fontWeight: theme.getFontWeight("bold"),
                color: theme.colors.baseBlack,
                marginBottom: theme.getSpacing("m"),
              }}
            >
              NavigationMenuItem Component
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: theme.getSpacing("m"),
              }}
            >
              <NavigationMenuItem
                href="/dashboard"
                isActive={true}
                size="md"
                variant="default"
              >
                Dashboard
              </NavigationMenuItem>
              <NavigationMenuItem
                href="/transactions"
                isActive={false}
                size="md"
                variant="default"
              >
                Transações
              </NavigationMenuItem>
              <NavigationMenuItem
                href="/reports"
                isActive={false}
                size="md"
                variant="secondary"
              >
                Relatórios
              </NavigationMenuItem>
            </div>
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

      {/* Toast Container */}
      {showToast && (
        <ToastContainer>
          <Toast
            type="success"
            title="Sucesso!"
            message="Componente Toast funcionando perfeitamente!"
            onClose={() => setShowToast(false)}
          />
        </ToastContainer>
      )}
    </div>
  );
};

export default LoginPage;
