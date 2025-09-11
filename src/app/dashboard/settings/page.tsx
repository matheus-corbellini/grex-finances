"use client";

import React, { useState } from "react";
import { DashboardLayout } from "../../../components/layout";
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
    ChevronDown
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


export default function Settings() {
    const [activeSection, setActiveSection] = useState("minha-igreja");
    const [activeTab, setActiveTab] = useState("informacoes");
    const [formData, setFormData] = useState({
        nomeIgreja: "",
        telefone: "",
        cpfCnpj: "",
        site: ""
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
        console.log('Adicionando novo usuário...');
        alert('Funcionalidade de adicionar usuário será implementada em breve!');
    };

    const handleCloseBanner = () => {
        setShowUpgradeBanner(false);
    };

    const handleViewDetails = () => {
        console.log('Visualizando detalhes do plano...');
        alert('Funcionalidade de ver detalhes será implementada em breve!');
    };

    const handleUpgrade = () => {
        console.log('Fazendo upgrade do plano...');
        alert('Funcionalidade de upgrade será implementada em breve!');
    };

    const handleChangePayment = () => {
        console.log('Alterando método de pagamento...');
        alert('Funcionalidade de alterar pagamento será implementada em breve!');
    };

    const handlePaymentHistory = () => {
        console.log('Visualizando histórico de pagamentos...');
        alert('Funcionalidade de histórico será implementada em breve!');
    };

    const handleChangeEmail = () => {
        console.log('Alterando e-mail de cobrança...');
        alert('Funcionalidade de alterar e-mail será implementada em breve!');
    };

    const handleAddCategory = () => {
        console.log('Adicionando nova categoria...');
        alert('Funcionalidade de adicionar categoria será implementada em breve!');
    };

    const handleImportCategories = () => {
        console.log('Importando categorias...');
        alert('Funcionalidade de importar categorias será implementada em breve!');
    };

    const handleExportCategories = () => {
        console.log('Exportando categorias...');
        alert('Funcionalidade de exportar categorias será implementada em breve!');
    };

    const handleCategoryHelp = () => {
        console.log('Abrindo ajuda de categorias...');
        alert('Funcionalidade de ajuda será implementada em breve!');
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

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setCategories((prevCategories) => {
                const currentTab = activeCategoryTab as keyof typeof prevCategories;
                const currentCategories = prevCategories[currentTab];

                // Encontrar a categoria pai de origem e destino
                const sourceParentIndex = currentCategories.findIndex(category =>
                    category.children?.some(child => child.id.toString() === active.id)
                );

                const targetParentIndex = currentCategories.findIndex(category =>
                    category.children?.some(child => child.id.toString() === over?.id)
                );

                // Se está movendo para uma categoria diferente
                if (sourceParentIndex !== -1 && targetParentIndex !== -1 && sourceParentIndex !== targetParentIndex) {
                    const sourceParent = currentCategories[sourceParentIndex];
                    const targetParent = currentCategories[targetParentIndex];

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

                        newCategories[targetParentIndex] = {
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
                if (sourceParentIndex !== -1 && sourceParentIndex === targetParentIndex) {
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
                        {/* Título */}
                        <h1 style={{
                            fontSize: "24px",
                            fontWeight: "600",
                            color: "#1f2937",
                            margin: "0 0 32px 0"
                        }}>
                            Minha Igreja
                        </h1>

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
                                        border: "none",
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
                                        border: "none",
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
                                                backgroundColor: "#dbeafe",
                                                borderRadius: "12px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                border: "2px dashed #93c5fd",
                                                position: "relative"
                                            }}>
                                                <Mountain size={64} color="#60a5fa" />
                                                <button
                                                    type="button"
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
                            <h1 style={{ fontSize: "24px", fontWeight: "600", color: "#1f2937", margin: "0 0 8px 0" }}>
                                Preferências
                            </h1>
                            <p style={{ fontSize: "16px", color: "#6b7280", margin: "0" }}>
                                Configure suas preferências de uso da plataforma
                            </p>
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
                                        fontWeight: "500"
                                    }}>
                                        {user.role}
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
                                    top: "16px",
                                    right: "16px",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "#6b7280",
                                    padding: "4px"
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
                                                    backgroundColor: "transparent",
                                                    color: "#3b82f6",
                                                    border: "none",
                                                    padding: "4px 0",
                                                    fontSize: "14px",
                                                    fontWeight: "500",
                                                    cursor: "pointer",
                                                    textDecoration: "underline"
                                                }}
                                            >
                                                Ver detalhes
                                            </button>
                                            <button
                                                onClick={handleUpgrade}
                                                style={{
                                                    backgroundColor: "transparent",
                                                    color: "#3b82f6",
                                                    border: "none",
                                                    padding: "4px 0",
                                                    fontSize: "14px",
                                                    fontWeight: "500",
                                                    cursor: "pointer",
                                                    textDecoration: "underline",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "4px"
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
                                                backgroundColor: "transparent",
                                                color: "#3b82f6",
                                                border: "none",
                                                padding: "4px 0",
                                                fontSize: "14px",
                                                fontWeight: "500",
                                                cursor: "pointer",
                                                textDecoration: "underline"
                                            }}
                                        >
                                            Alterar
                                        </button>
                                        <button
                                            onClick={handlePaymentHistory}
                                            style={{
                                                backgroundColor: "transparent",
                                                color: "#3b82f6",
                                                border: "none",
                                                padding: "4px 0",
                                                fontSize: "14px",
                                                fontWeight: "500",
                                                cursor: "pointer",
                                                textDecoration: "underline"
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
                                            backgroundColor: "transparent",
                                            color: "#3b82f6",
                                            border: "none",
                                            padding: "4px 0",
                                            fontSize: "14px",
                                            fontWeight: "500",
                                            cursor: "pointer",
                                            textDecoration: "underline"
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
                                <button
                                    onClick={handleExportCategories}
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
                                </button>
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
                                        border: "none",
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
                                        items={categories[activeCategoryTab as keyof typeof categories]
                                            .flatMap(category => category.children?.map(child => child.id.toString()) || [])}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        {categories[activeCategoryTab as keyof typeof categories].map((category) => (
                                            <div key={category.id}>
                                                {/* Categoria pai */}
                                                <div style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    padding: "16px 20px",
                                                    borderBottom: "1px solid #f1f5f9",
                                                    backgroundColor: "white"
                                                }}>
                                                    <div style={{ width: "20px", marginRight: "12px" }}>
                                                        <input type="checkbox" style={{ margin: "0" }} />
                                                    </div>
                                                    <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "8px" }}>
                                                        <Circle
                                                            size={6}
                                                            fill={category.color === "green" ? "#16a34a" : category.color === "blue" ? "#2563eb" : "#dc2626"}
                                                            color={category.color === "green" ? "#16a34a" : category.color === "blue" ? "#2563eb" : "#dc2626"}
                                                        />
                                                        <span style={{ fontSize: "14px", color: "#1f2937", fontWeight: "600" }}>
                                                            {category.name}
                                                        </span>
                                                    </div>
                                                    <div style={{ fontSize: "14px", color: "#6b7280" }}>
                                                        Ações
                                                    </div>
                                                </div>

                                                {/* Categorias filhas com drag & drop */}
                                                {category.children && category.children.map((child) => (
                                                    <SortableChildItem
                                                        key={child.id}
                                                        id={child.id.toString()}
                                                        child={child}
                                                        onDragEnd={handleDragEnd}
                                                    />
                                                ))}
                                            </div>
                                        ))}
                                    </SortableContext>
                                </DndContext>
                            </div>
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
                                    border: "none",
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
                                    border: "none",
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
                                    border: "none",
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
        </DashboardLayout>
    );
}
