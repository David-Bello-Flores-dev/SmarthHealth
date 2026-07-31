import React, { useEffect, useState } from 'react';
import { XIcon } from '@/components/layout/Icons';
import { api } from '@/services/api';

export const NewAppointmentModal = ({ fechaInicial, onClose, onCreated }) => {
  const [doctores, setDoctores] = useState([]);
  const [tiposConsulta, setTiposConsulta] = useState([]);
  const [doctorId, setDoctorId] = useState('');
  const [tipoConsultaId, setTipoConsultaId] = useState('');
  const [fecha, setFecha] = useState(fechaInicial ?? '');
  const [hora, setHora] = useState('');
  const [modalidad, setModalidad] = useState('presencial');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  const hoy = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD' de hoy


  useEffect(() => {
    api.get('/medicos').then(setDoctores).catch(() => {});
    api.get('/tipos-consulta').then(setTiposConsulta).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!doctorId || !tipoConsultaId || !fecha || !hora) return;

    setSaving(true);
    setError(null);
    try {
      const nuevaCita = await api.post('/citas', {
        doctorId, tipoConsultaId, fecha, hora: `${hora}:00`, modalidad,
      });
      onCreated(nuevaCita);
    } catch (err) {
      setError(err.message || 'No se pudo crear la cita');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card">
        <div className="modal-card__header">
          <h2>Nueva cita</h2>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <XIcon width={18} height={18} />
          </button>
        </div>

        {error && <div className="login-form__error">{error}</div>}

        <form onSubmit={handleSubmit} className="new-appt-form">
          <label className="new-appt-form__field">
            <span>Médico</span>
            <select value={doctorId} onChange={(e) => setDoctorId(e.target.value)} required>
              <option value="">Selecciona un médico</option>
              {doctores.map((d) => (
                <option key={d.id} value={d.id}>{d.nombre} — {d.especialidad}</option>
              ))}
            </select>
          </label>

          <label className="new-appt-form__field">
            <span>Tipo de consulta</span>
            <select value={tipoConsultaId} onChange={(e) => setTipoConsultaId(e.target.value)} required>
              <option value="">Selecciona un tipo</option>
              {tiposConsulta.map((t) => <option key={t.id} value={t.id}>{t.nombre}</option>)}
            </select>
          </label>

          <label className="new-appt-form__field">
            <span>Fecha</span>
            <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
          </label>

          <label className="new-appt-form__field">
            <span>Hora</span>
            <input type="time" min = {hoy} value={hora} onChange={(e) => setHora(e.target.value)} required />
          </label>

          <label className="new-appt-form__field">
            <span>Modalidad</span>
            <select value={modalidad} onChange={(e) => setModalidad(e.target.value)}>
              <option value="presencial">Presencial</option>
              <option value="videollamada">Videollamada</option>
            </select>
          </label>

          <div className="nueva-receta-form__actions">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={saving}>Cancelar</button>
            <button type="submit" className="btn-submit-receta" disabled={saving}>
              {saving ? 'Agendando...' : 'Agendar cita'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};