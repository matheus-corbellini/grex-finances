"use client";

import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Switch } from "../ui/Switch";
import {
    AlertTriangle,
    DollarSign,
    Calendar,
    Users,
    Clock,
    Bell,
    Mail,
    Smartphone,
    MessageSquare,
    Plus,
    Trash2,
    Save
} from "lucide-react";
import styles from "./AlertSettingsModal.module.css";

interface AlertRule {
    id: string;
    name: string;
    type: "financial" | "events" | "users" | "system";
    condition: string;
    threshold: number;
    enabled: boolean;
    channels: {
        email: boolean;
        push: boolean;
        sms: boolean;
    };
    frequency: "immediate" | "daily" | "weekly";
}

interface AlertSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (rules: AlertRule[]) => Promise<void>;
    initialRules?: AlertRule[];
}

const defaultRules: AlertRule[] = [
    {
        id: "1",
        name: "Saldo Baixo",
        type: "financial",
        condition: "below",
        threshold: 1000,
        enabled: true,
        channels: {
            email: true,
            push: true,
            sms: true,
        },
        frequency: "immediate",
    },
    {
        id: "2",
        name: "Gasto Alto",
        type: "financial",
        condition: "above",
        threshold: 5000,
        enabled: true,
        channels: {
            email: true,
            push: false,
            sms: false,
        },
        frequency: "daily",
    },
    {
        id: "3",
        name: "Evento Próximo",
        type: "events",
        condition: "days_before",
        threshold: 1,
        enabled: true,
        channels: {
            email: true,
            push: true,
            sms: false,
        },
        frequency: "immediate",
    },
];

export const AlertSettingsModal: React.FC<AlertSettingsModalProps> = ({
    isOpen,
    onClose,
    onSave,
    initialRules = defaultRules,
}) => {
    const [rules, setRules] = useState<AlertRule[]>(initialRules);
    const [isSaving, setIsSaving] = useState(false);
    const [editingRule, setEditingRule] = useState<AlertRule | null>(null);
    const [isAddingNew, setIsAddingNew] = useState(false);

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "financial": return <DollarSign size={20} />;
            case "events": return <Calendar size={20} />;
            case "users": return <Users size={20} />;
            case "system": return <AlertTriangle size={20} />;
            default: return <Bell size={20} />;
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case "financial": return "Financeiro";
            case "events": return "Eventos";
            case "users": return "Usuários";
            case "system": return "Sistema";
            default: return "Outros";
        }
    };

    const getConditionLabel = (condition: string) => {
        switch (condition) {
            case "below": return "Abaixo de";
            case "above": return "Acima de";
            case "equals": return "Igual a";
            case "days_before": return "Dias antes";
            case "days_after": return "Dias depois";
            default: return condition;
        }
    };

    const getFrequencyLabel = (frequency: string) => {
        switch (frequency) {
            case "immediate": return "Imediato";
            case "daily": return "Diário";
            case "weekly": return "Semanal";
            default: return frequency;
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave(rules);
            onClose();
        } catch (error) {
            console.error("Erro ao salvar alertas:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddRule = () => {
        const newRule: AlertRule = {
            id: Date.now().toString(),
            name: "",
            type: "financial",
            condition: "below",
            threshold: 0,
            enabled: true,
            channels: {
                email: true,
                push: false,
                sms: false,
            },
            frequency: "immediate",
        };
        setRules(prev => [...prev, newRule]);
        setEditingRule(newRule);
        setIsAddingNew(true);
    };

    const handleEditRule = (rule: AlertRule) => {
        setEditingRule(rule);
        setIsAddingNew(false);
    };

    const handleUpdateRule = (updatedRule: AlertRule) => {
        setRules(prev =>
            prev.map(rule => (rule.id === updatedRule.id ? updatedRule : rule))
        );
        setEditingRule(null);
        setIsAddingNew(false);
    };

    const handleDeleteRule = (ruleId: string) => {
        if (confirm("Tem certeza que deseja excluir este alerta?")) {
            setRules(prev => prev.filter(rule => rule.id !== ruleId));
        }
    };

    const handleToggleRule = (ruleId: string) => {
        setRules(prev =>
            prev.map(rule =>
                rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
            )
        );
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Configuração de Alertas">
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.headerInfo}>
                        <AlertTriangle size={24} />
                        <div>
                            <h3>Regras de Alerta</h3>
                            <p>Configure quando e como receber alertas importantes</p>
                        </div>
                    </div>
                    <Button
                        variant="primary"
                        onClick={handleAddRule}
                        icon={<Plus size={16} />}
                    >
                        Novo Alerta
                    </Button>
                </div>

                <div className={styles.rulesList}>
                    {rules.length === 0 ? (
                        <div className={styles.emptyState}>
                            <Bell size={48} />
                            <h3>Nenhum alerta configurado</h3>
                            <p>Adicione regras para receber notificações importantes</p>
                        </div>
                    ) : (
                        rules.map(rule => (
                            <div key={rule.id} className={styles.ruleCard}>
                                <div className={styles.ruleHeader}>
                                    <div className={styles.ruleInfo}>
                                        <div className={styles.ruleIcon}>
                                            {getTypeIcon(rule.type)}
                                        </div>
                                        <div className={styles.ruleDetails}>
                                            <h4>{rule.name}</h4>
                                            <p>
                                                {getTypeLabel(rule.type)} • {getConditionLabel(rule.condition)} {rule.threshold}
                                                {rule.type === "financial" ? " R$" : rule.type === "events" ? " dias" : ""}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={styles.ruleActions}>
                                        <Switch
                                            checked={rule.enabled}
                                            onChange={() => handleToggleRule(rule.id)}
                                        />
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEditRule(rule)}
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDeleteRule(rule.id)}
                                            icon={<Trash2 size={16} />}
                                        />
                                    </div>
                                </div>

                                <div className={styles.ruleChannels}>
                                    <div className={styles.channelItem}>
                                        <Mail size={16} />
                                        <span>Email</span>
                                        <div className={styles.channelStatus}>
                                            {rule.channels.email ? "✓" : "✗"}
                                        </div>
                                    </div>
                                    <div className={styles.channelItem}>
                                        <Smartphone size={16} />
                                        <span>Push</span>
                                        <div className={styles.channelStatus}>
                                            {rule.channels.push ? "✓" : "✗"}
                                        </div>
                                    </div>
                                    <div className={styles.channelItem}>
                                        <MessageSquare size={16} />
                                        <span>SMS</span>
                                        <div className={styles.channelStatus}>
                                            {rule.channels.sms ? "✓" : "✗"}
                                        </div>
                                    </div>
                                    <div className={styles.frequencyBadge}>
                                        <Clock size={14} />
                                        <span>{getFrequencyLabel(rule.frequency)}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {editingRule && (
                    <div className={styles.editForm}>
                        <h4>{isAddingNew ? "Novo Alerta" : "Editar Alerta"}</h4>
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label>Nome do Alerta</label>
                                <Input
                                    value={editingRule.name}
                                    onChange={(e) =>
                                        setEditingRule({ ...editingRule, name: e.target.value })
                                    }
                                    placeholder="Ex: Saldo Baixo"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Tipo</label>
                                <select
                                    value={editingRule.type}
                                    onChange={(e) =>
                                        setEditingRule({ ...editingRule, type: e.target.value as any })
                                    }
                                    className={styles.select}
                                >
                                    <option value="financial">Financeiro</option>
                                    <option value="events">Eventos</option>
                                    <option value="users">Usuários</option>
                                    <option value="system">Sistema</option>
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Condição</label>
                                <select
                                    value={editingRule.condition}
                                    onChange={(e) =>
                                        setEditingRule({ ...editingRule, condition: e.target.value })
                                    }
                                    className={styles.select}
                                >
                                    <option value="below">Abaixo de</option>
                                    <option value="above">Acima de</option>
                                    <option value="equals">Igual a</option>
                                    <option value="days_before">Dias antes</option>
                                    <option value="days_after">Dias depois</option>
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Valor</label>
                                <Input
                                    type="number"
                                    value={editingRule.threshold}
                                    onChange={(e) =>
                                        setEditingRule({ ...editingRule, threshold: Number(e.target.value) })
                                    }
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Frequência</label>
                                <select
                                    value={editingRule.frequency}
                                    onChange={(e) =>
                                        setEditingRule({ ...editingRule, frequency: e.target.value as any })
                                    }
                                    className={styles.select}
                                >
                                    <option value="immediate">Imediato</option>
                                    <option value="daily">Diário</option>
                                    <option value="weekly">Semanal</option>
                                </select>
                            </div>
                        </div>

                        <div className={styles.channelsSection}>
                            <label>Canais de Notificação</label>
                            <div className={styles.channelsGrid}>
                                <label className={styles.channelOption}>
                                    <Switch
                                        checked={editingRule.channels.email}
                                        onChange={(checked) =>
                                            setEditingRule({
                                                ...editingRule,
                                                channels: { ...editingRule.channels, email: checked },
                                            })
                                        }
                                    />
                                    <Mail size={16} />
                                    <span>Email</span>
                                </label>
                                <label className={styles.channelOption}>
                                    <Switch
                                        checked={editingRule.channels.push}
                                        onChange={(checked) =>
                                            setEditingRule({
                                                ...editingRule,
                                                channels: { ...editingRule.channels, push: checked },
                                            })
                                        }
                                    />
                                    <Smartphone size={16} />
                                    <span>Push</span>
                                </label>
                                <label className={styles.channelOption}>
                                    <Switch
                                        checked={editingRule.channels.sms}
                                        onChange={(checked) =>
                                            setEditingRule({
                                                ...editingRule,
                                                channels: { ...editingRule.channels, sms: checked },
                                            })
                                        }
                                    />
                                    <MessageSquare size={16} />
                                    <span>SMS</span>
                                </label>
                            </div>
                        </div>

                        <div className={styles.formActions}>
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    setEditingRule(null);
                                    setIsAddingNew(false);
                                }}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="primary"
                                onClick={() => handleUpdateRule(editingRule)}
                            >
                                Salvar Alerta
                            </Button>
                        </div>
                    </div>
                )}

                <div className={styles.footer}>
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        disabled={isSaving}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSave}
                        disabled={isSaving || editingRule !== null}
                        loading={isSaving}
                        icon={<Save size={16} />}
                    >
                        Salvar Configurações
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
