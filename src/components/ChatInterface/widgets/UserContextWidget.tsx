import React, { useState } from 'react';
import './UserContextWidget.css';

type UserSegment = 'solo_clinician' | 'small_practice' | 'clinic_enterprise' | 'other';
type UserRole = 'clinician' | 'rbt' | 'supervisor' | 'clinical_director' | 'other';
type ConversationLanguage = 'en' | 'es';

interface UserContextWidgetProps {
  language: ConversationLanguage;
  onSubmitContext: (context: {
    segment: UserSegment;
    role: UserRole;
    customSegment?: string;
    customRole?: string;
  }) => void;
  onSkip?: () => void;
}

const UserContextWidget: React.FC<UserContextWidgetProps> = ({
  language,
  onSubmitContext,
  onSkip,
}) => {
  const [segment, setSegment] = useState<UserSegment>('solo_clinician');
  const [role, setRole] = useState<UserRole>('clinician');
  const [customSegment, setCustomSegment] = useState('');
  const [customRole, setCustomRole] = useState('');

  const isEs = language === 'es';

  const labels = {
    title: isEs
      ? 'Ayúdame a adaptar las respuestas'
      : 'Help me tailor the answers',
    subtitle: isEs
      ? '¿Qué rol tienes y qué tipo de organización eres?'
      : 'What is your role and what type of organization are you?',
    roleLabel: isEs ? 'Rol' : 'Role',
    orgLabel: isEs ? 'Organización' : 'Organization',
    roleOptions: {
      clinician: isEs ? 'Clinician' : 'Clinician',
      rbt: 'RBT',
      supervisor: isEs ? 'Supervisor' : 'Supervisor',
      clinical_director: isEs ? 'Director clínico' : 'Clinical Director',
      other: isEs ? 'Otro' : 'Other',
    },
    segmentOptions: {
      solo_clinician: isEs ? 'Solo clinician' : 'Solo clinician',
      small_practice: isEs ? 'Practice (2–10)' : 'Practice (2–10)',
      clinic_enterprise: isEs ? 'Clínica / Enterprise' : 'Clinic / Enterprise',
      other: isEs ? 'Otro' : 'Other',
    },
    otherRolePlaceholder: isEs
      ? 'Especifica tu rol'
      : 'Specify your role',
    otherOrgPlaceholder: isEs
      ? 'Especifica tu organización'
      : 'Specify your organization',
    confirm: isEs ? 'Confirmar' : 'Confirm',
    skip: isEs ? 'Omitir por ahora' : 'Skip for now',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitContext({
      segment,
      role,
      customSegment: segment === 'other' ? customSegment.trim() : undefined,
      customRole: role === 'other' ? customRole.trim() : undefined,
    });
  };

  return (
    <div className="user-context-widget">
      <div className="user-context-widget-content">
        <h3 className="user-context-title">{labels.title}</h3>
        <p className="user-context-subtitle">{labels.subtitle}</p>

        <form className="user-context-form" onSubmit={handleSubmit}>
          <div className="user-context-group">
            <span className="user-context-label">{labels.roleLabel}</span>
            <div className="user-context-pills">
              {(['clinician', 'rbt', 'supervisor', 'clinical_director', 'other'] as UserRole[]).map(
                (value) => (
                  <button
                    key={value}
                    type="button"
                    className={
                      role === value
                        ? 'context-pill context-pill--active'
                        : 'context-pill'
                    }
                    onClick={() => setRole(value)}
                  >
                    {labels.roleOptions[value]}
                  </button>
                )
              )}
            </div>
            {role === 'other' && (
              <input
                className="user-context-input"
                type="text"
                placeholder={labels.otherRolePlaceholder}
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
              />
            )}
          </div>

          <div className="user-context-group">
            <span className="user-context-label">{labels.orgLabel}</span>
            <div className="user-context-pills">
              {(['solo_clinician', 'small_practice', 'clinic_enterprise', 'other'] as UserSegment[]).map(
                (value) => (
                  <button
                    key={value}
                    type="button"
                    className={
                      segment === value
                        ? 'context-pill context-pill--active'
                        : 'context-pill'
                    }
                    onClick={() => setSegment(value)}
                  >
                    {labels.segmentOptions[value]}
                  </button>
                )
              )}
            </div>
            {segment === 'other' && (
              <input
                className="user-context-input"
                type="text"
                placeholder={labels.otherOrgPlaceholder}
                value={customSegment}
                onChange={(e) => setCustomSegment(e.target.value)}
              />
            )}
          </div>

          <div className="user-context-actions">
            <button type="submit" className="user-context-confirm">
              {labels.confirm}
            </button>
            {onSkip && (
              <button
                type="button"
                className="user-context-skip"
                onClick={onSkip}
              >
                {labels.skip}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserContextWidget;
