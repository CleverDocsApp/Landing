import React from 'react';
import './DemoConfirmationWidget.css';

type ConversationLanguage = 'en' | 'es';

interface DemoConfirmationWidgetProps {
  messageText: string;
  language: ConversationLanguage;
  className?: string;
}

interface DemoData {
  name: string;
  email: string;
  role: string;
  teamSize: number;
  timezone: string;
}

const DemoConfirmationWidget: React.FC<DemoConfirmationWidgetProps> = ({ messageText, language, className = '' }) => {
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

      const isEs = language === 'es';
      return {
        name: data.name,
        email: data.email,
        role: data.role || (isEs ? 'No especificado' : 'Not specified'),
        teamSize: data.teamSize ?? 1,
        timezone: data.timezone || (isEs ? 'No especificada' : 'Not specified'),
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
  const isEs = language === 'es';

  const labels = {
    title: isEs ? 'Tu demo está en camino' : 'Your demo is on its way',
    bodySolo: isEs
      ? 'para coordinar un live demo enfocado en tu práctica.'
      : 'to schedule a live demo focused on your solo practice.',
    bodyTeam: isEs
      ? 'para coordinar un live demo enfocado en tu equipo.'
      : 'to schedule a live demo tailored to your team.',
    contact: isEs ? 'Nos pondremos en contacto a' : "We'll reach out to",
    timezoneLabel: isEs ? 'Zona horaria' : 'Timezone',
    notSpecified: isEs ? 'No especificada' : 'Not specified',
  };

  return (
    <div className={`demo-confirmation-widget ${className}`}>
      <div className="demo-confirmation-widget-content">
        <h3 className="demo-confirmation-widget-title">
          {labels.title}
        </h3>
        <p className="demo-confirmation-body">
          {labels.contact}{' '}
          <span className="demo-confirmation-highlight">
            {data.email}
          </span>{' '}
          {isSoloProvider ? labels.bodySolo : labels.bodyTeam}
        </p>
        {data.timezone && data.timezone !== labels.notSpecified && (
          <p className="demo-confirmation-subtext">
            {labels.timezoneLabel}: {data.timezone}
          </p>
        )}
      </div>
    </div>
  );
};

export default DemoConfirmationWidget;
