import {Routes, Route} from 'react-router-dom';
import SignInPage from "./pages/SignInPage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import { Toaster } from "sonner";

function App() {
  return (<>
    <Routes>
      <Route path={`/signin`} element={<SignInPage/>}/>
      <Route path={`/signup`} element={<SignUpPage/>}/>
      <Route path={`/`} element={<SignInPage/>}/>
    </Routes>
    <Toaster/>
  </>);
}

export default App;
