
import { AlertTriangle, Trash2 } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
  itemType?: string;
  description?: string;
  loading?: boolean;
}

export default function DeleteConfirmation({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemType = "cet élément",
  description,
  loading = false,
}: DeleteConfirmationProps) {
  const message =
    description ||
    (itemName
      ? `Voulez-vous vraiment supprimer ${itemType} « ${itemName} » ?`
      : `Voulez-vous vraiment supprimer ${itemType} ?`);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirmer la suppression"
      size="sm"
      closeOnOverlay={!loading}
      footer={
        <>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Annuler
          </Button>

          <Button
            variant="danger"
            leftIcon={<Trash2 size={16} />}
            loading={loading}
            onClick={onConfirm}
          >
            Supprimer
          </Button>
        </>
      }
    >
      <div className="flex flex-col items-center gap-4 py-2 text-center">
        {/* ICON */}
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 dark:bg-[#542B32]">
          <AlertTriangle
            size={27}
            className="text-red-500 dark:text-[#F29AA3]"
          />
        </div>

        {/* MESSAGE */}
        <div className="space-y-2">
          <h3 className="text-base font-semibold text-[#344238] dark:text-[#E5EDE7]">
            Êtes-vous sûr de vouloir supprimer ?
          </h3>

          <p className="text-sm leading-6 text-[#7D8981] dark:text-[#A8B8AC]">
            {message}
          </p>
        </div>
      </div>
    </Modal>
  );
}
