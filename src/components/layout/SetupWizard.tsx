"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "../../context/ThemeContext";
import { 
  ArrowRight, 
  ArrowLeft, 
  Building, 
  MapPin, 
  Palette, 
  User, 
  Settings,
  CheckCircle,
  Upload,
  Camera
} from "lucide-react";

const SheepIcon = () => (
  <img
    src="/Group 75.png"
    alt="Sheep Icon"
    style={{
      width: "40px",
      height: "40px",
      filter: "brightness(0) invert(1)", // Makes the image white
    }}
  />
);

interface ChurchData {
  // Informações básicas
  churchName: string;
  organizationType: string;
  document: string;
  phone: string;
  
  // Endereço
  zipCode: string;
  address: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  
  // Personalização
  logo: string;
  primaryColor: string;
  currency: string;
  
  // Usuário administrador
  adminName: string;
  adminEmail: string;
  adminPassword: string;
  confirmPassword: string;
  
  // Configurações
  fiscalPeriod: string;
  defaultCategories: boolean;
}

export const SetupWizard: React.FC = () => {
  const theme = useTheme();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<ChurchData>({
    churchName: "",
    organizationType: "igreja",
    document: "",
    phone: "",
    zipCode: "",
    address: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    logo: "",
    primaryColor: "#3b82f6",
    currency: "BRL",
    adminName: "",
    adminEmail: "",
    adminPassword: "",
    confirmPassword: "",
    fiscalPeriod: "mensal",
    defaultCategories: true,
  });

  const steps = [
    {
      id: "basic-info",
      title: "Informações Básicas",
      subtitle: "Configure os dados da sua igreja",
      icon: Building,
    },
    {
      id: "address",
      title: "Endereço",
      subtitle: "Localização da sua igreja",
      icon: MapPin,
    },
    {
      id: "personalization",
      title: "Personalização",
      subtitle: "Logo e identidade visual",
      icon: Palette,
    },
    {
      id: "admin-user",
      title: "Usuário Administrador",
      subtitle: "Configure sua conta de acesso",
      icon: User,
    },
    {
      id: "settings",
      title: "Configurações",
      subtitle: "Preferências iniciais",
      icon: Settings,
    },
  ];

  const organizationTypes = [
    { value: "igreja", label: "Igreja" },
    { value: "ministerio", label: "Ministério" },
    { value: "ong", label: "ONG" },
    { value: "fundacao", label: "Fundação" },
    { value: "outro", label: "Outro" },
  ];

  const currencies = [
    { value: "BRL", label: "Real (R$)" },
    { value: "USD", label: "Dólar ($)" },
    { value: "EUR", label: "Euro (€)" },
  ];

  const fiscalPeriods = [
    { value: "mensal", label: "Mensal" },
    { value: "trimestral", label: "Trimestral" },
    { value: "semestral", label: "Semestral" },
    { value: "anual", label: "Anual" },
  ];

  const handleInputChange = (field: keyof ChurchData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleZipCodeChange = async (zipCode: string) => {
    const cleanZipCode = zipCode.replace(/\D/g, '');
    
    setFormData(prev => ({
      ...prev,
      zipCode: cleanZipCode.length > 5 ? 
        `${cleanZipCode.substring(0, 5)}-${cleanZipCode.substring(5, 8)}` : 
        cleanZipCode,
    }));

    if (cleanZipCode.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanZipCode}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
          setFormData(prev => ({
            ...prev,
            address: data.logradouro || "",
            neighborhood: data.bairro || "",
            city: data.localidade || "",
            state: data.uf || "",
          }));
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      }
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = async () => {
    try {
      // TODO: Implementar salvamento dos dados
      console.log("Dados da igreja:", formData);
      
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirecionar para o dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Informações Básicas
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
                Nome da Igreja *
              </label>
              <input
                type="text"
                value={formData.churchName}
                onChange={(e) => handleInputChange("churchName", e.target.value)}
                placeholder="Ex: Igreja Batista Central"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "16px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
                Tipo de Organização *
              </label>
              <select
                value={formData.organizationType}
                onChange={(e) => handleInputChange("organizationType", e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "16px",
                  boxSizing: "border-box",
                }}
              >
                {organizationTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
                CNPJ/CPF *
              </label>
              <input
                type="text"
                value={formData.document}
                onChange={(e) => handleInputChange("document", e.target.value)}
                placeholder="00.000.000/0000-00"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "16px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
                Telefone de Contato
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="(11) 99999-9999"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "16px",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>
        );

      case 1: // Endereço
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
                CEP *
              </label>
              <input
                type="text"
                value={formData.zipCode}
                onChange={(e) => handleZipCodeChange(e.target.value)}
                placeholder="00000-000"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "16px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
                  Endereço *
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Rua, Avenida..."
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "16px",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
                  Número *
                </label>
                <input
                  type="text"
                  value={formData.number}
                  onChange={(e) => handleInputChange("number", e.target.value)}
                  placeholder="123"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "16px",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
                Complemento
              </label>
              <input
                type="text"
                value={formData.complement}
                onChange={(e) => handleInputChange("complement", e.target.value)}
                placeholder="Apartamento, sala, etc."
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "16px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
                  Bairro *
                </label>
                <input
                  type="text"
                  value={formData.neighborhood}
                  onChange={(e) => handleInputChange("neighborhood", e.target.value)}
                  placeholder="Centro"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "16px",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
                  Cidade *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="São Paulo"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "16px",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
                Estado *
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                placeholder="SP"
                maxLength={2}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "16px",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>
        );

      case 2: // Personalização
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
                Logo da Igreja
              </label>
              <div
                style={{
                  border: "2px dashed #d1d5db",
                  borderRadius: "8px",
                  padding: "40px",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = "#3b82f6";
                  e.currentTarget.style.backgroundColor = "#f8fafc";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = "#d1d5db";
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <Upload size={32} color="#9ca3af" style={{ margin: "0 auto 12px" }} />
                <p style={{ fontSize: "16px", color: "#6b7280", margin: "0 0 4px 0" }}>
                  Clique para fazer upload
                </p>
                <p style={{ fontSize: "14px", color: "#9ca3af", margin: "0" }}>
                  PNG, JPG até 2MB
                </p>
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
                Cor Principal
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <input
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => handleInputChange("primaryColor", e.target.value)}
                  style={{
                    width: "50px",
                    height: "40px",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                />
                <input
                  type="text"
                  value={formData.primaryColor}
                  onChange={(e) => handleInputChange("primaryColor", e.target.value)}
                  placeholder="#3b82f6"
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "16px",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
                Moeda Padrão
              </label>
              <select
                value={formData.currency}
                onChange={(e) => handleInputChange("currency", e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "16px",
                  boxSizing: "border-box",
                }}
              >
                {currencies.map(currency => (
                  <option key={currency.value} value={currency.value}>
                    {currency.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );

      case 3: // Usuário Administrador
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
                Nome Completo *
              </label>
              <input
                type="text"
                value={formData.adminName}
                onChange={(e) => handleInputChange("adminName", e.target.value)}
                placeholder="Seu nome completo"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "16px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
                E-mail *
              </label>
              <input
                type="email"
                value={formData.adminEmail}
                onChange={(e) => handleInputChange("adminEmail", e.target.value)}
                placeholder="seu@email.com"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "16px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
                Senha *
              </label>
              <input
                type="password"
                value={formData.adminPassword}
                onChange={(e) => handleInputChange("adminPassword", e.target.value)}
                placeholder="Mínimo 8 caracteres"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "16px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
                Confirmar Senha *
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                placeholder="Digite a senha novamente"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "16px",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>
        );

      case 4: // Configurações
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
                Período Fiscal Padrão
              </label>
              <select
                value={formData.fiscalPeriod}
                onChange={(e) => handleInputChange("fiscalPeriod", e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "16px",
                  boxSizing: "border-box",
                }}
              >
                {fiscalPeriods.map(period => (
                  <option key={period.value} value={period.value}>
                    {period.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={formData.defaultCategories}
                  onChange={(e) => handleInputChange("defaultCategories", e.target.checked.toString())}
                  style={{ width: "18px", height: "18px" }}
                />
                <span style={{ fontSize: "16px", color: "#374151" }}>
                  Criar categorias padrão (Receitas e Despesas)
                </span>
              </label>
              <p style={{ fontSize: "14px", color: "#6b7280", margin: "8px 0 0 30px" }}>
                Serão criadas categorias básicas como: Dízimos, Ofertas, Salários, Aluguel, etc.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const currentStepData = steps[currentStep];
  const IconComponent = currentStepData.icon;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(135deg, ${theme.colors.primary[600]} 0%, ${theme.colors.primary[700]} 100%)`,
        padding: "20px",
      }}
    >
      {/* Icon at top */}
      <div
        style={{
          position: "absolute",
          top: "40px",
          left: "50%",
          transform: "translateX(-50%)",
          opacity: 0.1,
        }}
      >
        <SheepIcon />
      </div>

      {/* Main Card */}
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          background: "white",
          borderRadius: "16px",
          padding: "40px",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <IconComponent size={28} color="white" />
          </div>

          <h1
            style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#1f2937",
              margin: "0 0 8px 0",
            }}
          >
            {currentStepData.title}
          </h1>

          <p
            style={{
              fontSize: "16px",
              color: "#6b7280",
              margin: "0 0 24px 0",
            }}
          >
            {currentStepData.subtitle}
          </p>

          {/* Progress Indicator */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            {steps.map((_, index) => (
              <div
                key={index}
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: index <= currentStep ? "#3b82f6" : "#e5e7eb",
                  transition: "all 0.2s ease",
                }}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ marginBottom: "32px" }}>
          {renderStepContent()}
        </div>

        {/* Actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            style={{
              padding: "12px 24px",
              background: currentStep === 0 ? "transparent" : "transparent",
              color: currentStep === 0 ? "#9ca3af" : "#6b7280",
              border: "2px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: currentStep === 0 ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
            onMouseOver={(e) => {
              if (currentStep > 0) {
                e.currentTarget.style.borderColor = "#d1d5db";
                e.currentTarget.style.color = "#374151";
              }
            }}
            onMouseOut={(e) => {
              if (currentStep > 0) {
                e.currentTarget.style.borderColor = "#e5e7eb";
                e.currentTarget.style.color = "#6b7280";
              }
            }}
          >
            <ArrowLeft size={16} />
            Anterior
          </button>

          <button
            onClick={handleNext}
            style={{
              padding: "12px 32px",
              background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(59, 130, 246, 0.4)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {currentStep === steps.length - 1 ? "Finalizar" : "Próximo"}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
