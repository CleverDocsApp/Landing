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
        if (!trimmed) continue;

        // Quitar posible "- " al inicio
        const normalized = trimmed.replace(/^-+\s*/, '');
        const lower = normalized.toLowerCase();

        if (lower.startsWith('name:')) {
          data.name = normalized.split(':')[1].trim();
        } else if (lower.startsWith('email:')) {
          data.email = normalized.split(':')[1].trim();
        } else if (lower.startsWith('role:')) {
          data.role = normalized.split(':')[1].trim();
        } else if (lower.startsWith('team size:')) {
          const numMatch = normalized.match(/(\d+)/);
          if (numMatch) {
            data.teamSize = parseInt(numMatch[1], 10);
          }
        } else if (lower.startsWith('timezone:')) {
          data.timezone = normalized.split(':')[1].trim();
        }
      }

      // Necesitamos al menos nombre y email para que tenga sentido el widget
      if (!data.name || !data.email) {
        return null;
      }

      return {
        name: data.name,
        email: data.email,
        role: data.role || 'No especificado',
        teamSize: data.teamSize ?? 1,
        timezone: data.timezone || 'No especificada',
      };
    } catch {
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
        <h3 className="demo-confirmation-widget-title">
          Tu demo está en camino
        </h3>
        <p className="demo-confirmation-body">
          Nos pondremos en contacto a{' '}
          <span className="demo-confirmation-highlight">
            {data.email}
          </span>{' '}
          para coordinar un live demo
          {isSoloProvider
            ? ' enfocado en tu práctica.'
            : ' enfocado en tu equipo.'}
        </p>
        {data.timezone && data.timezone !== 'No especificada' && (
          <p className="demo-confirmation-subtext">
            Zona horaria: {data.timezone}
          </p>
        )}
      </div>
    </div>
  );
};

export default DemoConfirmationWidget;
