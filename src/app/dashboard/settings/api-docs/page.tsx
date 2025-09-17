"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "../../../../components/layout";
import { useToastNotifications } from "../../../../hooks/useToastNotifications";
import {
    BookOpen,
    Code,
    Copy,
    Download,
    ExternalLink,
    Filter,
    Search,
    Play,
    CheckCircle,
    AlertTriangle,
    Info,
    Key,
    Globe,
    Zap,
    Database,
    Users,
    DollarSign,
    FileText,
    Settings
} from "lucide-react";
import styles from "./ApiDocs.module.css";

interface ApiEndpoint {
    id: string;
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    path: string;
    summary: string;
    description: string;
    category: string;
    requiresAuth: boolean;
    parameters?: ApiParameter[];
    requestBody?: any;
    responses: ApiResponse[];
    examples: ApiExample[];
}

interface ApiParameter {
    name: string;
    type: string;
    required: boolean;
    description: string;
    example?: any;
}

interface ApiResponse {
    status: number;
    description: string;
    schema?: any;
}

interface ApiExample {
    title: string;
    request?: any;
    response?: any;
}

export default function ApiDocsPage() {
    const toast = useToastNotifications();
    const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([]);
    const [filteredEndpoints, setFilteredEndpoints] = useState<ApiEndpoint[]>([]);
    const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedMethod, setSelectedMethod] = useState("all");
    const [apiKey, setApiKey] = useState("");
    const [baseUrl, setBaseUrl] = useState("https://api.grex-finances.com/v1");

    // Mock API endpoints
    useEffect(() => {
        const mockEndpoints: ApiEndpoint[] = [
            {
                id: "1",
                method: "GET",
                path: "/accounts",
                summary: "Listar contas",
                description: "Retorna uma lista paginada de todas as contas do usuário",
                category: "Contas",
                requiresAuth: true,
                parameters: [
                    {
                        name: "page",
                        type: "integer",
                        required: false,
                        description: "Número da página",
                        example: 1
                    },
                    {
                        name: "limit",
                        type: "integer",
                        required: false,
                        description: "Número de itens por página",
                        example: 20
                    }
                ],
                responses: [
                    { status: 200, description: "Lista de contas retornada com sucesso" },
                    { status: 401, description: "Token de autenticação inválido" },
                    { status: 403, description: "Acesso negado" }
                ],
                examples: [
                    {
                        title: "Requisição básica",
                        request: {
                            method: "GET",
                            url: "/accounts",
                            headers: {
                                "Authorization": "Bearer YOUR_API_KEY"
                            }
                        },
                        response: {
                            data: [
                                {
                                    id: "acc_123",
                                    name: "Conta Corrente",
                                    type: "checking",
                                    balance: 1500.00,
                                    currency: "BRL"
                                }
                            ],
                            pagination: {
                                page: 1,
                                limit: 20,
                                total: 1
                            }
                        }
                    }
                ]
            },
            {
                id: "2",
                method: "POST",
                path: "/transactions",
                summary: "Criar transação",
                description: "Cria uma nova transação financeira",
                category: "Transações",
                requiresAuth: true,
                requestBody: {
                    type: "object",
                    properties: {
                        accountId: { type: "string", description: "ID da conta" },
                        amount: { type: "number", description: "Valor da transação" },
                        description: { type: "string", description: "Descrição da transação" },
                        categoryId: { type: "string", description: "ID da categoria" },
                        date: { type: "string", format: "date", description: "Data da transação" }
                    },
                    required: ["accountId", "amount", "description"]
                },
                responses: [
                    { status: 201, description: "Transação criada com sucesso" },
                    { status: 400, description: "Dados inválidos" },
                    { status: 401, description: "Token de autenticação inválido" }
                ],
                examples: [
                    {
                        title: "Criar receita",
                        request: {
                            method: "POST",
                            url: "/transactions",
                            headers: {
                                "Authorization": "Bearer YOUR_API_KEY",
                                "Content-Type": "application/json"
                            },
                            body: {
                                accountId: "acc_123",
                                amount: 100.00,
                                description: "Dízimo recebido",
                                categoryId: "cat_456",
                                date: "2024-01-15"
                            }
                        },
                        response: {
                            id: "txn_789",
                            accountId: "acc_123",
                            amount: 100.00,
                            description: "Dízimo recebido",
                            categoryId: "cat_456",
                            date: "2024-01-15",
                            createdAt: "2024-01-15T10:30:00Z"
                        }
                    }
                ]
            },
            {
                id: "3",
                method: "GET",
                path: "/reports/summary",
                summary: "Relatório resumo",
                description: "Retorna um resumo financeiro do período especificado",
                category: "Relatórios",
                requiresAuth: true,
                parameters: [
                    {
                        name: "startDate",
                        type: "string",
                        required: true,
                        description: "Data de início (YYYY-MM-DD)",
                        example: "2024-01-01"
                    },
                    {
                        name: "endDate",
                        type: "string",
                        required: true,
                        description: "Data de fim (YYYY-MM-DD)",
                        example: "2024-01-31"
                    }
                ],
                responses: [
                    { status: 200, description: "Relatório gerado com sucesso" },
                    { status: 400, description: "Período inválido" },
                    { status: 401, description: "Token de autenticação inválido" }
                ],
                examples: [
                    {
                        title: "Resumo mensal",
                        request: {
                            method: "GET",
                            url: "/reports/summary?startDate=2024-01-01&endDate=2024-01-31",
                            headers: {
                                "Authorization": "Bearer YOUR_API_KEY"
                            }
                        },
                        response: {
                            period: {
                                startDate: "2024-01-01",
                                endDate: "2024-01-31"
                            },
                            summary: {
                                totalIncome: 5000.00,
                                totalExpenses: 3000.00,
                                balance: 2000.00
                            },
                            categories: [
                                {
                                    name: "Dízimos",
                                    income: 4000.00,
                                    expenses: 0.00
                                }
                            ]
                        }
                    }
                ]
            }
        ];

        setEndpoints(mockEndpoints);
        setFilteredEndpoints(mockEndpoints);
    }, []);

    // Filter endpoints
    useEffect(() => {
        let filtered = endpoints;

        // Category filter
        if (selectedCategory !== "all") {
            filtered = filtered.filter(endpoint => endpoint.category === selectedCategory);
        }

        // Method filter
        if (selectedMethod !== "all") {
            filtered = filtered.filter(endpoint => endpoint.method === selectedMethod);
        }

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(endpoint =>
                endpoint.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                endpoint.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
                endpoint.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredEndpoints(filtered);
    }, [endpoints, selectedCategory, selectedMethod, searchTerm]);

    const getMethodColor = (method: string) => {
        switch (method) {
            case "GET":
                return "var(--color-success-600)";
            case "POST":
                return "var(--color-primary-600)";
            case "PUT":
                return "var(--color-warning-600)";
            case "DELETE":
                return "var(--color-error-600)";
            case "PATCH":
                return "var(--color-primary-600)";
            default:
                return "var(--color-neutrals-600)";
        }
    };

    const getMethodIcon = (method: string) => {
        switch (method) {
            case "GET":
                return <CheckCircle size={16} />;
            case "POST":
                return <Play size={16} />;
            case "PUT":
                return <AlertTriangle size={16} />;
            case "DELETE":
                return <AlertTriangle size={16} />;
            case "PATCH":
                return <Info size={16} />;
            default:
                return <Code size={16} />;
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.showSuccess("Copiado para a área de transferência!");
    };

    const generateCurlCommand = (endpoint: ApiEndpoint) => {
        let curl = `curl -X ${endpoint.method} "${baseUrl}${endpoint.path}"`;

        if (endpoint.requiresAuth) {
            curl += ` \\\n  -H "Authorization: Bearer ${apiKey || 'YOUR_API_KEY'}"`;
        }

        if (endpoint.method === "POST" || endpoint.method === "PUT" || endpoint.method === "PATCH") {
            curl += ` \\\n  -H "Content-Type: application/json"`;
            if (endpoint.examples[0]?.request?.body) {
                curl += ` \\\n  -d '${JSON.stringify(endpoint.examples[0].request.body, null, 2)}'`;
            }
        }

        return curl;
    };

    const categories = Array.from(new Set(endpoints.map(e => e.category)));
    const methods = ["GET", "POST", "PUT", "DELETE", "PATCH"];

    return (
        <DashboardLayout>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerContent}>
                        <div className={styles.titleSection}>
                            <div className={styles.iconWrapper}>
                                <BookOpen size={24} />
                            </div>
                            <div>
                                <h1 className={styles.title}>Documentação da API</h1>
                                <p className={styles.subtitle}>
                                    Documentação completa da API REST do Grex Finances
                                </p>
                            </div>
                        </div>

                        <div className={styles.headerActions}>
                            <button
                                className={styles.downloadButton}
                                onClick={() => toast.showInfo("Download da documentação em PDF será implementado em breve!")}
                            >
                                <Download size={16} />
                                Download PDF
                            </button>
                        </div>
                    </div>
                </div>

                {/* API Info */}
                <div className={styles.apiInfoSection}>
                    <div className={styles.apiInfoCard}>
                        <div className={styles.apiInfoHeader}>
                            <h2 className={styles.apiInfoTitle}>Informações da API</h2>
                            <div className={styles.apiStatus}>
                                <div className={styles.statusIndicator} />
                                <span>API Online</span>
                            </div>
                        </div>

                        <div className={styles.apiInfoGrid}>
                            <div className={styles.apiInfoItem}>
                                <Globe size={20} />
                                <div>
                                    <span className={styles.apiInfoLabel}>Base URL</span>
                                    <span className={styles.apiInfoValue}>{baseUrl}</span>
                                </div>
                            </div>

                            <div className={styles.apiInfoItem}>
                                <Key size={20} />
                                <div>
                                    <span className={styles.apiInfoLabel}>Autenticação</span>
                                    <span className={styles.apiInfoValue}>Bearer Token</span>
                                </div>
                            </div>

                            <div className={styles.apiInfoItem}>
                                <Zap size={20} />
                                <div>
                                    <span className={styles.apiInfoLabel}>Rate Limit</span>
                                    <span className={styles.apiInfoValue}>1000 req/hora</span>
                                </div>
                            </div>

                            <div className={styles.apiInfoItem}>
                                <Database size={20} />
                                <div>
                                    <span className={styles.apiInfoLabel}>Formato</span>
                                    <span className={styles.apiInfoValue}>JSON</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* API Key Setup */}
                <div className={styles.apiKeySection}>
                    <div className={styles.apiKeyCard}>
                        <h3 className={styles.apiKeyTitle}>Configurar API Key</h3>
                        <p className={styles.apiKeyDescription}>
                            Insira sua chave de API para testar os endpoints diretamente na documentação
                        </p>

                        <div className={styles.apiKeyInput}>
                            <input
                                type="password"
                                placeholder="Insira sua API Key..."
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                className={styles.apiKeyField}
                            />
                            <button
                                className={styles.copyKeyButton}
                                onClick={() => copyToClipboard(apiKey)}
                                disabled={!apiKey}
                            >
                                <Copy size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className={styles.filtersSection}>
                    <div className={styles.filtersHeader}>
                        <div className={styles.searchBox}>
                            <Search size={16} />
                            <input
                                type="text"
                                placeholder="Buscar endpoints..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={styles.searchInput}
                            />
                        </div>

                        <div className={styles.filterControls}>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className={styles.filterSelect}
                            >
                                <option value="all">Todas as categorias</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>

                            <select
                                value={selectedMethod}
                                onChange={(e) => setSelectedMethod(e.target.value)}
                                className={styles.filterSelect}
                            >
                                <option value="all">Todos os métodos</option>
                                {methods.map(method => (
                                    <option key={method} value={method}>{method}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Endpoints List */}
                <div className={styles.endpointsSection}>
                    <h2 className={styles.endpointsTitle}>
                        Endpoints ({filteredEndpoints.length})
                    </h2>

                    <div className={styles.endpointsList}>
                        {filteredEndpoints.map((endpoint) => (
                            <div key={endpoint.id} className={styles.endpointCard}>
                                <div className={styles.endpointHeader}>
                                    <div className={styles.endpointMethod}>
                                        <span
                                            className={styles.methodBadge}
                                            style={{ backgroundColor: getMethodColor(endpoint.method) }}
                                        >
                                            {endpoint.method}
                                        </span>
                                    </div>

                                    <div className={styles.endpointInfo}>
                                        <h3 className={styles.endpointPath}>{endpoint.path}</h3>
                                        <p className={styles.endpointSummary}>{endpoint.summary}</p>
                                        <div className={styles.endpointMeta}>
                                            <span className={styles.endpointCategory}>{endpoint.category}</span>
                                            {endpoint.requiresAuth && (
                                                <span className={styles.authRequired}>
                                                    <Key size={12} />
                                                    Requer autenticação
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        className={styles.viewDetailsButton}
                                        onClick={() => setSelectedEndpoint(endpoint)}
                                    >
                                        <ExternalLink size={16} />
                                        Ver detalhes
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredEndpoints.length === 0 && (
                        <div className={styles.emptyState}>
                            <BookOpen size={48} />
                            <h3>Nenhum endpoint encontrado</h3>
                            <p>Não há endpoints que correspondam aos filtros aplicados.</p>
                        </div>
                    )}
                </div>

                {/* Endpoint Detail Modal */}
                {selectedEndpoint && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalContent}>
                            <div className={styles.modalHeader}>
                                <div className={styles.modalTitleSection}>
                                    <span
                                        className={styles.modalMethodBadge}
                                        style={{ backgroundColor: getMethodColor(selectedEndpoint.method) }}
                                    >
                                        {selectedEndpoint.method}
                                    </span>
                                    <h2 className={styles.modalTitle}>{selectedEndpoint.path}</h2>
                                </div>
                                <button
                                    className={styles.closeButton}
                                    onClick={() => setSelectedEndpoint(null)}
                                >
                                    ×
                                </button>
                            </div>

                            <div className={styles.modalBody}>
                                <div className={styles.endpointDescription}>
                                    <h3>Descrição</h3>
                                    <p>{selectedEndpoint.description}</p>
                                </div>

                                {selectedEndpoint.parameters && selectedEndpoint.parameters.length > 0 && (
                                    <div className={styles.parametersSection}>
                                        <h3>Parâmetros</h3>
                                        <div className={styles.parametersTable}>
                                            <div className={styles.parametersHeader}>
                                                <span>Nome</span>
                                                <span>Tipo</span>
                                                <span>Obrigatório</span>
                                                <span>Descrição</span>
                                            </div>
                                            {selectedEndpoint.parameters.map((param, index) => (
                                                <div key={index} className={styles.parameterRow}>
                                                    <span className={styles.paramName}>{param.name}</span>
                                                    <span className={styles.paramType}>{param.type}</span>
                                                    <span className={styles.paramRequired}>
                                                        {param.required ? "Sim" : "Não"}
                                                    </span>
                                                    <span className={styles.paramDescription}>{param.description}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedEndpoint.requestBody && (
                                    <div className={styles.requestBodySection}>
                                        <h3>Corpo da Requisição</h3>
                                        <div className={styles.codeBlock}>
                                            <button
                                                className={styles.copyCodeButton}
                                                onClick={() => copyToClipboard(JSON.stringify(selectedEndpoint.requestBody, null, 2))}
                                            >
                                                <Copy size={16} />
                                            </button>
                                            <pre>
                                                {JSON.stringify(selectedEndpoint.requestBody, null, 2)}
                                            </pre>
                                        </div>
                                    </div>
                                )}

                                <div className={styles.responsesSection}>
                                    <h3>Respostas</h3>
                                    <div className={styles.responsesList}>
                                        {selectedEndpoint.responses.map((response, index) => (
                                            <div key={index} className={styles.responseItem}>
                                                <span className={styles.responseStatus}>{response.status}</span>
                                                <span className={styles.responseDescription}>{response.description}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className={styles.examplesSection}>
                                    <h3>Exemplos</h3>
                                    {selectedEndpoint.examples.map((example, index) => (
                                        <div key={index} className={styles.exampleCard}>
                                            <h4>{example.title}</h4>

                                            <div className={styles.exampleRequest}>
                                                <h5>Requisição (cURL)</h5>
                                                <div className={styles.codeBlock}>
                                                    <button
                                                        className={styles.copyCodeButton}
                                                        onClick={() => copyToClipboard(generateCurlCommand(selectedEndpoint))}
                                                    >
                                                        <Copy size={16} />
                                                    </button>
                                                    <pre>
                                                        {generateCurlCommand(selectedEndpoint)}
                                                    </pre>
                                                </div>
                                            </div>

                                            {example.response && (
                                                <div className={styles.exampleResponse}>
                                                    <h5>Resposta</h5>
                                                    <div className={styles.codeBlock}>
                                                        <button
                                                            className={styles.copyCodeButton}
                                                            onClick={() => copyToClipboard(JSON.stringify(example.response, null, 2))}
                                                        >
                                                            <Copy size={16} />
                                                        </button>
                                                        <pre>
                                                            {JSON.stringify(example.response, null, 2)}
                                                        </pre>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
