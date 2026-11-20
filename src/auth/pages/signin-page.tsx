

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import {
  getSigninSchema,
  type SigninSchemaType,
} from "../forms/signin-schema";

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
import { Input } from "../../components/ui/inputt";
import { Spinner } from "../../components/ui/spinners";

// Identifiants de connexion
const DEMO_EMAIL = "admin@oliveapp.com";
const DEMO_PASSWORD = "Olive@123";

export function SignInPage() {
  const navigate = useNavigate();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SigninSchemaType>({
    resolver: zodResolver(getSigninSchema()),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  // Connexion locale
  async function onSubmit(values: SigninSchemaType) {
    try {
      setIsProcessing(true);
      setError(null);

      const email = values.email.trim().toLowerCase();
      const password = values.password;

      if (
        email !== DEMO_EMAIL.toLowerCase() ||
        password !== DEMO_PASSWORD
      ) {
        setError("Adresse e-mail ou mot de passe incorrect.");
        return;
      }

      // Enregistrer l'état de connexion
      if (values.rememberMe) {
        localStorage.setItem("oliveapp_authenticated", "true");
        sessionStorage.removeItem("oliveapp_authenticated");
      } else {
        sessionStorage.setItem("oliveapp_authenticated", "true");
        localStorage.removeItem("oliveapp_authenticated");
      }

      // Enregistrer l'utilisateur connecté
      localStorage.setItem(
        "oliveapp_current_user",
        JSON.stringify({
          email: DEMO_EMAIL,
          firstName: "Administrateur",
          lastName: "",
        })
      );

      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Sign-in error:", err);
      setError("Une erreur est survenue lors de la connexion.");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#F4F7F5] px-4 py-8 dark:bg-[#151F19]">
      {/* Conteneur blanc */}
      <div className="w-full max-w-[520px] rounded-2xl border border-[#E8EDE9] bg-white px-6 py-8 shadow-[0_8px_30px_rgba(40,86,64,0.07)] sm:px-10 sm:py-10 dark:border-[#35463B] dark:bg-[#1C2921]">

        {/* Logo / Identité */}
        <div className="mb-7 text-center">
          
          <h1 className="text-2xl font-bold tracking-tight text-[#26352D] dark:text-[#E5EDE7]">
            Connexion
          </h1>

          <p className="mt-2 text-sm text-[#7A857E] dark:text-[#A8B8AC]">
            Connectez-vous à votre compte pour continuer.
          </p>
        </div>

        {/* Formulaire avec largeur réduite */}
        <div className="mx-auto w-full max-w-[400px]">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
            >
              {/* Message d'erreur */}
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

              {/* Adresse e-mail */}
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

              {/* Mot de passe */}
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
                        placeholder="Saisissez votre mot de passe"
                        type={passwordVisible ? "text" : "password"}
                        autoComplete="current-password"
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

              {/* Se souvenir de moi / Mot de passe oublié */}
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) =>
                              field.onChange(checked === true)
                            }
                          />
                        </FormControl>

                        <FormLabel className="cursor-pointer text-[12px] font-normal text-[#59665E] dark:text-[#A8B8AC]">
                          Se souvenir de moi
                        </FormLabel>
                      </div>

                      <Link
                        to="/auth/request-reset"
                        className="text-[12px] font-medium text-[#285640] hover:underline dark:text-[#91C5A1]"
                      >
                        Mot de passe oublié ?
                      </Link>
                    </div>
                  </FormItem>
                )}
              />

              {/* Bouton de connexion */}
              <Button
                type="submit"
                fullWidth
                size="lg"
                disabled={isProcessing}
                className="mt-2"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <Spinner className="size-4 animate-spin" />
                    Connexion en cours...
                  </span>
                ) : (
                  "Se connecter"
                )}
              </Button>

              {/* Inscription */}
              <div className="pt-2 text-center text-[13px] text-[#7A857E] dark:text-[#A8B8AC]">
                Vous n'avez pas de compte ?{" "}
                <Link
                  to="/auth/signup"
                  className="font-semibold text-[#285640] hover:underline dark:text-[#91C5A1]"
                >
                  S'inscrire
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
