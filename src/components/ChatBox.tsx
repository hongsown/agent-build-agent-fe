import React, { useState, useRef, useEffect } from 'react';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, ExternalLink } from 'lucide-react';
import StepList from './StepList';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface AgentStep {
  activity: string;
  url?: string;
  id?: number;
  message?: string;
}

interface ChatBoxProps {
  onAgentDeployed?: (agentId: number) => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ onAgentDeployed }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentSteps, setCurrentSteps] = useState<AgentStep[]>([]);
  const [sessionId, setSessionId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentSteps]);

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
    setCurrentSteps([]);

    try {
      await fetchEventSource('http://54.179.34.55:5001/messages/send', {
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

          // Handle [DONE] event
          if (event.data === '[DONE]') {
            console.log('Stream completed');
            return;
          }

          try {
            const data: AgentStep = JSON.parse(event.data);

            // Handle different types of events
            switch (data.activity) {
              case 'visit_website':
                setCurrentSteps((prev) => [...prev, data]);
                break;
              case 'embed_document':
                setCurrentSteps((prev) => [...prev, data]);
                break;
              case 'deploy_agent':
                setCurrentSteps((prev) => [...prev, data]);
                break;
              case 'agent_deployed':
                setCurrentSteps((prev) => [...prev, data]);
                if (data.id && onAgentDeployed) {
                  onAgentDeployed(data.id);
                }
                break;
              case 'streaming':
                if (data.message) {
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
                }
                break;
              default:
                console.log('Unknown activity:', data.activity);
            }
          } catch (error) {
            console.error('Error parsing event data:', error);
          }
        },
        onerror(err) {
          console.log('EventSource failed:', err);
          setIsLoading(false);
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
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle>Agent Builder Chat</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col space-y-4 overflow-hidden">
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 max-w-full">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${message.sender === 'user'
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

          {/* Show steps when agent is being built */}
          {currentSteps.length > 0 && (
            <div className="mt-4 w-full">
              <StepList steps={currentSteps} />
            </div>
          )}

          {currentSteps.some(step => step.activity === 'agent_deployed') && (
            <div className="mt-4 w-full">
              <div className="flex justify-center">
                <Button
                  onClick={() => {
                    const deployedAgent = currentSteps.find(step => step.activity === 'agent_deployed');
                    if (deployedAgent?.id) {
                      window.open(`/agent/${deployedAgent.id}`, '_blank');
                    }
                  }}
                  className="w-full max-w-sm"
                  size="lg"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Agent Chat
                </Button>
              </div>
              {(() => {
                const deployedAgent = currentSteps.find(step => step.activity === 'agent_deployed');
                return deployedAgent?.id ? (
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Agent ID: {deployedAgent.id}
                  </p>
                ) : null;
              })()}
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
            placeholder="Create an Q/A agent about the website: https://sgtradex.com"
            disabled={isLoading}
            className="flex-1"
          />
          <Button onClick={sendMessage} disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatBox;