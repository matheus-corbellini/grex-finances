/**
 * Utilitários para cálculos financeiros
 */

export interface CompoundInterestParams {
  principal: number;
  rate: number; // Taxa anual em porcentagem
  time: number; // Tempo em anos
  compoundingFrequency?: number; // Frequência de capitalização por ano (padrão: 12)
}

export interface LoanCalculationParams {
  principal: number;
  rate: number; // Taxa anual em porcentagem
  term: number; // Prazo em anos
}

export interface InvestmentReturn {
  finalAmount: number;
  totalReturn: number;
  totalReturnPercentage: number;
  annualizedReturn: number;
}

/**
 * Calcula juros compostos
 */
export const calculateCompoundInterest = (
  params: CompoundInterestParams
): InvestmentReturn => {
  const { principal, rate, time, compoundingFrequency = 12 } = params;

  const rateDecimal = rate / 100;
  const compoundedAmount =
    principal *
    Math.pow(
      1 + rateDecimal / compoundingFrequency,
      compoundingFrequency * time
    );

  const totalReturn = compoundedAmount - principal;
  const totalReturnPercentage = (totalReturn / principal) * 100;
  const annualizedReturn = Math.pow(compoundedAmount / principal, 1 / time) - 1;

  return {
    finalAmount: compoundedAmount,
    totalReturn,
    totalReturnPercentage,
    annualizedReturn: annualizedReturn * 100,
  };
};

/**
 * Calcula prestação de empréstimo usando Sistema Price (SAC)
 */
export const calculateLoanPayment = (params: LoanCalculationParams): number => {
  const { principal, rate, term } = params;

  const monthlyRate = rate / 100 / 12;
  const numberOfPayments = term * 12;

  if (monthlyRate === 0) {
    return principal / numberOfPayments;
  }

  const payment =
    (principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  return payment;
};

/**
 * Calcula o valor futuro de uma anuidade
 */
export const calculateAnnuityFutureValue = (
  payment: number,
  rate: number,
  periods: number
): number => {
  const rateDecimal = rate / 100;

  if (rateDecimal === 0) {
    return payment * periods;
  }

  return payment * ((Math.pow(1 + rateDecimal, periods) - 1) / rateDecimal);
};

/**
 * Calcula o valor presente de uma anuidade
 */
export const calculateAnnuityPresentValue = (
  payment: number,
  rate: number,
  periods: number
): number => {
  const rateDecimal = rate / 100;

  if (rateDecimal === 0) {
    return payment * periods;
  }

  return payment * ((1 - Math.pow(1 + rateDecimal, -periods)) / rateDecimal);
};

/**
 * Calcula a taxa interna de retorno (TIR/IRR)
 */
export const calculateIRR = (
  cashFlows: number[],
  guess: number = 0.1
): number => {
  const maxIterations = 1000;
  const tolerance = 1e-6;

  let rate = guess;

  for (let i = 0; i < maxIterations; i++) {
    let npv = 0;
    let dnpv = 0;

    for (let j = 0; j < cashFlows.length; j++) {
      npv += cashFlows[j] / Math.pow(1 + rate, j);
      dnpv -= (j * cashFlows[j]) / Math.pow(1 + rate, j + 1);
    }

    const newRate = rate - npv / dnpv;

    if (Math.abs(newRate - rate) < tolerance) {
      return newRate * 100;
    }

    rate = newRate;
  }

  return NaN; // Convergência não encontrada
};

/**
 * Calcula o valor presente líquido (VPL/NPV)
 */
export const calculateNPV = (
  cashFlows: number[],
  discountRate: number
): number => {
  const rate = discountRate / 100;

  return cashFlows.reduce((npv, cashFlow, index) => {
    return npv + cashFlow / Math.pow(1 + rate, index);
  }, 0);
};

/**
 * Calcula retorno anualizado
 */
export const calculateAnnualizedReturn = (
  startValue: number,
  endValue: number,
  years: number
): number => {
  return (Math.pow(endValue / startValue, 1 / years) - 1) * 100;
};

/**
 * Calcula volatilidade (desvio padrão)
 */
export const calculateVolatility = (returns: number[]): number => {
  const mean = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
  const variance =
    returns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) /
    returns.length;
  return Math.sqrt(variance);
};

/**
 * Calcula Sharpe Ratio
 */
export const calculateSharpeRatio = (
  portfolioReturn: number,
  riskFreeRate: number,
  volatility: number
): number => {
  return (portfolioReturn - riskFreeRate) / volatility;
};

/**
 * Calcula valor necessário para meta de aposentadoria
 */
export const calculateRetirementGoal = (
  currentAge: number,
  retirementAge: number,
  monthlyExpenses: number,
  inflationRate: number = 3,
  withdrawalRate: number = 4
): number => {
  const yearsToRetirement = retirementAge - currentAge;
  const futureMonthlyExpenses =
    monthlyExpenses * Math.pow(1 + inflationRate / 100, yearsToRetirement);
  const annualExpenses = futureMonthlyExpenses * 12;

  return annualExpenses / (withdrawalRate / 100);
};

/**
 * Calcula economia mensal necessária para atingir uma meta
 */
export const calculateMonthlySavingsForGoal = (
  targetAmount: number,
  years: number,
  annualReturn: number = 7
): number => {
  const monthlyRate = annualReturn / 100 / 12;
  const numberOfPayments = years * 12;

  if (monthlyRate === 0) {
    return targetAmount / numberOfPayments;
  }

  return (
    (targetAmount * monthlyRate) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
  );
};
