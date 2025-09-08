"use client";

import React, { useState } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { ClientOnly } from "../../../components/layout/ClientOnly";
import styles from "./Settings.module.css";
import {
    Building,
    Settings,
    Users,
    CreditCard,
    Tag,
    Camera,
    Save
} from "lucide-react";

interface ChurchInfo {
    name: string;
    phone: string;
    cpfCnpj: string;
    website: string;
}

interface AddressInfo {
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
}

const settingsMenu = [
    { id: "church", label: "Minha Igreja", icon: Building, active: true },
    { id: "preferences", label: "Preferências", icon: Settings },
    { id: "users", label: "Usuários", icon: Users },
    { id: "plan", label: "Meu plano", icon: CreditCard },
    { id: "categories", label: "Categorias", icon: Tag }
];

export default function Settings() {
    const [activeSection, setActiveSection] = useState("church");
    const [activeTab, setActiveTab] = useState<"info" | "address">("info");
    const [churchInfo, setChurchInfo] = useState<ChurchInfo>({
        name: "",
        phone: "",
        cpfCnpj: "",
        website: ""
    });
    const [addressInfo, setAddressInfo] = useState<AddressInfo>({
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
        zipCode: ""
    });

    const handleChurchInfoChange = (field: keyof ChurchInfo, value: string) => {
        setChurchInfo(prev => ({ ...prev, [field]: value }));
    };

    const handleAddressInfoChange = (field: keyof AddressInfo, value: string) => {
        setAddressInfo(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        console.log("Salvando informações:", { churchInfo, addressInfo });
        // Aqui você implementaria a lógica para salvar
    };

    const renderContent = () => {
        switch (activeSection) {
            case "church":
                return (
                    <>
                        <div className={styles.header}>
                            <h1 className={styles.title}>Minha Igreja</h1>
                        </div>

                        <div className={styles.tabs}>
                            <button
                                className={`${styles.tab} ${activeTab === "info" ? styles.activeTab : ''}`}
                                onClick={() => setActiveTab("info")}
                            >
                                Informações
                            </button>
                            <button
                                className={`${styles.tab} ${activeTab === "address" ? styles.activeTab : ''}`}
                                onClick={() => setActiveTab("address")}
                            >
                                Endereço
                            </button>
                        </div>

                        <div className={styles.formContainer}>
                            {activeTab === "info" ? (
                                <div className={styles.formSection}>
                                    <div className={styles.formFields}>
                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>Nome da Igreja</label>
                                            <input
                                                type="text"
                                                className={styles.input}
                                                placeholder="Add value"
                                                value={churchInfo.name}
                                                onChange={(e) => handleChurchInfoChange("name", e.target.value)}
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>Telefone</label>
                                            <input
                                                type="tel"
                                                className={styles.input}
                                                placeholder="Add value"
                                                value={churchInfo.phone}
                                                onChange={(e) => handleChurchInfoChange("phone", e.target.value)}
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>CPF/CNPJ</label>
                                            <input
                                                type="text"
                                                className={styles.input}
                                                placeholder="Add value"
                                                value={churchInfo.cpfCnpj}
                                                onChange={(e) => handleChurchInfoChange("cpfCnpj", e.target.value)}
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>Site</label>
                                            <input
                                                type="url"
                                                className={styles.input}
                                                placeholder="Add value"
                                                value={churchInfo.website}
                                                onChange={(e) => handleChurchInfoChange("website", e.target.value)}
                                            />
                                        </div>

                                        <button className={styles.saveButton} onClick={handleSave}>
                                            <Save size={20} />
                                            Salvar
                                        </button>
                                    </div>

                                    <div className={styles.photoSection}>
                                        <label className={styles.photoLabel}>Carregar foto</label>
                                        <div className={styles.photoUpload}>
                                            <div className={styles.photoPlaceholder}>
                                                <div className={styles.photoIcon}>
                                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M2 17L12 22L22 17" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M2 12L12 17L22 12" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className={styles.photoActions}>
                                                <button className={styles.cameraButton}>
                                                    <Camera size={20} />
                                                </button>
                                                <div className={styles.photoLinks}>
                                                    <button className={styles.changeButton}>Alterar</button>
                                                    <button className={styles.removeButton}>Remover</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className={styles.formSection}>
                                    <div className={styles.formFields}>
                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>Rua</label>
                                            <input
                                                type="text"
                                                className={styles.input}
                                                placeholder="Add value"
                                                value={addressInfo.street}
                                                onChange={(e) => handleAddressInfoChange("street", e.target.value)}
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>Número</label>
                                            <input
                                                type="text"
                                                className={styles.input}
                                                placeholder="Add value"
                                                value={addressInfo.number}
                                                onChange={(e) => handleAddressInfoChange("number", e.target.value)}
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>Complemento</label>
                                            <input
                                                type="text"
                                                className={styles.input}
                                                placeholder="Add value"
                                                value={addressInfo.complement}
                                                onChange={(e) => handleAddressInfoChange("complement", e.target.value)}
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>Bairro</label>
                                            <input
                                                type="text"
                                                className={styles.input}
                                                placeholder="Add value"
                                                value={addressInfo.neighborhood}
                                                onChange={(e) => handleAddressInfoChange("neighborhood", e.target.value)}
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>Cidade</label>
                                            <input
                                                type="text"
                                                className={styles.input}
                                                placeholder="Add value"
                                                value={addressInfo.city}
                                                onChange={(e) => handleAddressInfoChange("city", e.target.value)}
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>Estado</label>
                                            <input
                                                type="text"
                                                className={styles.input}
                                                placeholder="Add value"
                                                value={addressInfo.state}
                                                onChange={(e) => handleAddressInfoChange("state", e.target.value)}
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>CEP</label>
                                            <input
                                                type="text"
                                                className={styles.input}
                                                placeholder="Add value"
                                                value={addressInfo.zipCode}
                                                onChange={(e) => handleAddressInfoChange("zipCode", e.target.value)}
                                            />
                                        </div>

                                        <button className={styles.saveButton} onClick={handleSave}>
                                            <Save size={20} />
                                            Salvar
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                );
            case "preferences":
                return (
                    <div className={styles.sectionContent}>
                        <h1 className={styles.title}>Preferências</h1>
                        <p className={styles.comingSoon}>Esta seção estará disponível em breve.</p>
                    </div>
                );
            case "users":
                return (
                    <div className={styles.sectionContent}>
                        <h1 className={styles.title}>Usuários</h1>
                        <p className={styles.comingSoon}>Esta seção estará disponível em breve.</p>
                    </div>
                );
            case "plan":
                return (
                    <div className={styles.sectionContent}>
                        <h1 className={styles.title}>Meu plano</h1>
                        <p className={styles.comingSoon}>Esta seção estará disponível em breve.</p>
                    </div>
                );
            case "categories":
                return (
                    <div className={styles.sectionContent}>
                        <h1 className={styles.title}>Categorias</h1>
                        <p className={styles.comingSoon}>Esta seção estará disponível em breve.</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <DashboardLayout>
            <ClientOnly>
                <div className={styles.container}>
                    <div className={styles.sidebar}>
                        <h2 className={styles.sidebarTitle}>Configurações</h2>
                        <nav className={styles.sidebarNav}>
                            {settingsMenu.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => setActiveSection(item.id)}
                                    className={`${styles.sidebarItem} ${activeSection === item.id ? styles.active : ''}`}
                                >
                                    <item.icon size={20} className={styles.sidebarIcon} />
                                    {item.label}
                                </div>
                            ))}
                        </nav>
                    </div>

                    <div className={styles.mainContent}>
                        {renderContent()}
                    </div>
                </div>
            </ClientOnly>
        </DashboardLayout>
    );
}