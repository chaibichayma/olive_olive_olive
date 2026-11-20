
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Check, Eye, EyeOff, MoveLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import {
  getNewPasswordSchema,
  type NewPasswordSchemaType,
} from "../forms/reset-password-schema";

import {
  Alert,
  AlertIcon,
  AlertTitle,
} from "../../components/ui/alert";
import { Button } from "../../components/ui";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/inputt";
import { Spinner } from "../../components/ui/spinners";

interface LocalUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export function ChangePasswordPage() {
  const navigate = useNavigate();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<NewPasswordSchemaType>({
    resolver: zodResolver(getNewPasswordSchema()),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Modification du mot de passe
  function onSubmit(values: NewPasswordSchemaType) {
    try {
      setError(null);
      setSuccessMessage(null);

      // Récupérer les utilisateurs enregistrés
      const storedUsers = localStorage.getItem("oliveapp_users");

      const users: LocalUser[] = storedUsers
        ? JSON.parse(storedUsers)
        : [];

      // Récupérer l'adresse e-mail vérifiée
      const resetEmail = sessionStorage.getItem("oliveapp_reset_email");

      if (!resetEmail) {
        setError(
          "Aucune demande de réinitialisation trouvée. Veuillez recommencer."
        );
        return;
      }

      // Rechercher le compte
      const userIndex = users.findIndex(
        (user) =>
          user.email.toLowerCase() === resetEmail.toLowerCase()
      );

      if (userIndex === -1) {
        setError("Aucun compte associé à cette adresse e-mail.");
        return;
      }

      // Modifier le mot de passe
      users[userIndex].password = values.password;

      // Enregistrer les modifications
      localStorage.setItem("oliveapp_users", JSON.stringify(users));

      // Supprimer l'adresse temporaire
      sessionStorage.removeItem("oliveapp_reset_email");

      setSuccessMessage(
        "Votre mot de passe a été modifié avec succès ! Redirection vers la connexion..."
      );

      form.reset();

      // Redirection vers Sign In
      setTimeout(() => {
        navigate("/auth/signin", { replace: true });
      }, 2000);

    } catch (err) {
      console.error("Password update error:", err);
      setError("Une erreur est survenue. Veuillez réessayer.");
    }
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#F4F7F5] px-4 py-8 dark:bg-[#151F19]">

      {/* Conteneur blanc */}
      <div className="w-full max-w-[520px] rounded-2xl border border-[#E8EDE9] bg-white px-6 py-8 shadow-[0_8px_30px_rgba(40,86,64,0.07)] sm:px-10 sm:py-10 dark:border-[#35463B] dark:bg-[#1C2921]">

        {/* Header */}
        <div className="mb-7 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-[#26352D] dark:text-[#E5EDE7]">
            Nouveau mot de passe
          </h1>

          <p className="mt-2 text-sm text-[#7A857E] dark:text-[#A8B8AC]">
            Créez un nouveau mot de passe pour votre compte.
          </p>
        </div>

        {/* Formulaire */}
        <div className="mx-auto w-full max-w-[400px]">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
            >

              {/* Erreur */}
              {error && (
                <Alert variant="destructive">
                  <AlertIcon>
                    <AlertCircle className="h-4 w-4" />
                  </AlertIcon>
                  <AlertTitle>{error}</AlertTitle>
                </Alert>
              )}

              {/* Succès */}
              {successMessage && (
                <Alert>
                  <AlertIcon>
                    <Check className="h-4 w-4 text-green-500 dark:text-[#91C5A1]" />
                  </AlertIcon>
                  <AlertTitle>{successMessage}</AlertTitle>
                </Alert>
              )}

              {/* Nouveau mot de passe */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[13px] font-medium text-[#34443A] dark:text-[#E5EDE7]">
                      Nouveau mot de passe
                    </FormLabel>

                    <div className="relative">
                      <Input
                        placeholder="Créer un mot de passe"
                        type={passwordVisible ? "text" : "password"}
                        autoComplete="new-password"
                        {...field}
                      />

                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() =>
                          setPasswordVisible((previous) => !previous)
                        }
                        className="absolute right-0 top-0 h-full !min-h-0 !border-0 !bg-transparent !px-3 !text-gray-500 hover:!bg-transparent dark:!text-[#A8B8AC]"
                      >
                        {passwordVisible ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirmation du mot de passe */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[13px] font-medium text-[#34443A] dark:text-[#E5EDE7]">
                      Confirmer le mot de passe
                    </FormLabel>

                    <div className="relative">
                      <Input
                        placeholder="Confirmer votre mot de passe"
                        type={confirmPasswordVisible ? "text" : "password"}
                        autoComplete="new-password"
                        {...field}
                      />

                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() =>
                          setConfirmPasswordVisible((previous) => !previous)
                        }
                        className="absolute right-0 top-0 h-full !min-h-0 !border-0 !bg-transparent !px-3 !text-gray-500 hover:!bg-transparent dark:!text-[#A8B8AC]"
                      >
                        {confirmPasswordVisible ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Bouton */}
              <Button
                type="submit"
                fullWidth
                size="lg"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Spinner className="h-4 w-4 animate-spin" />
                    Modification en cours...
                  </span>
                ) : (
                  "Modifier le mot de passe"
                )}
              </Button>

              {/* Retour à la connexion */}
              <div className="pt-2 text-center">
                <Link
                  to="/auth/signin"
                  className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#285640] hover:underline dark:text-[#91C5A1]"
                >
                  <MoveLeft className="size-3.5 opacity-70" />
                  Retour à la connexion
                </Link>
              </div>

            </form>
          </Form>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-[11px] text-[#A0AAA3] dark:text-[#718A78]">
          © {new Date().getFullYear()} Olive App. Tous droits réservés.
        </p>

      </div>
    </main>
  );
}
