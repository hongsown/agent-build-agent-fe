import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, ArrowLeft } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

const AgentChatPage: React.FC = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Add a welcome message when component loads
    const welcomeMessage: Message = {
      id: 'welcome',
      text: `Hello! I'm your Q&A agent (ID: ${agentId}). I can help answer questions based on the knowledge I've been trained on. What would you like to know?`,
      sender: 'assistant',
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, [agentId]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      await fetchEventSource(`http://54.179.34.55:5001/agents/${agentId}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId || undefined,
          message: input,
        }),
        onopen(res) {
          if (res.ok && res.status === 200) {
            console.log('Connection made ', res);
          } else if (res.status >= 400 && res.status < 500 && res.status !== 429) {
            console.log('Client side error ', res);
          }
        },
        onmessage(event) {
          console.log('Received event:', event.data);
          try {
            const data = JSON.parse(event.data);

            if (data.activity === 'streaming' && data.message) {
              // Add or update the streaming message
              setMessages((prev) => {
                const lastMessage = prev[prev.length - 1];
                if (lastMessage && lastMessage.sender === 'assistant' && lastMessage.id === 'streaming') {
                  // Update existing streaming message
                  return [
                    ...prev.slice(0, -1),
                    {
                      ...lastMessage,
                      text: lastMessage.text + data.message,
                    },
                  ];
                } else {
                  // Create new streaming message
                  return [
                    ...prev,
                    {
                      id: 'streaming',
                      text: data.message,
                      sender: 'assistant' as const,
                      timestamp: new Date(),
                    },
                  ];
                }
              });
            } else if (data.message) {
              // Handle non-streaming messages
              const assistantMessage: Message = {
                id: Date.now().toString(),
                text: data.message,
                sender: 'assistant',
                timestamp: new Date(),
              };
              setMessages((prev) => [...prev, assistantMessage]);
            }
          } catch (error) {
            console.error('Error parsing event data:', error);
            // Fallback: treat as plain text
            const assistantMessage: Message = {
              id: Date.now().toString(),
              text: event.data,
              sender: 'assistant',
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, assistantMessage]);
          }
        },
        onerror(err) {
          console.log('EventSource failed:', err);
          setIsLoading(false);
          // Show error message to user
          const errorMessage: Message = {
            id: Date.now().toString(),
            text: 'Sorry, I encountered an error. Please try again.',
            sender: 'assistant',
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, errorMessage]);
        },
        onclose() {
          console.log('Connection closed');
          setIsLoading(false);
          // Update the streaming message ID to a unique one
          setMessages((prev) => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage && lastMessage.id === 'streaming') {
              return [
                ...prev.slice(0, -1),
                {
                  ...lastMessage,
                  id: Date.now().toString(),
                },
              ];
            }
            return prev;
          });
        },
      });
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
      // Show error message to user
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: 'Sorry, I couldn\'t connect to the agent. Please check your connection and try again.',
        sender: 'assistant',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-4">
          <Button variant="ghost" onClick={goBack} className="mb-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <Card className="h-[calc(100vh-120px)] flex flex-col">
          <CardHeader>
            <CardTitle>Agent Chat - ID: {agentId}</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col space-y-4">
            {/* Messages area */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted text-muted-foreground p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm">Agent is thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about the website..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button onClick={sendMessage} disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgentChatPage;