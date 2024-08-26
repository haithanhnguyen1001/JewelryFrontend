import Layout from './components/Layout/Layout';
import './App.css';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import { useUserStore } from '../store';
import { useEffect } from 'react';

function App() {
  console.log('app');
  const navigate = useNavigate();
  const token = useUserStore(state => state.token);
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [])

  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path='/*' element={<Layout />}>
        </Route>
      </Routes>
    </div>
  )
}

export default App;
