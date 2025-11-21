import React from 'react';
import './TimeSavingsWidget.css';

interface TimeSavingsWidgetProps {
  messageText: string;
  className?: string;
}

interface TimeSavingsData {
  currentPerClinician: string;
  currentTeamTotal: string;
  savingsPerClinician: string;
  savingsTeamTotal: string;
}

const TimeSavingsWidget: React.FC<TimeSavingsWidgetProps> = ({ messageText, className = '' }) => {
  const parseTimeSavings = (): TimeSavingsData | null => {
    try {
      const lines = messageText.split('\n');

      let currentPerClinician = '';
      let currentTeamTotal = '';

      const perClinicianRegex = /-+\s*Per clinician:\s*(.+)/i;
      const teamTotalRegex = /-+\s*For\s+\d+\s+clinician\(s\):\s*(.+)/i;

      for (const raw of lines) {
        const trimmed = raw.trim();
        if (!currentPerClinician) {
          const m = trimmed.match(perClinicianRegex);
          if (m) currentPerClinician = m[1].trim();
        }
        if (!currentTeamTotal) {
          const m = trimmed.match(teamTotalRegex);
          if (m) currentTeamTotal = m[1].trim();
        }
      }

      // Si no encontramos al menos el dato por clínico, no mostramos widget
      if (!currentPerClinician) {
        return null;
      }

      const numericFromHours = (value: string): number | null => {
        const match = value.match(/([0-9]+(?:[.,][0-9]+)?)/);
        if (!match) return null;
        return parseFloat(match[1].replace(',', '.'));
      };

      const perClinicianHours = numericFromHours(currentPerClinician);
      const teamTotalHours = currentTeamTotal ? numericFromHours(currentTeamTotal) : null;

      // Escenario hipotético: liberar ~25% del tiempo
      const FRACTION = 0.25;

      let savingsPerClinician = '';
      let savingsTeamTotal = '';

      if (perClinicianHours != null) {
        const savings = perClinicianHours * FRACTION;
        savingsPerClinician = `~${savings.toFixed(1)} hours/week`;
      }

      if (teamTotalHours != null) {
        const teamSavings = teamTotalHours * FRACTION;
        savingsTeamTotal = `~${teamSavings.toFixed(1)} hours/week`;
      }

      return {
        currentPerClinician,
        currentTeamTotal,
        savingsPerClinician,
        savingsTeamTotal,
      };
    } catch {
      return null;
    }
  };

  const data = parseTimeSavings();

  if (!data) {
    return null;
  }

  return (
    <div className={`time-savings-widget ${className}`}>
      <div className="time-savings-widget-content">
        <h3 className="time-savings-widget-title">Análisis de tiempo (estimado)</h3>

        <div className="time-savings-grid">
          <div className="time-savings-section">
            <div className="time-savings-section-title">Tiempo actual</div>
            <div className="time-savings-metric">
              <div className="time-savings-label">Por clínico</div>
              <div className="time-savings-value">{data.currentPerClinician}</div>
            </div>
            {data.currentTeamTotal && (
              <div className="time-savings-metric">
                <div className="time-savings-label">Equipo total</div>
                <div className="time-savings-value">{data.currentTeamTotal}</div>
              </div>
            )}
          </div>

          <div className="time-savings-section time-savings-section-highlight">
            <div className="time-savings-section-title">Tiempo potencialmente liberado</div>
            <div className="time-savings-metric">
              <div className="time-savings-label">Por clínico</div>
              <div className="time-savings-value time-savings-value-highlight">{data.savingsPerClinician}</div>
            </div>
            {data.savingsTeamTotal && (
              <div className="time-savings-metric">
                <div className="time-savings-label">Equipo total</div>
                <div className="time-savings-value time-savings-value-highlight">{data.savingsTeamTotal}</div>
              </div>
            )}
          </div>
        </div>

        <div className="time-savings-disclaimer">
          Esto es un ejemplo ilustrativo, no una promesa de ahorro concreto.
        </div>
      </div>
    </div>
  );
};

export default TimeSavingsWidget;
