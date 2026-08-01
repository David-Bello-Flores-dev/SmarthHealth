import React from 'react';
import { DownloadIcon } from '@/components/layout/Icons';
import { descargarComprobanteCita } from '@/utils/pdfExport';

export const DownloadPdfButton = ({ cita, className = '' }) => {
  return (
    <button
      type="button"
      className={`download-pdf-btn ${className}`}
      onClick={() => descargarComprobanteCita(cita)}
      title="Descargar comprobante en PDF"
    >
      <DownloadIcon width={14} height={14} />
    </button>
  );
};