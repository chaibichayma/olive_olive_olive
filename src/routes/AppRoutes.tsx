
import { Navigate, Route, Routes } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";

import SaisonsPage from "../pages/saisons/SaisonsPage";
import CiternesPage from "../pages/citernes/CiternesPage";
import BonReceptionPage from "../pages/BonReception/BonReceptionPage";
import ComptesPage from "../pages/compte/ComptesPage";
import UtilisateursPage from "../pages/utilisateur/UtilisateursPage";
import DashboardPage from "../pages/dashboard/DashboardPage";

import { SignInPage } from "../auth/pages/signin-page";
import { SignUpPage } from "../auth/pages/signup-page";
import { ResetPasswordPage } from "../auth/pages/reset-password-page";

// Pages temporaires pour les futurs modules
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="space-y-3">
      <h1 className="text-xl font-bold text-gray-800">
        {title}
      </h1>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-500">
          Cette interface sera développée prochainement.
        </p>
      </div>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Pages d'authentification sans Header ni Sidebar */}
      <Route path="/auth/signin" element={<SignInPage />} />
      <Route path="/auth/signup" element={<SignUpPage />} />
      <Route
        path="/auth/request-reset"
        element={<ResetPasswordPage />}
      />

      {/* Pages principales avec Header et Sidebar */}
      <Route element={<MainLayout />}>
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />

        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/saisons" element={<SaisonsPage />} />
        <Route path="/comptes" element={<ComptesPage />} />
        <Route path="/utilisateurs" element={<UtilisateursPage />} />
        <Route path="/citernes" element={<CiternesPage />} />
        <Route path="/bons-reception" element={<BonReceptionPage />} />
      </Route>

      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />
    </Routes>
  );
}