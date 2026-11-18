

import { useRef, useState } from "react";
import { Save, X, AlertTriangle } from "lucide-react";

import { Button, Modal } from "../ui";

interface FormActionsProps {
  submitLabel?: string;
  cancelLabel?: string;
  onCancel: () => void;
}

export default function FormActions({
  submitLabel = "Enregistrer",
  cancelLabel = "Annuler",
  onCancel,
}: FormActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  // ==========================================
  // OUVRIR LA CONFIRMATION
  // ==========================================

  const handleSubmitClick = () => {
    setIsModalOpen(true);
  };

  // ==========================================
  // CONFIRMER L'ENREGISTREMENT
  // ==========================================

  const handleConfirm = () => {
    setIsModalOpen(false);
    submitButtonRef.current?.click();
  };

  // ==========================================
  // AFFICHAGE
  // ==========================================

  return (
    <>
      <div className="flex flex-wrap justify-end gap-2">
        <Button
  type="button"
  variant="outline"
  size="md"
  onClick={onCancel}
  className="!font-semibold !min-w-[150px]"
>
  {cancelLabel}
</Button>

        <Button
          type="button"
          variant="primary"
          size="md"
          leftIcon={<Save size={13} />}
          onClick={handleSubmitClick}
          className="!font-semibold"
        >
          {submitLabel}
        </Button>

        {/* Bouton submit réel, conservé dans le formulaire */}
        <button
          ref={submitButtonRef}
          type="submit"
          className="hidden"
          tabIndex={-1}
          aria-hidden="true"
        />
      </div>

      {/* BOÎTE DE CONFIRMATION */}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Confirmer l'enregistrement"
        size="sm"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EDF5EF]">
            <AlertTriangle
              size={20}
              className="text-[#47785B]"
            />
          </div>

          <div>
            <p className="text-sm font-semibold text-[#344238]">
              Voulez-vous confirmer l'enregistrement ?
            </p>

            <p className="mt-1 text-xs text-[#89948C]">
              Vérifiez les informations avant de valider le formulaire.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => setIsModalOpen(false)}
            className="!font-semibold"
          >
            Annuler
          </Button>

          <Button
            type="button"
            variant="primary"
            size="md"
            leftIcon={<Save size={13} />}
            onClick={handleConfirm}
            className="!font-semibold"
          >
            Confirmer
          </Button>
        </div>
      </Modal>
    </>
  );
}
