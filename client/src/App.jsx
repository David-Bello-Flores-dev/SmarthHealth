<<<<<<< HEAD
import React from "react";
import PublicLanding from "./features/public-site/PublicLanding";
import PatientDashboard from "./features/PatientDashBoard/PatientDashboard";
import LoginPage from "./features/LoginPage/LoginPage";
import AppointmentsPage from "./features/AppointmentsPage/AppointmentsPage";

function App(){
  return (
    <>
      <AppointmentsPage />
      <PublicLanding />
      <PatientDashboard />
      <LoginPage />
    </>
  );
}

export default App
=======
import { AppRoutes } from './routes/AppRoutes';
export default function App() {
  return <AppRoutes />;
}
>>>>>>> c9eb57c3578a46a4fbcf6675b2340b8bd2102b35
