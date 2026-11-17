
import {
  ImagePlus,
  Trash2,
  Upload,
} from "lucide-react";

interface ImageUploadFieldProps {
  name: string;
  value: string;
  accept?: string;
  disabled?: boolean;
  onChange: (name: string, value: string) => void;
}

export default function ImageUploadField({
  name,
  value,
  accept,
  disabled = false,
  onChange,
}: ImageUploadFieldProps) {

  // ==========================================
  // UPLOAD IMAGE
  // ==========================================

  const handleImageChange = (file: File | undefined) => {
    if (!file) return;

    // Vérifier le type du fichier
    if (!file.type.startsWith("image/")) {
      alert("Veuillez sélectionner un fichier image.");
      return;
    }

    // Vérifier la taille : maximum 5 Mo
    if (file.size > 5 * 1024 * 1024) {
      alert("L'image ne doit pas dépasser 5 Mo.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        onChange(name, reader.result);
      }
    };

    reader.onerror = () => {
      alert("Impossible de lire cette image.");
    };

    reader.readAsDataURL(file);
  };

  // ==========================================
  // SUPPRIMER IMAGE
  // ==========================================

  const handleRemoveImage = () => {
    onChange(name, "");
  };

  // ==========================================
  // AFFICHAGE
  // ==========================================

  return (
    <div className="flex flex-col items-start gap-2">

      {/* APERÇU IMAGE */}

      {value ? (
        <div
          className="
            relative
            flex
            h-[250px]
            w-[300px]
            items-center
            justify-center
            overflow-hidden
            rounded-lg
            border
            border-[#E1E5EA]
            bg-[#F8FAF8]
          "
        >
          <img
            src={value}
            alt="Aperçu de l'image"
            className="h-full w-full object-cover"
          />

          {/* BOUTON SUPPRIMER */}

          <button
            type="button"
            onClick={handleRemoveImage}
            disabled={disabled}
            title="Supprimer l'image"
            className="
              absolute
              right-1.5
              top-1.5
              flex
              h-6
              w-6
              items-center
              justify-center
              rounded-full
              bg-white
              text-red-500
              shadow-sm
              transition
              hover:bg-red-50
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <Trash2 size={12} />
          </button>
        </div>
      ) : (

        /* ZONE DE TÉLÉCHARGEMENT */

        <label
          htmlFor={name}
          className={`
            flex
            h-[250px]
            w-[300px]
            flex-col
            items-center
            justify-center
            gap-1.5
            rounded-lg
            border
            border-dashed
            border-[#CBD8CE]
            bg-[#F8FAF8]
            text-[#7D8981]
            transition
            ${
              disabled
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer hover:border-[#6D9B82] hover:bg-[#EDF5EF]"
            }
          `}
        >
          <ImagePlus
            size={21}
            className="text-[#47785B]"
          />

          <span className="text-[9px] font-semibold">
            Télécharger une image
          </span>

          <span className="text-[8px]">
            PNG, JPG ou WEBP
          </span>
        </label>
      )}

      {/* INPUT FILE */}

      <input
        id={name}
        name={name}
        type="file"
        accept={accept ?? "image/*"}
        disabled={disabled}
        onChange={(event) => {
          handleImageChange(event.target.files?.[0]);
          event.target.value = "";
        }}
        className="hidden"
      />

      {/* CHANGER IMAGE */}

      {value && (
        <label
          htmlFor={name}
          className={`
            inline-flex
            items-center
            gap-1
            text-[9px]
            font-semibold
            ${
              disabled
                ? "cursor-not-allowed text-[#A0AAA3]"
                : "cursor-pointer text-[#47785B] hover:text-[#285640]"
            }
          `}
        >
          <Upload size={11} />
          Changer l'image
        </label>
      )}

    </div>
  );
}
