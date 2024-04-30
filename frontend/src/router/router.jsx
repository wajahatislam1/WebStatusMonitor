import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";

import App from "../App";
import HomePage from "../screens/homepage/HomePage";
import UserAuth from "../screens/users/userAuth/UserAuth";
import GoogleAuth from "../screens/users/googleAuth/GoogleAuth";

const router = createBrowserRouter(
  createRoutesFromElements([
    <Route path="/" element={<App />}>
      <Route path="" element={<HomePage />} />
      <Route path="users/auth/google" element={<GoogleAuth />} />
    </Route>,
    <Route path="users/auth" element={<UserAuth />} />,
  ])
);

export default router;
