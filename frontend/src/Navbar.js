import React, { useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from './api';
import { UserContext } from './userContext'; // Import the UserContext

const Navbar = () => {
  const { user, setUser } = useContext(UserContext); // Use context to get user data
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.get('/users/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data); // Update user in context
        } catch (error) {
          console.error('Failed to fetch user', error);
        }
      }
    };

    fetchUser();
  }, [setUser]); // Only run when setUser changes

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null); // Reset user state immediately
    navigate('/login');
  };

  return (
    <nav className='navbar navbar-expand-lg navbar-dark bg-primary'>
      <div className='container-fluid'>
        <Link className='navbar-brand' to='/'>
          My App
        </Link>
        <button
          className='navbar-toggler'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbarNav'
        >
          <span className='navbar-toggler-icon'></span>
        </button>
        <div className='collapse navbar-collapse' id='navbarNav'>
          <ul className='navbar-nav ms-auto'>
            {user ? (
              <>
                <li className='nav-item'>
                  <span className='navbar-text me-3'>
                    Welcome, {user.name} (
                    {user.role === 'IT_ADMIN' ? 'Admin View' : 'User View'})
                  </span>
                </li>
                <li className='nav-item'>
                  <Link className='nav-link' to='/companies'>
                    Company Management
                  </Link>
                </li>
                <li className='nav-item'>
                  <button className='btn btn-danger' onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className='nav-item'>
                  <Link className='nav-link' to='/login'>
                    Login
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link className='nav-link' to='/register'>
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
