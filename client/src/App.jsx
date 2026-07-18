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
