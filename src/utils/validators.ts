/**
 * Utilitários para validação de dados financeiros
 */

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export const validateEmail = (email: string): ValidationResult => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    return { isValid: false, message: "Email é obrigatório" };
  }

  if (!emailRegex.test(email)) {
    return { isValid: false, message: "Email inválido" };
  }

  return { isValid: true };
};

export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, message: "Senha é obrigatória" };
  }

  if (password.length < 8) {
    return {
      isValid: false,
      message: "Senha deve ter pelo menos 8 caracteres",
    };
  }

  if (!/(?=.*[a-z])/.test(password)) {
    return {
      isValid: false,
      message: "Senha deve conter pelo menos uma letra minúscula",
    };
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    return {
      isValid: false,
      message: "Senha deve conter pelo menos uma letra maiúscula",
    };
  }

  if (!/(?=.*\d)/.test(password)) {
    return {
      isValid: false,
      message: "Senha deve conter pelo menos um número",
    };
  }

  return { isValid: true };
};

export const validateAmount = (amount: number | string): ValidationResult => {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(numAmount)) {
    return { isValid: false, message: "Valor deve ser um número válido" };
  }

  if (numAmount < 0) {
    return { isValid: false, message: "Valor não pode ser negativo" };
  }

  if (numAmount === 0) {
    return { isValid: false, message: "Valor deve ser maior que zero" };
  }

  return { isValid: true };
};

export const validatePositiveAmount = (
  amount: number | string
): ValidationResult => {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(numAmount)) {
    return { isValid: false, message: "Valor deve ser um número válido" };
  }

  if (numAmount <= 0) {
    return { isValid: false, message: "Valor deve ser maior que zero" };
  }

  return { isValid: true };
};

export const validatePercentage = (
  percentage: number | string
): ValidationResult => {
  const numPercentage =
    typeof percentage === "string" ? parseFloat(percentage) : percentage;

  if (isNaN(numPercentage)) {
    return { isValid: false, message: "Porcentagem deve ser um número válido" };
  }

  if (numPercentage < 0 || numPercentage > 100) {
    return { isValid: false, message: "Porcentagem deve estar entre 0 e 100" };
  }

  return { isValid: true };
};

export const validateDate = (date: Date | string): ValidationResult => {
  let dateObj: Date;

  if (typeof date === "string") {
    dateObj = new Date(date);
  } else {
    dateObj = date;
  }

  if (isNaN(dateObj.getTime())) {
    return { isValid: false, message: "Data inválida" };
  }

  return { isValid: true };
};

export const validateFutureDate = (date: Date | string): ValidationResult => {
  const dateValidation = validateDate(date);
  if (!dateValidation.isValid) {
    return dateValidation;
  }

  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();

  if (dateObj <= now) {
    return { isValid: false, message: "Data deve ser no futuro" };
  }

  return { isValid: true };
};

export const validatePastDate = (date: Date | string): ValidationResult => {
  const dateValidation = validateDate(date);
  if (!dateValidation.isValid) {
    return dateValidation;
  }

  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();

  if (dateObj >= now) {
    return { isValid: false, message: "Data deve ser no passado" };
  }

  return { isValid: true };
};

export const validateAccountNumber = (
  accountNumber: string
): ValidationResult => {
  if (!accountNumber) {
    return { isValid: false, message: "Número da conta é obrigatório" };
  }

  // Remove espaços e hífens
  const cleaned = accountNumber.replace(/[\s-]/g, "");

  if (!/^\d+$/.test(cleaned)) {
    return {
      isValid: false,
      message: "Número da conta deve conter apenas números",
    };
  }

  if (cleaned.length < 4 || cleaned.length > 20) {
    return {
      isValid: false,
      message: "Número da conta deve ter entre 4 e 20 dígitos",
    };
  }

  return { isValid: true };
};

export const validateCPF = (cpf: string): ValidationResult => {
  if (!cpf) {
    return { isValid: false, message: "CPF é obrigatório" };
  }

  // Remove caracteres não numéricos
  const cleaned = cpf.replace(/\D/g, "");

  if (cleaned.length !== 11) {
    return { isValid: false, message: "CPF deve ter 11 dígitos" };
  }

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleaned)) {
    return { isValid: false, message: "CPF inválido" };
  }

  // Validação dos dígitos verificadores
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i);
  }

  let digit1 = 11 - (sum % 11);
  if (digit1 > 9) digit1 = 0;

  if (parseInt(cleaned.charAt(9)) !== digit1) {
    return { isValid: false, message: "CPF inválido" };
  }

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i);
  }

  let digit2 = 11 - (sum % 11);
  if (digit2 > 9) digit2 = 0;

  if (parseInt(cleaned.charAt(10)) !== digit2) {
    return { isValid: false, message: "CPF inválido" };
  }

  return { isValid: true };
};

export const validatePhone = (phone: string): ValidationResult => {
  if (!phone) {
    return { isValid: false, message: "Telefone é obrigatório" };
  }

  // Remove caracteres não numéricos
  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.length < 10 || cleaned.length > 11) {
    return { isValid: false, message: "Telefone deve ter 10 ou 11 dígitos" };
  }

  return { isValid: true };
};

export const validateRequired = (
  value: any,
  fieldName: string
): ValidationResult => {
  if (value === null || value === undefined || value === "") {
    return { isValid: false, message: `${fieldName} é obrigatório` };
  }

  return { isValid: true };
};

export const validateMinLength = (
  value: string,
  minLength: number,
  fieldName: string
): ValidationResult => {
  if (!value || value.length < minLength) {
    return {
      isValid: false,
      message: `${fieldName} deve ter pelo menos ${minLength} caracteres`,
    };
  }

  return { isValid: true };
};

export const validateMaxLength = (
  value: string,
  maxLength: number,
  fieldName: string
): ValidationResult => {
  if (value && value.length > maxLength) {
    return {
      isValid: false,
      message: `${fieldName} deve ter no máximo ${maxLength} caracteres`,
    };
  }

  return { isValid: true };
};
