
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export function CallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const errorParam = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");
    const nextPath = searchParams.get("next");

    if (errorParam) {
      const params = new URLSearchParams({
        error: errorParam,
        error_description:
          errorDescription || "Une erreur est survenue lors de la connexion.",
      });

      navigate(`/auth/signin?${params.toString()}`, {
        replace: true,
      });

      return;
    }

    // L'authentification locale ne nécessite pas de callback OAuth.
    // Rediriger vers la page de connexion.
    const destination =
      nextPath && nextPath.startsWith("/") && !nextPath.startsWith("//")
        ? nextPath
        : "/auth/signin";

    navigate(destination, { replace: true });
  }, [navigate, searchParams]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="space-y-3">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#285640]" />

        <h2 className="text-xl font-semibold">
          Traitement de la connexion...
        </h2>

        <p className="text-sm text-muted-foreground">
          Vous allez être redirigé dans quelques instants.
        </p>
      </div>
    </div>
  );
}
