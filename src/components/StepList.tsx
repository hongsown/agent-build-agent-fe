import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, Globe, Database, Rocket } from 'lucide-react';

interface AgentStep {
  activity: string;
  url?: string;
  id?: number;
  message?: string;
}

interface StepListProps {
  steps: AgentStep[];
}

const StepList: React.FC<StepListProps> = ({ steps }) => {
  const getStepInfo = (activity: string) => {
    switch (activity) {
      case 'visit_website':
        return {
          icon: <Globe className="h-4 w-4" />,
          title: 'Visiting Website',
          description: 'Analyzing the website content and structure',
          status: 'completed' as const,
        };
      case 'embed_document':
        return {
          icon: <Database className="h-4 w-4" />,
          title: 'Processing Documents',
          description: 'Creating embeddings from website content',
          status: 'completed' as const,
        };
      case 'deploy_agent':
        return {
          icon: <Rocket className="h-4 w-4" />,
          title: 'Deploying Agent',
          description: 'Setting up the Q&A agent with processed knowledge',
          status: 'completed' as const,
        };
      case 'agent_deployed':
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          title: 'Agent Deployed Successfully',
          description: 'Your Q&A agent is ready to use!',
          status: 'completed' as const,
        };
      default:
        return {
          icon: <Clock className="h-4 w-4" />,
          title: 'Processing',
          description: 'Working on your request...',
          status: 'in_progress' as const,
        };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'in_progress':
        return 'text-blue-600';
      default:
        return 'text-gray-500';
    }
  };


  return (
    <Card className="w-full max-w-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Building Your Agent</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-4">
        {steps.map((step, index) => {
          const stepInfo = getStepInfo(step.activity);
          return (
            <div key={index} className="flex items-start space-x-3 w-full">
              <div className={`mt-0.5 flex-shrink-0 ${getStatusColor(stepInfo.status)}`}>
                {stepInfo.icon}
              </div>
              <div className="flex-1 min-w-0 overflow-hidden">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground truncate">
                    {stepInfo.title}
                  </p>
                  {stepInfo.status === 'in_progress' && (
                    <div className="flex space-x-1 flex-shrink-0 ml-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground break-words">
                  {stepInfo.description}
                </p>
                {step.url && (
                  <p className="text-xs text-blue-600 mt-1 truncate">
                    {step.url}
                  </p>
                )}
              </div>
            </div>
          );
        })}

      </CardContent>
    </Card>
  );
};

export default StepList;