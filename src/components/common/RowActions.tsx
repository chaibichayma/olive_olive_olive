
import { useState } from "react";
import { Pencil, Trash2, AlertTriangle } from "lucide-react";

import { Button, Modal } from "../ui";

interface RowActionsProps {
  type: "edit" | "delete";
  onClick: () => void;
}

export default function RowActions({
  type,
  onClick,
}: RowActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isEdit = type === "edit";

  // ==========================================
  // OUVRIR LA CONFIRMATION
  // ==========================================

  const handleClick = () => {
    if (isEdit) {
      onClick();
    } else {
      setIsModalOpen(true);
    }
  };

  // ==========================================
  // CONFIRMER LA SUPPRESSION
  // ==========================================

  const handleConfirmDelete = () => {
    onClick();
    setIsModalOpen(false);
  };

  // ==========================================
  // AFFICHAGE
  // ==========================================

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleClick}
        title={isEdit ? "Modifier" : "Supprimer"}
        aria-label={isEdit ? "Modifier" : "Supprimer"}
        leftIcon={
          isEdit ? (
            <Pencil size={15} />
          ) : (
            <Trash2 size={15} />
          )
        }
        className={`!min-h-0 !w-8 !h-8 !p-1.5 !gap-0 !rounded-md transition-colors duration-200 ${
          isEdit
            ? "!text-[#47785B] hover:!bg-[#EDF5EF] hover:!text-[#285640] dark:!text-[#91C5A1] dark:hover:!bg-[#26372C] dark:hover:!text-[#B9DEC4]"
            : "!text-red-500 hover:!bg-red-50 hover:!text-red-700 dark:!text-red-400 dark:hover:!bg-red-950/40 dark:hover:!text-red-300"
        }`}
      >
        <span className="sr-only">
          {isEdit ? "Modifier" : "Supprimer"}
        </span>
      </Button>

      {!isEdit && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Confirmer la suppression"
          size="sm"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/40">
              <AlertTriangle
                size={20}
                className="text-red-600 dark:text-red-400"
              />
            </div>

            <div>
              <p className="text-sm font-semibold text-[#344238] transition-colors duration-200 dark:text-[#E5EDE7]">
                Voulez-vous vraiment supprimer cet élément ?
              </p>

              <p className="mt-1 text-xs text-[#89948C] dark:text-[#A8B8AC]">
                Les données associées à cet élément seront supprimées.
                Cette opération ne pourra pas être annulée.
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setIsModalOpen(false)}
            >
              Annuler
            </Button>

            <Button
              type="button"
              variant="danger"
              size="md"
              leftIcon={<Trash2 size={14} />}
              onClick={handleConfirmDelete}
            >
              Confirmer
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}
