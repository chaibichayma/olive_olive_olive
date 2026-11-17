import type { ReactNode } from "react";
import { Pencil, X } from "lucide-react";

import Modal from "../ui/Modal";
import Button from "../ui/Button";

export interface DetailItem {
  label: string;
  value: ReactNode;
  fullWidth?: boolean;
}

export interface DetailSection {
  title?: string;
  items: DetailItem[];
}

interface ViewDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  sections: DetailSection[];
  onEdit?: () => void;
  editLabel?: string;
  footer?: ReactNode;
}

export default function ViewDetails({
  isOpen,
  onClose,
  title,
  description,
  sections,
  onEdit,
  editLabel = "Modifier",
  footer,
}: ViewDetailsProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      size="lg"
      footer={
        footer ?? (
          <>
            <Button
              variant="outline"
              leftIcon={<X size={15} />}
              onClick={onClose}
            >
              Fermer
            </Button>

            {onEdit && (
              <Button
                leftIcon={<Pencil size={15} />}
                onClick={onEdit}
              >
                {editLabel}
              </Button>
            )}
          </>
        )
      }
    >
      <div className="space-y-5">
        {sections.map((section, sectionIndex) => (
          <section key={`${section.title ?? "section"}-${sectionIndex}`}>
            {section.title && (
              <h3 className="mb-3 border-b border-[#E8EDE4] pb-2 text-sm font-bold text-[#556B2F]">
                {section.title}
              </h3>
            )}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {section.items.map((item, itemIndex) => (
                <div
                  key={`${item.label}-${itemIndex}`}
                  className={`
                    min-w-0 rounded-lg border border-[#E8EDE4]
                    bg-[#FAFBF8] p-3
                    ${item.fullWidth ? "sm:col-span-2" : ""}
                  `}
                >
                  <p className="mb-1 text-xs font-medium text-[#89948C]">
                    {item.label}
                  </p>

                  <div className="break-words text-sm font-semibold text-[#344238]">
                    {item.value ?? "—"}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </Modal>
  );
}