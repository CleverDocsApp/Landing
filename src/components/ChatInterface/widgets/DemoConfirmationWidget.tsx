import React from 'react';
import './DemoConfirmationWidget.css';

interface DemoConfirmationWidgetProps {
  messageText: string;
  className?: string;
}

interface DemoData {
  name: string;
  email: string;
  role: string;
  teamSize: number;
  timezone: string;
}

const DemoConfirmationWidget: React.FC<DemoConfirmationWidgetProps> = ({ messageText, className = '' }) => {
  const parseDemoData = (): DemoData | null => {
    try {
      const lines = messageText.split('\n');
      const data: Partial<DemoData> = {};

      for (const line of lines) {
        const trimmed = line.trim();

        if (trimmed.startsWith('- Name:')) {
          data.name = trimmed.replace('- Name:', '').trim();
        } else if (trimmed.startsWith('- Email:')) {
          data.email = trimmed.replace('- Email:', '').trim();
        } else if (trimmed.startsWith('- Role:')) {
          data.role = trimmed.replace('- Role:', '').trim();
        } else if (trimmed.startsWith('- Team Size:')) {
          const teamSizeStr = trimmed.replace('- Team Size:', '').trim();
          const teamSizeMatch = teamSizeStr.match(/\d+/);
          if (teamSizeMatch) {
            data.teamSize = parseInt(teamSizeMatch[0], 10);
          }
        } else if (trimmed.startsWith('- Timezone:')) {
          data.timezone = trimmed.replace('- Timezone:', '').trim();
        }
      }

      if (data.name && data.email && data.role && data.teamSize !== undefined && data.timezone) {
        return data as DemoData;
      }

      return null;
    } catch (error) {
      return null;
    }
  };

  const data = parseDemoData();

  if (!data) {
    return null;
  }

  const isSoloProvider = data.teamSize === 1;

  return (
    <div className={`demo-confirmation-widget ${className}`}>
      <div className="demo-confirmation-widget-content">
        <h3 className="demo-confirmation-widget-title">Tu solicitud de demo fue recibida</h3>

        <div className="demo-confirmation-details">
          <div className="demo-confirmation-detail">
            <span className="demo-confirmation-label">Nombre:</span>
            <span className="demo-confirmation-value">{data.name}</span>
          </div>
          <div className="demo-confirmation-detail">
            <span className="demo-confirmation-label">Email:</span>
            <span className="demo-confirmation-value">{data.email}</span>
          </div>
          <div className="demo-confirmation-detail">
            <span className="demo-confirmation-label">Rol:</span>
            <span className="demo-confirmation-value">{data.role}</span>
          </div>
          <div className="demo-confirmation-detail">
            <span className="demo-confirmation-label">Tamaño del equipo:</span>
            <span className="demo-confirmation-value">{data.teamSize}</span>
          </div>
          <div className="demo-confirmation-detail">
            <span className="demo-confirmation-label">Zona horaria:</span>
            <span className="demo-confirmation-value">{data.timezone}</span>
          </div>
        </div>

        <div className="demo-confirmation-message">
          {isSoloProvider ? (
            <p>
              Mientras nuestro equipo revisa tu interés, también puedes empezar con un free trial desde el landing.
            </p>
          ) : (
            <p>
              Nuestro equipo te contactará para coordinar un live demo enfocado en la versión Enterprise.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DemoConfirmationWidget;
