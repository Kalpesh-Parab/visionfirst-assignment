import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Login from './Login';
import Register from './Register';
import CompanyManagement from './CompanyManagement';
import EditCompany from './EditCompany';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

import ProtectedRoute from './ProtectedRoute'; // Import the ProtectedRoute
import { UserProvider } from './userContext';

function App() {
  return (
    <>
      <UserProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />

            {/* Protect the company management routes */}
            <Route
              path='/companies'
              element={
                <ProtectedRoute>
                  <CompanyManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path='/companies/edit/:id'
              element={
                <ProtectedRoute>
                  <EditCompany />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </UserProvider>
      <ToastContainer />
    </>
  );
}

export default App;
