
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Check, MoveLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import {
  getResetRequestSchema,
  type ResetRequestSchemaType,
} from "../forms/reset-password-schema";

import {
  Alert,
  AlertIcon,
  AlertTitle,
} from "../../components/ui/alert";
import { Button } from "../../components/ui";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/inputt";

interface LocalUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export function ResetPasswordPage() {
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<ResetRequestSchemaType>({
    resolver: zodResolver(getResetRequestSchema()),
    defaultValues: {
      email: "",
    },
  });

  // Vérification du compte
  function onSubmit(values: ResetRequestSchemaType) {
    setError(null);
    setSuccessMessage(null);

    try {
      const storedUsers = localStorage.getItem("oliveapp_users");

      const users: LocalUser[] = storedUsers
        ? JSON.parse(storedUsers)
        : [];

      const email = values.email.trim().toLowerCase();

      const userExists = users.some(
        (user) => user.email.toLowerCase() === email
      );

      if (!userExists) {
        setError("Aucun compte n'est associé à cette adresse e-mail.");
        return;
      }

      // Conserver temporairement l'adresse pour la page suivante
      sessionStorage.setItem("oliveapp_reset_email", email);

      setSuccessMessage(
        "Compte trouvé ! Redirection vers la modification du mot de passe..."
      );

      form.reset();

      // Redirection vers Change Password
      navigate("/auth/change-password", { replace: true });

    } catch (err) {
      console.error("Password reset error:", err);
      setError("Une erreur est survenue. Veuillez réessayer.");
    }
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#F4F7F5] px-4 py-8">

      {/* Conteneur blanc */}
      <div className="w-full max-w-[520px] rounded-2xl border border-[#E8EDE9] bg-white px-6 py-8 shadow-[0_8px_30px_rgba(40,86,64,0.07)] sm:px-10 sm:py-10">

        {/* Header */}
        <div className="mb-7 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-[#26352D]">
            Réinitialiser le mot de passe
          </h1>

          <p className="mt-2 text-sm text-[#7A857E]">
            Saisissez votre adresse e-mail pour retrouver votre compte.
          </p>
        </div>

        {/* Formulaire */}
        <div className="mx-auto w-full max-w-[400px]">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
            >

              {/* Message d'erreur */}
              {error && (
                <Alert variant="destructive">
                  <AlertIcon>
                    <AlertCircle className="h-4 w-4" />
                  </AlertIcon>

                  <AlertTitle>{error}</AlertTitle>
                </Alert>
              )}

              {/* Message de succès */}
              {successMessage && (
                <Alert>
                  <AlertIcon>
                    <Check className="h-4 w-4 text-green-500" />
                  </AlertIcon>

                  <AlertTitle>{successMessage}</AlertTitle>
                </Alert>
              )}

              {/* Adresse e-mail */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[13px] font-medium text-[#34443A]">
                      Adresse e-mail
                    </FormLabel>

                    <FormControl>
                      <Input
                        placeholder="votre.email@example.com"
                        type="email"
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Bouton */}
              <Button
                type="submit"
                fullWidth
                size="lg"
              >
                Vérifier mon compte
              </Button>

              {/* Retour à la connexion */}
              <div className="pt-2 text-center">
                <Link
                  to="/auth/signin"
                  className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#285640] hover:underline"
                >
                  <MoveLeft className="size-3.5 opacity-70" />
                  Retour à la connexion
                </Link>
              </div>

            </form>
          </Form>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-[11px] text-[#A0AAA3]">
          © {new Date().getFullYear()} Olive App. Tous droits réservés.
        </p>

      </div>
    </main>
  );
}
