import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface AgentTone {
  id: string;
  name: string;
  description: string;
  prompt: string;
}

interface AgentSettingsProps {
  selectedTone: string;
  onToneChange: (toneId: string) => void;
  onClose: () => void;
}

const AgentSettings: React.FC<AgentSettingsProps> = ({ selectedTone, onToneChange, onClose }) => {
  const tones: AgentTone[] = [
    {
      id: 'professional',
      name: 'Professional',
      description: 'Formal, polite, and precise',
      prompt: 'Always respond in a professional, formal, and precise manner. Use proper business language and maintain a respectful tone.'
    },
    {
      id: 'friendly',
      name: 'Friendly & Warm',
      description: 'Warm, approachable, and welcoming',
      prompt: 'Be warm, friendly, and approachable in your responses. Use a conversational tone that makes users feel comfortable and welcomed.'
    },
    {
      id: 'expert',
      name: 'Expert',
      description: 'Authoritative, detailed, and credible',
      prompt: 'Respond as an authoritative expert with deep knowledge. Provide detailed, comprehensive answers with technical accuracy and professional credibility.'
    },
    {
      id: 'casual',
      name: 'Casual',
      description: 'Relaxed, informal, and natural',
      prompt: 'Use a casual, relaxed tone as if talking to a friend. Keep responses natural and conversational without being overly formal.'
    },
    {
      id: 'helpful',
      name: 'Supportive',
      description: 'Patient, thorough, and helpful',
      prompt: 'Be extremely helpful, patient, and supportive. Go above and beyond to assist users and provide comprehensive guidance.'
    }
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Agent Settings - Choose Tone</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          {tones.map((tone) => (
            <div
              key={tone.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedTone === tone.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => onToneChange(tone.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold">{tone.name}</h3>
                    {selectedTone === tone.id && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {tone.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onClose}>
            Confirm
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentSettings;