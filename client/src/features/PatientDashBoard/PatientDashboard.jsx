import React from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { WelcomeBanner } from './components/WelcomeBanner';
import { VitalsGrid } from './components/VitalsGrid';
import { BloodPressureChart } from './components/BloodPressureChart';
import { UpcomingAppointments } from './components/UpcomingAppointments';

export const PatientDashboard = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar activeItem="resumen" />

      <div className="dashboard-main">
        <TopBar title="Resumen" subtitle="SmartHealth — Paciente" />

        <div className="dashboard-content">
          <WelcomeBanner />
          <VitalsGrid />

          <div className="dashboard-content-grid">
            <BloodPressureChart />
            <UpcomingAppointments />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
