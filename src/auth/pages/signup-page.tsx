
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Check, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import {
  getSignupSchema,
  type SignupSchemaType,
} from "../forms/signup-schema";

import { Button } from "../../components/ui";
import {
  Alert,
  AlertIcon,
  AlertTitle,
} from "../../components/ui/alert";
import { Checkbox } from "../../components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Spinner } from "../../components/ui/spinners";
import { Input } from "../../components/ui/inputt";

interface LocalUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export function SignUpPage() {
  const navigate = useNavigate();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<SignupSchemaType>({
    resolver: zodResolver(getSignupSchema()),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      terms: false,
    },
  });

  // Inscription locale
  async function onSubmit(values: SignupSchemaType) {
    try {
      setIsProcessing(true);
      setError(null);
      setSuccessMessage(null);

      const email = values.email.trim().toLowerCase();

      // Récupérer les utilisateurs enregistrés
      const users: LocalUser[] = JSON.parse(
        localStorage.getItem("oliveapp_users") || "[]"
      );

      // Vérifier si l'utilisateur existe déjà
      const existingUser = users.find(
        (user) => user.email.toLowerCase() === email
      );

      if (existingUser) {
        setError("Cette adresse e-mail est déjà utilisée.");
        return;
      }

      // Créer le nouvel utilisateur
      const newUser: LocalUser = {
        email,
        password: values.password,
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
      };

      users.push(newUser);

      // Enregistrer le nouvel utilisateur
      localStorage.setItem("oliveapp_users", JSON.stringify(users));

      // Enregistrer la session
      localStorage.setItem("oliveapp_authenticated", "true");
      sessionStorage.removeItem("oliveapp_authenticated");

      localStorage.setItem(
        "oliveapp_current_user",
        JSON.stringify({
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
        })
      );

      setSuccessMessage(
        "Inscription réussie ! Redirection vers le tableau de bord..."
      );

      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Registration error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors de l'inscription."
      );
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#F4F7F5] px-4 py-8 dark:bg-[#151F19]">
      {/* Conteneur blanc */}
      <div className="w-full max-w-[520px] rounded-2xl border border-[#E8EDE9] bg-white px-6 py-8 shadow-[0_8px_30px_rgba(40,86,64,0.07)] sm:px-10 sm:py-10 dark:border-[#35463B] dark:bg-[#1C2921]">

        {/* Header */}
        <div className="mb-7 text-center">

          <h1 className="text-2xl font-bold tracking-tight text-[#26352D] dark:text-[#E5EDE7]">
            Créer un compte
          </h1>

          <p className="mt-2 text-sm text-[#7A857E] dark:text-[#A8B8AC]">
            Créez votre compte pour commencer.
          </p>
        </div>

        {/* Formulaire */}
        <div className="mx-auto w-full max-w-[400px]">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              {/* Error Message */}
              {error && (
                <Alert
                  variant="destructive"
                  appearance="light"
                  onClose={() => setError(null)}
                >
                  <AlertIcon>
                    <AlertCircle />
                  </AlertIcon>
                  <AlertTitle>{error}</AlertTitle>
                </Alert>
              )}

              {/* Success Message */}
              {successMessage && (
                <Alert
                  appearance="light"
                  onClose={() => setSuccessMessage(null)}
                >
                  <AlertIcon>
                    <Check />
                  </AlertIcon>
                  <AlertTitle>{successMessage}</AlertTitle>
                </Alert>
              )}

              {/* First Name */}
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[13px] font-medium text-[#34443A] dark:text-[#E5EDE7]">
                      Prénom
                    </FormLabel>

                    <FormControl>
                      <Input
                        placeholder="Saisir votre prénom"
                        autoComplete="given-name"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Last Name */}
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[13px] font-medium text-[#34443A] dark:text-[#E5EDE7]">
                      Nom
                    </FormLabel>

                    <FormControl>
                      <Input
                        placeholder="Saisir votre nom"
                        autoComplete="family-name"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[13px] font-medium text-[#34443A] dark:text-[#E5EDE7]">
                      Adresse e-mail
                    </FormLabel>

                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Votre adresse e-mail"
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[13px] font-medium text-[#34443A] dark:text-[#E5EDE7]">
                      Mot de passe
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
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
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
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Terms and Privacy */}
              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start gap-2 space-y-0 rounded-md pt-1">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) =>
                          field.onChange(checked === true)
                        }
                      />
                    </FormControl>

                    <div className="space-y-1 leading-5">
                      <FormLabel className="cursor-pointer text-xs font-normal text-[#59665E] dark:text-[#A8B8AC]">
                        J'accepte les conditions et la{" "}
                        <Link
                          to="#"
                          className="font-semibold text-[#285640] hover:underline dark:text-[#91C5A1]"
                        >
                          Politique de confidentialité
                        </Link>
                      </FormLabel>

                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              {/* Submit */}
              <Button
                type="submit"
                fullWidth
                size="lg"
                disabled={isProcessing}
                className="mt-2"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <Spinner className="h-4 w-4 animate-spin" />
                    Création du compte...
                  </span>
                ) : (
                  "Créer un compte"
                )}
              </Button>

              {/* Sign In Link */}
              <div className="pt-2 text-center text-[13px] text-[#7A857E] dark:text-[#A8B8AC]">
                Vous avez déjà un compte ?{" "}
                <Link
                  to="/auth/signin"
                  className="font-semibold text-[#285640] hover:underline dark:text-[#91C5A1]"
                >
                  Se connecter
                </Link>
              </div>
            </form>
          </Form>
        </div>

        {/* Footer */}
        <p className="mt-7 text-center text-[11px] text-[#A0AAA3] dark:text-[#718A78]">
          © {new Date().getFullYear()} Olive App. Tous droits réservés.
        </p>
      </div>
    </main>
  );
}
