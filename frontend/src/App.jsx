import { Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import TurmaDetalhe from './pages/TurmaDetalhe';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <Link to="/" className="app-brand">
          Frequência<span>CF</span>
        </Link>
        <span className="app-subtitle">Acompanhamento de frequência do Centro de Formação</span>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/turmas/:idTurma" element={<TurmaDetalhe />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
