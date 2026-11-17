
export interface CSVColumn<T> {
  header: string;
  value: (item: T) => string | number | null | undefined;
}

interface ExportToCSVOptions<T> {
  filename: string;
  columns: CSVColumn<T>[];
  data: T[];
  separator?: string;
}

/**
 * Échappe les valeurs CSV pour éviter les problèmes
 * avec les guillemets, séparateurs et retours à la ligne.
 */
const escapeCSVValue = (
  value: string | number | null | undefined,
  separator: string
): string => {
  const text = value === null || value === undefined
    ? ""
    : String(value);

  if (
    text.includes('"') ||
    text.includes(separator) ||
    text.includes("\n") ||
    text.includes("\r")
  ) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
};

/**
 * Exporte une liste de données au format CSV.
 */
export function exportToCSV<T>({
  filename,
  columns,
  data,
  separator = ";",
}: ExportToCSVOptions<T>): void {
  const headers = columns
    .map((column) => escapeCSVValue(column.header, separator))
    .join(separator);

  const rows = data.map((item) =>
    columns
      .map((column) =>
        escapeCSVValue(column.value(item), separator)
      )
      .join(separator)
  );

  const csvContent = [headers, ...rows].join("\r\n");

  // BOM UTF-8 pour conserver les accents dans Excel
  const blob = new Blob(["\uFEFF", csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename.toLowerCase().endsWith(".csv")
    ? filename
    : `${filename}.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
