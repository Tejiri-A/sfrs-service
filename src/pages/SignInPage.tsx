// src/pages/auth/SignInPage.tsx
import AuthContainer from "../components/auth/AuthContainer.tsx";
import { SignInForm } from "../components/auth/SignInForm.tsx";
import { Link } from "react-router-dom";
import {ROUTES} from "../libs/constants.ts";

export function SignInPage() {
  return (
    <AuthContainer
      title="Welcome back"
      description="Enter your credentials to sign in"
    >
      <SignInForm />
      <div className="mt-4 text-center text-sm">
        Don't have an account?{" "}
        <Link to={ROUTES.SIGN_UP} className="underline hover:text-primary">
          Sign up
        </Link>
      </div>
    </AuthContainer>
  );
}