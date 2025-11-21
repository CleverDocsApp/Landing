export type WidgetType = 'none' | 'howto' | 'time_savings' | 'demo_confirmation';

export function classifyAssistantMessage(messageText: string): WidgetType {
  const lowerText = messageText.toLowerCase();

  // Widget OK How-To
  if (lowerText.includes('onklinic.com/ok-how-to') ||
      lowerText.includes('ok how-to') ||
      lowerText.includes('ok how to')) {
    return 'howto';
  }

  // Widget de cálculo de tiempo
  if (messageText.startsWith('Time Analysis:')) {
    return 'time_savings';
  }

  // Widget de confirmación de demo
  if (messageText.startsWith('Demo request received!')) {
    return 'demo_confirmation';
  }

  return 'none';
}
