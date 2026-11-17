
import type { ReactNode } from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import RowActions from "./RowActions";

export interface ContactCardDetail {
  icon: ReactNode;
  value: string;
}

interface ContactCardsProps<T> {
  data: T[];
  getKey: (item: T) => string | number;
  getName: (item: T) => string;
  getImage: (item: T) => string;
  getAddress?: (item: T) => string;
  getMobile?: (item: T) => string;
  getEmail?: (item: T) => string;
  getDetails?: (item: T) => ContactCardDetail[];
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  subtitle?: (item: T) => string;
}

export default function ContactCards<T>({
  data,
  getKey,
  getName,
  getImage,
  getAddress,
  getMobile,
  getEmail,
  getDetails,
  onEdit,
  onDelete,
  subtitle,
}: ContactCardsProps<T>) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {data.map((item) => {
        const details = getDetails
          ? getDetails(item)
          : [
              ...(getAddress
                ? [{ icon: <MapPin size={12} />, value: getAddress(item) }]
                : []),
              ...(getMobile
                ? [{ icon: <Phone size={12} />, value: getMobile(item) }]
                : []),
              ...(getEmail
                ? [{ icon: <Mail size={12} />, value: getEmail(item) }]
                : []),
            ];

        return (
          <div
            key={getKey(item)}
            className="min-w-0 rounded-xl border border-[#E3EAE5] bg-white p-3.5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#C7D9CC] hover:shadow-md"
          >
            {/* IMAGE + NOM + ACTIONS */}

            <div className="flex items-start justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2.5">
                <img
                  src={getImage(item)}
                  alt={getName(item)}
                  className="h-10 w-10 shrink-0 rounded-full border border-[#E5EBE7] object-cover"
                />

                <div className="min-w-0">
                  <h3 className="truncate text-[12px] font-semibold text-[#38453D]">
                    {getName(item)}
                  </h3>

                  {subtitle && (
                    <p className="mt-0.5 truncate text-[10px] text-[#929D95]">
                      {subtitle(item)}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-0.5">
                <RowActions
                  type="edit"
                  onClick={() => onEdit(item)}
                />
                <RowActions
                  type="delete"
                  onClick={() => onDelete(item)}
                />
              </div>
            </div>

            {/* INFORMATIONS PERSONNALISABLES */}

            <div className="mt-3 space-y-2 border-t border-[#EEF1EF] pt-3">
              {details.map((detail, index) => (
                <div
                  key={index}
                  className="flex min-w-0 items-center gap-2"
                >
                  <span className="shrink-0 text-[#789080]">
                    {detail.icon}
                  </span>
                  <p className="truncate text-[10px] text-[#647168]">
                    {detail.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
