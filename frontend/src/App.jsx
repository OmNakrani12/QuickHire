import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import WorkerDashboard from './pages/WorkerDashboard';
import ContractorDashboard from './pages/ContractorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import EditProfile from './pages/EditProfile';
import ContractorEditProfile from './pages/ContractorEditProfile';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import ProtectedRoute from './components/ProtectedRoute';
import VerifyPhone from './pages/VerifyPhone';

function App() {
    return (
        <ThemeProvider>
            <LanguageProvider>
                <Routes>
                    <Route path="/"
                        element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        } />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    <Route path="/verify-phone" element={<VerifyPhone />} />
                    <Route path="/worker/dashboard"
                        element={
                            <ProtectedRoute>
                                <WorkerDashboard />
                            </ProtectedRoute>
                        } />
                    <Route path="/worker/edit-profile"
                        element={
                            <ProtectedRoute>
                                <EditProfile />
                            </ProtectedRoute>
                        } />
                    <Route path="/contractor/dashboard"
                        element={
                            <ProtectedRoute>
                                <ContractorDashboard />
                            </ProtectedRoute>
                        } />
                    <Route path="/contractor/edit-profile"
                        element={
                            <ProtectedRoute>
                                <ContractorEditProfile />
                            </ProtectedRoute>
                        } />
                    <Route path="/admin/dashboard"
                        element={
                            <ProtectedRoute>
                                <AdminDashboard />
                            </ProtectedRoute>
                        } />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </LanguageProvider>
        </ThemeProvider>
    );
}


export default App;
