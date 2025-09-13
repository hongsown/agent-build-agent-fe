# Agent Builder - React Chatbox Interface

A modern React application built with Vite and shadcn/ui for creating and interacting with AI agents.

## Features

- **Agent Creation**: Build Q&A agents from any website URL
- **Real-time Progress**: See live steps as your agent is being built (visit website → process content → deploy agent)
- **Chat Interface**: Interact with deployed agents through a clean chat interface
- **Server-Sent Events (SSE)**: Real-time streaming responses using `@microsoft/fetch-event-source`
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository or download the code
2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Creating an Agent

1. On the home page, you'll see the main chatbox
2. Enter a prompt like: "Create an Q/A agent about the website: https://sgtradex.com"
3. Watch as the system:
   - Visits the website
   - Processes and embeds the content
   - Deploys your agent
4. Once deployed, click "Open Agent Chat" to start chatting with your agent

### Chatting with an Agent

1. Each agent gets a unique chat interface at `/agent/{id}`
2. Ask questions about the website content the agent was trained on
3. Get real-time streamed responses

## Project Structure

```
src/
├── components/
│   ├── ui/                 # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── card.tsx
│   ├── ChatBox.tsx         # Main chat interface for agent creation
│   ├── StepList.tsx        # Progress indicator for agent building
│   ├── AgentChatPage.tsx   # Individual agent chat interface
│   └── HomePage.tsx        # Landing page
├── lib/
│   └── utils.ts           # Utility functions (cn helper)
├── App.tsx               # Main app with routing
└── main.tsx             # Application entry point
```

## API Integration

The application connects to the agent builder API at `http://54.179.34.55:5001`:

- `POST /messages/send` - Create new agents
- `POST /agents/{id}/chat` - Chat with specific agents

Both endpoints use Server-Sent Events for real-time streaming responses.

## Technologies Used

- **React 19** with TypeScript
- **Vite** for fast development and building
- **shadcn/ui** for beautiful, accessible UI components
- **Tailwind CSS** for styling
- **React Router** for navigation
- **@microsoft/fetch-event-source** for SSE handling
- **Lucide React** for icons

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Development Notes

- The app uses TypeScript for type safety
- ESLint is configured for code quality
- The project follows React best practices
- Components are well-commented for easy understanding and extension

## Customization

The application is designed to be easily customizable:

- Modify API endpoints in the components
- Adjust styling by editing Tailwind classes
- Add new UI components using shadcn/ui
- Extend functionality by adding new routes and components
