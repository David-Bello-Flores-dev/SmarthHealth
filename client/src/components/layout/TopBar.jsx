import React from 'react';
import { UserMenu } from './UserMenu';
import { NotificationsMenu } from './NotificationsMenu';
import './TopBar.css';

export const TopBar = ({ title = '', subtitle = '', userInitial = '' }) => {
  return (
    <header className="dashboard-topbar">
      <div>
        <h1 className="topbar-title">{title}</h1>
        <p className="topbar-subtitle">{subtitle}</p>
      </div>

      <div className="topbar-actions">
        <NotificationsMenu />
        <UserMenu userInitial={userInitial} />
      </div>
    </header>
  );
};

export default TopBar;