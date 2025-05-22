export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

export interface Option {
  id: string;
  text: string;
  value: string;
}