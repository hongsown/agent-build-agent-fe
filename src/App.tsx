import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import AgentChatPage from './components/AgentChatPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/agent/:agentId" element={<AgentChatPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
