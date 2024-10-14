import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import TravelerDashboard from './pages/TravelerDashboard'
import BuyerDashboard from './pages/BuyerDashboard'
import CreateRoute from './pages/CreateRoute'
import SearchRoutes from './pages/SearchRoutes'
import Login from './pages/Login'
import Register from './pages/Register'
import Messages from './pages/Messages'
import UserProfile from './pages/UserProfile'
import Chat from './pages/Chat'
import Payment from './pages/Payment'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { SocketProvider } from './contexts/SocketContext'
import { NotificationProvider } from './contexts/NotificationContext'

const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { user } = useAuth();
  return user ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <NotificationProvider>
          <Router>
            <div className="min-h-screen flex flex-col bg-gray-100">
              <Header />
              <main className="flex-grow container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/traveler" element={<PrivateRoute element={<TravelerDashboard />} />} />
                  <Route path="/buyer" element={<PrivateRoute element={<BuyerDashboard />} />} />
                  <Route path="/create-route" element={<PrivateRoute element={<CreateRoute />} />} />
                  <Route path="/search-routes" element={<PrivateRoute element={<SearchRoutes />} />} />
                  <Route path="/messages" element={<PrivateRoute element={<Messages />} />} />
                  <Route path="/chat" element={<PrivateRoute element={<Chat />} />} />
                  <Route path="/user/:userId" element={<UserProfile />} />
                  <Route path="/payment" element={<PrivateRoute element={<Payment />} />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </NotificationProvider>
      </SocketProvider>
    </AuthProvider>
  )
}

export default App