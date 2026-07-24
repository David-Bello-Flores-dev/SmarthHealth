import React, { useState } from 'react';
import { XIcon, TrashIcon } from '@/components/layout/Icons';

const MEDICAMENTO_VACIO = { nombre: '', dosis: '', via: 'Oral', frecuencia: '', duracion: '', instrucciones: '' };

export const NuevaRecetaModal = ({ pacienteNombre, saving, onClose, onSubmit }) => {
  const [diagnostico, setDiagnostico] = useState('');
  const [medicamentos, setMedicamentos] = useState([{ ...MEDICAMENTO_VACIO }]);

  const handleMedicamentoChange = (index, field, value) => {
    setMedicamentos((prev) =>
      prev.map((med, i) => (i === index ? { ...med, [field]: value } : med))
    );
  };

  const handleAddMedicamento = () => {
    setMedicamentos((prev) => [...prev, { ...MEDICAMENTO_VACIO }]);
  };

  const handleRemoveMedicamento = (index) => {
    setMedicamentos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validación mínima en el front; el backend debe revalidar todo esto también.
    if (!diagnostico.trim() || medicamentos.some((m) => !m.nombre.trim() || !m.dosis.trim())) {
      return;
    }
    onSubmit({ diagnostico, medicamentos });
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card">
        <div className="modal-card__header">
          <div>
            <h2>Nueva receta</h2>
            <p>Paciente: {pacienteNombre}</p>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Cerrar">
            <XIcon width={18} height={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="nueva-receta-form">
          <label className="nueva-receta-form__field">
            <span>Diagnóstico</span>
            <input
              type="text"
              value={diagnostico}
              onChange={(e) => setDiagnostico(e.target.value)}
              placeholder="Ej. Hipertensión arterial + seguimiento metabólico"
              required
            />
          </label>

          <div className="nueva-receta-form__meds-header">
            <span>Medicamentos prescritos</span>
            <button type="button" className="btn-add-med" onClick={handleAddMedicamento}>
              + Agregar medicamento
            </button>
          </div>

          <div className="nueva-receta-form__meds">
            {medicamentos.map((med, index) => (
              <div key={index} className="med-form-row">
                <div className="med-form-row__header">
                  <span className="med-form-row__number">{index + 1}</span>
                  {medicamentos.length > 1 && (
                    <button
                      type="button"
                      className="med-form-row__remove"
                      onClick={() => handleRemoveMedicamento(index)}
                      aria-label="Quitar medicamento"
                    >
                      <TrashIcon width={15} height={15} />
                    </button>
                  )}
                </div>

                <div className="med-form-row__grid">
                  <input
                    type="text"
                    placeholder="Medicamento (ej. Enalapril)"
                    value={med.nombre}
                    onChange={(e) => handleMedicamentoChange(index, 'nombre', e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Dosis (ej. 10 mg)"
                    value={med.dosis}
                    onChange={(e) => handleMedicamentoChange(index, 'dosis', e.target.value)}
                    required
                  />
                  <select
                    value={med.via}
                    onChange={(e) => handleMedicamentoChange(index, 'via', e.target.value)}
                  >
                    <option value="Oral">Oral</option>
                    <option value="Intramuscular">Intramuscular</option>
                    <option value="Intravenosa">Intravenosa</option>
                    <option value="Tópica">Tópica</option>
                    <option value="Sublingual">Sublingual</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Frecuencia (ej. Cada 12 horas)"
                    value={med.frecuencia}
                    onChange={(e) => handleMedicamentoChange(index, 'frecuencia', e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Duración (ej. 30 días)"
                    value={med.duracion}
                    onChange={(e) => handleMedicamentoChange(index, 'duracion', e.target.value)}
                    required
                  />
                </div>

                <input
                  type="text"
                  className="med-form-row__instrucciones"
                  placeholder="Instrucciones adicionales (opcional)"
                  value={med.instrucciones}
                  onChange={(e) => handleMedicamentoChange(index, 'instrucciones', e.target.value)}
                />
              </div>
            ))}
          </div>

          <div className="nueva-receta-form__actions">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={saving}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit-receta" disabled={saving}>
              {saving ? 'Emitiendo...' : 'Emitir receta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};