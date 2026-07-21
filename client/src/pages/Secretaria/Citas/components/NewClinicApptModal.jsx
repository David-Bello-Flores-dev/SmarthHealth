import React, { useEffect, useState } from 'react';
import { XIcon } from '@/components/layout/Icons';
import { PatientSearchBar } from '@/components/patient-search/PatientSearchBar';

async function searchPacientes(_doctorId, query) {
  const TODOS = ['María García López', 'Carlos Méndez', 'Ana López', 'Pedro Ruiz'];
  return new Promise((resolve) => setTimeout(() => {
    const q = query.trim().toLowerCase();
    resolve(TODOS.filter((n) => !q || n.toLowerCase().includes(q)).map((n, i) => ({ id: String(i), nombre: n })));
  }, 200));
}

export const NewClinicApptModal = ({ fetchDoctores, onClose, onSubmit }) => {
  const [doctores, setDoctores] = useState([]);
  const [pacienteNombre, setPacienteNombre] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [hora, setHora] = useState('');
  const [tipoConsulta, setTipoConsulta] = useState('');
  const [modalidad, setModalidad] = useState('presencial');

  useEffect(() => { fetchDoctores().then(setDoctores); }, [fetchDoctores]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!pacienteNombre || !doctorId || !hora || !tipoConsulta) return;
    const medico = doctores.find((d) => d.id === doctorId)?.nombre ?? '';
    onSubmit({ paciente: pacienteNombre, medico, hora, tipoConsulta, modalidad });
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card">
        <div className="modal-card__header">
          <h2>Nueva cita</h2>
          <button type="button" className="modal-close-btn" onClick={onClose}><XIcon width={18} height={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="new-appt-form">
          <label className="new-appt-form__field">
            <span>Paciente</span>
            <PatientSearchBar doctorId={null} onSearch={searchPacientes} onSelectPatient={(_id, nombre) => setPacienteNombre(nombre)} />
            {pacienteNombre && <p className="new-appt-form__selected">Seleccionado: {pacienteNombre}</p>}
          </label>

          <label className="new-appt-form__field">
            <span>Médico</span>
            <select value={doctorId} onChange={(e) => setDoctorId(e.target.value)} required>
              <option value="">Selecciona un médico</option>
              {doctores.map((d) => <option key={d.id} value={d.id}>{d.nombre}</option>)}
            </select>
          </label>

          <label className="new-appt-form__field">
            <span>Hora</span>
            <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} required />
          </label>

          <label className="new-appt-form__field">
            <span>Tipo de consulta</span>
            <input type="text" value={tipoConsulta} onChange={(e) => setTipoConsulta(e.target.value)} placeholder="Ej. Consulta general" required />
          </label>

          <label className="new-appt-form__field">
            <span>Modalidad</span>
            <select value={modalidad} onChange={(e) => setModalidad(e.target.value)}>
              <option value="presencial">Presencial</option>
              <option value="videollamada">Videollamada</option>
            </select>
          </label>

          <div className="nueva-receta-form__actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-submit-receta">Crear cita</button>
          </div>
        </form>
      </div>
    </div>
  );
};