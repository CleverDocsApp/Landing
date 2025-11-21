import React, { useState } from 'react';
import './DemoConfirmationWidget.css';

interface DemoFormWidgetProps {
  onSubmitStructured: (widgetId: string, payload: any) => void;
}

const DemoFormWidget: React.FC<DemoFormWidgetProps> = ({ onSubmitStructured }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [teamSize, setTeamSize] = useState('1');
  const [timezone, setTimezone] = useState('');

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
        <h3 className="demo-confirmation-widget-title">Schedule a live demo</h3>
        <form className="demo-confirmation-form" onSubmit={handleSubmit}>
          <div className="demo-confirmation-form-row">
            <label className="demo-confirmation-form-label">
              <span className="demo-confirmation-label">Name</span>
              <input
                className="demo-confirmation-form-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
            <label className="demo-confirmation-form-label">
              <span className="demo-confirmation-label">Email</span>
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
              <span className="demo-confirmation-label">Role</span>
              <input
                className="demo-confirmation-form-input"
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Clinical Director"
              />
            </label>
            <label className="demo-confirmation-form-label">
              <span className="demo-confirmation-label">Team size</span>
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
              <span className="demo-confirmation-label">Timezone (e.g. EST)</span>
              <input
                className="demo-confirmation-form-input"
                type="text"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                placeholder="EST, PST, GMT, etc."
              />
            </label>
          </div>
          <button type="submit" className="demo-confirmation-form-submit">
            Send demo request
          </button>
          {isSoloProvider && (
            <p className="demo-confirmation-hint">
              If you are a solo provider, we can start with a short, focused walkthrough.
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default DemoFormWidget;
