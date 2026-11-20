
interface DateTimeDisplayProps {
  value?: string | null;
  showTime?: boolean;
}

export default function DateTimeDisplay({
  value,
  showTime = false,
}: DateTimeDisplayProps) {
  if (!value) {
    return (
      <span className="text-[#9AA49D] dark:text-[#829287]">
        —
      </span>
    );
  }

  const date = new Date(value);

  if (isNaN(date.getTime())) {
    return (
      <span className="text-[#9AA49D] dark:text-[#829287]">
        —
      </span>
    );
  }

  const formattedDate = new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...(showTime && {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }).format(date);

  return (
    <span className="whitespace-nowrap text-[#38453D] dark:text-[#D4E0D7]">
      {formattedDate}
    </span>
  );
}
