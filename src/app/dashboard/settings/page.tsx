"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "../../../components/layout";
import { SetupWizardModal } from "../../../components/layout/SetupWizardModal";
import { UserModals } from "../../../components/layout/UserModals";
import { InviteModals } from "../../../components/layout/InviteModals";
import { CategoryModals } from "../../../components/layout/CategoryModals";
import { AddSubcategoryModal, AdvancedPreferencesModal } from "../../../components/modals";
import { CategoryType } from "../../../../shared/types/category.types";
import { Icon } from "../../../components/ui/Icon";
import { useToastNotifications } from "../../../hooks/useToastNotifications";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import {
    Building,
    Users,
    CreditCard,
    Tag,
    Settings as SettingsIcon,
    Camera,
    Mountain,
    Plus,
    HelpCircle,
    Mail,
    ArrowUp,
    CreditCard as CardIcon,
    Search,
    Upload,
    Download,
    GripVertical,
    Circle,
    Key,
    Webhook,
    FileText,
    Edit,
    Pause,
    Trash2,
    X,
    Filter,
    Play,
    Trash,
    Check,
    ChevronDown,
    FileSpreadsheet,
    Info,
    Target,
    AlertTriangle,
    Bell,
    Database,
    HardDrive,
    Cloud,
    Shield,
    Clock,
    RefreshCw,
    CheckCircle
} from "lucide-react";

// Componente para sub-categoria sortable
function SortableChildItem({ id, child, onDragEnd }: { id: string; child: any; onDragEnd: (event: any) => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <div style={{
                display: "flex",
                alignItems: "flex-start",
                padding: "12px 20px 12px 52px",
                borderBottom: "1px solid #f1f5f9",
                backgroundColor: "white",
                cursor: "grab"
            }}>
                <div style={{ width: "20px", marginRight: "12px", marginTop: "2px" }}>
                    <input type="checkbox" style={{ margin: "0" }} />
                </div>
                <div style={{
                    width: "20px",
                    marginRight: "12px",
                    cursor: "grab",
                    marginTop: "2px",
                    touchAction: "none"
                }}>
                    <GripVertical size={14} color="#9ca3af" />
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "14px", color: "#1f2937", marginBottom: "2px" }}>
                        {child.name}
                    </div>
                    {child.description && (
                        <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>
                            {child.description}
                        </div>
                    )}
                </div>
                <div style={{ fontSize: "14px", color: "#6b7280", marginTop: "2px" }}>
                    Ações
                </div>
            </div>
        </div>
    );
}

// Componente para categoria pai sortable (drop zone)
function SortableParentItem({ id, category, children }: { id: string; category: any; children: React.ReactNode }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <div style={{
                display: "flex",
                alignItems: "center",
                padding: "16px 20px",
                backgroundColor: "#f8fafc",
                borderBottom: "1px solid #e2e8f0",
                cursor: "grab",
                minHeight: "60px" // Garantir altura mínima para drop zone
            }}>
                <div style={{ width: "20px", marginRight: "12px" }}>
                    <input type="checkbox" style={{ margin: "0" }} />
                </div>
                <div style={{ width: "20px", marginRight: "12px" }}>
                    <GripVertical size={16} color="#9ca3af" />
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#1f2937",
                        marginBottom: "4px"
                    }}>
                        • {category.name}
                    </div>
                    <div style={{
                        fontSize: "12px",
                        color: "#6b7280"
                    }}>
                        {category.children?.length || 0} subcategoria{(category.children?.length || 0) !== 1 ? 's' : ''}
                    </div>
                </div>
                <div style={{ marginLeft: "16px" }}>
                    <button style={{
                        background: "none",
                        border: "none",
                        color: "#6b7280",
                        cursor: "pointer",
                        fontSize: "14px",
                        padding: "4px 8px",
                        borderRadius: "4px"
                    }}>
                        Ações
                    </button>
                </div>
            </div>
            {children}
        </div>
    );
}


export default function Settings() {
    const router = useRouter();
    const toast = useToastNotifications();
    const [activeSection, setActiveSection] = useState("minha-igreja");
    const [activeTab, setActiveTab] = useState("informacoes");
    const [showSetupModal, setShowSetupModal] = useState(false);
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [showEditUserModal, setShowEditUserModal] = useState(false);
    const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
    const [showInviteUserModal, setShowInviteUserModal] = useState(false);
    const [showAcceptInviteModal, setShowAcceptInviteModal] = useState(false);
    const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
    const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
    const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
    const [showChangeEmailModal, setShowChangeEmailModal] = useState(false);
    const [showUploadLogoModal, setShowUploadLogoModal] = useState(false);
    const [showFileManagementModal, setShowFileManagementModal] = useState(false);
    const [showImagePreviewModal, setShowImagePreviewModal] = useState(false);
    const [showNotificationSettingsModal, setShowNotificationSettingsModal] = useState(false);
    const [showNotificationHistoryModal, setShowNotificationHistoryModal] = useState(false);
    const [showAlertSettingsModal, setShowAlertSettingsModal] = useState(false);
    const [showBackupModal, setShowBackupModal] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [showAddSubcategoryModal, setShowAddSubcategoryModal] = useState(false);
    const [showAdvancedPreferencesModal, setShowAdvancedPreferencesModal] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [deletingUser, setDeletingUser] = useState<any>(null);
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [deletingCategory, setDeletingCategory] = useState<any>(null);
    const [userForm, setUserForm] = useState({
        name: "",
        email: "",
        role: "Membro",
        phone: "",
        department: ""
    });
    const [inviteForm, setInviteForm] = useState({
        email: "",
        name: "",
        role: "Membro",
        department: "",
        message: ""
    });
    const [categoryForm, setCategoryForm] = useState({
        name: "",
        type: "expense",
        parentId: "",
        description: "",
        color: "#3b82f6"
    });
    const [emailForm, setEmailForm] = useState({
        currentEmail: "gustavo@grex.com.br",
        newEmail: "",
        confirmEmail: ""
    });
    const [uploadForm, setUploadForm] = useState({
        file: null as File | null,
        preview: null as string | null,
        description: ""
    });
    const [notificationSettings, setNotificationSettings] = useState({
        email: true,
        push: true,
        sms: false,
        weeklyReport: true,
        monthlyReport: true,
        paymentReminder: true,
        systemUpdates: true
    });
    const [files, setFiles] = useState([
        { id: 1, name: "logo-igreja.png", size: "2.3 MB", type: "image", uploadDate: "15/01/2024" },
        { id: 2, name: "documento-contas.pdf", size: "1.8 MB", type: "document", uploadDate: "10/01/2024" },
        { id: 3, name: "relatorio-mensal.xlsx", size: "945 KB", type: "spreadsheet", uploadDate: "05/01/2024" }
    ]);
    const [notifications, setNotifications] = useState([
        { id: 1, title: "Relatório semanal gerado", message: "Seu relatório semanal está disponível", date: "20/01/2024", read: false, type: "info" },
        { id: 2, title: "Pagamento processado", message: "Pagamento de R$ 80,00 foi processado com sucesso", date: "18/01/2024", read: true, type: "success" },
        { id: 3, title: "Backup realizado", message: "Backup automático dos dados foi concluído", date: "15/01/2024", read: true, type: "info" }
    ]);
    const [showExportDropdown, setShowExportDropdown] = useState(false);
    const [showCategoryHelpModal, setShowCategoryHelpModal] = useState(false);

    // Função para fechar dropdown
    const handleCloseExportDropdown = () => {
        setShowExportDropdown(false);
    };
    const [formData, setFormData] = useState({
        nomeIgreja: "",
        telefone: "",
        cpfCnpj: "",
        site: "",
        churchPhoto: ""
    });

    const [addressData, setAddressData] = useState({
        cep: "",
        logradouro: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",
        pais: "Brasil"
    });
    const [preferences, setPreferences] = useState({
        orderType: "crescente",
        defaultPeriod: "mensal",
        defaultCurrency: "brl"
    });
    const [showUpgradeBanner, setShowUpgradeBanner] = useState(true);
    const [users] = useState([
        {
            id: 1,
            name: "Gustavo Bertin",
            email: "gustavo@grex.com.br",
            role: "Dono da conta",
            initials: "GB"
        },
        {
            id: 2,
            name: "Gustavo Bertin",
            email: "gustavo@grex.com.br",
            role: "Dono da conta",
            initials: "GB"
        }
    ]);
    const [planData] = useState({
        currentPlan: {
            name: "Plano mensal - Start",
            price: "R$ 80,00",
            nextBilling: "03/09/2024",
            description: "Despesas Instituto"
        },
        paymentMethod: {
            type: "Cartão de crédito com final 4523",
            icons: ["mastercard", "visa"]
        },
        billingEmail: "gustavo@grex.com.br"
    });
    const [activeCategoryTab, setActiveCategoryTab] = useState("saidas");
    const [searchTerm, setSearchTerm] = useState("");
    const [activeIntegrationTab, setActiveIntegrationTab] = useState("chaves-api");
    const [apiKeys, setApiKeys] = useState([
        {
            id: 1,
            name: "Chave de API",
            expirationDate: "18/03/2026",
            status: "Ativa",
            isActive: true
        }
    ]);
    const [showApiKeyModal, setShowApiKeyModal] = useState(false);
    const [apiKeyForm, setApiKeyForm] = useState({
        name: "",
        expirationDate: "",
        expirationTime: ""
    });
    const [webhooks, setWebhooks] = useState([
        {
            id: 1,
            name: "[Grex] Demo",
            expirationDate: "18/03/2026",
            status: "Ativo",
            isActive: true
        }
    ]);
    const [showWebhookModal, setShowWebhookModal] = useState(false);
    const [webhookForm, setWebhookForm] = useState({
        name: "",
        url: "",
        events: [] as string[]
    });
    const [editingWebhook, setEditingWebhook] = useState<any>(null);
    const [webhookEditForm, setWebhookEditForm] = useState({
        isActive: true,
        name: "[Grex] Demo",
        url: "http://",
        email: "email@email.com",
        apiVersion: "V1",
        authToken: "************",
        syncQueueActive: true,
        eventType: "Sequencial",
        selectedEvents: [] as string[]
    });

    // Backup states
    const [backupSettings, setBackupSettings] = useState({
        autoBackup: true,
        frequency: "daily",
        retentionDays: 30,
        includeFiles: true,
        includeUsers: true,
        includeTransactions: true,
        includeReports: true,
        cloudStorage: false,
        emailNotification: true
    });

    const [backupJobs, setBackupJobs] = useState([
        {
            id: "1",
            name: "Backup Completo - Janeiro 2024",
            type: "scheduled",
            status: "completed",
            createdAt: new Date("2024-01-15T02:00:00"),
            completedAt: new Date("2024-01-15T02:15:00"),
            size: 15728640,
            format: "sql",
            includes: ["users", "transactions", "reports", "files"]
        },
        {
            id: "2",
            name: "Backup Financeiro - Semana 2",
            type: "manual",
            status: "completed",
            createdAt: new Date("2024-01-14T10:30:00"),
            completedAt: new Date("2024-01-14T10:35:00"),
            size: 5242880,
            format: "json",
            includes: ["transactions", "reports"]
        }
    ] as Array<{
        id: string;
        name: string;
        type: string;
        status: string;
        createdAt: Date;
        completedAt?: Date;
        size: number;
        format: string;
        includes: string[];
    }>);

    const [isCreatingBackup, setIsCreatingBackup] = useState(false);
    const [webhookEvents] = useState([
        {
            id: "PAYMENT_AUTHORIZED",
            name: "PAYMENT_AUTHORIZED",
            description: "Pagamento em cartão que foi autorizado e precisa ser capturado."
        },
        {
            id: "PAYMENT_CAPTURED",
            name: "PAYMENT_CAPTURED",
            description: "Pagamento em cartão que foi capturado com sucesso."
        },
        {
            id: "PAYMENT_REFUNDED",
            name: "PAYMENT_REFUNDED",
            description: "Pagamento que foi estornado."
        },
        {
            id: "PAYMENT_FAILED",
            name: "PAYMENT_FAILED",
            description: "Pagamento que falhou na autorização."
        },
        {
            id: "PIX_RECEIVED",
            name: "PIX_RECEIVED",
            description: "Pix recebido na conta."
        },
        {
            id: "PIX_SENT",
            name: "PIX_SENT",
            description: "Pix enviado da conta."
        }
    ]);
    const [selectedWebhookLog, setSelectedWebhookLog] = useState(1);
    const [webhookLogs] = useState([
        {
            id: 1,
            url: "https://example.com/aleatorio",
            description: "[Grex] Demo - 10/06/2025",
            status: "Status code 500, reason: Internal Server Error",
            statusCode: 500,
            isError: true,
            creationDate: "21/03/2026 03:00",
            webhookName: "[Grex] Demo",
            errorExplanation: "Lorem ipsum dolor sit amet consectetur. Gravida amet neque augue augue. Nisi id enim velit risus et orci lectus. Consectetur volutpat quis mauris amet odio congue dui commodo nisi.",
            sentContent: "",
            responseContent: ""
        },
        {
            id: 2,
            url: "https://example.com/webhook2",
            description: "[Grex] Test - 11/06/2025",
            status: "Success",
            statusCode: 200,
            isError: false,
            creationDate: "21/03/2026 02:30",
            webhookName: "[Grex] Test",
            errorExplanation: "",
            sentContent: "",
            responseContent: ""
        },
        {
            id: 3,
            url: "https://example.com/webhook3",
            description: "[Grex] Production - 12/06/2025",
            status: "Status code 404, reason: Not Found",
            statusCode: 404,
            isError: true,
            creationDate: "21/03/2026 02:00",
            webhookName: "[Grex] Production",
            errorExplanation: "Lorem ipsum dolor sit amet consectetur. Gravida amet neque augue augue.",
            sentContent: "",
            responseContent: ""
        }
    ]);

    // Sensores para drag and drop
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const [categories, setCategories] = useState({
        saidas: [
            {
                id: 1,
                name: "Despesa com Pessoal",
                type: "parent",
                color: "red",
                children: [
                    { id: 11, name: "Comissão de Vendas", type: "child", description: "" },
                    { id: 12, name: "Freelancers", type: "child", description: "" },
                    { id: 13, name: "INSS(GPS)", type: "child", description: "" },
                    { id: 14, name: "IRRF", type: "child", description: "DRE: Despesas com pessoal" }
                ]
            },
            {
                id: 2,
                name: "Despesa Administrativas",
                type: "parent",
                color: "red",
                children: [
                    { id: 21, name: "Advogado", type: "child", description: "DRE: Despesas administrativas" },
                    { id: 22, name: "Contabilidade", type: "child", description: "DRE: Despesas administrativas" },
                    { id: 23, name: "Impostos (DAS)", type: "child", description: "" },
                    { id: 24, name: "Infraestrutura", type: "child", description: "" },
                    { id: 25, name: "Outras Despesas", type: "child", description: "DRE: Despesas administrativas" }
                ]
            },
            {
                id: 3,
                name: "Despesa com Marketing",
                type: "parent",
                color: "red",
                children: [
                    { id: 31, name: "Facebook Ads", type: "child", description: "DRE: Despesas comerciais /.marketing" }
                ]
            }
        ],
        entradas: [
            {
                id: 4,
                name: "Receitas de Dízimos",
                type: "parent",
                color: "green",
                children: [
                    { id: 41, name: "Dízimos Mensais", type: "child", description: "DRE: Receitas de dízimos" },
                    { id: 42, name: "Dízimos Especiais", type: "child", description: "DRE: Receitas de dízimos" },
                    { id: 43, name: "Dízimos Online", type: "child", description: "DRE: Receitas de dízimos" },
                    { id: 44, name: "Dízimos em Espécie", type: "child", description: "DRE: Receitas de dízimos" }
                ]
            },
            {
                id: 5,
                name: "Receitas de Ofertas",
                type: "parent",
                color: "green",
                children: [
                    { id: 51, name: "Ofertas Regulares", type: "child", description: "DRE: Receitas de ofertas" },
                    { id: 52, name: "Ofertas Especiais", type: "child", description: "DRE: Receitas de ofertas" },
                    { id: 53, name: "Ofertas de Missões", type: "child", description: "DRE: Receitas de ofertas" },
                    { id: 54, name: "Ofertas de Construção", type: "child", description: "DRE: Receitas de ofertas" }
                ]
            },
            {
                id: 6,
                name: "Receitas de Eventos",
                type: "parent",
                color: "green",
                children: [
                    { id: 61, name: "Bazares", type: "child", description: "DRE: Receitas de eventos" },
                    { id: 62, name: "Jantares", type: "child", description: "DRE: Receitas de eventos" },
                    { id: 63, name: "Conferências", type: "child", description: "DRE: Receitas de eventos" },
                    { id: 64, name: "Cursos", type: "child", description: "DRE: Receitas de eventos" }
                ]
            }
        ],
        outros: [
            {
                id: 7,
                name: "Investimentos",
                type: "parent",
                color: "blue",
                children: [
                    { id: 71, name: "CDB", type: "child", description: "DRE: Investimentos" },
                    { id: 72, name: "Tesouro Direto", type: "child", description: "DRE: Investimentos" },
                    { id: 73, name: "Fundos", type: "child", description: "DRE: Investimentos" },
                    { id: 74, name: "Ações", type: "child", description: "DRE: Investimentos" }
                ]
            },
            {
                id: 8,
                name: "Empréstimos",
                type: "parent",
                color: "blue",
                children: [
                    { id: 81, name: "Empréstimos Pessoais", type: "child", description: "DRE: Empréstimos" },
                    { id: 82, name: "Financiamentos", type: "child", description: "DRE: Empréstimos" },
                    { id: 83, name: "Cartão de Crédito", type: "child", description: "DRE: Empréstimos" },
                    { id: 84, name: "Cheque Especial", type: "child", description: "DRE: Empréstimos" }
                ]
            },
            {
                id: 9,
                name: "Transferências",
                type: "parent",
                color: "blue",
                children: [
                    { id: 91, name: "Transferências entre Contas", type: "child", description: "DRE: Transferências" },
                    { id: 92, name: "Ajustes Contábeis", type: "child", description: "DRE: Transferências" },
                    { id: 93, name: "Reclassificações", type: "child", description: "DRE: Transferências" },
                    { id: 94, name: "Correções", type: "child", description: "DRE: Transferências" }
                ]
            }
        ]
    });

    const settingsMenu = [
        { id: "minha-igreja", label: "Minha Igreja", icon: Building },
        { id: "preferencias", label: "Preferências", icon: SettingsIcon },
        { id: "usuarios", label: "Usuários", icon: Users },
        { id: "meu-plano", label: "Meu plano", icon: CreditCard },
        { id: "categorias", label: "Categorias", icon: Tag },
        { id: "backup", label: "Backup e Dados", icon: Database },
        { id: "integracoes", label: "Integrações", icon: SettingsIcon }
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setAddressData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        let cep = e.target.value.replace(/\D/g, '');

        // Formatar CEP com hífen
        if (cep.length > 5) {
            cep = cep.substring(0, 5) + '-' + cep.substring(5, 8);
        }

        setAddressData(prev => ({
            ...prev,
            cep: cep
        }));

        // Buscar endereço quando CEP tiver 8 dígitos
        const cepNumbers = cep.replace(/\D/g, '');
        if (cepNumbers.length === 8) {
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cepNumbers}/json/`);
                const data = await response.json();

                if (!data.erro) {
                    setAddressData(prev => ({
                        ...prev,
                        logradouro: data.logradouro || "",
                        bairro: data.bairro || "",
                        cidade: data.localidade || "",
                        estado: data.uf || ""
                    }));
                }
            } catch (error) {
                console.error('Erro ao buscar CEP:', error);
            }
        }
    };

    const handleAddressSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Endereço salvo:", addressData);
        alert('Endereço salvo com sucesso!');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
    };

    const handlePreferenceChange = (key: string, value: string) => {
        setPreferences(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSavePreferences = () => {
        console.log('Salvando preferências:', preferences);
        alert('Preferências salvas com sucesso!');
    };

    const handleDeleteData = () => {
        if (confirm('Tem certeza que deseja excluir todos os dados? Esta ação não pode ser desfeita!')) {
            console.log('Excluindo dados do sistema...');
            alert('Dados excluídos com sucesso!');
        }
    };

    const handleAddUser = () => {
        setUserForm({
            name: "",
            email: "",
            role: "Membro",
            phone: "",
            department: ""
        });
        setShowAddUserModal(true);
    };

    const handleEditUser = (user: any) => {
        setEditingUser(user);
        setUserForm({
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone || "",
            department: user.department || ""
        });
        setShowEditUserModal(true);
    };

    const handleDeleteUser = (user: any) => {
        setDeletingUser(user);
        setShowDeleteUserModal(true);
    };

    const handleCloseAddUserModal = () => {
        setShowAddUserModal(false);
        setUserForm({
            name: "",
            email: "",
            role: "Membro",
            phone: "",
            department: ""
        });
    };

    const handleCloseEditUserModal = () => {
        setShowEditUserModal(false);
        setEditingUser(null);
        setUserForm({
            name: "",
            email: "",
            role: "Membro",
            phone: "",
            department: ""
        });
    };

    const handleCloseDeleteUserModal = () => {
        setShowDeleteUserModal(false);
        setDeletingUser(null);
    };

    const handleUserFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUserForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveUser = () => {
        if (!userForm.name || !userForm.email) {
            alert('Nome e e-mail são obrigatórios!');
            return;
        }

        if (editingUser) {
            // Editar usuário existente
            console.log('Editando usuário:', { ...editingUser, ...userForm });
            alert('Usuário editado com sucesso!');
            handleCloseEditUserModal();
        } else {
            // Adicionar novo usuário
            console.log('Adicionando usuário:', userForm);
            alert('Usuário adicionado com sucesso!');
            handleCloseAddUserModal();
        }
    };

    const handleConfirmDeleteUser = () => {
        if (deletingUser) {
            console.log('Removendo usuário:', deletingUser);
            alert('Usuário removido com sucesso!');
            handleCloseDeleteUserModal();
        }
    };

    const handleInviteUser = () => {
        setInviteForm({
            email: "",
            name: "",
            role: "Membro",
            department: "",
            message: ""
        });
        setShowInviteUserModal(true);
    };

    const handleCloseInviteUserModal = () => {
        setShowInviteUserModal(false);
        setInviteForm({
            email: "",
            name: "",
            role: "Membro",
            department: "",
            message: ""
        });
    };

    const handleInviteFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setInviteForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSendInvite = () => {
        if (!inviteForm.email || !inviteForm.name) {
            alert('E-mail e nome são obrigatórios!');
            return;
        }

        console.log('Enviando convite:', inviteForm);
        alert('Convite enviado com sucesso!');
        handleCloseInviteUserModal();
    };

    const handleCloseBanner = () => {
        setShowUpgradeBanner(false);
    };

    const handleViewDetails = () => {
        router.push('/dashboard/billing/invoices');
    };

    const handleUpgrade = () => {
        router.push('/dashboard/billing/plans');
    };

    const handleChangePayment = () => {
        router.push('/dashboard/billing/payment-methods');
    };

    const handlePaymentHistory = () => {
        router.push('/dashboard/billing/history');
    };

    const handleChangeEmail = () => {
        setEmailForm({
            currentEmail: "gustavo@grex.com.br",
            newEmail: "",
            confirmEmail: ""
        });
        setShowChangeEmailModal(true);
    };

    const handleEmailFormChange = (field: string, value: string) => {
        setEmailForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSaveEmail = () => {
        if (emailForm.newEmail !== emailForm.confirmEmail) {
            alert('Os e-mails não coincidem');
            return;
        }

        if (!emailForm.newEmail || !emailForm.confirmEmail) {
            alert('Preencha todos os campos');
            return;
        }

        // Aqui você pode implementar a lógica para salvar o novo e-mail
        console.log('Salvando novo e-mail:', emailForm.newEmail);
        alert('E-mail alterado com sucesso!');
        setShowChangeEmailModal(false);
    };

    const handleCloseChangeEmailModal = () => {
        setShowChangeEmailModal(false);
    };

    // Funções para Upload e Arquivos
    const handleUploadLogo = () => {
        // Simula o clique no input de arquivo da área de foto
        const fileInput = document.getElementById('church-photo-input') as HTMLInputElement;
        if (fileInput) {
            fileInput.click();
        }
    };

    const handleFileManagement = () => {
        setShowFileManagementModal(true);
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setUploadForm(prev => ({
                    ...prev,
                    file: file,
                    preview: e.target?.result as string
                }));
                // Atualiza a foto da igreja no formulário
                setFormData(prev => ({
                    ...prev,
                    churchPhoto: e.target?.result as string
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveLogo = () => {
        if (uploadForm.file) {
            console.log('Salvando logo:', uploadForm.file);
            alert('Logo salvo com sucesso!');
            setShowUploadLogoModal(false);
        }
    };

    const handlePreviewImage = (file: any) => {
        setUploadForm(prev => ({ ...prev, preview: file.preview }));
        setShowImagePreviewModal(true);
    };

    // Funções para Notificações
    const handleNotificationSettings = () => {
        setShowNotificationSettingsModal(true);
    };

    const handleNotificationHistory = () => {
        setShowNotificationHistoryModal(true);
    };

    const handleAlertSettings = () => {
        setShowAlertSettingsModal(true);
    };

    const handleNotificationToggle = (key: string) => {
        setNotificationSettings(prev => ({
            ...prev,
            [key]: !prev[key as keyof typeof prev]
        }));
    };

    const handleMarkAsRead = (id: number) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === id ? { ...notif, read: true } : notif
            )
        );
    };

    const handleDeleteFile = (id: number) => {
        setFiles(prev => prev.filter(file => file.id !== id));
    };

    const handleAddCategory = () => {
        setCategoryForm({
            name: "",
            type: "expense",
            parentId: "",
            description: "",
            color: "#3b82f6"
        });
        setShowAddCategoryModal(true);
    };

    const handleEditCategory = (category: any) => {
        setEditingCategory(category);
        setCategoryForm({
            name: category.name,
            type: category.type || "expense",
            parentId: category.parentId || "",
            description: category.description || "",
            color: category.color || "#3b82f6"
        });
        setShowEditCategoryModal(true);
    };

    const handleDeleteCategory = (category: any) => {
        setDeletingCategory(category);
        setShowDeleteCategoryModal(true);
    };

    const handleCloseAddCategoryModal = () => {
        setShowAddCategoryModal(false);
        setCategoryForm({
            name: "",
            type: "expense",
            parentId: "",
            description: "",
            color: "#3b82f6"
        });
    };

    const handleAddSubcategory = (subcategoryData: any) => {
        console.log("Adicionar subcategoria:", subcategoryData);
        toast.showSuccess("Subcategoria adicionada com sucesso!");
        setShowAddSubcategoryModal(false);
    };

    const handleSaveAdvancedPreferences = (preferences: any) => {
        console.log("Salvar preferências avançadas:", preferences);
        toast.showSuccess("Preferências salvas com sucesso!");
        setShowAdvancedPreferencesModal(false);
    };

    const handleCloseEditCategoryModal = () => {
        setShowEditCategoryModal(false);
        setEditingCategory(null);
        setCategoryForm({
            name: "",
            type: "expense",
            parentId: "",
            description: "",
            color: "#3b82f6"
        });
    };

    const handleCloseDeleteCategoryModal = () => {
        setShowDeleteCategoryModal(false);
        setDeletingCategory(null);
    };

    const handleCategoryFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCategoryForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveCategory = () => {
        if (!categoryForm.name) {
            alert('Nome da categoria é obrigatório!');
            return;
        }

        if (editingCategory) {
            // Editar categoria existente
            console.log('Editando categoria:', { ...editingCategory, ...categoryForm });
            alert('Categoria editada com sucesso!');
            handleCloseEditCategoryModal();
        } else {
            // Adicionar nova categoria
            console.log('Adicionando categoria:', categoryForm);
            alert('Categoria adicionada com sucesso!');
            handleCloseAddCategoryModal();
        }
    };

    const handleConfirmDeleteCategory = () => {
        if (deletingCategory) {
            console.log('Removendo categoria:', deletingCategory);
            alert('Categoria removida com sucesso!');
            handleCloseDeleteCategoryModal();
        }
    };

    const handleExportCategoriesJSON = () => {
        try {
            // Preparar dados para exportação
            const exportData = {
                metadata: {
                    exportDate: new Date().toISOString(),
                    version: "1.0",
                    totalCategories: Object.values(categories).flat().length,
                    totalSubcategories: Object.values(categories).flat().reduce((acc, cat) => acc + (cat.children?.length || 0), 0)
                },
                categories: {
                    saidas: categories.saidas,
                    entradas: categories.entradas,
                    outros: categories.outros
                }
            };

            // Criar arquivo JSON
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });

            // Criar link de download
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `categorias-grex-${new Date().toISOString().split('T')[0]}.json`;

            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            // Feedback visual
            alert('Categorias exportadas para JSON com sucesso!');
            handleCloseExportDropdown();
        } catch (error) {
            console.error('Erro ao exportar categorias:', error);
            alert('Erro ao exportar categorias. Tente novamente.');
        }
    };

    const handleExportCategoriesPDF = () => {
        try {
            const doc = new jsPDF();
            const currentDate = new Date().toLocaleDateString('pt-BR');
            const currentTime = new Date().toLocaleTimeString('pt-BR');

            // Cores personalizadas
            const primaryColor = [59, 130, 246]; // Azul
            const secondaryColor = [107, 114, 128]; // Cinza
            const accentColor = [220, 38, 38]; // Vermelho

            // Função para adicionar linha decorativa
            const addDecorativeLine = (y: number, color: number[] = primaryColor) => {
                doc.setDrawColor(color[0], color[1], color[2]);
                doc.setLineWidth(0.5);
                doc.line(20, y, 190, y);
            };

            // Função para adicionar retângulo colorido
            const addColoredRect = (x: number, y: number, width: number, height: number, color: number[]) => {
                doc.setFillColor(color[0], color[1], color[2]);
                doc.rect(x, y, width, height, 'F');
            };

            // Cabeçalho com fundo colorido
            addColoredRect(0, 0, 210, 40, primaryColor);

            // Logo/Título principal
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(24);
            doc.setFont('helvetica', 'bold');
            doc.text('GREX FINANCES', 20, 20);

            // Subtítulo
            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');
            doc.text('Sistema de Gestão Financeira', 20, 28);

            // Data e hora
            doc.setFontSize(10);
            doc.text(`Exportado em: ${currentDate} às ${currentTime}`, 20, 35);

            // Resetar cor do texto
            doc.setTextColor(0, 0, 0);

            let yPosition = 55;

            // Função para adicionar seção com cabeçalho estilizado
            const addSection = (title: string, color: number[] = primaryColor) => {
                if (yPosition > 250) {
                    doc.addPage();
                    yPosition = 20;
                }

                // Cabeçalho da seção
                addColoredRect(15, yPosition - 8, 180, 12, color);
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(14);
                doc.setFont('helvetica', 'bold');
                doc.text(title, 20, yPosition);

                // Resetar cor
                doc.setTextColor(0, 0, 0);
                yPosition += 15;
            };

            // Função para adicionar categoria com estilo
            const addCategory = (category: any, isSubcategory = false) => {
                if (yPosition > 270) {
                    doc.addPage();
                    yPosition = 20;
                }

                const indent = isSubcategory ? 25 : 0;
                const fontSize = isSubcategory ? 10 : 12;
                const fontWeight = isSubcategory ? 'normal' : 'bold';

                // Ícone colorido para categoria principal
                if (!isSubcategory) {
                    const iconColor = category.color === 'red' ? accentColor :
                        category.color === 'green' ? [34, 197, 94] :
                            category.color === 'blue' ? primaryColor : secondaryColor;

                    doc.setFillColor(iconColor[0], iconColor[1], iconColor[2]);
                    doc.circle(20 + indent, yPosition - 2, 2, 'F');
                }

                // Nome da categoria
                doc.setFontSize(fontSize);
                doc.setFont('helvetica', fontWeight);
                doc.setTextColor(0, 0, 0);
                doc.text(`${isSubcategory ? '    • ' : '• '}${category.name}`, 25 + indent, yPosition);

                // Descrição em cinza
                if (category.description) {
                    yPosition += 6;
                    doc.setFontSize(8);
                    doc.setFont('helvetica', 'italic');
                    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
                    doc.text(`      ${category.description}`, 25 + indent, yPosition);
                    yPosition += 4;
                }

                yPosition += 8;
            };

            // Estatísticas gerais
            const totalCategories = Object.values(categories).flat().length;
            const totalSubcategories = Object.values(categories).flat().reduce((acc, cat) => acc + (cat.children?.length || 0), 0);

            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
            doc.text(`Total: ${totalCategories} categorias principais • ${totalSubcategories} subcategorias`, 20, yPosition);
            yPosition += 15;

            // Linha decorativa
            addDecorativeLine(yPosition);
            yPosition += 10;

            // Seção Saídas
            addSection('SAÍDAS (Despesas)', accentColor);

            categories.saidas.forEach(category => {
                addCategory(category);
                if (category.children) {
                    category.children.forEach((child: any) => addCategory(child, true));
                }
            });

            // Espaçamento entre seções
            yPosition += 10;
            addDecorativeLine(yPosition, [34, 197, 94]); // Verde
            yPosition += 10;

            // Seção Entradas
            addSection('ENTRADAS (Receitas)', [34, 197, 94]);

            categories.entradas.forEach(category => {
                addCategory(category);
                if (category.children) {
                    category.children.forEach((child: any) => addCategory(child, true));
                }
            });

            // Espaçamento entre seções
            yPosition += 10;
            addDecorativeLine(yPosition, [168, 85, 247]); // Roxo
            yPosition += 10;

            // Seção Outros
            addSection('OUTROS', [168, 85, 247]);

            categories.outros.forEach(category => {
                addCategory(category);
                if (category.children) {
                    category.children.forEach((child: any) => addCategory(child, true));
                }
            });

            // Rodapé na última página
            const pageCount = (doc as any).getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);

                // Linha decorativa no rodapé
                addDecorativeLine(285, secondaryColor);

                // Informações do rodapé
                doc.setFontSize(8);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
                doc.text(`Página ${i} de ${pageCount}`, 20, 290);
                doc.text('Grex Finances - Sistema de Gestão Financeira', 120, 290);
            }

            // Salvar PDF
            doc.save(`categorias-grex-${new Date().toISOString().split('T')[0]}.pdf`);

            // Feedback visual
            alert('Categorias exportadas para PDF com sucesso!');
            handleCloseExportDropdown();
        } catch (error) {
            console.error('Erro ao exportar PDF:', error);
            alert('Erro ao exportar PDF. Tente novamente.');
        }
    };

    const handleExportCategoriesExcel = () => {
        try {
            // Preparar dados para Excel
            const excelData: any[] = [];

            // Cabeçalho
            excelData.push(['TIPO', 'CATEGORIA PRINCIPAL', 'SUBCATEGORIA', 'DESCRIÇÃO', 'COR']);

            // Função para adicionar categoria
            const addCategoryToExcel = (category: any, type: string) => {
                // Categoria principal
                excelData.push([
                    type,
                    category.name,
                    '',
                    category.description || '',
                    category.color || ''
                ]);

                // Subcategorias
                if (category.children) {
                    category.children.forEach((child: any) => {
                        excelData.push([
                            type,
                            category.name,
                            child.name,
                            child.description || '',
                            ''
                        ]);
                    });
                }
            };

            // Adicionar todas as categorias
            categories.saidas.forEach(category => addCategoryToExcel(category, 'SAÍDAS'));
            categories.entradas.forEach(category => addCategoryToExcel(category, 'ENTRADAS'));
            categories.outros.forEach(category => addCategoryToExcel(category, 'OUTROS'));

            // Criar workbook
            const ws = XLSX.utils.aoa_to_sheet(excelData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Categorias');

            // Salvar arquivo
            XLSX.writeFile(wb, `categorias-grex-${new Date().toISOString().split('T')[0]}.xlsx`);

            // Feedback visual
            alert('Categorias exportadas para Excel com sucesso!');
            handleCloseExportDropdown();
        } catch (error) {
            console.error('Erro ao exportar Excel:', error);
            alert('Erro ao exportar Excel. Tente novamente.');
        }
    };

    const handleImportCategories = () => {
        // Criar input de arquivo
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.style.display = 'none';

        input.onchange = (event) => {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const content = e.target?.result as string;
                    const importData = JSON.parse(content);

                    // Validar estrutura do arquivo
                    if (!importData.categories || !importData.metadata) {
                        throw new Error('Formato de arquivo inválido');
                    }

                    // Validar estrutura das categorias
                    const requiredTabs = ['saidas', 'entradas', 'outros'];
                    for (const tab of requiredTabs) {
                        if (!Array.isArray(importData.categories[tab])) {
                            throw new Error(`Estrutura inválida para ${tab}`);
                        }
                    }

                    // Confirmar importação
                    const totalCategories = Object.values(importData.categories).flat().length;
                    const totalSubcategories = Object.values(importData.categories).flat().reduce((acc: number, cat: any) => acc + (cat.children?.length || 0), 0);

                    const confirmMessage = `Deseja importar as categorias?\n\n` +
                        `• ${totalCategories} categorias principais\n` +
                        `• ${totalSubcategories} subcategorias\n` +
                        `• Data de exportação: ${new Date(importData.metadata.exportDate).toLocaleDateString('pt-BR')}\n\n` +
                        `⚠️ Esta ação substituirá todas as categorias atuais!`;

                    if (confirm(confirmMessage)) {
                        // Importar categorias
                        setCategories(importData.categories);

                        // Feedback visual
                        alert('Categorias importadas com sucesso!');
                    }
                } catch (error) {
                    console.error('Erro ao importar categorias:', error);
                    alert('Erro ao importar categorias. Verifique se o arquivo está no formato correto.');
                }
            };

            reader.readAsText(file);
        };

        // Trigger file selection
        document.body.appendChild(input);
        input.click();
        document.body.removeChild(input);
    };

    const handleCategoryHelp = () => {
        setShowCategoryHelpModal(true);
    };

    const handleCloseCategoryHelpModal = () => {
        setShowCategoryHelpModal(false);
    };

    const handleReconfigureChurch = () => {
        if (confirm('Deseja reconfigurar as informações da igreja? O assistente de configuração será aberto.')) {
            setShowSetupModal(true);
        }
    };

    const handleCloseSetupModal = () => {
        setShowSetupModal(false);
    };

    const handleAddApiKey = () => {
        setShowApiKeyModal(true);
    };

    const handleCloseApiKeyModal = () => {
        setShowApiKeyModal(false);
        setApiKeyForm({
            name: "",
            expirationDate: "",
            expirationTime: ""
        });
    };

    const handleApiKeyFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setApiKeyForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveApiKey = () => {
        const newApiKey = {
            id: Date.now(),
            name: apiKeyForm.name,
            expirationDate: apiKeyForm.expirationDate || "Sem expiração",
            status: "Ativa",
            isActive: true
        };

        setApiKeys(prev => [...prev, newApiKey]);
        handleCloseApiKeyModal();
    };

    const handleEditApiKey = (id: number) => {
        console.log('Editando chave de API:', id);
        alert('Funcionalidade de editar chave de API será implementada em breve!');
    };

    const handleToggleApiKey = (id: number) => {
        setApiKeys(prev => prev.map(key =>
            key.id === id ? { ...key, isActive: !key.isActive, status: key.isActive ? "Inativa" : "Ativa" } : key
        ));
    };

    const handleDeleteApiKey = (id: number) => {
        if (confirm('Tem certeza que deseja excluir esta chave de API?')) {
            setApiKeys(prev => prev.filter(key => key.id !== id));
        }
    };

    const handleAddWebhook = () => {
        setShowWebhookModal(true);
    };

    const handleCloseWebhookModal = () => {
        setShowWebhookModal(false);
        setWebhookForm({
            name: "",
            url: "",
            events: []
        });
    };

    const handleWebhookFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setWebhookForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveWebhook = () => {
        const newWebhook = {
            id: Date.now(),
            name: webhookForm.name,
            expirationDate: "Sem expiração",
            status: "Ativo",
            isActive: true
        };

        setWebhooks(prev => [...prev, newWebhook]);
        handleCloseWebhookModal();
    };


    const handleDeleteWebhook = (id: number) => {
        if (confirm('Tem certeza que deseja excluir este webhook?')) {
            setWebhooks(prev => prev.filter(webhook => webhook.id !== id));
        }
    };

    const handleEditWebhook = (webhook: any) => {
        setEditingWebhook(webhook);
        setWebhookEditForm({
            isActive: webhook.isActive,
            name: webhook.name,
            url: webhook.url,
            email: webhook.email || "email@email.com",
            apiVersion: "V1",
            authToken: "************",
            syncQueueActive: true,
            eventType: "Sequencial",
            selectedEvents: []
        });
    };

    const handleCloseWebhookEdit = () => {
        setEditingWebhook(null);
    };

    const handleWebhookEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setWebhookEditForm(prev => ({
                ...prev,
                [name]: checked
            }));
        } else {
            setWebhookEditForm(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleEventToggle = (eventId: string) => {
        setWebhookEditForm(prev => ({
            ...prev,
            selectedEvents: prev.selectedEvents.includes(eventId)
                ? prev.selectedEvents.filter(id => id !== eventId)
                : [...prev.selectedEvents, eventId]
        }));
    };

    const handleSelectAllEvents = () => {
        setWebhookEditForm(prev => ({
            ...prev,
            selectedEvents: webhookEvents.map(event => event.id)
        }));
    };

    const handleClearEventSelection = () => {
        setWebhookEditForm(prev => ({
            ...prev,
            selectedEvents: []
        }));
    };

    const handleSaveWebhookEdit = () => {
        if (editingWebhook) {
            setWebhooks(webhooks.map(webhook =>
                webhook.id === editingWebhook.id
                    ? { ...webhook, ...webhookEditForm }
                    : webhook
            ));
        }
        setEditingWebhook(null);
    };

    // Backup functions
    const handleCreateBackup = async () => {
        setIsCreatingBackup(true);

        const newBackup = {
            id: Date.now().toString(),
            name: `Backup Manual - ${new Date().toLocaleDateString('pt-BR')}`,
            type: "manual",
            status: "running",
            createdAt: new Date(),
            size: 0,
            format: "sql",
            includes: ["users", "transactions", "reports"],
        };

        setBackupJobs(prev => [newBackup, ...prev]);

        // Show loading toast
        const loadingToastId = toast.showBackupProgress("Criando backup dos dados...");

        // Simulate backup process
        setTimeout(() => {
            const finalSize = Math.floor(Math.random() * 20000000) + 1000000;

            setBackupJobs(prev =>
                prev.map(backup =>
                    backup.id === newBackup.id
                        ? {
                            ...backup,
                            status: "completed",
                            completedAt: new Date(),
                            size: finalSize,
                        }
                        : backup
                )
            );

            // Dismiss loading toast and show success
            toast.dismissToast(loadingToastId);
            toast.showBackupComplete(formatFileSize(finalSize));
            setIsCreatingBackup(false);
        }, 3000);
    };

    const handleDownloadBackup = (backup: any) => {
        try {
            // Simulate download
            const link = document.createElement("a");
            link.href = "#";
            link.download = `${backup.name}.${backup.format}`;
            link.click();
            toast.showSuccess(`Download iniciado: ${backup.name}`);
        } catch (error) {
            toast.showApiError("baixar backup");
        }
    };

    const handleDeleteBackup = (backupId: string) => {
        const backup = backupJobs.find(b => b.id === backupId);
        if (backup) {
            toast.showDeleteConfirm(`o backup "${backup.name}"`, () => {
                setBackupJobs(prev => prev.filter(backup => backup.id !== backupId));
                toast.showSuccess("Backup excluído com sucesso!");
            });
        }
    };

    const handleBackupSettingChange = (key: string, value: any) => {
        setBackupSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSaveBackupSettings = async () => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.showSaveSuccess();
        } catch (error) {
            toast.showApiError("salvar configurações de backup");
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setCategories((prevCategories) => {
                const currentTab = activeCategoryTab as keyof typeof prevCategories;
                const currentCategories = prevCategories[currentTab];

                // Encontrar a categoria pai de origem
                const sourceParentIndex = currentCategories.findIndex(category =>
                    category.children?.some(child => child.id.toString() === active.id)
                );

                // Verificar se está arrastando para uma categoria pai (drop zone)
                const targetParentIndex = currentCategories.findIndex(category =>
                    category.id.toString() === over?.id
                );

                // Se está arrastando para uma categoria pai
                if (sourceParentIndex !== -1 && targetParentIndex !== -1) {
                    const sourceParent = currentCategories[sourceParentIndex];
                    const targetParent = currentCategories[targetParentIndex];

                    // Encontrar a sub-categoria sendo movida
                    const sourceChild = sourceParent.children?.find(child => child.id.toString() === active.id);

                    if (sourceChild) {
                        const newCategories = [...currentCategories];

                        // Remover da categoria de origem
                        newCategories[sourceParentIndex] = {
                            ...sourceParent,
                            children: sourceParent.children?.filter(child => child.id.toString() !== active.id) || []
                        };

                        // Adicionar na categoria de destino
                        newCategories[targetParentIndex] = {
                            ...targetParent,
                            children: [
                                ...(targetParent.children || []),
                                sourceChild
                            ]
                        };

                        return {
                            ...prevCategories,
                            [currentTab]: newCategories
                        };
                    }
                }

                // Verificar se está arrastando para uma subcategoria (comportamento original)
                const targetChildParentIndex = currentCategories.findIndex(category =>
                    category.children?.some(child => child.id.toString() === over?.id)
                );

                // Se está movendo para uma subcategoria diferente
                if (sourceParentIndex !== -1 && targetChildParentIndex !== -1 && sourceParentIndex !== targetChildParentIndex) {
                    const sourceParent = currentCategories[sourceParentIndex];
                    const targetParent = currentCategories[targetChildParentIndex];

                    // Encontrar a sub-categoria sendo movida
                    const sourceChild = sourceParent.children?.find(child => child.id.toString() === active.id);
                    const targetChild = targetParent.children?.find(child => child.id.toString() === over?.id);

                    if (sourceChild && targetChild) {
                        const newCategories = [...currentCategories];

                        // Remover da categoria de origem
                        newCategories[sourceParentIndex] = {
                            ...sourceParent,
                            children: sourceParent.children?.filter(child => child.id.toString() !== active.id) || []
                        };

                        // Adicionar na categoria de destino
                        const targetChildren = targetParent.children || [];
                        const targetIndex = targetChildren.findIndex(child => child.id.toString() === over?.id);
                        const newTargetChildren = [...targetChildren];
                        newTargetChildren.splice(targetIndex, 0, sourceChild);

                        newCategories[targetChildParentIndex] = {
                            ...targetParent,
                            children: newTargetChildren
                        };

                        return {
                            ...prevCategories,
                            [currentTab]: newCategories
                        };
                    }
                }

                // Se está movendo dentro da mesma categoria
                if (sourceParentIndex !== -1 && sourceParentIndex === targetChildParentIndex) {
                    const parentCategory = currentCategories[sourceParentIndex];
                    const children = parentCategory.children || [];

                    const oldIndex = children.findIndex((child) => child.id.toString() === active.id);
                    const newIndex = children.findIndex((child) => child.id.toString() === over?.id);

                    if (oldIndex !== -1 && newIndex !== -1) {
                        const newChildren = arrayMove(children, oldIndex, newIndex);
                        const newCategories = [...currentCategories];
                        newCategories[sourceParentIndex] = {
                            ...parentCategory,
                            children: newChildren
                        };

                        return {
                            ...prevCategories,
                            [currentTab]: newCategories
                        };
                    }
                }

                return prevCategories;
            });
        }
    };

    const renderContent = () => {
        switch (activeSection) {
            case "minha-igreja":
                return (
                    <div style={{
                        padding: "32px",
                        backgroundColor: "#f8fafc",
                        minHeight: "100vh"
                    }}>
                        {/* Título e Botão de Reconfiguração */}
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "32px"
                        }}>
                            <h1 style={{
                                fontSize: "24px",
                                fontWeight: "600",
                                color: "#1f2937",
                                margin: "0"
                            }}>
                                Minha Igreja
                            </h1>
                            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                                <button
                                    onClick={handleReconfigureChurch}
                                    style={{
                                        padding: "12px 24px",
                                        background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "8px",
                                        fontSize: "14px",
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
                                    <SettingsIcon size={16} />
                                    Reconfigurar Igreja
                                </button>

                                <button
                                    onClick={handleFileManagement}
                                    style={{
                                        padding: "12px 24px",
                                        backgroundColor: "#ffffff",
                                        color: "#6b7280",
                                        border: "1px solid #d1d5db",
                                        borderRadius: "8px",
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        cursor: "pointer",
                                        transition: "all 0.2s ease",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.backgroundColor = "#f9fafb";
                                        e.currentTarget.style.borderColor = "#9ca3af";
                                        e.currentTarget.style.color = "#374151";
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.backgroundColor = "#ffffff";
                                        e.currentTarget.style.borderColor = "#d1d5db";
                                        e.currentTarget.style.color = "#6b7280";
                                    }}
                                >
                                    <FileSpreadsheet size={16} />
                                    Gerenciar Arquivos
                                </button>
                            </div>
                        </div>

                        {/* Container principal */}
                        <div style={{
                            backgroundColor: "white",
                            borderRadius: "12px",
                            padding: "32px",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                        }}>
                            {/* Abas */}
                            <div style={{
                                display: "flex",
                                borderBottom: "1px solid #e5e7eb",
                                marginBottom: "32px"
                            }}>
                                <button
                                    type="button"
                                    style={{
                                        background: "none",
                                        borderTop: "none",
                                        borderLeft: "none",
                                        borderRight: "none",
                                        padding: "16px 24px",
                                        fontSize: "16px",
                                        fontWeight: "500",
                                        color: activeTab === "informacoes" ? "#3b82f6" : "#6b7280",
                                        cursor: "pointer",
                                        borderBottom: activeTab === "informacoes" ? "2px solid #3b82f6" : "2px solid transparent"
                                    }}
                                    onClick={() => setActiveTab("informacoes")}
                                >
                                    Informações
                                </button>
                                <button
                                    type="button"
                                    style={{
                                        background: "none",
                                        borderTop: "none",
                                        borderLeft: "none",
                                        borderRight: "none",
                                        padding: "16px 24px",
                                        fontSize: "16px",
                                        fontWeight: "500",
                                        color: activeTab === "endereco" ? "#3b82f6" : "#6b7280",
                                        cursor: "pointer",
                                        borderBottom: activeTab === "endereco" ? "2px solid #3b82f6" : "2px solid transparent"
                                    }}
                                    onClick={() => setActiveTab("endereco")}
                                >
                                    Endereço
                                </button>
                            </div>

                            {/* Conteúdo das abas */}
                            {activeTab === "informacoes" && (
                                <form onSubmit={handleSubmit}>
                                    <div style={{ display: "flex", gap: "48px" }}>
                                        {/* Coluna esquerda - Formulário */}
                                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "24px" }}>
                                            <div>
                                                <label style={{
                                                    display: "block",
                                                    marginBottom: "8px",
                                                    fontSize: "14px",
                                                    fontWeight: "500",
                                                    color: "#374151"
                                                }}>
                                                    Nome da Igreja
                                                </label>
                                                <input
                                                    type="text"
                                                    name="nomeIgreja"
                                                    value={formData.nomeIgreja}
                                                    onChange={handleInputChange}
                                                    placeholder="Add value"
                                                    style={{
                                                        width: "100%",
                                                        padding: "10px 12px",
                                                        border: "1px solid #d1d5db",
                                                        borderRadius: "8px",
                                                        fontSize: "14px",
                                                        color: "#111827",
                                                        backgroundColor: "white",
                                                        outline: "none"
                                                    }}
                                                />
                                            </div>

                                            <div>
                                                <label style={{
                                                    display: "block",
                                                    marginBottom: "8px",
                                                    fontSize: "14px",
                                                    fontWeight: "500",
                                                    color: "#374151"
                                                }}>
                                                    Telefone
                                                </label>
                                                <input
                                                    type="text"
                                                    name="telefone"
                                                    value={formData.telefone}
                                                    onChange={handleInputChange}
                                                    placeholder="Add value"
                                                    style={{
                                                        width: "100%",
                                                        padding: "10px 12px",
                                                        border: "1px solid #d1d5db",
                                                        borderRadius: "8px",
                                                        fontSize: "14px",
                                                        color: "#111827",
                                                        backgroundColor: "white",
                                                        outline: "none"
                                                    }}
                                                />
                                            </div>

                                            <div>
                                                <label style={{
                                                    display: "block",
                                                    marginBottom: "8px",
                                                    fontSize: "14px",
                                                    fontWeight: "500",
                                                    color: "#374151"
                                                }}>
                                                    CPF/CNPJ
                                                </label>
                                                <input
                                                    type="text"
                                                    name="cpfCnpj"
                                                    value={formData.cpfCnpj}
                                                    onChange={handleInputChange}
                                                    placeholder="Add value"
                                                    style={{
                                                        width: "100%",
                                                        padding: "10px 12px",
                                                        border: "1px solid #d1d5db",
                                                        borderRadius: "8px",
                                                        fontSize: "14px",
                                                        color: "#111827",
                                                        backgroundColor: "white",
                                                        outline: "none"
                                                    }}
                                                />
                                            </div>

                                            <div>
                                                <label style={{
                                                    display: "block",
                                                    marginBottom: "8px",
                                                    fontSize: "14px",
                                                    fontWeight: "500",
                                                    color: "#374151"
                                                }}>
                                                    Site
                                                </label>
                                                <input
                                                    type="text"
                                                    name="site"
                                                    value={formData.site}
                                                    onChange={handleInputChange}
                                                    placeholder="Add value"
                                                    style={{
                                                        width: "100%",
                                                        padding: "10px 12px",
                                                        border: "1px solid #d1d5db",
                                                        borderRadius: "8px",
                                                        fontSize: "14px",
                                                        color: "#111827",
                                                        backgroundColor: "white",
                                                        outline: "none"
                                                    }}
                                                />
                                            </div>

                                            {/* Botão Salvar */}
                                            <div style={{ marginTop: "16px" }}>
                                                <button
                                                    type="submit"
                                                    style={{
                                                        backgroundColor: "#3b82f6",
                                                        color: "white",
                                                        border: "none",
                                                        padding: "10px 20px",
                                                        borderRadius: "8px",
                                                        fontSize: "14px",
                                                        fontWeight: "500",
                                                        cursor: "pointer"
                                                    }}
                                                >
                                                    Salvar
                                                </button>
                                            </div>
                                        </div>

                                        {/* Coluna direita - Upload de foto */}
                                        <div style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            gap: "16px",
                                            minWidth: "280px"
                                        }}>
                                            <label style={{
                                                fontSize: "14px",
                                                fontWeight: "500",
                                                color: "#374151",
                                                alignSelf: "flex-start"
                                            }}>
                                                Carregar foto
                                            </label>

                                            <div style={{
                                                width: "240px",
                                                height: "180px",
                                                backgroundColor: formData.churchPhoto ? "transparent" : "#dbeafe",
                                                borderRadius: "12px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                border: "2px dashed #93c5fd",
                                                position: "relative",
                                                overflow: "hidden"
                                            }}>
                                                {formData.churchPhoto ? (
                                                    <img
                                                        src={formData.churchPhoto}
                                                        alt="Foto da Igreja"
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            objectFit: "cover",
                                                            borderRadius: "10px"
                                                        }}
                                                    />
                                                ) : (
                                                    <Mountain size={64} color="#60a5fa" />
                                                )}
                                                <input
                                                    id="church-photo-input"
                                                    type="file"
                                                    accept="image/*"
                                                    style={{ display: "none" }}
                                                    onChange={handleFileUpload}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const fileInput = document.getElementById('church-photo-input') as HTMLInputElement;
                                                        if (fileInput) {
                                                            fileInput.click();
                                                        }
                                                    }}
                                                    style={{
                                                        position: "absolute",
                                                        bottom: "12px",
                                                        right: "12px",
                                                        width: "40px",
                                                        height: "40px",
                                                        borderRadius: "50%",
                                                        backgroundColor: "#6b7280",
                                                        border: "none",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        cursor: "pointer",
                                                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                                                    }}
                                                >
                                                    <Camera size={20} color="white" />
                                                </button>
                                            </div>

                                            <div style={{
                                                display: "flex",
                                                gap: "16px",
                                                alignItems: "center"
                                            }}>
                                                <button
                                                    type="button"
                                                    style={{
                                                        background: "none",
                                                        border: "none",
                                                        color: "#3b82f6",
                                                        fontSize: "14px",
                                                        cursor: "pointer",
                                                        textDecoration: "underline"
                                                    }}
                                                >
                                                    Alterar
                                                </button>
                                                <button
                                                    type="button"
                                                    style={{
                                                        background: "none",
                                                        border: "none",
                                                        color: "#ef4444",
                                                        fontSize: "14px",
                                                        cursor: "pointer",
                                                        textDecoration: "underline"
                                                    }}
                                                >
                                                    Remover
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            )}

                            {activeTab === "endereco" && (
                                <form onSubmit={handleAddressSubmit}>
                                    <div style={{ display: "flex", gap: "48px" }}>
                                        {/* Coluna esquerda - Formulário */}
                                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "24px" }}>
                                            {/* CEP */}
                                            <div>
                                                <label style={{
                                                    display: "block",
                                                    marginBottom: "8px",
                                                    fontSize: "14px",
                                                    fontWeight: "500",
                                                    color: "#374151"
                                                }}>
                                                    CEP *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="cep"
                                                    value={addressData.cep}
                                                    onChange={handleCepChange}
                                                    placeholder="00000-000"
                                                    maxLength={9}
                                                    style={{
                                                        width: "100%",
                                                        padding: "10px 12px",
                                                        border: "1px solid #d1d5db",
                                                        borderRadius: "8px",
                                                        fontSize: "14px",
                                                        color: "#111827",
                                                        backgroundColor: "white",
                                                        outline: "none"
                                                    }}
                                                />
                                            </div>

                                            {/* Logradouro */}
                                            <div>
                                                <label style={{
                                                    display: "block",
                                                    marginBottom: "8px",
                                                    fontSize: "14px",
                                                    fontWeight: "500",
                                                    color: "#374151"
                                                }}>
                                                    Logradouro *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="logradouro"
                                                    value={addressData.logradouro}
                                                    onChange={handleAddressChange}
                                                    placeholder="Rua, Avenida, etc."
                                                    style={{
                                                        width: "100%",
                                                        padding: "10px 12px",
                                                        border: "1px solid #d1d5db",
                                                        borderRadius: "8px",
                                                        fontSize: "14px",
                                                        color: "#111827",
                                                        backgroundColor: "white",
                                                        outline: "none"
                                                    }}
                                                />
                                            </div>

                                            {/* Número e Complemento */}
                                            <div style={{ display: "flex", gap: "16px" }}>
                                                <div style={{ flex: 1 }}>
                                                    <label style={{
                                                        display: "block",
                                                        marginBottom: "8px",
                                                        fontSize: "14px",
                                                        fontWeight: "500",
                                                        color: "#374151"
                                                    }}>
                                                        Número *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="numero"
                                                        value={addressData.numero}
                                                        onChange={handleAddressChange}
                                                        placeholder="123"
                                                        style={{
                                                            width: "100%",
                                                            padding: "10px 12px",
                                                            border: "1px solid #d1d5db",
                                                            borderRadius: "8px",
                                                            fontSize: "14px",
                                                            color: "#111827",
                                                            backgroundColor: "white",
                                                            outline: "none"
                                                        }}
                                                    />
                                                </div>
                                                <div style={{ flex: 2 }}>
                                                    <label style={{
                                                        display: "block",
                                                        marginBottom: "8px",
                                                        fontSize: "14px",
                                                        fontWeight: "500",
                                                        color: "#374151"
                                                    }}>
                                                        Complemento
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="complemento"
                                                        value={addressData.complemento}
                                                        onChange={handleAddressChange}
                                                        placeholder="Apartamento, sala, etc."
                                                        style={{
                                                            width: "100%",
                                                            padding: "10px 12px",
                                                            border: "1px solid #d1d5db",
                                                            borderRadius: "8px",
                                                            fontSize: "14px",
                                                            color: "#111827",
                                                            backgroundColor: "white",
                                                            outline: "none"
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Bairro */}
                                            <div>
                                                <label style={{
                                                    display: "block",
                                                    marginBottom: "8px",
                                                    fontSize: "14px",
                                                    fontWeight: "500",
                                                    color: "#374151"
                                                }}>
                                                    Bairro *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="bairro"
                                                    value={addressData.bairro}
                                                    onChange={handleAddressChange}
                                                    placeholder="Nome do bairro"
                                                    style={{
                                                        width: "100%",
                                                        padding: "10px 12px",
                                                        border: "1px solid #d1d5db",
                                                        borderRadius: "8px",
                                                        fontSize: "14px",
                                                        color: "#111827",
                                                        backgroundColor: "white",
                                                        outline: "none"
                                                    }}
                                                />
                                            </div>

                                            {/* Cidade e Estado */}
                                            <div style={{ display: "flex", gap: "16px" }}>
                                                <div style={{ flex: 2 }}>
                                                    <label style={{
                                                        display: "block",
                                                        marginBottom: "8px",
                                                        fontSize: "14px",
                                                        fontWeight: "500",
                                                        color: "#374151"
                                                    }}>
                                                        Cidade *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="cidade"
                                                        value={addressData.cidade}
                                                        onChange={handleAddressChange}
                                                        placeholder="Nome da cidade"
                                                        style={{
                                                            width: "100%",
                                                            padding: "10px 12px",
                                                            border: "1px solid #d1d5db",
                                                            borderRadius: "8px",
                                                            fontSize: "14px",
                                                            color: "#111827",
                                                            backgroundColor: "white",
                                                            outline: "none"
                                                        }}
                                                    />
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <label style={{
                                                        display: "block",
                                                        marginBottom: "8px",
                                                        fontSize: "14px",
                                                        fontWeight: "500",
                                                        color: "#374151"
                                                    }}>
                                                        Estado *
                                                    </label>
                                                    <select
                                                        name="estado"
                                                        value={addressData.estado}
                                                        onChange={handleAddressChange}
                                                        style={{
                                                            width: "100%",
                                                            padding: "10px 12px",
                                                            border: "1px solid #d1d5db",
                                                            borderRadius: "8px",
                                                            fontSize: "14px",
                                                            color: "#111827",
                                                            backgroundColor: "white",
                                                            outline: "none"
                                                        }}
                                                    >
                                                        <option value="">Selecione</option>
                                                        <option value="AC">Acre</option>
                                                        <option value="AL">Alagoas</option>
                                                        <option value="AP">Amapá</option>
                                                        <option value="AM">Amazonas</option>
                                                        <option value="BA">Bahia</option>
                                                        <option value="CE">Ceará</option>
                                                        <option value="DF">Distrito Federal</option>
                                                        <option value="ES">Espírito Santo</option>
                                                        <option value="GO">Goiás</option>
                                                        <option value="MA">Maranhão</option>
                                                        <option value="MT">Mato Grosso</option>
                                                        <option value="MS">Mato Grosso do Sul</option>
                                                        <option value="MG">Minas Gerais</option>
                                                        <option value="PA">Pará</option>
                                                        <option value="PB">Paraíba</option>
                                                        <option value="PR">Paraná</option>
                                                        <option value="PE">Pernambuco</option>
                                                        <option value="PI">Piauí</option>
                                                        <option value="RJ">Rio de Janeiro</option>
                                                        <option value="RN">Rio Grande do Norte</option>
                                                        <option value="RS">Rio Grande do Sul</option>
                                                        <option value="RO">Rondônia</option>
                                                        <option value="RR">Roraima</option>
                                                        <option value="SC">Santa Catarina</option>
                                                        <option value="SP">São Paulo</option>
                                                        <option value="SE">Sergipe</option>
                                                        <option value="TO">Tocantins</option>
                                                    </select>
                                                </div>
                                            </div>

                                            {/* País */}
                                            <div>
                                                <label style={{
                                                    display: "block",
                                                    marginBottom: "8px",
                                                    fontSize: "14px",
                                                    fontWeight: "500",
                                                    color: "#374151"
                                                }}>
                                                    País
                                                </label>
                                                <input
                                                    type="text"
                                                    name="pais"
                                                    value={addressData.pais}
                                                    onChange={handleAddressChange}
                                                    placeholder="Brasil"
                                                    style={{
                                                        width: "100%",
                                                        padding: "10px 12px",
                                                        border: "1px solid #d1d5db",
                                                        borderRadius: "8px",
                                                        fontSize: "14px",
                                                        color: "#111827",
                                                        backgroundColor: "white",
                                                        outline: "none"
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* Coluna direita - Informações */}
                                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "24px" }}>
                                            <div style={{
                                                backgroundColor: "#f8fafc",
                                                padding: "24px",
                                                borderRadius: "8px",
                                                border: "1px solid #e5e7eb"
                                            }}>
                                                <h3 style={{
                                                    fontSize: "16px",
                                                    fontWeight: "600",
                                                    color: "#1f2937",
                                                    margin: "0 0 12px 0"
                                                }}>
                                                    💡 Dicas
                                                </h3>
                                                <ul style={{
                                                    margin: 0,
                                                    paddingLeft: "20px",
                                                    fontSize: "14px",
                                                    color: "#6b7280",
                                                    lineHeight: "1.6"
                                                }}>
                                                    <li>Digite o CEP para preenchimento automático</li>
                                                    <li>Campos marcados com * são obrigatórios</li>
                                                    <li>O endereço será usado para documentos fiscais</li>
                                                    <li>Verifique se todos os dados estão corretos</li>
                                                </ul>
                                            </div>

                                            <div style={{
                                                backgroundColor: "#fef3c7",
                                                padding: "16px",
                                                borderRadius: "8px",
                                                border: "1px solid #f59e0b"
                                            }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                                                    <div style={{
                                                        width: "20px",
                                                        height: "20px",
                                                        backgroundColor: "#f59e0b",
                                                        borderRadius: "50%",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        color: "white",
                                                        fontSize: "12px",
                                                        fontWeight: "bold"
                                                    }}>
                                                        !
                                                    </div>
                                                    <span style={{
                                                        fontSize: "14px",
                                                        fontWeight: "600",
                                                        color: "#92400e"
                                                    }}>
                                                        Importante
                                                    </span>
                                                </div>
                                                <p style={{
                                                    margin: 0,
                                                    fontSize: "13px",
                                                    color: "#92400e",
                                                    lineHeight: "1.5"
                                                }}>
                                                    O endereço informado será utilizado para emissão de notas fiscais e documentos contábeis.
                                                    Certifique-se de que está correto e atualizado.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Botão de salvar */}
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        marginTop: "32px",
                                        paddingTop: "24px",
                                        borderTop: "1px solid #e5e7eb"
                                    }}>
                                        <button
                                            type="submit"
                                            style={{
                                                backgroundColor: "#3b82f6",
                                                color: "white",
                                                border: "none",
                                                padding: "12px 24px",
                                                borderRadius: "8px",
                                                fontSize: "14px",
                                                fontWeight: "600",
                                                cursor: "pointer",
                                                transition: "background-color 0.2s"
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#2563eb"}
                                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#3b82f6"}
                                        >
                                            Salvar Endereço
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                );
            case "preferencias":
                return (
                    <div style={{ padding: "32px" }}>
                        <div style={{ marginBottom: "32px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                                <div>
                                    <h1 style={{ fontSize: "24px", fontWeight: "600", color: "#1f2937", margin: "0 0 8px 0" }}>
                                        Preferências
                                    </h1>
                                    <p style={{ fontSize: "16px", color: "#6b7280", margin: "0" }}>
                                        Configure suas preferências de uso da plataforma
                                    </p>
                                </div>
                                <div style={{ display: "flex", gap: "12px" }}>
                                    <button
                                        onClick={handleNotificationSettings}
                                        style={{
                                            padding: "12px 24px",
                                            backgroundColor: "#ffffff",
                                            color: "#3b82f6",
                                            border: "1px solid #e5e7eb",
                                            borderRadius: "8px",
                                            fontSize: "14px",
                                            fontWeight: "500",
                                            cursor: "pointer",
                                            transition: "all 0.2s ease",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.backgroundColor = "#f8fafc";
                                            e.currentTarget.style.borderColor = "#3b82f6";
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.backgroundColor = "#ffffff";
                                            e.currentTarget.style.borderColor = "#e5e7eb";
                                        }}
                                    >
                                        <Bell size={16} />
                                        Configurar Notificações
                                    </button>

                                    <button
                                        onClick={handleNotificationHistory}
                                        style={{
                                            padding: "12px 24px",
                                            backgroundColor: "#ffffff",
                                            color: "#6b7280",
                                            border: "1px solid #d1d5db",
                                            borderRadius: "8px",
                                            fontSize: "14px",
                                            fontWeight: "500",
                                            cursor: "pointer",
                                            transition: "all 0.2s ease",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.backgroundColor = "#f9fafb";
                                            e.currentTarget.style.borderColor = "#9ca3af";
                                            e.currentTarget.style.color = "#374151";
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.backgroundColor = "#ffffff";
                                            e.currentTarget.style.borderColor = "#d1d5db";
                                            e.currentTarget.style.color = "#6b7280";
                                        }}
                                    >
                                        <FileSpreadsheet size={16} />
                                        Histórico de Notificações
                                    </button>

                                    <button
                                        onClick={handleAlertSettings}
                                        style={{
                                            padding: "12px 24px",
                                            backgroundColor: "#ffffff",
                                            color: "#6b7280",
                                            border: "1px solid #d1d5db",
                                            borderRadius: "8px",
                                            fontSize: "14px",
                                            fontWeight: "500",
                                            cursor: "pointer",
                                            transition: "all 0.2s ease",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.backgroundColor = "#f9fafb";
                                            e.currentTarget.style.borderColor = "#9ca3af";
                                            e.currentTarget.style.color = "#374151";
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.backgroundColor = "#ffffff";
                                            e.currentTarget.style.borderColor = "#d1d5db";
                                            e.currentTarget.style.color = "#6b7280";
                                        }}
                                    >
                                        <AlertTriangle size={16} />
                                        Configurar Alertas
                                    </button>

                                    <button
                                        onClick={() => setShowAdvancedPreferencesModal(true)}
                                        style={{
                                            padding: "12px 24px",
                                            backgroundColor: "#ffffff",
                                            color: "#8b5cf6",
                                            border: "1px solid #d1d5db",
                                            borderRadius: "8px",
                                            fontSize: "14px",
                                            fontWeight: "500",
                                            cursor: "pointer",
                                            transition: "all 0.2s ease",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.backgroundColor = "#f9fafb";
                                            e.currentTarget.style.borderColor = "#8b5cf6";
                                            e.currentTarget.style.color = "#7c3aed";
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.backgroundColor = "#ffffff";
                                            e.currentTarget.style.borderColor = "#d1d5db";
                                            e.currentTarget.style.color = "#8b5cf6";
                                        }}
                                    >
                                        <SettingsIcon size={16} />
                                        Preferências Avançadas
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div style={{
                            backgroundColor: "white",
                            borderRadius: "12px",
                            padding: "32px",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                            border: "1px solid #e5e7eb"
                        }}>
                            <form style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                                {/* Ordem dos lançamentos */}
                                <div>
                                    <label style={{
                                        display: "block",
                                        marginBottom: "8px",
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        color: "#374151"
                                    }}>
                                        Ordem dos lançamentos na tela
                                    </label>
                                    <div style={{ position: "relative" }}>
                                        <select
                                            value={preferences.orderType}
                                            onChange={(e) => handlePreferenceChange('orderType', e.target.value)}
                                            style={{
                                                width: "100%",
                                                padding: "12px 16px",
                                                border: "1px solid #d1d5db",
                                                borderRadius: "8px",
                                                fontSize: "16px",
                                                color: "#111827",
                                                backgroundColor: "white",
                                                appearance: "none",
                                                backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e\")",
                                                backgroundPosition: "right 12px center",
                                                backgroundRepeat: "no-repeat",
                                                backgroundSize: "16px"
                                            }}
                                        >
                                            <option value="crescente">Crescente</option>
                                            <option value="decrescente">Decrescente</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Período de navegação */}
                                <div>
                                    <label style={{
                                        display: "block",
                                        marginBottom: "8px",
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        color: "#374151"
                                    }}>
                                        Período de navegação padrão
                                    </label>
                                    <div style={{ position: "relative" }}>
                                        <select
                                            value={preferences.defaultPeriod}
                                            onChange={(e) => handlePreferenceChange('defaultPeriod', e.target.value)}
                                            style={{
                                                width: "100%",
                                                padding: "12px 16px",
                                                border: "1px solid #d1d5db",
                                                borderRadius: "8px",
                                                fontSize: "16px",
                                                color: "#111827",
                                                backgroundColor: "white",
                                                appearance: "none",
                                                backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e\")",
                                                backgroundPosition: "right 12px center",
                                                backgroundRepeat: "no-repeat",
                                                backgroundSize: "16px"
                                            }}
                                        >
                                            <option value="mensal">Mensal</option>
                                            <option value="semanal">Semanal</option>
                                            <option value="anual">Anual</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Moeda padrão */}
                                <div>
                                    <label style={{
                                        display: "block",
                                        marginBottom: "8px",
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        color: "#374151"
                                    }}>
                                        Moeda padrão
                                    </label>
                                    <div style={{ position: "relative" }}>
                                        <select
                                            value={preferences.defaultCurrency}
                                            onChange={(e) => handlePreferenceChange('defaultCurrency', e.target.value)}
                                            style={{
                                                width: "100%",
                                                padding: "12px 16px",
                                                border: "1px solid #d1d5db",
                                                borderRadius: "8px",
                                                fontSize: "16px",
                                                color: "#111827",
                                                backgroundColor: "white",
                                                appearance: "none",
                                                backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e\")",
                                                backgroundPosition: "right 12px center",
                                                backgroundRepeat: "no-repeat",
                                                backgroundSize: "16px"
                                            }}
                                        >
                                            <option value="brl">(BRL) Real</option>
                                            <option value="usd">(USD) Dólar</option>
                                            <option value="eur">(EUR) Euro</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Botão Salvar */}
                                <div style={{ marginTop: "16px" }}>
                                    <button
                                        type="button"
                                        onClick={handleSavePreferences}
                                        style={{
                                            backgroundColor: "#3b82f6",
                                            color: "white",
                                            border: "none",
                                            padding: "12px 24px",
                                            borderRadius: "8px",
                                            fontSize: "16px",
                                            fontWeight: "500",
                                            cursor: "pointer"
                                        }}
                                    >
                                        Salvar
                                    </button>
                                </div>

                                {/* Zona de perigo */}
                                <div style={{
                                    marginTop: "48px",
                                    padding: "24px",
                                    backgroundColor: "#fef2f2",
                                    border: "1px solid #fecaca",
                                    borderRadius: "8px"
                                }}>
                                    <h3 style={{
                                        fontSize: "18px",
                                        fontWeight: "600",
                                        color: "#dc2626",
                                        margin: "0 0 8px 0"
                                    }}>
                                        Excluir dados do sistema
                                    </h3>
                                    <p style={{
                                        fontSize: "14px",
                                        color: "#991b1b",
                                        margin: "0 0 16px 0"
                                    }}>
                                        Esta é uma zona de perigo! Você pode excluir os seus dados do sistema,
                                        mas entenda que ao fazer isso você não poderá voltar atrás!
                                    </p>
                                    <button
                                        type="button"
                                        onClick={handleDeleteData}
                                        style={{
                                            backgroundColor: "#dc2626",
                                            color: "white",
                                            border: "none",
                                            padding: "8px 16px",
                                            borderRadius: "6px",
                                            fontSize: "14px",
                                            fontWeight: "500",
                                            cursor: "pointer"
                                        }}
                                    >
                                        Excluir Dados
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                );
            case "usuarios":
                return (
                    <div style={{ padding: "32px" }}>
                        <div style={{ marginBottom: "32px" }}>
                            <h1 style={{ fontSize: "24px", fontWeight: "600", color: "#1f2937", margin: "0 0 8px 0" }}>
                                Usuários
                            </h1>
                            <p style={{ fontSize: "16px", color: "#6b7280", margin: "0" }}>
                                Gerencie os usuários da sua conta
                            </p>
                        </div>

                        {/* Header com contador e botão */}
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "24px"
                        }}>
                            <h2 style={{
                                fontSize: "18px",
                                fontWeight: "600",
                                color: "#1f2937",
                                margin: "0"
                            }}>
                                {users.length} usuário{users.length !== 1 ? 's' : ''}
                            </h2>
                            <div style={{
                                display: "flex",
                                gap: "12px"
                            }}>
                                <button
                                    onClick={handleAddUser}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        backgroundColor: "#3b82f6",
                                        color: "white",
                                        border: "none",
                                        padding: "10px 16px",
                                        borderRadius: "8px",
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        cursor: "pointer"
                                    }}
                                >
                                    <Plus size={16} />
                                    Adicionar
                                </button>
                                <button
                                    onClick={handleInviteUser}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        backgroundColor: "white",
                                        color: "#3b82f6",
                                        border: "1px solid #3b82f6",
                                        padding: "10px 16px",
                                        borderRadius: "8px",
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        cursor: "pointer"
                                    }}
                                >
                                    <Mail size={16} />
                                    Convidar por E-mail
                                </button>
                            </div>
                        </div>

                        {/* Banner de upgrade */}
                        {showUpgradeBanner && (
                            <div style={{
                                backgroundColor: "#fef3c7",
                                border: "1px solid #f59e0b",
                                borderRadius: "8px",
                                padding: "16px",
                                marginBottom: "24px",
                                position: "relative"
                            }}>
                                <button
                                    onClick={handleCloseBanner}
                                    style={{
                                        position: "absolute",
                                        top: "12px",
                                        right: "12px",
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        color: "#92400e",
                                        padding: "4px"
                                    }}
                                >
                                    <X size={16} />
                                </button>
                                <p style={{
                                    fontSize: "14px",
                                    color: "#92400e",
                                    margin: "0",
                                    paddingRight: "32px"
                                }}>
                                    Migre para o plano PLUS para adicionar usuários ilimitados.
                                </p>
                            </div>
                        )}

                        {/* Lista de usuários */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            {users.map((user) => (
                                <div
                                    key={user.id}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "16px",
                                        backgroundColor: "white",
                                        border: "1px solid #e5e7eb",
                                        borderRadius: "8px",
                                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                                    }}
                                >
                                    {/* Avatar */}
                                    <div style={{
                                        width: "40px",
                                        height: "40px",
                                        borderRadius: "50%",
                                        backgroundColor: "#f3f4f6",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginRight: "16px",
                                        fontSize: "14px",
                                        fontWeight: "600",
                                        color: "#6b7280"
                                    }}>
                                        {user.initials}
                                    </div>

                                    {/* Informações do usuário */}
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{
                                            fontSize: "16px",
                                            fontWeight: "600",
                                            color: "#1f2937",
                                            margin: "0 0 4px 0"
                                        }}>
                                            {user.name}
                                        </h3>
                                        <p style={{
                                            fontSize: "14px",
                                            color: "#6b7280",
                                            margin: "0"
                                        }}>
                                            {user.email}
                                        </p>
                                    </div>

                                    {/* Role */}
                                    <div style={{
                                        fontSize: "14px",
                                        color: "#6b7280",
                                        fontWeight: "500",
                                        marginRight: "16px"
                                    }}>
                                        {user.role}
                                    </div>

                                    {/* Botões de ação */}
                                    <div style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px"
                                    }}>
                                        <button
                                            onClick={() => handleEditUser(user)}
                                            style={{
                                                background: "none",
                                                border: "none",
                                                cursor: "pointer",
                                                padding: "8px",
                                                borderRadius: "6px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "#3b82f6"
                                            }}
                                            title="Editar usuário"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteUser(user)}
                                            style={{
                                                background: "none",
                                                border: "none",
                                                cursor: "pointer",
                                                padding: "8px",
                                                borderRadius: "6px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "#dc2626"
                                            }}
                                            title="Remover usuário"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case "meu-plano":
                return (
                    <div style={{ padding: "32px" }}>
                        <div style={{ marginBottom: "32px" }}>
                            <h1 style={{ fontSize: "24px", fontWeight: "600", color: "#1f2937", margin: "0 0 8px 0" }}>
                                Meu plano
                            </h1>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                            {/* Card do Plano Atual */}
                            <div style={{
                                backgroundColor: "white",
                                border: "1px solid #e5e7eb",
                                borderRadius: "12px",
                                padding: "24px",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                position: "relative"
                            }}>
                                {/* Ícone de ajuda */}
                                <button style={{
                                    position: "absolute",
                                    top: "0px",
                                    right: "0px",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "#6b7280",
                                    padding: "8px"
                                }}>
                                    <HelpCircle size={16} />
                                </button>

                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                                    <div style={{ flex: 1 }}>
                                        <p style={{
                                            fontSize: "14px",
                                            color: "#6b7280",
                                            margin: "0 0 4px 0"
                                        }}>
                                            {planData.currentPlan.description}
                                        </p>
                                        <h2 style={{
                                            fontSize: "16px",
                                            fontWeight: "600",
                                            color: "#1f2937",
                                            margin: "0 0 8px 0"
                                        }}>
                                            {planData.currentPlan.name}
                                        </h2>
                                        <div style={{ display: "flex", gap: "12px" }}>
                                            <button
                                                onClick={handleViewDetails}
                                                style={{
                                                    backgroundColor: "#ffffff",
                                                    color: "#3b82f6",
                                                    border: "1px solid #e5e7eb",
                                                    padding: "10px 16px",
                                                    fontSize: "14px",
                                                    fontWeight: "500",
                                                    cursor: "pointer",
                                                    textDecoration: "none",
                                                    borderRadius: "8px",
                                                    transition: "all 0.2s ease",
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: "6px",
                                                    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                                                    minHeight: "40px"
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.backgroundColor = "#f8fafc";
                                                    e.currentTarget.style.borderColor = "#3b82f6";
                                                    e.currentTarget.style.color = "#1d4ed8";
                                                    e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
                                                    e.currentTarget.style.transform = "translateY(-1px)";
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.backgroundColor = "#ffffff";
                                                    e.currentTarget.style.borderColor = "#e5e7eb";
                                                    e.currentTarget.style.color = "#3b82f6";
                                                    e.currentTarget.style.boxShadow = "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
                                                    e.currentTarget.style.transform = "translateY(0)";
                                                }}
                                            >
                                                Ver detalhes
                                            </button>
                                            <button
                                                onClick={handleUpgrade}
                                                style={{
                                                    backgroundColor: "#3b82f6",
                                                    color: "#ffffff",
                                                    border: "1px solid #3b82f6",
                                                    padding: "10px 16px",
                                                    fontSize: "14px",
                                                    fontWeight: "600",
                                                    cursor: "pointer",
                                                    textDecoration: "none",
                                                    borderRadius: "8px",
                                                    transition: "all 0.2s ease",
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: "6px",
                                                    boxShadow: "0 1px 2px 0 rgba(59, 130, 246, 0.3)",
                                                    minHeight: "40px"
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.backgroundColor = "#1d4ed8";
                                                    e.currentTarget.style.borderColor = "#1d4ed8";
                                                    e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(59, 130, 246, 0.4), 0 2px 4px -1px rgba(59, 130, 246, 0.2)";
                                                    e.currentTarget.style.transform = "translateY(-1px)";
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.backgroundColor = "#3b82f6";
                                                    e.currentTarget.style.borderColor = "#3b82f6";
                                                    e.currentTarget.style.boxShadow = "0 1px 2px 0 rgba(59, 130, 246, 0.3)";
                                                    e.currentTarget.style.transform = "translateY(0)";
                                                }}
                                            >
                                                <ArrowUp size={14} />
                                                Fazer upgrade
                                            </button>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <p style={{
                                            fontSize: "16px",
                                            fontWeight: "600",
                                            color: "#1f2937",
                                            margin: "0 0 4px 0"
                                        }}>
                                            {planData.currentPlan.price}
                                        </p>
                                        <p style={{
                                            fontSize: "14px",
                                            color: "#6b7280",
                                            margin: "0"
                                        }}>
                                            Próxima cobrança: {planData.currentPlan.nextBilling}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Card do Método de Pagamento */}
                            <div style={{
                                backgroundColor: "white",
                                border: "1px solid #e5e7eb",
                                borderRadius: "12px",
                                padding: "24px",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                            }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{
                                            fontSize: "16px",
                                            fontWeight: "600",
                                            color: "#1f2937",
                                            margin: "0 0 8px 0"
                                        }}>
                                            {planData.currentPlan.name}
                                        </h3>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <p style={{
                                                fontSize: "14px",
                                                color: "#6b7280",
                                                margin: "0"
                                            }}>
                                                {planData.paymentMethod.type}
                                            </p>
                                            <div style={{ display: "flex", gap: "2px" }}>
                                                <div style={{
                                                    width: "20px",
                                                    height: "12px",
                                                    backgroundColor: "#ff6b35",
                                                    borderRadius: "2px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontSize: "8px",
                                                    fontWeight: "600",
                                                    color: "white"
                                                }}>
                                                    M
                                                </div>
                                                <div style={{
                                                    width: "20px",
                                                    height: "12px",
                                                    backgroundColor: "#ffd700",
                                                    borderRadius: "2px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontSize: "8px",
                                                    fontWeight: "600",
                                                    color: "white"
                                                }}>
                                                    V
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", gap: "12px" }}>
                                        <button
                                            onClick={handleChangePayment}
                                            style={{
                                                backgroundColor: "#ffffff",
                                                color: "#6b7280",
                                                border: "1px solid #d1d5db",
                                                padding: "10px 16px",
                                                fontSize: "14px",
                                                fontWeight: "500",
                                                cursor: "pointer",
                                                textDecoration: "none",
                                                borderRadius: "8px",
                                                transition: "all 0.2s ease",
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: "6px",
                                                boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                                                minHeight: "40px"
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = "#f9fafb";
                                                e.currentTarget.style.borderColor = "#9ca3af";
                                                e.currentTarget.style.color = "#374151";
                                                e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
                                                e.currentTarget.style.transform = "translateY(-1px)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = "#ffffff";
                                                e.currentTarget.style.borderColor = "#d1d5db";
                                                e.currentTarget.style.color = "#6b7280";
                                                e.currentTarget.style.boxShadow = "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
                                                e.currentTarget.style.transform = "translateY(0)";
                                            }}
                                        >
                                            Alterar
                                        </button>
                                        <button
                                            onClick={handlePaymentHistory}
                                            style={{
                                                backgroundColor: "#ffffff",
                                                color: "#3b82f6",
                                                border: "1px solid #e5e7eb",
                                                padding: "10px 16px",
                                                fontSize: "14px",
                                                fontWeight: "500",
                                                cursor: "pointer",
                                                textDecoration: "none",
                                                borderRadius: "8px",
                                                transition: "all 0.2s ease",
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: "6px",
                                                boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                                                minHeight: "40px"
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = "#f8fafc";
                                                e.currentTarget.style.borderColor = "#3b82f6";
                                                e.currentTarget.style.color = "#1d4ed8";
                                                e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
                                                e.currentTarget.style.transform = "translateY(-1px)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = "#ffffff";
                                                e.currentTarget.style.borderColor = "#e5e7eb";
                                                e.currentTarget.style.color = "#3b82f6";
                                                e.currentTarget.style.boxShadow = "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
                                                e.currentTarget.style.transform = "translateY(0)";
                                            }}
                                        >
                                            Histórico de pagamentos
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Card do E-mail para Faturas */}
                            <div style={{
                                backgroundColor: "white",
                                border: "1px solid #e5e7eb",
                                borderRadius: "12px",
                                padding: "24px",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                            }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                    <div style={{ flex: 1 }}>
                                        <p style={{
                                            fontSize: "14px",
                                            color: "#6b7280",
                                            margin: "0 0 8px 0"
                                        }}>
                                            E-mail para emissão de faturas e notas fiscais
                                        </p>
                                        <p style={{
                                            fontSize: "16px",
                                            fontWeight: "600",
                                            color: "#1f2937",
                                            margin: "0"
                                        }}>
                                            {planData.billingEmail}
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleChangeEmail}
                                        style={{
                                            backgroundColor: "#ffffff",
                                            color: "#6b7280",
                                            border: "1px solid #d1d5db",
                                            padding: "10px 16px",
                                            fontSize: "14px",
                                            fontWeight: "500",
                                            cursor: "pointer",
                                            textDecoration: "none",
                                            borderRadius: "8px",
                                            transition: "all 0.2s ease",
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: "6px",
                                            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                                            minHeight: "40px"
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = "#f9fafb";
                                            e.currentTarget.style.borderColor = "#9ca3af";
                                            e.currentTarget.style.color = "#374151";
                                            e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
                                            e.currentTarget.style.transform = "translateY(-1px)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = "#ffffff";
                                            e.currentTarget.style.borderColor = "#d1d5db";
                                            e.currentTarget.style.color = "#6b7280";
                                            e.currentTarget.style.boxShadow = "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
                                            e.currentTarget.style.transform = "translateY(0)";
                                        }}
                                    >
                                        Alterar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case "categorias":
                return (
                    <div style={{ padding: "32px" }}>
                        <div style={{ marginBottom: "32px" }}>
                            <h1 style={{ fontSize: "24px", fontWeight: "600", color: "#1f2937", margin: "0 0 8px 0" }}>
                                Categorias
                            </h1>
                            <p style={{ fontSize: "16px", color: "#6b7280", margin: "0" }}>
                                Gerencie suas categorias de receitas e despesas
                            </p>
                        </div>

                        {/* Header com barra de pesquisa e botões */}
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "24px",
                            gap: "16px"
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1 }}>
                                <div style={{ position: "relative", flex: 1, maxWidth: "300px" }}>
                                    <Search
                                        size={16}
                                        style={{
                                            position: "absolute",
                                            left: "12px",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            color: "#6b7280"
                                        }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Localizar"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        style={{
                                            width: "100%",
                                            padding: "10px 12px 10px 40px",
                                            border: "1px solid #d1d5db",
                                            borderRadius: "8px",
                                            fontSize: "14px",
                                            color: "#111827",
                                            backgroundColor: "white"
                                        }}
                                    />
                                </div>
                                <button
                                    onClick={handleAddCategory}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        backgroundColor: "#3b82f6",
                                        color: "white",
                                        border: "none",
                                        padding: "10px 16px",
                                        borderRadius: "8px",
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        cursor: "pointer"
                                    }}
                                >
                                    <Plus size={16} />
                                    Adicionar
                                </button>
                                <button
                                    onClick={() => setShowAddSubcategoryModal(true)}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        backgroundColor: "#10b981",
                                        color: "white",
                                        border: "none",
                                        padding: "10px 16px",
                                        borderRadius: "8px",
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        cursor: "pointer"
                                    }}
                                >
                                    <Plus size={16} />
                                    Subcategoria
                                </button>
                            </div>
                            <div style={{ display: "flex", gap: "12px" }}>
                                <button
                                    onClick={handleImportCategories}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "6px",
                                        backgroundColor: "transparent",
                                        color: "#6b7280",
                                        border: "1px solid #d1d5db",
                                        padding: "8px 12px",
                                        borderRadius: "6px",
                                        fontSize: "14px",
                                        cursor: "pointer"
                                    }}
                                >
                                    <Upload size={16} />
                                    Importar
                                </button>
                                <div style={{ position: "relative" }}>
                                    <button
                                        onClick={() => setShowExportDropdown(!showExportDropdown)}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "6px",
                                            backgroundColor: "transparent",
                                            color: "#6b7280",
                                            border: "1px solid #d1d5db",
                                            padding: "8px 12px",
                                            borderRadius: "6px",
                                            fontSize: "14px",
                                            cursor: "pointer"
                                        }}
                                    >
                                        <Download size={16} />
                                        Exportar
                                        <ChevronDown size={14} />
                                    </button>

                                    {showExportDropdown && (
                                        <div style={{
                                            position: "absolute",
                                            top: "100%",
                                            right: "0",
                                            marginTop: "4px",
                                            backgroundColor: "white",
                                            border: "1px solid #d1d5db",
                                            borderRadius: "8px",
                                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                                            zIndex: 1000,
                                            minWidth: "160px"
                                        }}>
                                            <button
                                                onClick={handleExportCategoriesJSON}
                                                style={{
                                                    width: "100%",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "8px",
                                                    padding: "10px 12px",
                                                    border: "none",
                                                    backgroundColor: "transparent",
                                                    fontSize: "14px",
                                                    color: "#374151",
                                                    cursor: "pointer",
                                                    borderBottom: "1px solid #f3f4f6"
                                                }}
                                                onMouseOver={(e) => {
                                                    e.currentTarget.style.backgroundColor = "#f9fafb";
                                                }}
                                                onMouseOut={(e) => {
                                                    e.currentTarget.style.backgroundColor = "transparent";
                                                }}
                                            >
                                                <FileText size={16} />
                                                Exportar JSON
                                            </button>
                                            <button
                                                onClick={handleExportCategoriesPDF}
                                                style={{
                                                    width: "100%",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "8px",
                                                    padding: "10px 12px",
                                                    border: "none",
                                                    backgroundColor: "transparent",
                                                    fontSize: "14px",
                                                    color: "#374151",
                                                    cursor: "pointer",
                                                    borderBottom: "1px solid #f3f4f6"
                                                }}
                                                onMouseOver={(e) => {
                                                    e.currentTarget.style.backgroundColor = "#f9fafb";
                                                }}
                                                onMouseOut={(e) => {
                                                    e.currentTarget.style.backgroundColor = "transparent";
                                                }}
                                            >
                                                <FileText size={16} />
                                                Exportar PDF
                                            </button>
                                            <button
                                                onClick={handleExportCategoriesExcel}
                                                style={{
                                                    width: "100%",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "8px",
                                                    padding: "10px 12px",
                                                    border: "none",
                                                    backgroundColor: "transparent",
                                                    fontSize: "14px",
                                                    color: "#374151",
                                                    cursor: "pointer"
                                                }}
                                                onMouseOver={(e) => {
                                                    e.currentTarget.style.backgroundColor = "#f9fafb";
                                                }}
                                                onMouseOut={(e) => {
                                                    e.currentTarget.style.backgroundColor = "transparent";
                                                }}
                                            >
                                                <FileSpreadsheet size={16} />
                                                Exportar Excel
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={handleCategoryHelp}
                                    style={{
                                        backgroundColor: "transparent",
                                        color: "#6b7280",
                                        border: "1px solid #d1d5db",
                                        padding: "8px",
                                        borderRadius: "6px",
                                        cursor: "pointer"
                                    }}
                                >
                                    <HelpCircle size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div style={{
                            display: "flex",
                            borderBottom: "1px solid #e5e7eb",
                            marginBottom: "24px"
                        }}>
                            {[
                                { id: "saidas", label: "Saídas" },
                                { id: "entradas", label: "Entradas" },
                                { id: "outros", label: "Outros" }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveCategoryTab(tab.id)}
                                    style={{
                                        padding: "12px 24px",
                                        borderTop: "none",
                                        borderLeft: "none",
                                        borderRight: "none",
                                        backgroundColor: "transparent",
                                        color: activeCategoryTab === tab.id ? "#dc2626" : "#6b7280",
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        cursor: "pointer",
                                        borderBottom: activeCategoryTab === tab.id ? "2px solid #dc2626" : "2px solid transparent",
                                        marginBottom: "-1px"
                                    }}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Lista de Categorias */}
                        <div style={{
                            backgroundColor: "white",
                            border: "none",
                            borderRadius: "0px",
                            overflow: "hidden"
                        }}>
                            {/* Header da lista */}
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "16px 20px",
                                backgroundColor: "white",
                                borderBottom: "1px solid #f1f5f9"
                            }}>
                                <div style={{ width: "20px", marginRight: "12px" }}></div>
                                <div style={{ width: "20px", marginRight: "12px" }}></div>
                                <div style={{ flex: 1, fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                                    Categoria
                                </div>
                                <div style={{ fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                                    Ações
                                </div>
                            </div>

                            {/* Lista de categorias */}
                            <div style={{ height: "672px", overflowY: "auto" }}>
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleDragEnd}
                                >
                                    <SortableContext
                                        items={[
                                            // Incluir IDs das categorias principais como drop zones
                                            ...categories[activeCategoryTab as keyof typeof categories].map(category => category.id.toString()),
                                            // Incluir IDs das subcategorias para drag
                                            ...categories[activeCategoryTab as keyof typeof categories]
                                                .flatMap(category => category.children?.map(child => child.id.toString()) || [])
                                        ]}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        {categories[activeCategoryTab as keyof typeof categories].map((category) => (
                                            <SortableParentItem
                                                key={category.id}
                                                id={category.id.toString()}
                                                category={category}
                                            >
                                                {/* Categorias filhas com drag & drop */}
                                                {category.children && category.children.map((child) => (
                                                    <SortableChildItem
                                                        key={child.id}
                                                        id={child.id.toString()}
                                                        child={child}
                                                        onDragEnd={handleDragEnd}
                                                    />
                                                ))}
                                            </SortableParentItem>
                                        ))}
                                    </SortableContext>
                                </DndContext>
                            </div>
                        </div>
                    </div>
                );
            case "backup":
                return (
                    <div style={{ padding: "32px" }}>
                        {/* Título */}
                        <h1 style={{
                            fontSize: "24px",
                            fontWeight: "600",
                            color: "#1f2937",
                            margin: "0 0 32px 0"
                        }}>
                            Backup e Dados
                        </h1>

                        {/* Estatísticas */}
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                            gap: "24px",
                            marginBottom: "32px"
                        }}>
                            <div style={{
                                padding: "24px",
                                backgroundColor: "white",
                                border: "1px solid #e5e7eb",
                                borderRadius: "12px"
                            }}>
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "16px"
                                }}>
                                    <div style={{
                                        width: "48px",
                                        height: "48px",
                                        backgroundColor: "#dbeafe",
                                        borderRadius: "12px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}>
                                        <Database size={24} color="#3b82f6" />
                                    </div>
                                    <div>
                                        <h3 style={{
                                            fontSize: "20px",
                                            fontWeight: "700",
                                            color: "#1f2937",
                                            margin: "0 0 4px 0"
                                        }}>
                                            {backupJobs.length}
                                        </h3>
                                        <p style={{
                                            fontSize: "14px",
                                            color: "#6b7280",
                                            margin: "0"
                                        }}>
                                            Total de Backups
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div style={{
                                padding: "24px",
                                backgroundColor: "white",
                                border: "1px solid #e5e7eb",
                                borderRadius: "12px"
                            }}>
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "16px"
                                }}>
                                    <div style={{
                                        width: "48px",
                                        height: "48px",
                                        backgroundColor: "#dcfce7",
                                        borderRadius: "12px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}>
                                        <CheckCircle size={24} color="#16a34a" />
                                    </div>
                                    <div>
                                        <h3 style={{
                                            fontSize: "20px",
                                            fontWeight: "700",
                                            color: "#1f2937",
                                            margin: "0 0 4px 0"
                                        }}>
                                            {backupJobs.filter(b => b.status === "completed").length}
                                        </h3>
                                        <p style={{
                                            fontSize: "14px",
                                            color: "#6b7280",
                                            margin: "0"
                                        }}>
                                            Concluídos
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div style={{
                                padding: "24px",
                                backgroundColor: "white",
                                border: "1px solid #e5e7eb",
                                borderRadius: "12px"
                            }}>
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "16px"
                                }}>
                                    <div style={{
                                        width: "48px",
                                        height: "48px",
                                        backgroundColor: "#fef3c7",
                                        borderRadius: "12px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}>
                                        <HardDrive size={24} color="#d97706" />
                                    </div>
                                    <div>
                                        <h3 style={{
                                            fontSize: "20px",
                                            fontWeight: "700",
                                            color: "#1f2937",
                                            margin: "0 0 4px 0"
                                        }}>
                                            {formatFileSize(backupJobs.reduce((acc, backup) => acc + backup.size, 0))}
                                        </h3>
                                        <p style={{
                                            fontSize: "14px",
                                            color: "#6b7280",
                                            margin: "0"
                                        }}>
                                            Espaço Total
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Configurações de Backup */}
                        <div style={{
                            backgroundColor: "white",
                            border: "1px solid #e5e7eb",
                            borderRadius: "12px",
                            padding: "24px",
                            marginBottom: "24px"
                        }}>
                            <h3 style={{
                                fontSize: "18px",
                                fontWeight: "600",
                                color: "#1f2937",
                                margin: "0 0 24px 0"
                            }}>
                                Configurações de Backup
                            </h3>

                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                                gap: "24px",
                                marginBottom: "24px"
                            }}>
                                <div>
                                    <label style={{
                                        display: "block",
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        color: "#374151",
                                        marginBottom: "8px"
                                    }}>
                                        Backup Automático
                                    </label>
                                    <div style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px"
                                    }}>
                                        <input
                                            type="checkbox"
                                            checked={backupSettings.autoBackup}
                                            onChange={(e) => handleBackupSettingChange('autoBackup', e.target.checked)}
                                            style={{
                                                width: "16px",
                                                height: "16px",
                                                accentColor: "#3b82f6"
                                            }}
                                        />
                                        <span style={{
                                            fontSize: "14px",
                                            color: "#6b7280"
                                        }}>
                                            Ativar backup automático
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label style={{
                                        display: "block",
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        color: "#374151",
                                        marginBottom: "8px"
                                    }}>
                                        Frequência
                                    </label>
                                    <select
                                        value={backupSettings.frequency}
                                        onChange={(e) => handleBackupSettingChange('frequency', e.target.value)}
                                        disabled={!backupSettings.autoBackup}
                                        style={{
                                            width: "100%",
                                            padding: "8px 12px",
                                            border: "1px solid #d1d5db",
                                            borderRadius: "6px",
                                            fontSize: "14px",
                                            backgroundColor: !backupSettings.autoBackup ? "#f9fafb" : "white"
                                        }}
                                    >
                                        <option value="daily">Diário</option>
                                        <option value="weekly">Semanal</option>
                                        <option value="monthly">Mensal</option>
                                    </select>
                                </div>

                                <div>
                                    <label style={{
                                        display: "block",
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        color: "#374151",
                                        marginBottom: "8px"
                                    }}>
                                        Retenção (dias)
                                    </label>
                                    <input
                                        type="number"
                                        value={backupSettings.retentionDays}
                                        onChange={(e) => handleBackupSettingChange('retentionDays', Number(e.target.value))}
                                        min="1"
                                        max="365"
                                        style={{
                                            width: "100%",
                                            padding: "8px 12px",
                                            border: "1px solid #d1d5db",
                                            borderRadius: "6px",
                                            fontSize: "14px"
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{
                                        display: "block",
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        color: "#374151",
                                        marginBottom: "8px"
                                    }}>
                                        Armazenamento em Nuvem
                                    </label>
                                    <div style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px"
                                    }}>
                                        <input
                                            type="checkbox"
                                            checked={backupSettings.cloudStorage}
                                            onChange={(e) => handleBackupSettingChange('cloudStorage', e.target.checked)}
                                            style={{
                                                width: "16px",
                                                height: "16px",
                                                accentColor: "#3b82f6"
                                            }}
                                        />
                                        <span style={{
                                            fontSize: "14px",
                                            color: "#6b7280"
                                        }}>
                                            Salvar na nuvem
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: "12px"
                            }}>
                                <button
                                    onClick={handleSaveBackupSettings}
                                    style={{
                                        backgroundColor: "#3b82f6",
                                        color: "white",
                                        border: "none",
                                        padding: "12px 24px",
                                        borderRadius: "8px",
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        cursor: "pointer"
                                    }}
                                >
                                    Salvar Configurações
                                </button>
                            </div>
                        </div>

                        {/* Ações de Backup */}
                        <div style={{
                            backgroundColor: "white",
                            border: "1px solid #e5e7eb",
                            borderRadius: "12px",
                            padding: "24px",
                            marginBottom: "24px"
                        }}>
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "24px"
                            }}>
                                <h3 style={{
                                    fontSize: "18px",
                                    fontWeight: "600",
                                    color: "#1f2937",
                                    margin: "0"
                                }}>
                                    Ações de Backup
                                </h3>
                                <button
                                    onClick={handleCreateBackup}
                                    disabled={isCreatingBackup}
                                    style={{
                                        backgroundColor: "#3b82f6",
                                        color: "white",
                                        border: "none",
                                        padding: "12px 24px",
                                        borderRadius: "8px",
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        cursor: isCreatingBackup ? "not-allowed" : "pointer",
                                        opacity: isCreatingBackup ? 0.6 : 1,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px"
                                    }}
                                >
                                    {isCreatingBackup ? (
                                        <>
                                            <RefreshCw size={16} className="animate-spin" />
                                            Criando...
                                        </>
                                    ) : (
                                        <>
                                            <Download size={16} />
                                            Criar Backup
                                        </>
                                    )}
                                </button>
                            </div>

                            <p style={{
                                fontSize: "14px",
                                color: "#6b7280",
                                margin: "0"
                            }}>
                                Crie backups manuais dos seus dados ou configure backups automáticos para proteger suas informações.
                            </p>
                        </div>

                        {/* Histórico de Backups */}
                        <div style={{
                            backgroundColor: "white",
                            border: "1px solid #e5e7eb",
                            borderRadius: "12px",
                            padding: "24px"
                        }}>
                            <h3 style={{
                                fontSize: "18px",
                                fontWeight: "600",
                                color: "#1f2937",
                                margin: "0 0 24px 0"
                            }}>
                                Histórico de Backups
                            </h3>

                            {backupJobs.length === 0 ? (
                                <div style={{
                                    textAlign: "center",
                                    padding: "48px 24px",
                                    color: "#6b7280"
                                }}>
                                    <Database size={48} style={{ marginBottom: "16px" }} />
                                    <h4 style={{
                                        fontSize: "16px",
                                        fontWeight: "500",
                                        color: "#374151",
                                        margin: "0 0 8px 0"
                                    }}>
                                        Nenhum backup encontrado
                                    </h4>
                                    <p style={{
                                        fontSize: "14px",
                                        margin: "0"
                                    }}>
                                        Crie seu primeiro backup para proteger os dados da igreja
                                    </p>
                                </div>
                            ) : (
                                <div style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "16px"
                                }}>
                                    {backupJobs.map(backup => (
                                        <div key={backup.id} style={{
                                            border: "1px solid #e5e7eb",
                                            borderRadius: "8px",
                                            padding: "16px",
                                            transition: "all 0.2s"
                                        }}>
                                            <div style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "flex-start",
                                                marginBottom: "12px"
                                            }}>
                                                <div style={{
                                                    display: "flex",
                                                    gap: "12px",
                                                    flex: 1
                                                }}>
                                                    <div style={{
                                                        width: "40px",
                                                        height: "40px",
                                                        backgroundColor: "#dbeafe",
                                                        borderRadius: "8px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center"
                                                    }}>
                                                        <Database size={20} color="#3b82f6" />
                                                    </div>
                                                    <div>
                                                        <h4 style={{
                                                            fontSize: "16px",
                                                            fontWeight: "600",
                                                            color: "#1f2937",
                                                            margin: "0 0 4px 0"
                                                        }}>
                                                            {backup.name}
                                                        </h4>
                                                        <p style={{
                                                            fontSize: "14px",
                                                            color: "#6b7280",
                                                            margin: "0"
                                                        }}>
                                                            {backup.type === "manual" ? "Manual" : "Automático"} • {backup.format.toUpperCase()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "8px"
                                                }}>
                                                    <span style={{
                                                        padding: "4px 8px",
                                                        borderRadius: "12px",
                                                        fontSize: "12px",
                                                        fontWeight: "500",
                                                        backgroundColor: backup.status === "completed" ? "#dcfce7" : "#fef3c7",
                                                        color: backup.status === "completed" ? "#16a34a" : "#d97706"
                                                    }}>
                                                        {backup.status === "completed" ? "Concluído" : backup.status === "running" ? "Executando" : backup.status}
                                                    </span>
                                                </div>
                                            </div>

                                            <div style={{
                                                display: "flex",
                                                gap: "24px",
                                                marginBottom: "12px",
                                                fontSize: "14px",
                                                color: "#6b7280"
                                            }}>
                                                <div style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "4px"
                                                }}>
                                                    <Clock size={14} />
                                                    <span>{formatDate(backup.createdAt)}</span>
                                                </div>
                                                {backup.completedAt && (
                                                    <div style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "4px"
                                                    }}>
                                                        <CheckCircle size={14} />
                                                        <span>Concluído em {formatDate(backup.completedAt)}</span>
                                                    </div>
                                                )}
                                                <div style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "4px"
                                                }}>
                                                    <HardDrive size={14} />
                                                    <span>{formatFileSize(backup.size)}</span>
                                                </div>
                                            </div>

                                            <div style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center"
                                            }}>
                                                <div>
                                                    <span style={{
                                                        fontSize: "12px",
                                                        color: "#6b7280",
                                                        marginRight: "8px"
                                                    }}>
                                                        Inclui:
                                                    </span>
                                                    {backup.includes.map((include, index) => (
                                                        <span key={include} style={{
                                                            fontSize: "12px",
                                                            padding: "2px 6px",
                                                            backgroundColor: "#f3f4f6",
                                                            borderRadius: "4px",
                                                            marginRight: "4px"
                                                        }}>
                                                            {include}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div style={{
                                                    display: "flex",
                                                    gap: "8px"
                                                }}>
                                                    {backup.status === "completed" && (
                                                        <button
                                                            onClick={() => handleDownloadBackup(backup)}
                                                            style={{
                                                                backgroundColor: "#3b82f6",
                                                                color: "white",
                                                                border: "none",
                                                                padding: "6px 12px",
                                                                borderRadius: "6px",
                                                                fontSize: "12px",
                                                                fontWeight: "500",
                                                                cursor: "pointer",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: "4px"
                                                            }}
                                                        >
                                                            <Download size={12} />
                                                            Download
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDeleteBackup(backup.id)}
                                                        style={{
                                                            backgroundColor: "#ef4444",
                                                            color: "white",
                                                            border: "none",
                                                            padding: "6px 12px",
                                                            borderRadius: "6px",
                                                            fontSize: "12px",
                                                            fontWeight: "500",
                                                            cursor: "pointer",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: "4px"
                                                        }}
                                                    >
                                                        <Trash2 size={12} />
                                                        Excluir
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                );
            case "integracoes":
                return (
                    <div style={{ padding: "32px" }}>
                        {/* Título */}
                        <h1 style={{
                            fontSize: "24px",
                            fontWeight: "600",
                            color: "#1f2937",
                            margin: "0 0 32px 0"
                        }}>
                            Integrações
                        </h1>

                        {/* Abas */}
                        <div style={{
                            display: "flex",
                            borderBottom: "1px solid #e5e7eb",
                            marginBottom: "32px"
                        }}>
                            <button
                                type="button"
                                style={{
                                    background: "none",
                                    borderTop: "none",
                                    borderLeft: "none",
                                    borderRight: "none",
                                    padding: "16px 24px",
                                    fontSize: "16px",
                                    fontWeight: "500",
                                    color: activeIntegrationTab === "chaves-api" ? "#1f2937" : "#6b7280",
                                    cursor: "pointer",
                                    borderBottom: activeIntegrationTab === "chaves-api" ? "2px solid #3b82f6" : "2px solid transparent"
                                }}
                                onClick={() => setActiveIntegrationTab("chaves-api")}
                            >
                                Chaves API
                            </button>
                            <button
                                type="button"
                                style={{
                                    background: "none",
                                    borderTop: "none",
                                    borderLeft: "none",
                                    borderRight: "none",
                                    padding: "16px 24px",
                                    fontSize: "16px",
                                    fontWeight: "500",
                                    color: activeIntegrationTab === "webhooks" ? "#1f2937" : "#6b7280",
                                    cursor: "pointer",
                                    borderBottom: activeIntegrationTab === "webhooks" ? "2px solid #3b82f6" : "2px solid transparent"
                                }}
                                onClick={() => setActiveIntegrationTab("webhooks")}
                            >
                                Webhooks
                            </button>
                            <button
                                type="button"
                                style={{
                                    background: "none",
                                    borderTop: "none",
                                    borderLeft: "none",
                                    borderRight: "none",
                                    padding: "16px 24px",
                                    fontSize: "16px",
                                    fontWeight: "500",
                                    color: activeIntegrationTab === "logs-webhooks" ? "#1f2937" : "#6b7280",
                                    cursor: "pointer",
                                    borderBottom: activeIntegrationTab === "logs-webhooks" ? "2px solid #3b82f6" : "2px solid transparent"
                                }}
                                onClick={() => setActiveIntegrationTab("logs-webhooks")}
                            >
                                Logs de Webhooks
                            </button>
                        </div>

                        {/* Conteúdo das abas */}
                        {activeIntegrationTab === "chaves-api" && (
                            <div>
                                {/* Cabeçalho da seção */}
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                    marginBottom: "24px"
                                }}>
                                    <div>
                                        <h2 style={{
                                            fontSize: "18px",
                                            fontWeight: "600",
                                            color: "#1f2937",
                                            margin: "0 0 8px 0"
                                        }}>
                                            Chaves de API
                                        </h2>
                                        <p style={{
                                            fontSize: "14px",
                                            color: "#6b7280",
                                            margin: "0",
                                            maxWidth: "500px"
                                        }}>
                                            Lorem ipsum dolor sit amet consectetur. Faucibus urna aliquam sed viverra diam faucibus. Leo.
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleAddApiKey}
                                        style={{
                                            backgroundColor: "#3b82f6",
                                            color: "white",
                                            border: "none",
                                            padding: "12px 16px",
                                            borderRadius: "8px",
                                            fontSize: "14px",
                                            fontWeight: "500",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px"
                                        }}
                                    >
                                        <Plus size={16} />
                                        Adicionar chave de API
                                    </button>
                                </div>

                                {/* Tabela de chaves de API */}
                                <div style={{
                                    backgroundColor: "white",
                                    borderRadius: "8px",
                                    border: "1px solid #e5e7eb",
                                    overflow: "hidden"
                                }}>
                                    {/* Cabeçalho da tabela */}
                                    <div style={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr 1fr 1fr 120px",
                                        padding: "16px 20px",
                                        backgroundColor: "#f9fafb",
                                        borderBottom: "1px solid #e5e7eb"
                                    }}>
                                        <div style={{ fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                                            Nome
                                        </div>
                                        <div style={{ fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                                            Data de Expiração
                                        </div>
                                        <div style={{ fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                                            Situação
                                        </div>
                                        <div style={{ fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                                            Ações
                                        </div>
                                    </div>

                                    {/* Linhas da tabela */}
                                    {apiKeys.map((key) => (
                                        <div key={key.id} style={{
                                            display: "grid",
                                            gridTemplateColumns: "1fr 1fr 1fr 120px",
                                            padding: "16px 20px",
                                            borderBottom: "1px solid #e5e7eb",
                                            alignItems: "center"
                                        }}>
                                            <div style={{ fontSize: "14px", color: "#1f2937" }}>
                                                {key.name}
                                            </div>
                                            <div style={{ fontSize: "14px", color: "#6b7280" }}>
                                                {key.expirationDate}
                                            </div>
                                            <div>
                                                <span style={{
                                                    backgroundColor: key.isActive ? "#10b981" : "#ef4444",
                                                    color: "white",
                                                    padding: "4px 12px",
                                                    borderRadius: "16px",
                                                    fontSize: "12px",
                                                    fontWeight: "500"
                                                }}>
                                                    {key.status}
                                                </span>
                                            </div>
                                            <div style={{
                                                display: "flex",
                                                gap: "8px",
                                                alignItems: "center"
                                            }}>
                                                <button
                                                    onClick={() => handleEditApiKey(key.id)}
                                                    style={{
                                                        background: "none",
                                                        border: "none",
                                                        cursor: "pointer",
                                                        padding: "4px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center"
                                                    }}
                                                >
                                                    <Edit size={16} color="#3b82f6" />
                                                </button>
                                                <button
                                                    onClick={() => handleToggleApiKey(key.id)}
                                                    style={{
                                                        background: "none",
                                                        border: "none",
                                                        cursor: "pointer",
                                                        padding: "4px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center"
                                                    }}
                                                >
                                                    <Pause size={16} color="#f59e0b" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteApiKey(key.id)}
                                                    style={{
                                                        background: "none",
                                                        border: "none",
                                                        cursor: "pointer",
                                                        padding: "4px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center"
                                                    }}
                                                >
                                                    <Trash2 size={16} color="#ef4444" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Rodapé da tabela */}
                                <div style={{
                                    marginTop: "16px",
                                    fontSize: "14px",
                                    color: "#6b7280"
                                }}>
                                    {apiKeys.length} chave de API criada de 10 disponíveis
                                </div>
                            </div>
                        )}

                        {activeIntegrationTab === "webhooks" && (
                            <div>
                                {/* Cabeçalho da seção */}
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                    marginBottom: "24px"
                                }}>
                                    <div>
                                        <h2 style={{
                                            fontSize: "18px",
                                            fontWeight: "600",
                                            color: "#1f2937",
                                            margin: "0 0 8px 0"
                                        }}>
                                            Meus Webhooks
                                        </h2>
                                        <p style={{
                                            fontSize: "14px",
                                            color: "#6b7280",
                                            margin: "0",
                                            maxWidth: "500px"
                                        }}>
                                            Lorem ipsum dolor sit amet consectetur. Faucibus urna aliquam sed viverra diam faucibus. Leo.
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleAddWebhook}
                                        style={{
                                            backgroundColor: "#3b82f6",
                                            color: "white",
                                            border: "none",
                                            padding: "12px 16px",
                                            borderRadius: "8px",
                                            fontSize: "14px",
                                            fontWeight: "500",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px"
                                        }}
                                    >
                                        <Plus size={16} />
                                        Adicionar webhook
                                    </button>
                                </div>

                                {/* Tabela de webhooks */}
                                <div style={{
                                    backgroundColor: "white",
                                    borderRadius: "8px",
                                    border: "1px solid #e5e7eb",
                                    overflow: "hidden"
                                }}>
                                    {/* Cabeçalho da tabela */}
                                    <div style={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr 1fr 1fr 120px",
                                        padding: "16px 20px",
                                        backgroundColor: "#f9fafb",
                                        borderBottom: "1px solid #e5e7eb"
                                    }}>
                                        <div style={{ fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                                            Nome
                                        </div>
                                        <div style={{ fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                                            Data de Expiração
                                        </div>
                                        <div style={{ fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                                            Situação
                                        </div>
                                        <div style={{ fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                                            Ações
                                        </div>
                                    </div>

                                    {/* Linhas da tabela */}
                                    {webhooks.map((webhook) => (
                                        <div key={webhook.id} style={{
                                            display: "grid",
                                            gridTemplateColumns: "1fr 1fr 1fr 120px",
                                            padding: "16px 20px",
                                            borderBottom: "1px solid #e5e7eb",
                                            alignItems: "center"
                                        }}>
                                            <div style={{ fontSize: "14px", color: "#1f2937" }}>
                                                {webhook.name}
                                            </div>
                                            <div style={{ fontSize: "14px", color: "#6b7280" }}>
                                                {webhook.expirationDate}
                                            </div>
                                            <div>
                                                <span style={{
                                                    backgroundColor: webhook.isActive ? "#10b981" : "#ef4444",
                                                    color: "white",
                                                    padding: "4px 12px",
                                                    borderRadius: "16px",
                                                    fontSize: "12px",
                                                    fontWeight: "500"
                                                }}>
                                                    {webhook.status}
                                                </span>
                                            </div>
                                            <div style={{
                                                display: "flex",
                                                gap: "8px",
                                                alignItems: "center"
                                            }}>
                                                <button
                                                    onClick={() => handleEditWebhook(webhook.id)}
                                                    style={{
                                                        background: "none",
                                                        border: "none",
                                                        cursor: "pointer",
                                                        padding: "4px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center"
                                                    }}
                                                >
                                                    <Edit size={16} color="#3b82f6" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteWebhook(webhook.id)}
                                                    style={{
                                                        background: "none",
                                                        border: "none",
                                                        cursor: "pointer",
                                                        padding: "4px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center"
                                                    }}
                                                >
                                                    <Trash2 size={16} color="#ef4444" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Rodapé da tabela */}
                                <div style={{
                                    marginTop: "16px",
                                    fontSize: "14px",
                                    color: "#6b7280"
                                }}>
                                    {webhooks.length} Webhooks criados de 10 disponíveis
                                </div>
                            </div>
                        )}

                        {activeIntegrationTab === "logs-webhooks" && (
                            <div>
                                {/* Botão Filtros */}
                                <div style={{ marginBottom: "24px" }}>
                                    <button style={{
                                        backgroundColor: "white",
                                        color: "#374151",
                                        border: "1px solid #d1d5db",
                                        padding: "8px 16px",
                                        borderRadius: "6px",
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px"
                                    }}>
                                        <Filter size={16} />
                                        Filtros
                                    </button>
                                </div>

                                {/* Layout de duas colunas */}
                                <div style={{ display: "flex", gap: "24px", height: "600px" }}>
                                    {/* Coluna esquerda - Lista de webhooks */}
                                    <div style={{
                                        flex: 1,
                                        backgroundColor: "white",
                                        borderRadius: "8px",
                                        border: "1px solid #e5e7eb",
                                        display: "flex",
                                        flexDirection: "column"
                                    }}>
                                        {/* Cabeçalho da lista */}
                                        <div style={{
                                            padding: "16px 20px",
                                            borderBottom: "1px solid #e5e7eb",
                                            backgroundColor: "#f9fafb"
                                        }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <div style={{ fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                                                    Dados do Webhook
                                                </div>
                                                <div style={{ fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                                                    Status
                                                </div>
                                            </div>
                                        </div>

                                        {/* Lista de webhooks */}
                                        <div style={{ flex: 1, overflowY: "auto" }}>
                                            {webhookLogs.map((log) => (
                                                <div
                                                    key={log.id}
                                                    onClick={() => setSelectedWebhookLog(log.id)}
                                                    style={{
                                                        padding: "16px 20px",
                                                        borderBottom: "1px solid #e5e7eb",
                                                        cursor: "pointer",
                                                        backgroundColor: selectedWebhookLog === log.id ? "#f3f4f6" : "white",
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "center"
                                                    }}
                                                >
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ fontSize: "14px", color: "#1f2937", marginBottom: "4px" }}>
                                                            {log.url}
                                                        </div>
                                                        <div style={{ fontSize: "12px", color: "#6b7280" }}>
                                                            {log.description}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <span style={{
                                                            backgroundColor: log.isError ? "#ef4444" : "#10b981",
                                                            color: "white",
                                                            padding: "4px 8px",
                                                            borderRadius: "12px",
                                                            fontSize: "12px",
                                                            fontWeight: "500"
                                                        }}>
                                                            Status
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Paginação */}
                                        <div style={{
                                            padding: "16px 20px",
                                            borderTop: "1px solid #e5e7eb",
                                            backgroundColor: "#f9fafb",
                                            fontSize: "14px",
                                            color: "#6b7280"
                                        }}>
                                            Exibindo de 1 a 10 Próximo
                                        </div>
                                    </div>

                                    {/* Coluna direita - Detalhes */}
                                    <div style={{
                                        flex: 1,
                                        backgroundColor: "white",
                                        borderRadius: "8px",
                                        border: "1px solid #e5e7eb",
                                        padding: "24px"
                                    }}>
                                        <h3 style={{
                                            fontSize: "16px",
                                            fontWeight: "600",
                                            color: "#1f2937",
                                            margin: "0 0 20px 0"
                                        }}>
                                            Detalhes
                                        </h3>

                                        {(() => {
                                            const selectedLog = webhookLogs.find(log => log.id === selectedWebhookLog);
                                            if (!selectedLog) return null;

                                            return (
                                                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                                    {/* URL do Webhook */}
                                                    <div>
                                                        <label style={{
                                                            fontSize: "12px",
                                                            fontWeight: "500",
                                                            color: "#6b7280",
                                                            marginBottom: "4px",
                                                            display: "block"
                                                        }}>
                                                            Webhook URL
                                                        </label>
                                                        <div style={{
                                                            fontSize: "14px",
                                                            color: "#1f2937",
                                                            fontFamily: "monospace",
                                                            backgroundColor: "#f9fafb",
                                                            padding: "8px 12px",
                                                            borderRadius: "4px",
                                                            border: "1px solid #e5e7eb"
                                                        }}>
                                                            {selectedLog.url}
                                                        </div>
                                                    </div>

                                                    {/* Data de Criação */}
                                                    <div>
                                                        <label style={{
                                                            fontSize: "12px",
                                                            fontWeight: "500",
                                                            color: "#6b7280",
                                                            marginBottom: "4px",
                                                            display: "block"
                                                        }}>
                                                            Data de Criação
                                                        </label>
                                                        <div style={{ fontSize: "14px", color: "#1f2937" }}>
                                                            {selectedLog.creationDate}
                                                        </div>
                                                    </div>

                                                    {/* Webhook */}
                                                    <div>
                                                        <label style={{
                                                            fontSize: "12px",
                                                            fontWeight: "500",
                                                            color: "#6b7280",
                                                            marginBottom: "4px",
                                                            display: "block"
                                                        }}>
                                                            Webhook
                                                        </label>
                                                        <div style={{ fontSize: "14px", color: "#1f2937" }}>
                                                            {selectedLog.webhookName}
                                                        </div>
                                                    </div>

                                                    {/* Status */}
                                                    <div>
                                                        <label style={{
                                                            fontSize: "12px",
                                                            fontWeight: "500",
                                                            color: "#6b7280",
                                                            marginBottom: "4px",
                                                            display: "block"
                                                        }}>
                                                            Status
                                                        </label>
                                                        <div style={{
                                                            fontSize: "14px",
                                                            color: selectedLog.isError ? "#ef4444" : "#10b981",
                                                            fontFamily: "monospace"
                                                        }}>
                                                            {selectedLog.status}
                                                        </div>
                                                    </div>

                                                    {/* Explicação do erro */}
                                                    {selectedLog.isError && selectedLog.errorExplanation && (
                                                        <div>
                                                            <label style={{
                                                                fontSize: "12px",
                                                                fontWeight: "500",
                                                                color: "#6b7280",
                                                                marginBottom: "4px",
                                                                display: "block"
                                                            }}>
                                                                Explicação do erro
                                                            </label>
                                                            <div style={{
                                                                fontSize: "14px",
                                                                color: "#1f2937",
                                                                lineHeight: "1.5"
                                                            }}>
                                                                {selectedLog.errorExplanation}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Conteúdo enviado */}
                                                    <div>
                                                        <label style={{
                                                            fontSize: "12px",
                                                            fontWeight: "500",
                                                            color: "#6b7280",
                                                            marginBottom: "4px",
                                                            display: "block"
                                                        }}>
                                                            Conteúdo enviado
                                                        </label>
                                                        <textarea
                                                            value={selectedLog.sentContent}
                                                            readOnly
                                                            style={{
                                                                width: "100%",
                                                                height: "80px",
                                                                padding: "8px 12px",
                                                                border: "1px solid #d1d5db",
                                                                borderRadius: "4px",
                                                                fontSize: "14px",
                                                                color: "#1f2937",
                                                                backgroundColor: "#f9fafb",
                                                                resize: "none",
                                                                fontFamily: "monospace"
                                                            }}
                                                            placeholder="Nenhum conteúdo enviado"
                                                        />
                                                    </div>

                                                    {/* Conteúdo da resposta */}
                                                    <div>
                                                        <label style={{
                                                            fontSize: "12px",
                                                            fontWeight: "500",
                                                            color: "#6b7280",
                                                            marginBottom: "4px",
                                                            display: "block"
                                                        }}>
                                                            Conteúdo da resposta
                                                        </label>
                                                        <textarea
                                                            value={selectedLog.responseContent}
                                                            readOnly
                                                            style={{
                                                                width: "100%",
                                                                height: "80px",
                                                                padding: "8px 12px",
                                                                border: "1px solid #d1d5db",
                                                                borderRadius: "4px",
                                                                fontSize: "14px",
                                                                color: "#1f2937",
                                                                backgroundColor: "#f9fafb",
                                                                resize: "none",
                                                                fontFamily: "monospace"
                                                            }}
                                                            placeholder="Nenhuma resposta recebida"
                                                        />
                                                    </div>

                                                    {/* Botões de ação */}
                                                    <div style={{
                                                        display: "flex",
                                                        gap: "12px",
                                                        marginTop: "20px"
                                                    }}>
                                                        <button style={{
                                                            backgroundColor: "#3b82f6",
                                                            color: "white",
                                                            border: "none",
                                                            padding: "8px 16px",
                                                            borderRadius: "6px",
                                                            fontSize: "14px",
                                                            fontWeight: "500",
                                                            cursor: "pointer",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: "8px"
                                                        }}>
                                                            <Play size={16} />
                                                            Reenviar
                                                        </button>
                                                        <button style={{
                                                            backgroundColor: "#ef4444",
                                                            color: "white",
                                                            border: "none",
                                                            padding: "8px 16px",
                                                            borderRadius: "6px",
                                                            fontSize: "14px",
                                                            fontWeight: "500",
                                                            cursor: "pointer",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: "8px"
                                                        }}>
                                                            <Trash size={16} />
                                                            Remover da fila
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Modal Gerar Chave de API */}
                        {showApiKeyModal && (
                            <div style={{
                                position: "fixed",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                zIndex: 1000
                            }}>
                                <div style={{
                                    backgroundColor: "white",
                                    borderRadius: "12px",
                                    padding: "24px",
                                    width: "850px",
                                    maxWidth: "90vw",
                                    maxHeight: "90vh",
                                    overflow: "auto",
                                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                                }}>
                                    {/* Cabeçalho do modal */}
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginBottom: "20px"
                                    }}>
                                        <h2 style={{
                                            fontSize: "18px",
                                            fontWeight: "600",
                                            color: "#1e40af",
                                            margin: 0
                                        }}>
                                            Gerar Chave de API
                                        </h2>
                                        <button
                                            onClick={handleCloseApiKeyModal}
                                            style={{
                                                background: "none",
                                                border: "none",
                                                cursor: "pointer",
                                                padding: "4px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                borderRadius: "4px"
                                            }}
                                        >
                                            <X size={18} color="#6b7280" />
                                        </button>
                                    </div>

                                    {/* Descrição */}
                                    <p style={{
                                        fontSize: "14px",
                                        color: "#6b7280",
                                        margin: "0 0 20px 0",
                                        lineHeight: "1.5"
                                    }}>
                                        Crie uma chave de API, atribua um nome a ela e se preferir, defina uma data e hora de expiração.
                                    </p>

                                    {/* Formulário */}
                                    <div style={{ display: "flex", gap: "12px" }}>
                                        {/* Campo Nome */}
                                        <div style={{ flex: 1 }}>
                                            <label style={{
                                                display: "block",
                                                marginBottom: "8px",
                                                fontSize: "14px",
                                                fontWeight: "500",
                                                color: "#374151"
                                            }}>
                                                Nome
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={apiKeyForm.name}
                                                onChange={handleApiKeyFormChange}
                                                placeholder="Chave de API"
                                                style={{
                                                    width: "100%",
                                                    padding: "10px 12px",
                                                    border: "1px solid #d1d5db",
                                                    borderRadius: "8px",
                                                    fontSize: "14px",
                                                    color: "#111827",
                                                    backgroundColor: "white",
                                                    outline: "none"
                                                }}
                                            />
                                        </div>

                                        {/* Campo Data de Expiração */}
                                        <div style={{ flex: 1 }}>
                                            <label style={{
                                                display: "block",
                                                marginBottom: "8px",
                                                fontSize: "14px",
                                                fontWeight: "500",
                                                color: "#374151"
                                            }}>
                                                Data de Expiração (opcional)
                                            </label>
                                            <input
                                                type="text"
                                                name="expirationDate"
                                                value={apiKeyForm.expirationDate}
                                                onChange={handleApiKeyFormChange}
                                                placeholder="Bradesco"
                                                style={{
                                                    width: "100%",
                                                    padding: "10px 12px",
                                                    border: "1px solid #d1d5db",
                                                    borderRadius: "8px",
                                                    fontSize: "14px",
                                                    color: "#111827",
                                                    backgroundColor: "white",
                                                    outline: "none"
                                                }}
                                            />
                                        </div>

                                        {/* Campo Hora de Expiração */}
                                        <div style={{ flex: 1 }}>
                                            <label style={{
                                                display: "block",
                                                marginBottom: "8px",
                                                fontSize: "14px",
                                                fontWeight: "500",
                                                color: "#374151"
                                            }}>
                                                Hora de expiração (opcional)
                                            </label>
                                            <input
                                                type="text"
                                                name="expirationTime"
                                                value={apiKeyForm.expirationTime}
                                                onChange={handleApiKeyFormChange}
                                                placeholder="Bradesco"
                                                style={{
                                                    width: "100%",
                                                    padding: "10px 12px",
                                                    border: "1px solid #d1d5db",
                                                    borderRadius: "8px",
                                                    fontSize: "14px",
                                                    color: "#111827",
                                                    backgroundColor: "white",
                                                    outline: "none"
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Botões */}
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        gap: "8px",
                                        marginTop: "24px"
                                    }}>
                                        <button
                                            onClick={handleCloseApiKeyModal}
                                            style={{
                                                backgroundColor: "white",
                                                color: "#374151",
                                                border: "1px solid #d1d5db",
                                                padding: "10px 20px",
                                                borderRadius: "8px",
                                                fontSize: "14px",
                                                fontWeight: "500",
                                                cursor: "pointer"
                                            }}
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={handleSaveApiKey}
                                            style={{
                                                backgroundColor: "#3b82f6",
                                                color: "white",
                                                border: "none",
                                                padding: "10px 20px",
                                                borderRadius: "8px",
                                                fontSize: "14px",
                                                fontWeight: "500",
                                                cursor: "pointer"
                                            }}
                                        >
                                            Salvar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Modal Editar Webhook */}
                        {editingWebhook && (
                            <div style={{
                                position: "fixed",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                zIndex: 1000
                            }}>
                                <div style={{
                                    backgroundColor: "white",
                                    borderRadius: "8px",
                                    padding: "24px",
                                    width: "800px",
                                    maxWidth: "90vw",
                                    maxHeight: "90vh",
                                    overflow: "auto",
                                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                                }}>
                                    {/* Cabeçalho do modal */}
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginBottom: "24px"
                                    }}>
                                        <h2 style={{
                                            fontSize: "18px",
                                            fontWeight: "600",
                                            color: "#1f2937",
                                            margin: 0
                                        }}>
                                            Editar Webhook
                                        </h2>
                                        <button
                                            onClick={handleCloseWebhookEdit}
                                            style={{
                                                background: "none",
                                                border: "none",
                                                cursor: "pointer",
                                                padding: "4px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                borderRadius: "4px"
                                            }}
                                        >
                                            <X size={18} color="#6b7280" />
                                        </button>
                                    </div>

                                    {/* Seção Dados do Webhook */}
                                    <div style={{
                                        border: "1px solid #e5e7eb",
                                        borderRadius: "8px",
                                        padding: "20px",
                                        marginBottom: "24px",
                                        backgroundColor: "#f9fafb"
                                    }}>
                                        <div style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            marginBottom: "20px"
                                        }}>
                                            <h3 style={{
                                                fontSize: "16px",
                                                fontWeight: "600",
                                                color: "#1f2937",
                                                margin: 0
                                            }}>
                                                Dados do Webhook
                                            </h3>
                                            <button style={{
                                                background: "none",
                                                border: "none",
                                                color: "#ef4444",
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "4px",
                                                fontSize: "14px"
                                            }}>
                                                <Trash2 size={16} />
                                                Excluir
                                            </button>
                                        </div>

                                        {/* Formulário */}
                                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                            {/* Webhook ativo */}
                                            <div style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "12px"
                                            }}>
                                                <label style={{
                                                    fontSize: "14px",
                                                    fontWeight: "500",
                                                    color: "#374151"
                                                }}>
                                                    Este webhook ficará ativo?
                                                </label>
                                                <label style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    cursor: "pointer"
                                                }}>
                                                    <input
                                                        type="checkbox"
                                                        name="isActive"
                                                        checked={webhookEditForm.isActive}
                                                        onChange={handleWebhookEditFormChange}
                                                        style={{ marginRight: "8px" }}
                                                    />
                                                    <span style={{ fontSize: "14px", color: "#374151" }}>
                                                        {webhookEditForm.isActive ? "Sim" : "Não"}
                                                    </span>
                                                </label>
                                            </div>

                                            {/* Nome do Webhook */}
                                            <div>
                                                <label style={{
                                                    display: "block",
                                                    marginBottom: "8px",
                                                    fontSize: "14px",
                                                    fontWeight: "500",
                                                    color: "#374151"
                                                }}>
                                                    Nome do Webhook
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={webhookEditForm.name}
                                                    onChange={handleWebhookEditFormChange}
                                                    style={{
                                                        width: "100%",
                                                        padding: "12px 16px",
                                                        border: "1px solid #d1d5db",
                                                        borderRadius: "8px",
                                                        fontSize: "14px",
                                                        color: "#111827",
                                                        backgroundColor: "white",
                                                        outline: "none"
                                                    }}
                                                />
                                            </div>

                                            {/* URL do Webhook */}
                                            <div>
                                                <label style={{
                                                    display: "block",
                                                    marginBottom: "8px",
                                                    fontSize: "14px",
                                                    fontWeight: "500",
                                                    color: "#374151"
                                                }}>
                                                    URL do Webhook
                                                </label>
                                                <input
                                                    type="text"
                                                    name="url"
                                                    value={webhookEditForm.url}
                                                    onChange={handleWebhookEditFormChange}
                                                    style={{
                                                        width: "100%",
                                                        padding: "12px 16px",
                                                        border: "1px solid #d1d5db",
                                                        borderRadius: "8px",
                                                        fontSize: "14px",
                                                        color: "#111827",
                                                        backgroundColor: "white",
                                                        outline: "none"
                                                    }}
                                                />
                                            </div>

                                            {/* E-mail do Webhook */}
                                            <div>
                                                <label style={{
                                                    display: "block",
                                                    marginBottom: "8px",
                                                    fontSize: "14px",
                                                    fontWeight: "500",
                                                    color: "#374151"
                                                }}>
                                                    E-mail do Webhook
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={webhookEditForm.email}
                                                    onChange={handleWebhookEditFormChange}
                                                    style={{
                                                        width: "100%",
                                                        padding: "12px 16px",
                                                        border: "1px solid #d1d5db",
                                                        borderRadius: "8px",
                                                        fontSize: "14px",
                                                        color: "#111827",
                                                        backgroundColor: "white",
                                                        outline: "none"
                                                    }}
                                                />
                                            </div>

                                            {/* Versão da API e Tipo de Evento */}
                                            <div style={{ display: "flex", gap: "16px" }}>
                                                <div style={{ flex: 1 }}>
                                                    <label style={{
                                                        display: "block",
                                                        marginBottom: "8px",
                                                        fontSize: "14px",
                                                        fontWeight: "500",
                                                        color: "#374151"
                                                    }}>
                                                        Versão da API
                                                    </label>
                                                    <select
                                                        name="apiVersion"
                                                        value={webhookEditForm.apiVersion}
                                                        onChange={handleWebhookEditFormChange}
                                                        style={{
                                                            width: "100%",
                                                            padding: "12px 16px",
                                                            border: "1px solid #d1d5db",
                                                            borderRadius: "8px",
                                                            fontSize: "14px",
                                                            color: "#111827",
                                                            backgroundColor: "white",
                                                            outline: "none"
                                                        }}
                                                    >
                                                        <option value="V1">V1</option>
                                                        <option value="V2">V2</option>
                                                    </select>
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <label style={{
                                                        display: "block",
                                                        marginBottom: "8px",
                                                        fontSize: "14px",
                                                        fontWeight: "500",
                                                        color: "#374151"
                                                    }}>
                                                        Tipo de Evento
                                                    </label>
                                                    <select
                                                        name="eventType"
                                                        value={webhookEditForm.eventType}
                                                        onChange={handleWebhookEditFormChange}
                                                        style={{
                                                            width: "100%",
                                                            padding: "12px 16px",
                                                            border: "1px solid #d1d5db",
                                                            borderRadius: "8px",
                                                            fontSize: "14px",
                                                            color: "#111827",
                                                            backgroundColor: "white",
                                                            outline: "none"
                                                        }}
                                                    >
                                                        <option value="Sequencial">Sequencial</option>
                                                        <option value="Paralelo">Paralelo</option>
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Token de autenticação */}
                                            <div>
                                                <label style={{
                                                    display: "block",
                                                    marginBottom: "8px",
                                                    fontSize: "14px",
                                                    fontWeight: "500",
                                                    color: "#374151"
                                                }}>
                                                    Token de autentificação
                                                </label>
                                                <input
                                                    type="password"
                                                    name="authToken"
                                                    value={webhookEditForm.authToken}
                                                    onChange={handleWebhookEditFormChange}
                                                    style={{
                                                        width: "100%",
                                                        padding: "12px 16px",
                                                        border: "1px solid #d1d5db",
                                                        borderRadius: "8px",
                                                        fontSize: "14px",
                                                        color: "#111827",
                                                        backgroundColor: "white",
                                                        outline: "none"
                                                    }}
                                                />
                                            </div>

                                            {/* Fila de sincronização */}
                                            <div>
                                                <div style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "12px",
                                                    marginBottom: "8px"
                                                }}>
                                                    <label style={{
                                                        fontSize: "14px",
                                                        fontWeight: "500",
                                                        color: "#374151"
                                                    }}>
                                                        Fila de sincronização ativada?
                                                    </label>
                                                    <label style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        cursor: "pointer"
                                                    }}>
                                                        <input
                                                            type="checkbox"
                                                            name="syncQueueActive"
                                                            checked={webhookEditForm.syncQueueActive}
                                                            onChange={handleWebhookEditFormChange}
                                                            style={{ marginRight: "8px" }}
                                                        />
                                                        <span style={{ fontSize: "14px", color: "#374151" }}>
                                                            {webhookEditForm.syncQueueActive ? "Sim" : "Não"}
                                                        </span>
                                                    </label>
                                                </div>
                                                <p style={{
                                                    fontSize: "12px",
                                                    color: "#6b7280",
                                                    margin: 0,
                                                    lineHeight: "1.4"
                                                }}>
                                                    Atenção! Mesmo com a fila interrompida novos eventos continuarão sendo gerados, porém não serão enviados para sua aplicação até que a fila de sincronização seja ativada novamente.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Seção Cobranças */}
                                    <div style={{
                                        border: "1px solid #e5e7eb",
                                        borderRadius: "8px",
                                        padding: "20px",
                                        marginBottom: "24px"
                                    }}>
                                        <div style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            marginBottom: "16px"
                                        }}>
                                            <h3 style={{
                                                fontSize: "16px",
                                                fontWeight: "600",
                                                color: "#1f2937",
                                                margin: 0,
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "8px"
                                            }}>
                                                Cobranças
                                                <ChevronDown size={16} color="#6b7280" />
                                            </h3>
                                            <div style={{ display: "flex", gap: "8px" }}>
                                                <button
                                                    onClick={handleSelectAllEvents}
                                                    style={{
                                                        background: "none",
                                                        border: "1px solid #d1d5db",
                                                        padding: "6px 12px",
                                                        borderRadius: "6px",
                                                        fontSize: "12px",
                                                        color: "#374151",
                                                        cursor: "pointer",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "4px"
                                                    }}
                                                >
                                                    <Check size={14} />
                                                    Selecionar Todos
                                                </button>
                                                <button
                                                    onClick={handleClearEventSelection}
                                                    style={{
                                                        background: "none",
                                                        border: "1px solid #d1d5db",
                                                        padding: "6px 12px",
                                                        borderRadius: "6px",
                                                        fontSize: "12px",
                                                        color: "#374151",
                                                        cursor: "pointer"
                                                    }}
                                                >
                                                    Limpar Seleção
                                                </button>
                                            </div>
                                        </div>

                                        <p style={{
                                            fontSize: "14px",
                                            color: "#6b7280",
                                            margin: "0 0 16px 0",
                                            lineHeight: "1.5"
                                        }}>
                                            Receba notificações referente suas transações bancárias, depósitos, recebimentos via Pix e todos valores que entrarem na sua conta Grex.
                                        </p>

                                        {/* Lista de eventos */}
                                        <div style={{
                                            maxHeight: "200px",
                                            overflowY: "auto",
                                            border: "1px solid #e5e7eb",
                                            borderRadius: "6px"
                                        }}>
                                            {webhookEvents.map((event) => (
                                                <div key={event.id} style={{
                                                    padding: "12px 16px",
                                                    borderBottom: "1px solid #f3f4f6",
                                                    display: "flex",
                                                    alignItems: "flex-start",
                                                    gap: "12px"
                                                }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={webhookEditForm.selectedEvents.includes(event.id)}
                                                        onChange={() => handleEventToggle(event.id)}
                                                        style={{ marginTop: "2px" }}
                                                    />
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{
                                                            fontSize: "14px",
                                                            fontWeight: "500",
                                                            color: "#1f2937",
                                                            marginBottom: "4px"
                                                        }}>
                                                            {event.name}
                                                        </div>
                                                        <div style={{
                                                            fontSize: "12px",
                                                            color: "#6b7280",
                                                            lineHeight: "1.4"
                                                        }}>
                                                            {event.description}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Botões */}
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        gap: "12px"
                                    }}>
                                        <button
                                            onClick={handleCloseWebhookEdit}
                                            style={{
                                                backgroundColor: "white",
                                                color: "#3b82f6",
                                                border: "1px solid #d1d5db",
                                                padding: "12px 24px",
                                                borderRadius: "8px",
                                                fontSize: "14px",
                                                fontWeight: "500",
                                                cursor: "pointer"
                                            }}
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={handleSaveWebhookEdit}
                                            style={{
                                                backgroundColor: "#3b82f6",
                                                color: "white",
                                                border: "none",
                                                padding: "12px 24px",
                                                borderRadius: "8px",
                                                fontSize: "14px",
                                                fontWeight: "500",
                                                cursor: "pointer"
                                            }}
                                        >
                                            Salvar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );
            default:
                return (
                    <div style={{ padding: "20px" }}>
                        <h2>Seção em desenvolvimento</h2>
                        <p>Esta seção será implementada em breve.</p>
                    </div>
                );
        }
    };

    return (
        <DashboardLayout>
            <div style={{ display: "flex", minHeight: "100vh", background: "white" }}>
                {/* Sidebar */}
                <div style={{
                    width: "280px",
                    background: "#e6f2ff",
                    borderRight: "1px solid #e2e8f0",
                    padding: "32px 0"
                }}>
                    <div style={{ marginBottom: "32px", padding: "0 32px 16px", borderBottom: "1px solid #d1e7ff" }}>
                        <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1e293b", margin: "0" }}>
                            Configurações
                        </h2>
                    </div>

                    <div style={{ padding: "0 16px" }}>
                        {settingsMenu.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "12px",
                                        width: "100%",
                                        padding: "12px 16px",
                                        background: activeSection === item.id ? "#3b82f6" : "none",
                                        border: "none",
                                        borderRadius: "8px",
                                        fontSize: "15px",
                                        fontWeight: "500",
                                        color: activeSection === item.id ? "white" : "#475569",
                                        cursor: "pointer",
                                        textAlign: "left",
                                        marginBottom: "4px"
                                    }}
                                    onClick={() => setActiveSection(item.id)}
                                >
                                    <Icon size={20} />
                                    <span>{item.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Main Content */}
                <div style={{ flex: 1, padding: "20px" }}>
                    {renderContent()}
                </div>
            </div>

            {/* Setup Wizard Modal */}
            <SetupWizardModal
                isOpen={showSetupModal}
                onClose={handleCloseSetupModal}
            />

            {/* User Modals */}
            <UserModals
                showAddUserModal={showAddUserModal}
                onCloseAddUserModal={handleCloseAddUserModal}
                showEditUserModal={showEditUserModal}
                onCloseEditUserModal={handleCloseEditUserModal}
                showDeleteUserModal={showDeleteUserModal}
                onCloseDeleteUserModal={handleCloseDeleteUserModal}
                deletingUser={deletingUser}
                userForm={userForm}
                onUserFormChange={handleUserFormChange}
                onSaveUser={handleSaveUser}
                onConfirmDeleteUser={handleConfirmDeleteUser}
            />

            {/* Invite Modals */}
            <InviteModals
                showInviteUserModal={showInviteUserModal}
                onCloseInviteUserModal={handleCloseInviteUserModal}
                inviteForm={inviteForm}
                onInviteFormChange={handleInviteFormChange}
                onSendInvite={handleSendInvite}
            />

            {/* Category Modals */}
            <CategoryModals
                showAddCategoryModal={showAddCategoryModal}
                onCloseAddCategoryModal={handleCloseAddCategoryModal}
                showEditCategoryModal={showEditCategoryModal}
                onCloseEditCategoryModal={handleCloseEditCategoryModal}
                showDeleteCategoryModal={showDeleteCategoryModal}
                onCloseDeleteCategoryModal={handleCloseDeleteCategoryModal}
                deletingCategory={deletingCategory}
                categoryForm={categoryForm}
                onCategoryFormChange={handleCategoryFormChange}
                onSaveCategory={handleSaveCategory}
                onConfirmDeleteCategory={handleConfirmDeleteCategory}
            />

            {/* Modal de Adicionar Subcategoria */}
            <AddSubcategoryModal
                isOpen={showAddSubcategoryModal}
                onClose={() => setShowAddSubcategoryModal(false)}
                onSubmit={handleAddSubcategory}
                categories={[
                    {
                        id: "1",
                        name: "Alimentação",
                        type: CategoryType.EXPENSE,
                        color: "#3b82f6",
                        icon: "utensils",
                        isDefault: false,
                        order: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        id: "2",
                        name: "Transporte",
                        type: CategoryType.EXPENSE,
                        color: "#10b981",
                        icon: "car",
                        isDefault: false,
                        order: 2,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        id: "3",
                        name: "Salário",
                        type: CategoryType.INCOME,
                        color: "#f59e0b",
                        icon: "money",
                        isDefault: false,
                        order: 3,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                ]}
            />

            {/* Modal de Preferências Avançadas */}
            <AdvancedPreferencesModal
                isOpen={showAdvancedPreferencesModal}
                onClose={() => setShowAdvancedPreferencesModal(false)}
                onSave={handleSaveAdvancedPreferences}
            />

            {/* Modal de Ajuda para Categorias */}
            {showCategoryHelpModal && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 10000,
                    padding: "20px"
                }}>
                    <div style={{
                        backgroundColor: "white",
                        borderRadius: "12px",
                        maxWidth: "600px",
                        width: "100%",
                        maxHeight: "80vh",
                        overflowY: "auto",
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                    }}>
                        {/* Cabeçalho do Modal */}
                        <div style={{
                            padding: "24px 24px 16px 24px",
                            borderBottom: "1px solid #e5e7eb",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between"
                        }}>
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px"
                            }}>
                                <div style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "8px",
                                    backgroundColor: "#3b82f6",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}>
                                    <HelpCircle size={20} color="white" />
                                </div>
                                <div>
                                    <h2 style={{
                                        fontSize: "20px",
                                        fontWeight: "600",
                                        color: "#1f2937",
                                        margin: "0"
                                    }}>
                                        Ajuda - Categorias
                                    </h2>
                                    <p style={{
                                        fontSize: "14px",
                                        color: "#6b7280",
                                        margin: "4px 0 0 0"
                                    }}>
                                        Guia completo para gerenciar suas categorias
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleCloseCategoryHelpModal}
                                style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    padding: "8px",
                                    borderRadius: "6px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#6b7280"
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.backgroundColor = "#f3f4f6";
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.backgroundColor = "transparent";
                                }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Conteúdo do Modal */}
                        <div style={{ padding: "24px" }}>
                            {/* Seção Como Usar */}
                            <div style={{ marginBottom: "24px" }}>
                                <h3 style={{
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    color: "#1f2937",
                                    margin: "0 0 12px 0",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px"
                                }}>
                                    <Info size={18} color="#3b82f6" />
                                    Como Usar
                                </h3>
                                <div style={{
                                    backgroundColor: "#f8fafc",
                                    padding: "16px",
                                    borderRadius: "8px",
                                    borderLeft: "4px solid #3b82f6"
                                }}>
                                    <ul style={{
                                        margin: "0",
                                        paddingLeft: "20px",
                                        color: "#374151"
                                    }}>
                                        <li style={{ marginBottom: "8px" }}>
                                            Clique em <strong>&quot;+ Adicionar&quot;</strong> para criar novas categorias
                                        </li>
                                        <li style={{ marginBottom: "8px" }}>
                                            Use o <strong>drag & drop</strong> para reorganizar subcategorias
                                        </li>
                                        <li style={{ marginBottom: "0" }}>
                                            Arraste subcategorias entre diferentes categorias principais
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Seção Exportar */}
                            <div style={{ marginBottom: "24px" }}>
                                <h3 style={{
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    color: "#1f2937",
                                    margin: "0 0 12px 0",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px"
                                }}>
                                    <Upload size={18} color="#0ea5e9" />
                                    Exportar
                                </h3>
                                <div style={{
                                    backgroundColor: "#f0f9ff",
                                    padding: "16px",
                                    borderRadius: "8px",
                                    borderLeft: "4px solid #0ea5e9"
                                }}>
                                    <ul style={{
                                        margin: "0",
                                        paddingLeft: "20px",
                                        color: "#374151"
                                    }}>
                                        <li style={{ marginBottom: "8px" }}>
                                            Clique em <strong>&quot;Exportar&quot;</strong> para baixar suas categorias
                                        </li>
                                        <li style={{ marginBottom: "8px" }}>
                                            Escolha entre <strong>JSON</strong>, <strong>PDF</strong> ou <strong>Excel</strong>
                                        </li>
                                        <li style={{ marginBottom: "0" }}>
                                            Arquivo será salvo com data atual
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Seção Importar */}
                            <div style={{ marginBottom: "24px" }}>
                                <h3 style={{
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    color: "#1f2937",
                                    margin: "0 0 12px 0",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px"
                                }}>
                                    <Download size={18} color="#f59e0b" />
                                    Importar
                                </h3>
                                <div style={{
                                    backgroundColor: "#fef3c7",
                                    padding: "16px",
                                    borderRadius: "8px",
                                    borderLeft: "4px solid #f59e0b"
                                }}>
                                    <ul style={{
                                        margin: "0",
                                        paddingLeft: "20px",
                                        color: "#374151"
                                    }}>
                                        <li style={{ marginBottom: "8px" }}>
                                            Clique em <strong>&quot;Importar&quot;</strong> e selecione arquivo JSON
                                        </li>
                                        <li style={{ marginBottom: "8px" }}>
                                            Arquivo deve ter sido exportado pelo sistema
                                        </li>
                                        <li style={{ marginBottom: "0", color: "#dc2626", fontWeight: "500", display: "flex", alignItems: "center", gap: "6px" }}>
                                            <AlertTriangle size={14} color="#dc2626" />
                                            Substitui todas as categorias atuais
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Seção Dicas */}
                            <div style={{ marginBottom: "24px" }}>
                                <h3 style={{
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    color: "#1f2937",
                                    margin: "0 0 12px 0",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px"
                                }}>
                                    <Target size={18} color="#22c55e" />
                                    Dicas Importantes
                                </h3>
                                <div style={{
                                    backgroundColor: "#f0fdf4",
                                    padding: "16px",
                                    borderRadius: "8px",
                                    borderLeft: "4px solid #22c55e"
                                }}>
                                    <ul style={{
                                        margin: "0",
                                        paddingLeft: "20px",
                                        color: "#374151"
                                    }}>
                                        <li style={{ marginBottom: "8px" }}>
                                            Faça <strong>backup</strong> antes de importar
                                        </li>
                                        <li style={{ marginBottom: "8px" }}>
                                            Use <strong>cores</strong> para organizar visualmente
                                        </li>
                                        <li style={{ marginBottom: "0" }}>
                                            Categorias vazias aceitam drops de outras subcategorias
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Seção Suporte */}
                            <div style={{
                                backgroundColor: "#f8fafc",
                                padding: "16px",
                                borderRadius: "8px",
                                border: "1px solid #e5e7eb"
                            }}>
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px"
                                }}>
                                    <div style={{
                                        width: "32px",
                                        height: "32px",
                                        borderRadius: "6px",
                                        backgroundColor: "#3b82f6",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}>
                                        <HelpCircle size={16} color="white" />
                                    </div>
                                    <div>
                                        <p style={{
                                            margin: "0",
                                            fontSize: "14px",
                                            color: "#374151",
                                            fontWeight: "500"
                                        }}>
                                            Precisa de mais ajuda?
                                        </p>
                                        <p style={{
                                            margin: "4px 0 0 0",
                                            fontSize: "13px",
                                            color: "#6b7280"
                                        }}>
                                            Entre em contato com o suporte através do menu &quot;Abrir Ticket de Suporte&quot;
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Rodapé do Modal */}
                        <div style={{
                            padding: "16px 24px",
                            borderTop: "1px solid #e5e7eb",
                            display: "flex",
                            justifyContent: "flex-end"
                        }}>
                            <button
                                onClick={handleCloseCategoryHelpModal}
                                style={{
                                    backgroundColor: "#3b82f6",
                                    color: "white",
                                    border: "none",
                                    padding: "10px 20px",
                                    borderRadius: "8px",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease"
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.backgroundColor = "#2563eb";
                                    e.currentTarget.style.transform = "translateY(-1px)";
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.backgroundColor = "#3b82f6";
                                    e.currentTarget.style.transform = "translateY(0)";
                                }}
                            >
                                Entendi
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Alterar E-mail de Cobrança */}
            {showChangeEmailModal && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: "white",
                        borderRadius: "12px",
                        padding: "24px",
                        maxWidth: "500px",
                        width: "90%",
                        maxHeight: "90vh",
                        overflowY: "auto"
                    }}>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "24px"
                        }}>
                            <h2 style={{
                                margin: 0,
                                fontSize: "20px",
                                fontWeight: "600",
                                color: "#1f2937"
                            }}>
                                Alterar E-mail de Cobrança
                            </h2>
                            <button
                                onClick={handleCloseChangeEmailModal}
                                style={{
                                    background: "none",
                                    border: "none",
                                    fontSize: "24px",
                                    color: "#6b7280",
                                    cursor: "pointer",
                                    padding: "4px"
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <div style={{ marginBottom: "20px" }}>
                            <label style={{
                                display: "block",
                                marginBottom: "8px",
                                fontSize: "14px",
                                fontWeight: "500",
                                color: "#374151"
                            }}>
                                E-mail atual
                            </label>
                            <input
                                type="email"
                                value={emailForm.currentEmail}
                                disabled
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "8px",
                                    fontSize: "14px",
                                    backgroundColor: "#f9fafb",
                                    color: "#6b7280"
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: "20px" }}>
                            <label style={{
                                display: "block",
                                marginBottom: "8px",
                                fontSize: "14px",
                                fontWeight: "500",
                                color: "#374151"
                            }}>
                                Novo e-mail
                            </label>
                            <input
                                type="email"
                                value={emailForm.newEmail}
                                onChange={(e) => handleEmailFormChange('newEmail', e.target.value)}
                                placeholder="Digite o novo e-mail"
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "8px",
                                    fontSize: "14px"
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: "24px" }}>
                            <label style={{
                                display: "block",
                                marginBottom: "8px",
                                fontSize: "14px",
                                fontWeight: "500",
                                color: "#374151"
                            }}>
                                Confirmar novo e-mail
                            </label>
                            <input
                                type="email"
                                value={emailForm.confirmEmail}
                                onChange={(e) => handleEmailFormChange('confirmEmail', e.target.value)}
                                placeholder="Confirme o novo e-mail"
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "8px",
                                    fontSize: "14px"
                                }}
                            />
                        </div>

                        <div style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: "12px"
                        }}>
                            <button
                                onClick={handleCloseChangeEmailModal}
                                style={{
                                    padding: "12px 24px",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "8px",
                                    backgroundColor: "white",
                                    color: "#374151",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    cursor: "pointer"
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveEmail}
                                style={{
                                    padding: "12px 24px",
                                    border: "none",
                                    borderRadius: "8px",
                                    backgroundColor: "#3b82f6",
                                    color: "white",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    cursor: "pointer"
                                }}
                            >
                                Salvar Alterações
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Upload Logo da Igreja */}
            {showUploadLogoModal && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: "white",
                        borderRadius: "12px",
                        padding: "24px",
                        maxWidth: "500px",
                        width: "90%",
                        maxHeight: "90vh",
                        overflowY: "auto"
                    }}>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "24px"
                        }}>
                            <h2 style={{
                                margin: 0,
                                fontSize: "20px",
                                fontWeight: "600",
                                color: "#1f2937"
                            }}>
                                Upload Logo da Igreja
                            </h2>
                            <button
                                onClick={() => setShowUploadLogoModal(false)}
                                style={{
                                    background: "none",
                                    border: "none",
                                    fontSize: "24px",
                                    color: "#6b7280",
                                    cursor: "pointer",
                                    padding: "4px"
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <div style={{ marginBottom: "20px" }}>
                            <label style={{
                                display: "block",
                                marginBottom: "8px",
                                fontSize: "14px",
                                fontWeight: "500",
                                color: "#374151"
                            }}>
                                Selecionar arquivo
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "8px",
                                    fontSize: "14px"
                                }}
                            />
                        </div>

                        {uploadForm.preview && (
                            <div style={{ marginBottom: "20px" }}>
                                <label style={{
                                    display: "block",
                                    marginBottom: "8px",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    color: "#374151"
                                }}>
                                    Preview
                                </label>
                                <img
                                    src={uploadForm.preview}
                                    alt="Preview"
                                    style={{
                                        width: "100%",
                                        maxHeight: "200px",
                                        objectFit: "contain",
                                        border: "1px solid #e5e7eb",
                                        borderRadius: "8px"
                                    }}
                                />
                            </div>
                        )}

                        <div style={{ marginBottom: "24px" }}>
                            <label style={{
                                display: "block",
                                marginBottom: "8px",
                                fontSize: "14px",
                                fontWeight: "500",
                                color: "#374151"
                            }}>
                                Descrição (opcional)
                            </label>
                            <input
                                type="text"
                                value={uploadForm.description}
                                onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Descreva o logo..."
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "8px",
                                    fontSize: "14px"
                                }}
                            />
                        </div>

                        <div style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: "12px"
                        }}>
                            <button
                                onClick={() => setShowUploadLogoModal(false)}
                                style={{
                                    padding: "12px 24px",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "8px",
                                    backgroundColor: "white",
                                    color: "#374151",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    cursor: "pointer"
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveLogo}
                                disabled={!uploadForm.file}
                                style={{
                                    padding: "12px 24px",
                                    border: "none",
                                    borderRadius: "8px",
                                    backgroundColor: uploadForm.file ? "#3b82f6" : "#9ca3af",
                                    color: "white",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    cursor: uploadForm.file ? "pointer" : "not-allowed"
                                }}
                            >
                                Salvar Logo
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Gerenciamento de Arquivos */}
            {showFileManagementModal && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: "white",
                        borderRadius: "12px",
                        padding: "24px",
                        maxWidth: "800px",
                        width: "90%",
                        maxHeight: "90vh",
                        overflowY: "auto"
                    }}>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "24px"
                        }}>
                            <h2 style={{
                                margin: 0,
                                fontSize: "20px",
                                fontWeight: "600",
                                color: "#1f2937"
                            }}>
                                Gerenciamento de Arquivos
                            </h2>
                            <button
                                onClick={() => setShowFileManagementModal(false)}
                                style={{
                                    background: "none",
                                    border: "none",
                                    fontSize: "24px",
                                    color: "#6b7280",
                                    cursor: "pointer",
                                    padding: "4px"
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <div style={{ marginBottom: "20px" }}>
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "16px"
                            }}>
                                <h3 style={{
                                    margin: 0,
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    color: "#374151"
                                }}>
                                    Arquivos ({files.length})
                                </h3>
                                <button
                                    onClick={handleUploadLogo}
                                    style={{
                                        padding: "8px 16px",
                                        backgroundColor: "#3b82f6",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "6px",
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "6px"
                                    }}
                                >
                                    <Plus size={16} />
                                    Novo Upload
                                </button>
                            </div>

                            <div style={{
                                border: "1px solid #e5e7eb",
                                borderRadius: "8px",
                                overflow: "hidden"
                            }}>
                                {files.map((file) => (
                                    <div key={file.id} style={{
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "16px",
                                        borderBottom: "1px solid #e5e7eb",
                                        backgroundColor: "white"
                                    }}>
                                        <div style={{
                                            width: "40px",
                                            height: "40px",
                                            backgroundColor: file.type === "image" ? "#dbeafe" : "#f3f4f6",
                                            borderRadius: "8px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            marginRight: "12px"
                                        }}>
                                            {file.type === "image" ? (
                                                <Camera size={20} color="#3b82f6" />
                                            ) : (
                                                <FileSpreadsheet size={20} color="#6b7280" />
                                            )}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{
                                                margin: "0 0 4px 0",
                                                fontSize: "14px",
                                                fontWeight: "500",
                                                color: "#374151"
                                            }}>
                                                {file.name}
                                            </p>
                                            <p style={{
                                                margin: "0",
                                                fontSize: "12px",
                                                color: "#6b7280"
                                            }}>
                                                {file.size} • {file.uploadDate}
                                            </p>
                                        </div>
                                        <div style={{ display: "flex", gap: "8px" }}>
                                            <button
                                                onClick={() => handlePreviewImage(file)}
                                                style={{
                                                    padding: "6px 12px",
                                                    backgroundColor: "#f3f4f6",
                                                    color: "#374151",
                                                    border: "none",
                                                    borderRadius: "6px",
                                                    fontSize: "12px",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                Visualizar
                                            </button>
                                            <button
                                                onClick={() => handleDeleteFile(file.id)}
                                                style={{
                                                    padding: "6px 12px",
                                                    backgroundColor: "#fef2f2",
                                                    color: "#dc2626",
                                                    border: "none",
                                                    borderRadius: "6px",
                                                    fontSize: "12px",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                Excluir
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{
                            display: "flex",
                            justifyContent: "flex-end"
                        }}>
                            <button
                                onClick={() => setShowFileManagementModal(false)}
                                style={{
                                    padding: "12px 24px",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "8px",
                                    backgroundColor: "white",
                                    color: "#374151",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    cursor: "pointer"
                                }}
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Preview de Imagem */}
            {showImagePreviewModal && uploadForm.preview && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1000
                }}>
                    <div style={{
                        position: "relative",
                        maxWidth: "90%",
                        maxHeight: "90%"
                    }}>
                        <button
                            onClick={() => setShowImagePreviewModal(false)}
                            style={{
                                position: "absolute",
                                top: "-40px",
                                right: "0",
                                background: "rgba(255, 255, 255, 0.2)",
                                border: "none",
                                color: "white",
                                fontSize: "24px",
                                cursor: "pointer",
                                padding: "8px",
                                borderRadius: "4px"
                            }}
                        >
                            ×
                        </button>
                        <img
                            src={uploadForm.preview}
                            alt="Preview"
                            style={{
                                maxWidth: "100%",
                                maxHeight: "100%",
                                objectFit: "contain",
                                borderRadius: "8px"
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Modal Configurações de Notificações */}
            {showNotificationSettingsModal && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: "white",
                        borderRadius: "12px",
                        padding: "24px",
                        maxWidth: "600px",
                        width: "90%",
                        maxHeight: "90vh",
                        overflowY: "auto"
                    }}>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "24px"
                        }}>
                            <h2 style={{
                                margin: 0,
                                fontSize: "20px",
                                fontWeight: "600",
                                color: "#1f2937"
                            }}>
                                Configurações de Notificações
                            </h2>
                            <button
                                onClick={() => setShowNotificationSettingsModal(false)}
                                style={{
                                    background: "none",
                                    border: "none",
                                    fontSize: "24px",
                                    color: "#6b7280",
                                    cursor: "pointer",
                                    padding: "4px"
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            <div>
                                <h3 style={{
                                    margin: "0 0 16px 0",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    color: "#374151"
                                }}>
                                    Canais de Notificação
                                </h3>
                                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                    {[
                                        { key: "email", label: "E-mail", description: "Receber notificações por e-mail" },
                                        { key: "push", label: "Push", description: "Receber notificações push no navegador" },
                                        { key: "sms", label: "SMS", description: "Receber notificações por SMS" }
                                    ].map((channel) => (
                                        <div key={channel.key} style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            padding: "16px",
                                            border: "1px solid #e5e7eb",
                                            borderRadius: "8px"
                                        }}>
                                            <div>
                                                <p style={{
                                                    margin: "0 0 4px 0",
                                                    fontSize: "14px",
                                                    fontWeight: "500",
                                                    color: "#374151"
                                                }}>
                                                    {channel.label}
                                                </p>
                                                <p style={{
                                                    margin: "0",
                                                    fontSize: "12px",
                                                    color: "#6b7280"
                                                }}>
                                                    {channel.description}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleNotificationToggle(channel.key)}
                                                style={{
                                                    width: "44px",
                                                    height: "24px",
                                                    backgroundColor: notificationSettings[channel.key as keyof typeof notificationSettings] ? "#3b82f6" : "#d1d5db",
                                                    border: "none",
                                                    borderRadius: "12px",
                                                    cursor: "pointer",
                                                    position: "relative",
                                                    transition: "all 0.2s ease"
                                                }}
                                            >
                                                <div style={{
                                                    width: "20px",
                                                    height: "20px",
                                                    backgroundColor: "white",
                                                    borderRadius: "50%",
                                                    position: "absolute",
                                                    top: "2px",
                                                    left: notificationSettings[channel.key as keyof typeof notificationSettings] ? "22px" : "2px",
                                                    transition: "all 0.2s ease"
                                                }} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 style={{
                                    margin: "0 0 16px 0",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    color: "#374151"
                                }}>
                                    Tipos de Notificação
                                </h3>
                                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                    {[
                                        { key: "weeklyReport", label: "Relatório Semanal", description: "Receber relatórios semanais" },
                                        { key: "monthlyReport", label: "Relatório Mensal", description: "Receber relatórios mensais" },
                                        { key: "paymentReminder", label: "Lembrete de Pagamento", description: "Lembretes de vencimento" },
                                        { key: "systemUpdates", label: "Atualizações do Sistema", description: "Notificações sobre atualizações" }
                                    ].map((type) => (
                                        <div key={type.key} style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            padding: "16px",
                                            border: "1px solid #e5e7eb",
                                            borderRadius: "8px"
                                        }}>
                                            <div>
                                                <p style={{
                                                    margin: "0 0 4px 0",
                                                    fontSize: "14px",
                                                    fontWeight: "500",
                                                    color: "#374151"
                                                }}>
                                                    {type.label}
                                                </p>
                                                <p style={{
                                                    margin: "0",
                                                    fontSize: "12px",
                                                    color: "#6b7280"
                                                }}>
                                                    {type.description}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleNotificationToggle(type.key)}
                                                style={{
                                                    width: "44px",
                                                    height: "24px",
                                                    backgroundColor: notificationSettings[type.key as keyof typeof notificationSettings] ? "#3b82f6" : "#d1d5db",
                                                    border: "none",
                                                    borderRadius: "12px",
                                                    cursor: "pointer",
                                                    position: "relative",
                                                    transition: "all 0.2s ease"
                                                }}
                                            >
                                                <div style={{
                                                    width: "20px",
                                                    height: "20px",
                                                    backgroundColor: "white",
                                                    borderRadius: "50%",
                                                    position: "absolute",
                                                    top: "2px",
                                                    left: notificationSettings[type.key as keyof typeof notificationSettings] ? "22px" : "2px",
                                                    transition: "all 0.2s ease"
                                                }} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: "12px",
                            marginTop: "24px"
                        }}>
                            <button
                                onClick={() => setShowNotificationSettingsModal(false)}
                                style={{
                                    padding: "12px 24px",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "8px",
                                    backgroundColor: "white",
                                    color: "#374151",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    cursor: "pointer"
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => {
                                    console.log('Salvando configurações:', notificationSettings);
                                    alert('Configurações salvas com sucesso!');
                                    setShowNotificationSettingsModal(false);
                                }}
                                style={{
                                    padding: "12px 24px",
                                    border: "none",
                                    borderRadius: "8px",
                                    backgroundColor: "#3b82f6",
                                    color: "white",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    cursor: "pointer"
                                }}
                            >
                                Salvar Configurações
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Histórico de Notificações */}
            {showNotificationHistoryModal && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: "white",
                        borderRadius: "12px",
                        padding: "24px",
                        maxWidth: "800px",
                        width: "90%",
                        maxHeight: "90vh",
                        overflowY: "auto"
                    }}>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "24px"
                        }}>
                            <h2 style={{
                                margin: 0,
                                fontSize: "20px",
                                fontWeight: "600",
                                color: "#1f2937"
                            }}>
                                Histórico de Notificações
                            </h2>
                            <button
                                onClick={() => setShowNotificationHistoryModal(false)}
                                style={{
                                    background: "none",
                                    border: "none",
                                    fontSize: "24px",
                                    color: "#6b7280",
                                    cursor: "pointer",
                                    padding: "4px"
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <div style={{
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                            overflow: "hidden"
                        }}>
                            {notifications.map((notification) => (
                                <div key={notification.id} style={{
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "16px",
                                    borderBottom: "1px solid #e5e7eb",
                                    backgroundColor: notification.read ? "white" : "#f8fafc"
                                }}>
                                    <div style={{
                                        width: "8px",
                                        height: "8px",
                                        backgroundColor: notification.read ? "transparent" : "#3b82f6",
                                        borderRadius: "50%",
                                        marginRight: "12px"
                                    }} />
                                    <div style={{ flex: 1 }}>
                                        <p style={{
                                            margin: "0 0 4px 0",
                                            fontSize: "14px",
                                            fontWeight: notification.read ? "400" : "600",
                                            color: "#374151"
                                        }}>
                                            {notification.title}
                                        </p>
                                        <p style={{
                                            margin: "0 0 4px 0",
                                            fontSize: "12px",
                                            color: "#6b7280"
                                        }}>
                                            {notification.message}
                                        </p>
                                        <p style={{
                                            margin: "0",
                                            fontSize: "11px",
                                            color: "#9ca3af"
                                        }}>
                                            {notification.date}
                                        </p>
                                    </div>
                                    {!notification.read && (
                                        <button
                                            onClick={() => handleMarkAsRead(notification.id)}
                                            style={{
                                                padding: "6px 12px",
                                                backgroundColor: "#3b82f6",
                                                color: "white",
                                                border: "none",
                                                borderRadius: "6px",
                                                fontSize: "12px",
                                                cursor: "pointer"
                                            }}
                                        >
                                            Marcar como lida
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            marginTop: "24px"
                        }}>
                            <button
                                onClick={() => setShowNotificationHistoryModal(false)}
                                style={{
                                    padding: "12px 24px",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "8px",
                                    backgroundColor: "white",
                                    color: "#374151",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    cursor: "pointer"
                                }}
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Configuração de Alertas */}
            {showAlertSettingsModal && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: "white",
                        borderRadius: "12px",
                        padding: "24px",
                        maxWidth: "600px",
                        width: "90%",
                        maxHeight: "90vh",
                        overflowY: "auto"
                    }}>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "24px"
                        }}>
                            <h2 style={{
                                margin: 0,
                                fontSize: "20px",
                                fontWeight: "600",
                                color: "#1f2937"
                            }}>
                                Configuração de Alertas
                            </h2>
                            <button
                                onClick={() => setShowAlertSettingsModal(false)}
                                style={{
                                    background: "none",
                                    border: "none",
                                    fontSize: "24px",
                                    color: "#6b7280",
                                    cursor: "pointer",
                                    padding: "4px"
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            <div>
                                <h3 style={{
                                    margin: "0 0 16px 0",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    color: "#374151"
                                }}>
                                    Alertas de Sistema
                                </h3>
                                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                    {[
                                        { key: "lowBalance", label: "Saldo Baixo", description: "Alertar quando saldo estiver abaixo de R$ 100" },
                                        { key: "overduePayments", label: "Pagamentos em Atraso", description: "Alertar sobre pagamentos vencidos" },
                                        { key: "unusualActivity", label: "Atividade Incomum", description: "Alertar sobre transações suspeitas" },
                                        { key: "backupStatus", label: "Status do Backup", description: "Alertar sobre falhas no backup" }
                                    ].map((alert) => (
                                        <div key={alert.key} style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            padding: "16px",
                                            border: "1px solid #e5e7eb",
                                            borderRadius: "8px"
                                        }}>
                                            <div>
                                                <p style={{
                                                    margin: "0 0 4px 0",
                                                    fontSize: "14px",
                                                    fontWeight: "500",
                                                    color: "#374151"
                                                }}>
                                                    {alert.label}
                                                </p>
                                                <p style={{
                                                    margin: "0",
                                                    fontSize: "12px",
                                                    color: "#6b7280"
                                                }}>
                                                    {alert.description}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => console.log('Toggle alert:', alert.key)}
                                                style={{
                                                    width: "44px",
                                                    height: "24px",
                                                    backgroundColor: "#3b82f6",
                                                    border: "none",
                                                    borderRadius: "12px",
                                                    cursor: "pointer",
                                                    position: "relative",
                                                    transition: "all 0.2s ease"
                                                }}
                                            >
                                                <div style={{
                                                    width: "20px",
                                                    height: "20px",
                                                    backgroundColor: "white",
                                                    borderRadius: "50%",
                                                    position: "absolute",
                                                    top: "2px",
                                                    left: "22px",
                                                    transition: "all 0.2s ease"
                                                }} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: "12px",
                            marginTop: "24px"
                        }}>
                            <button
                                onClick={() => setShowAlertSettingsModal(false)}
                                style={{
                                    padding: "12px 24px",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "8px",
                                    backgroundColor: "white",
                                    color: "#374151",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    cursor: "pointer"
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => {
                                    console.log('Salvando configurações de alertas');
                                    alert('Configurações de alertas salvas com sucesso!');
                                    setShowAlertSettingsModal(false);
                                }}
                                style={{
                                    padding: "12px 24px",
                                    border: "none",
                                    borderRadius: "8px",
                                    backgroundColor: "#3b82f6",
                                    color: "white",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    cursor: "pointer"
                                }}
                            >
                                Salvar Configurações
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
