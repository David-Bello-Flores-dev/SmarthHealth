import jsPDF from 'jspdf';

const ESTATUS_LABEL = { confirmada: 'Confirmada', pendiente: 'Pendiente', cancelada: 'Cancelada' };
const MODALIDAD_LABEL = { presencial: 'Presencial', videollamada: 'Videollamada' };

/**
 * Genera y descarga un PDF de comprobante de cita médica.
 * @param {object} cita - debe tener: fecha, hora, tipoConsulta, modalidad, estatus,
 *                         y según el rol: medico (vista paciente) o paciente (vista médico/secretaria)
 */
export function descargarComprobanteCita(cita) {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });

  const margenIzq = 56;
  let y = 70;

  // --- Encabezado con marca ---
  doc.setFillColor(22, 33, 62); // #16213E
  doc.rect(0, 0, 612, 90, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('SmartHealth', margenIzq, 45);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Comprobante de cita médica', margenIzq, 64);

  // --- Cuerpo ---
  doc.setTextColor(31, 41, 55); // #1f2937
  y = 130;

  const renglon = (etiqueta, valor) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128); // gris
    doc.text(etiqueta.toUpperCase(), margenIzq, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(13);
    doc.setTextColor(31, 41, 55);
    doc.text(String(valor ?? '—'), margenIzq, y + 18);
    y += 46;
  };

  const fechaFormateada = new Date(cita.fecha).toLocaleDateString('es-MX', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  renglon('Fecha', fechaFormateada);
  renglon('Hora', cita.hora);
  renglon('Tipo de consulta', cita.tipoConsulta);
  if (cita.medico) renglon('Médico', cita.medico);
  if (cita.paciente) renglon('Paciente', cita.paciente);
  renglon('Modalidad', MODALIDAD_LABEL[cita.modalidad] ?? cita.modalidad);
  renglon('Estatus', ESTATUS_LABEL[cita.estatus] ?? cita.estatus);

  // --- Pie de página ---
  doc.setFontSize(9);
  doc.setTextColor(156, 163, 175);
  doc.text(
    `Generado el ${new Date().toLocaleDateString('es-MX')} · SmartHealth`,
    margenIzq,
    750
  );

  const nombreArchivo = `cita-${cita.fecha}-${cita.hora.replace(':', '')}.pdf`;
  doc.save(nombreArchivo);
}