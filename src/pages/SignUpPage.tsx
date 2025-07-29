import AuthContainer from "../components/auth/AuthContainer.tsx";
import SignUpForm from "../components/auth/SignUpForm.tsx";
import { Link } from "react-router-dom";
import { ROUTES } from "../libs/constants.ts";

const SignUpPage = () => {
  return (
    <AuthContainer title={`Create an account`} description={`Enter your details to get started`}>
      <SignUpForm/>
      <div>
        Already have an account?{" "}
        <Link to={ROUTES.SIGN_IN} className={`underline text-primary`}>Sign in</Link>
      </div>
    </AuthContainer>
  );
};
export default SignUpPage;
