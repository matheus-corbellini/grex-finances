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
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value)
    }

    const formatYAxis = (value: number) => {
        return `${(value / 1000).toFixed(1)}k`
    }

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
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id={`gradient-${bankName}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.8} />
                                <stop offset="50%" stopColor="#93c5fd" stopOpacity={0.4} />
                                <stop offset="100%" stopColor="#dbeafe" stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="0" stroke="#f3f4f6" vertical={false} />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 11 }} dy={10} />
                        <YAxis
                            domain={yAxisDomain}
                            ticks={yAxisTicks}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#9ca3af", fontSize: 11 }}
                            tickFormatter={formatYAxis}
                            dx={-5}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#60a5fa"
                            strokeWidth={2}
                            fill={`url(#gradient-${bankName})`}
                            dot={(props: any) => {
                                const { cx, cy, index } = props
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
            </div>
        </div>
    )
}