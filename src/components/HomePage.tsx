import React from 'react';
import ChatBox from './ChatBox';

const HomePage: React.FC = () => {

  const handleAgentDeployed = (agentId: number) => {
    // Navigate to the agent chat page when agent is deployed
    // This will be handled by the StepList component's button click
    console.log(`Agent ${agentId} deployed successfully`);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Agent Builder
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create intelligent Q&A agents from any website. Simply provide a URL and
            I'll analyze the content, create embeddings, and deploy a custom agent
            that can answer questions about that website's content.
          </p>
        </div>

        <div className="flex justify-center">
          <ChatBox onAgentDeployed={handleAgentDeployed} />
        </div>

        <div className="mt-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">How it works:</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-4 border rounded-lg">
                <div className="font-medium mb-2">1. Visit Website</div>
                <div className="text-muted-foreground">
                  I'll analyze the website content and extract relevant information
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="font-medium mb-2">2. Process Content</div>
                <div className="text-muted-foreground">
                  Create embeddings and prepare the knowledge base for your agent
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="font-medium mb-2">3. Deploy Agent</div>
                <div className="text-muted-foreground">
                  Your Q&A agent is ready to answer questions about the website
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;