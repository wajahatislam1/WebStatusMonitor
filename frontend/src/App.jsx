import { GoogleOAuthProvider } from "@react-oauth/google";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <GoogleOAuthProvider>
        <Outlet />
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
