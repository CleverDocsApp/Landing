export type WidgetType = 'none' | 'howto' | 'time_savings' | 'demo_confirmation';

export function classifyAssistantMessage(messageText: string): WidgetType {
  const text = (messageText || '').trim();
  const lowerText = text.toLowerCase();

  // Widget OK How-To
  if (
    lowerText.includes('onklinic.com/ok-how-to') ||
    lowerText.includes('ok how-to') ||
    lowerText.includes('ok how to')
  ) {
    return 'howto';
  }

  // Widget de cálculo de tiempo
  // Con que aparezca "Time Analysis:" en la respuesta nos basta
  if (lowerText.includes('time analysis:')) {
    return 'time_savings';
  }

  // Widget de confirmación de demo
  // Cubrimos varias formas posibles del mensaje
  if (
    lowerText.startsWith('demo request received!') ||
    lowerText.includes('demo request captured successfully') ||
    lowerText.includes('solicitud de demo')
  ) {
    return 'demo_confirmation';
  }

  return 'none';
}
