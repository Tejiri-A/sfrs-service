// src/App.tsx
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Toaster } from "./components/ui/sonner.tsx";
import { ROUTES } from "./libs/constants.ts";
import { SignInPage } from "./pages/SignInPage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import ClientPage from "./pages/ClientPage.tsx";
import ValidatorPage from "./pages/ValidatorPage.tsx";
import ApproverPage from "./pages/ApproverPage.tsx";

function App() {
  return (
    <>
      <Routes>
        <Route path={ROUTES.SIGN_IN} element={<SignInPage />} />
        <Route path={ROUTES.SIGN_UP} element={<SignUpPage />} />
        <Route
          path={ROUTES.CLIENT_DASHBOARD}
          element={
            <ProtectedRoute allowedRoles={["client"]}>
              <ClientPage/>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.VALIDATOR_DASHBOARD}
          element={
            <ProtectedRoute allowedRoles={["validator"]}>
              <ValidatorPage/>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.APPROVER_DASHBOARD}
          element={
            <ProtectedRoute allowedRoles={["approver"]}>
              <ApproverPage/>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<SignInPage />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;