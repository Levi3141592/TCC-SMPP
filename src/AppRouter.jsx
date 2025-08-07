// src/AppRouter.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import Calendar from './calendar'; // ajuste o caminho se estiver em outra pasta

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/calendar" element={<Calendar />} />
      </Routes>
    </Router>
  );
}

