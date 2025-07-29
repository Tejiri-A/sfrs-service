import {Routes, Route} from 'react-router-dom';
import SignInPage from "./pages/SignInPage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import ClientPage from "./pages/ClientPage.tsx";
import ValidatorPage from "./pages/ValidatorPage.tsx";
import ApproverPage from "./pages/ApproverPage.tsx";
import { Toaster } from "sonner";
import { AuthProvider } from "./hooks/useAuth.tsx";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path={`/signin`} element={<SignInPage/>}/>
        <Route path={`/signup`} element={<SignUpPage/>}/>
        <Route path={`/client`} element={<ClientPage/>}/>
        <Route path={`/reviewer`} element={<ValidatorPage/>}/>
        <Route path={`/approver`} element={<ApproverPage/>}/>
        <Route path={`/`} element={<SignInPage/>}/>
      </Routes>
      <Toaster/>
    </AuthProvider>
  );
}

export default App;
