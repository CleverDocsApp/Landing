import React, { useState } from 'react';
import './DemoConfirmationWidget.css';

type ConversationLanguage = 'en' | 'es';

interface DemoFormWidgetProps {
  language: ConversationLanguage;
  onSubmitStructured: (widgetId: string, payload: any) => void;
}

const DemoFormWidget: React.FC<DemoFormWidgetProps> = ({ language, onSubmitStructured }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [teamSize, setTeamSize] = useState('1');
  const [timezone, setTimezone] = useState('');

  const isEs = language === 'es';

  const labels = {
    title: isEs ? 'Agenda un live demo' : 'Schedule a live demo',
    name: isEs ? 'Nombre' : 'Name',
    email: 'Email',
    role: isEs ? 'Rol' : 'Role',
    rolePlaceholder: isEs ? 'ej. Director Clínico' : 'e.g. Clinical Director',
    teamSize: isEs ? 'Tamaño del equipo' : 'Team size',
    timezone: isEs ? 'Zona horaria (ej. EST)' : 'Timezone (e.g. EST)',
    timezonePlaceholder: 'EST, PST, GMT, etc.',
    submit: isEs ? 'Enviar solicitud' : 'Send request',
    hintSolo: isEs
      ? 'Si eres proveedor individual, podemos empezar con una demo corta y enfocada.'
      : 'If you are a solo provider, we can start with a short, focused walkthrough.',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    onSubmitStructured('schedule_demo', {
      name,
      email,
      role,
      teamSize: Number(teamSize),
      timezone,
    });
  };

  const isSoloProvider = Number(teamSize) === 1;

  return (
    <div className="demo-confirmation-widget demo-confirmation-widget--form">
      <div className="demo-confirmation-widget-content">
        <h3 className="demo-confirmation-widget-title">{labels.title}</h3>
        <form className="demo-confirmation-form" onSubmit={handleSubmit}>
          <div className="demo-confirmation-form-row">
            <label className="demo-confirmation-form-label">
              <span className="demo-confirmation-label">{labels.name}</span>
              <input
                className="demo-confirmation-form-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
            <label className="demo-confirmation-form-label">
              <span className="demo-confirmation-label">{labels.email}</span>
              <input
                className="demo-confirmation-form-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
          </div>
          <div className="demo-confirmation-form-row">
            <label className="demo-confirmation-form-label">
              <span className="demo-confirmation-label">{labels.role}</span>
              <input
                className="demo-confirmation-form-input"
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder={labels.rolePlaceholder}
              />
            </label>
            <label className="demo-confirmation-form-label">
              <span className="demo-confirmation-label">{labels.teamSize}</span>
              <input
                className="demo-confirmation-form-input"
                type="number"
                min={1}
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
                required
              />
            </label>
          </div>
          <div className="demo-confirmation-form-row demo-confirmation-form-row--single">
            <label className="demo-confirmation-form-label">
              <span className="demo-confirmation-label">{labels.timezone}</span>
              <input
                className="demo-confirmation-form-input"
                type="text"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                placeholder={labels.timezonePlaceholder}
              />
            </label>
          </div>
          <button type="submit" className="demo-confirmation-form-submit">
            {labels.submit}
          </button>
          {isSoloProvider && (
            <p className="demo-confirmation-hint">
              {labels.hintSolo}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default DemoFormWidget;
