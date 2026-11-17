
import { useState } from "react";

export type FormMode = "create" | "edit";

interface EntityWithId {
  id: number;
}

interface UseEntityCrudOptions<T extends EntityWithId> {
  initialItems: T[];
}

export function useEntityCrud<T extends EntityWithId>({
  initialItems,
}: UseEntityCrudOptions<T>) {
  // Données
  const [items, setItems] = useState<T[]>(initialItems);

  // Formulaire
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>("create");
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Détails
  const [viewOpen, setViewOpen] = useState(false);

  // Suppression
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Ouvrir le formulaire de création
  const openCreate = () => {
    setSelectedItem(null);
    setViewOpen(false);
    setDeleteOpen(false);

    setFormMode("create");
    setShowForm(true);
  };

  // Ouvrir le formulaire de modification
  const openEdit = (item: T) => {
    setSelectedItem(item);
    setViewOpen(false);
    setDeleteOpen(false);

    setFormMode("edit");
    setShowForm(true);
  };

  // Ouvrir les détails
  const openView = (item: T) => {
    setSelectedItem(item);
    setShowForm(false);
    setDeleteOpen(false);

    setViewOpen(true);
  };

  // Ouvrir la confirmation de suppression
  const openDelete = (item: T) => {
    setSelectedItem(item);
    setShowForm(false);
    setViewOpen(false);

    setDeleteOpen(true);
  };

  // Fermer le formulaire
  const closeForm = () => {
    if (formLoading) return;

    setShowForm(false);
    setSelectedItem(null);
  };

  // Fermer les détails
  const closeView = () => {
    setViewOpen(false);
    setSelectedItem(null);
  };

  // Fermer la confirmation de suppression
  const closeDelete = () => {
    if (deleteLoading) return;

    setDeleteOpen(false);
    setSelectedItem(null);
  };

  // Ajouter ou modifier un élément
  const submitForm = async (data: Omit<T, "id">) => {
    try {
      setFormLoading(true);

      if (formMode === "create") {
        const newItem = {
          ...data,
          id: Date.now(),
        } as T;

        setItems((previous) => [...previous, newItem]);
      } else if (selectedItem) {
        setItems((previous) =>
          previous.map((item) =>
            item.id === selectedItem.id
              ? ({ ...data, id: selectedItem.id } as T)
              : item
          )
        );
      }

      setShowForm(false);
      setSelectedItem(null);
    } finally {
      setFormLoading(false);
    }
  };

  // Confirmer la suppression
  const confirmDelete = async () => {
    if (!selectedItem || deleteLoading) return;

    try {
      setDeleteLoading(true);

      setItems((previous) =>
        previous.filter(
          (item) => item.id !== selectedItem.id
        )
      );

      setDeleteOpen(false);
      setViewOpen(false);
      setSelectedItem(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  return {
    // Données
    items,
    setItems,
    selectedItem,

    // Formulaire
    showForm,
    formMode,
    formLoading,
    openCreate,
    openEdit,
    closeForm,
    submitForm,

    // Détails
    viewOpen,
    openView,
    closeView,

    // Suppression
    deleteOpen,
    deleteLoading,
    openDelete,
    closeDelete,
    confirmDelete,
  };
}
