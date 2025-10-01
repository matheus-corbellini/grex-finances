"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Dot } from "recharts"
import { FileText } from "lucide-react"
import { Icon } from "./Icon"
import styles from "./BankAccountCard.module.css"

interface BankAccountCardProps {
    bankName: string
    accountType: string
    balance: number
    logo: string
    actionLabel: string
    highlighted?: boolean
    chartData: Array<{ date: string; value: number }>
    yAxisDomain: [number, number]
    yAxisTicks: number[]
    onViewDetails?: () => void
}

export function BankAccountCard({
    bankName,
    accountType,
    balance,
    logo,
    actionLabel,
    highlighted = false,
    chartData,
    yAxisDomain,
    yAxisTicks,
    onViewDetails,
}: BankAccountCardProps) {
    // Criar ID único e seguro para o gradiente
    const gradientId = `gradient-${bankName.replace(/[^a-zA-Z0-9]/g, '')}-${balance}`.toLowerCase();

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value)
    }

    const formatYAxis = (value: number) => {
        // Formatação inteligente baseada na magnitude do valor
        if (value >= 1000000) {
            // Milhões: 20.0M, 1.5M, etc.
            return `${(value / 1000000).toFixed(1)}M`
        } else if (value >= 1000) {
            // Milhares: 20.0k, 1.5k, etc.
            return `${(value / 1000).toFixed(1)}k`
        } else {
            // Valores menores que 1000: mostrar inteiro
            return value.toFixed(0)
        }
    }

    // Debug: log dados do gráfico (removido para produção)
    // console.log(`BankAccountCard - ${bankName}:`, {
    //     chartDataLength: chartData.length,
    //     yAxisDomain,
    //     yAxisTicks,
    //     sampleData: chartData.slice(0, 3)
    // });

    return (
        <div className={`${styles.card} ${highlighted ? styles.highlighted : ''}`}>
            {/* Header - Layout horizontal como na imagem */}
            <div className={styles.header}>
                <div className={styles.bankLogo}>
                    <Icon name={logo || "bank"} size={24} />
                </div>
                <div className={styles.bankInfo}>
                    <div className={styles.bankName}>{bankName} ({accountType})</div>
                    <div className={styles.balanceValue}>{formatCurrency(balance)}</div>
                </div>
                <div className={styles.actions}>
                    <button
                        className={styles.actionButton}
                        onClick={onViewDetails}
                    >
                        <FileText className="h-4 w-4" />
                        {actionLabel}
                    </button>
                    <button className={styles.conciliarButton}>
                        Conciliar
                    </button>
                    <button className={styles.moreButton}>
                        ⋯
                    </button>
                </div>
            </div>

            {/* Chart */}
            <div className={styles.chart}>
                {chartData && chartData.length >= 2 && chartData.every(d => d.value !== undefined && d.date !== undefined) ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 40, bottom: 0 }}>
                            <defs>
                                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.8} />
                                    <stop offset="50%" stopColor="#93c5fd" stopOpacity={0.4} />
                                    <stop offset="100%" stopColor="#dbeafe" stopOpacity={0.1} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="0" stroke="#f3f4f6" vertical={false} />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 11 }} dy={10} />
                            <YAxis
                                domain={yAxisDomain && yAxisDomain.length === 2 && yAxisDomain[0] !== yAxisDomain[1] ? yAxisDomain : [0, 'dataMax']}
                                tickCount={5}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#9ca3af", fontSize: 11 }}
                                tickFormatter={formatYAxis}
                                width={35}
                            />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#60a5fa"
                                strokeWidth={2}
                                fill={`url(#${gradientId})`}
                                dot={(props: any) => {
                                    const { cx, cy, index } = props

                                    // Se há apenas um ponto, mostrar o ponto
                                    if (chartData.length === 1) {
                                        return <Dot key={`dot-${index}`} cx={cx} cy={cy} r={4} fill="#60a5fa" stroke="#fff" strokeWidth={2} />
                                    }

                                    // Show dots on peaks and valleys
                                    if (index === 0 || index === chartData.length - 1) {
                                        return <Dot key={`dot-${index}`} cx={cx} cy={cy} r={4} fill="#60a5fa" stroke="#fff" strokeWidth={2} />
                                    }
                                    const prev = chartData[index - 1]?.value || 0
                                    const curr = chartData[index]?.value || 0
                                    const next = chartData[index + 1]?.value || 0

                                    // Peak or valley
                                    if ((curr > prev && curr > next) || (curr < prev && curr < next)) {
                                        return <Dot key={`dot-${index}`} cx={cx} cy={cy} r={4} fill="#60a5fa" stroke="#fff" strokeWidth={2} />
                                    }
                                    return null
                                }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        color: '#9ca3af',
                        fontSize: '12px'
                    }}>
                        Sem dados para exibir
                    </div>
                )}
            </div>
        </div>
    )
}