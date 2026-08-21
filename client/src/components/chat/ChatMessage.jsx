import React from 'react';
import { UserMessage } from './UserMessage';
import { AIResponse } from './AIResponse';

export const ChatMessage = ({ message }) => {
  if (message.sender === 'user') {
    return <UserMessage content={message.text} timestamp={message.timestamp} />;
  }

  return (
    <AIResponse content={message.text} timestamp={message.timestamp}>
      {message.children}
    </AIResponse>
  );
};
