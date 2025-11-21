import React, { useState } from 'react';
import './TimeSavingsWidget.css';

type ConversationLanguage = 'en' | 'es';

interface TimeSavingsFormWidgetProps {
  language: ConversationLanguage;
  onSubmitStructured: (widgetId: string, payload: any) => void;
}

const TimeSavingsFormWidget: React.FC<TimeSavingsFormWidgetProps> = ({ language, onSubmitStructured }) => {
  const [notesPerDay, setNotesPerDay] = useState('');
  const [minutesPerNote, setMinutesPerNote] = useState('');
  const [daysPerWeek, setDaysPerWeek] = useState('');
  const [cliniciansCount, setCliniciansCount] = useState('1');

  const isEs = language === 'es';

  const labels = {
    title: isEs ? 'Cálculo rápido de tiempo' : 'Quick time estimate',
    notesPerDay: isEs ? 'Notas por día' : 'Notes per day',
    minutesPerNote: isEs ? 'Minutos por nota' : 'Minutes per note',
    daysPerWeek: isEs ? 'Días por semana' : 'Days per week',
    cliniciansIncluded: isEs ? 'Clínicos incluidos' : 'Clinicians included',
    submit: isEs ? 'Calcular' : 'Calculate',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notesPerDay || !minutesPerNote || !daysPerWeek || !cliniciansCount) return;

    onSubmitStructured('time_savings', {
      notes_per_day: Number(notesPerDay),
      minutes_per_note: Number(minutesPerNote),
      days_per_week: Number(daysPerWeek),
      clinicians_count: Number(cliniciansCount),
    });
  };

  return (
    <div className="time-savings-widget time-savings-widget--form">
      <div className="time-savings-widget-content">
        <h3 className="time-savings-widget-title">
          {labels.title}
        </h3>
        <form className="time-savings-form" onSubmit={handleSubmit}>
          <div className="time-savings-form-row">
            <label className="time-savings-form-label">
              <span className="time-savings-label">{labels.notesPerDay}</span>
              <input
                className="time-savings-form-input"
                type="number"
                min={0}
                value={notesPerDay}
                onChange={(e) => setNotesPerDay(e.target.value)}
                required
              />
            </label>
            <label className="time-savings-form-label">
              <span className="time-savings-label">{labels.minutesPerNote}</span>
              <input
                className="time-savings-form-input"
                type="number"
                min={0}
                value={minutesPerNote}
                onChange={(e) => setMinutesPerNote(e.target.value)}
                required
              />
            </label>
          </div>
          <div className="time-savings-form-row">
            <label className="time-savings-form-label">
              <span className="time-savings-label">{labels.daysPerWeek}</span>
              <input
                className="time-savings-form-input"
                type="number"
                min={1}
                max={7}
                value={daysPerWeek}
                onChange={(e) => setDaysPerWeek(e.target.value)}
                required
              />
            </label>
            <label className="time-savings-form-label">
              <span className="time-savings-label">{labels.cliniciansIncluded}</span>
              <input
                className="time-savings-form-input"
                type="number"
                min={1}
                value={cliniciansCount}
                onChange={(e) => setCliniciansCount(e.target.value)}
                required
              />
            </label>
          </div>
          <button type="submit" className="time-savings-form-submit">
            {labels.submit}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TimeSavingsFormWidget;
