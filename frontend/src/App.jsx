import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import WorkerDashboard from './pages/WorkerDashboard';
import ContractorDashboard from './pages/ContractorDashboard';
import EditProfile from './pages/EditProfile';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/worker/dashboard" element={<WorkerDashboard />} />
            <Route path="/worker/edit-profile" element={<EditProfile />} />
            <Route path="/contractor/dashboard" element={<ContractorDashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}


export default App;
