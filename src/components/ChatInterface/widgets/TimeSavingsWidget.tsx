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
      const data: Partial<TimeSavingsData> = {};

      let inCurrentSection = false;
      let inSavingsSection = false;

      for (const line of lines) {
        const trimmed = line.trim();

        if (trimmed.includes('Current Time Spent:')) {
          inCurrentSection = true;
          inSavingsSection = false;
          continue;
        }

        if (trimmed.includes('Potential Time Savings')) {
          inCurrentSection = false;
          inSavingsSection = true;
          continue;
        }

        if (inCurrentSection && trimmed.startsWith('- Per clinician:')) {
          const match = trimmed.match(/:\s*(.+)/);
          if (match) data.currentPerClinician = match[1];
        }

        if (inCurrentSection && trimmed.match(/For\s+\d+\s+clinician/)) {
          const match = trimmed.match(/:\s*(.+)/);
          if (match) data.currentTeamTotal = match[1];
        }

        if (inSavingsSection && trimmed.startsWith('- Per clinician:')) {
          const match = trimmed.match(/:\s*(.+)/);
          if (match) data.savingsPerClinician = match[1];
        }

        if (inSavingsSection && trimmed.match(/For\s+\d+\s+clinician/)) {
          const match = trimmed.match(/:\s*(.+)/);
          if (match) data.savingsTeamTotal = match[1];
        }
      }

      if (data.currentPerClinician && data.savingsPerClinician) {
        return data as TimeSavingsData;
      }

      return null;
    } catch (error) {
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
