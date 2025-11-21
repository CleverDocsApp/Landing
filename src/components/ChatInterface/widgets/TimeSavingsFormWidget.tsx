import React, { useState } from 'react';
import './TimeSavingsWidget.css';

interface TimeSavingsFormWidgetProps {
  onSubmitStructured: (widgetId: string, payload: any) => void;
}

const TimeSavingsFormWidget: React.FC<TimeSavingsFormWidgetProps> = ({ onSubmitStructured }) => {
  const [notesPerDay, setNotesPerDay] = useState('');
  const [minutesPerNote, setMinutesPerNote] = useState('');
  const [daysPerWeek, setDaysPerWeek] = useState('');
  const [cliniciansCount, setCliniciansCount] = useState('1');

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
          Quick time estimate
        </h3>
        <form className="time-savings-form" onSubmit={handleSubmit}>
          <div className="time-savings-form-row">
            <label className="time-savings-form-label">
              <span className="time-savings-label">Notes per day</span>
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
              <span className="time-savings-label">Minutes per note</span>
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
              <span className="time-savings-label">Days per week</span>
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
              <span className="time-savings-label">Clinicians included</span>
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
            Calculate
          </button>
        </form>
      </div>
    </div>
  );
};

export default TimeSavingsFormWidget;
