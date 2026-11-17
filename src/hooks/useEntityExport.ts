
import { useCallback } from "react";

import {
  exportToCSV,
  type CSVColumn,
} from "../utils";

interface UseEntityExportOptions<T> {
  filename: string;
  columns: CSVColumn<T>[];
}

export function useEntityExport<T>({
  filename,
  columns,
}: UseEntityExportOptions<T>) {
  const exportData = useCallback(
    (data: T[]) => {
      exportToCSV({
        filename,
        data,
        columns,
      });
    },
    [filename, columns]
  );

  return {
    exportData,
  };
}
