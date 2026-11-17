
import DeleteConfirmation from "./DeleteConfirmation";

interface EntityModalsProps {
  // Confirmation de suppression
  deleteOpen: boolean;
  onCloseDelete: () => void;
  onConfirmDelete: () => void;
  itemName?: string;
  itemType: string;
  deleteLoading?: boolean;
}

export default function EntityModals({
  deleteOpen,
  onCloseDelete,
  onConfirmDelete,
  itemName,
  itemType,
  deleteLoading = false,
}: EntityModalsProps) {
  return (
    <DeleteConfirmation
      isOpen={deleteOpen}
      onClose={onCloseDelete}
      onConfirm={onConfirmDelete}
      itemName={itemName}
      itemType={itemType}
      loading={deleteLoading}
    />
  );
}
