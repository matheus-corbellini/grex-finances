export function formatCurrency(
  value: number,
  locale = "pt-BR",
  currency = "BRL"
) {
  return value.toLocaleString(locale, {
    style: "currency",
    currency,
  });
}
