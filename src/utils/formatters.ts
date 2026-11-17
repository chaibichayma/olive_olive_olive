
/**
 * Formate une date YYYY-MM-DD en DD/MM/YYYY.
 */
export const formatDate = (date: string | null | undefined): string => {
  if (!date) return "—";

  const parts = date.split("-");

  if (parts.length !== 3) return date;

  const [year, month, day] = parts;

  return `${day}/${month}/${year}`;
};

/**
 * Formate un nombre selon les conventions françaises.
 */
export const formatNumber = (
  value: number | null | undefined,
  decimals?: number
): string => {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return "—";
  }

  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: decimals ?? 0,
    maximumFractionDigits: decimals ?? 2,
  }).format(value);
};

/**
 * Formate une capacité en litres.
 */
export const formatCapacity = (
  capacity: number | null | undefined
): string => {
  if (capacity === null || capacity === undefined) return "—";

  return `${formatNumber(capacity)} L`;
};

/**
 * Formate un prix avec trois chiffres après la virgule.
 */
export const formatPrice = (
  price: number | null | undefined,
  currency = ""
): string => {
  if (price === null || price === undefined) return "—";

  const formatted = formatNumber(price, 3);

  return currency ? `${formatted} ${currency}` : formatted;
};
