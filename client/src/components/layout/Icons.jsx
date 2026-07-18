import React from 'react';

const base = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export const ActivityIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

export const GridIcon = (props) => (
  <svg {...base} {...props}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

export const CalendarIcon = (props) => (
  <svg {...base} {...props}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

export const FolderIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M3 6a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z" />
  </svg>
);

export const PillIcon = (props) => (
  <svg {...base} {...props}>
    <rect x="3.5" y="10.5" width="17" height="7" rx="3.5" transform="rotate(-45 12 14)" />
    <path d="M8.5 8.5 15.5 15.5" />
  </svg>
);

export const GearIcon = (props) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
  </svg>
);

export const LogoutIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="M16 17l5-5-5-5M21 12H9" />
  </svg>
);

export const ChevronRightIcon = (props) => (
  <svg {...base} {...props}>
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export const BellIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9Z" />
    <path d="M13.7 21a2 2 0 0 1-3.4 0" />
  </svg>
);

/* --- Íconos nuevos para el Expediente Clínico --- */

export const ShareIcon = (props) => (
  <svg {...base} {...props}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <path d="m8.6 10.5 6.8-3.9M8.6 13.5l6.8 3.9" />
  </svg>
);

export const PrinterIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M6 9V3h12v6" />
    <rect x="4" y="9" width="16" height="8" rx="1.5" />
    <path d="M6 17v4h12v-4" />
  </svg>
);

export const DropletIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M12 2s6 7.2 6 11.5a6 6 0 1 1-12 0C6 9.2 12 2 12 2Z" />
  </svg>
);

export const RulerIcon = (props) => (
  <svg {...base} {...props}>
    <rect x="3" y="7" width="18" height="10" rx="1.5" transform="rotate(0 12 12)" />
    <path d="M7 7v3M11 7v3M15 7v3M19 7v3" />
  </svg>
);

export const ScaleIcon = (props) => (
  <svg {...base} {...props}>
    <rect x="4" y="13" width="16" height="7" rx="2" />
    <path d="M8 13V9a4 4 0 0 1 8 0v4" />
  </svg>
);

export const GaugeIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M4.5 19a8.5 8.5 0 1 1 15 0" />
    <path d="M12 13 15 9" />
    <circle cx="12" cy="13" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const FlaskIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M9 2h6M10 2v6.2L4.7 18a2 2 0 0 0 1.8 2.9h11a2 2 0 0 0 1.8-2.9L14 8.2V2" />
    <path d="M7.5 15h9" />
  </svg>
);

export const ShieldAlertIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M12 2 4 5v6c0 5 3.4 8.7 8 11 4.6-2.3 8-6 8-11V5Z" />
    <path d="M12 8v4" />
    <circle cx="12" cy="16" r="0.5" fill="currentColor" stroke="none" />
  </svg>
);

export const CheckCircleIcon = (props) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8.5 12.5 2.5 2.5 5-5" />
  </svg>
);

export const AlertTriangleIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M12 3.5 2.5 20h19L12 3.5Z" />
    <path d="M12 10v4" />
    <circle cx="12" cy="17" r="0.5" fill="currentColor" stroke="none" />
  </svg>
);

export const HeartIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M12 21s-7.5-4.6-10-9.3C.5 8.4 2.3 5 5.7 5c1.9 0 3.4 1 4.3 2.4C11 6 12.5 5 14.3 5c3.4 0 5.2 3.4 3.7 6.7C19.5 16.4 12 21 12 21Z" />
  </svg>
);

export const ThermometerIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M14 4a2 2 0 0 0-4 0v9.5a4 4 0 1 0 4 0Z" />
    <circle cx="12" cy="17" r="1" fill="currentColor" stroke="none" />
  </svg>
);