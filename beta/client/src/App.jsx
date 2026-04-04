import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Plans from './pages/Plans.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Deposit from './pages/Deposit.jsx';
import ProcessClaim from './pages/ProcessClaim.jsx';
import ClaimResult from './pages/ClaimResult.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/plans" element={<Plans />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/deposit" element={<Deposit />} />
      <Route path="/claim/process" element={<ProcessClaim />} />
      <Route path="/claim/result" element={<ClaimResult />} />
    </Routes>
  );
}
