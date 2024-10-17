
import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import EventDetail from './components/events/EventDetail';
import EventForm from './components/events/EventForm';
import EventList from './components/events/EventList';
import { AuthProvider,AuthContext } from './context/AuthProvider'; 

function App() {

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/user/register" />} />
        <Route path="/user/login" element={<Login />} />
        <Route path="/user/register" element={<Register />} />
        <Route path="/events/new" element={<PrivateRoute component={EventForm} />} />
        <Route path="/events/:id/edit" element={<PrivateRoute component={EventForm} />} />
        <Route path="/events/:id" element={<PrivateRoute component={EventDetail} />} />
        <Route path="/events" element={<EventList />} />     {/* List of events */}
      </Routes>
    </AuthProvider>
  );
}

const PrivateRoute = ({ component: Component }) => {
  const { isLoggedIn } = useContext(AuthContext); // Use AuthContext to check login status

  return isLoggedIn ? <Component /> : <Navigate to="/user/login" />;
};

export default App;
