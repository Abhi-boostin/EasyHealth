import { Routes, Route } from 'react-router-dom'
import './App.css'
import Dashboard from './pages/Dashboard.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Chat from './pages/Chat.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/chat" element={<Chat />} />
    </Routes>
  )
}

export default App