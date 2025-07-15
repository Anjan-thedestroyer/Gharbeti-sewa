import React, { useEffect, useState } from 'react';
import './Navbar.css';
import logo from '../assets/edusity_assets/logo.png';
import menu_icon from '../assets/edusity_assets/menu-icon.png';
import { Link } from 'react-scroll';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';

const Navbar = ({ color }) => {
  const [sticky, setSticky] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [hostel, setHostel] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 500 || color === 'no');
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // call immediately

    return () => window.removeEventListener('scroll', handleScroll);
  }, [color]);

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('accesstoken') && localStorage.getItem('refreshToken')
      setIsLogged(!!token);
    };

    checkLoginStatus();
    const getData = async () => {
      try {
        const response = await axiosInstance.get('/user/user-details');
        const hostelData = response.data?.data?.hostel;
        const status = response.data?.data?.role
        if (Array.isArray(hostelData) && hostelData.length > 0 && hostelData[0] !== null) {
          setHostel(true);
        } else {
          setHostel(false);
        }
        if (status === 'ADMIN') {
          setIsAdmin(true)

        } else {
          setIsAdmin(false)
        }

      } catch (error) {
        console.error("Failed to fetch user details:", error);
        setHostel(false);
      }
    };
    getData()
    window.addEventListener('auth-change', checkLoginStatus);
    return () => {
      window.removeEventListener('auth-change', checkLoginStatus);
    };
  }, []);

  const toggleMenu = () => {
    setMobileMenu(prev => !prev);
  };

  const removeToken = async () => {
    try {
      await axiosInstance.get('/user/logout');
      localStorage.removeItem('accesstoken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('myData')
      window.location.href = '/'

      window.dispatchEvent(new Event('auth-change'));
      navigate('/');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div>
      <nav className={`container ${sticky ? 'dark-nav' : ''}`}>
        <img
          onClick={() => {
            navigate('/');
            setMobileMenu(false);
          }}
          src={logo}
          alt='Logo'
          className='logo'
        />

        <ul className={mobileMenu ? '' : 'hide-mobile-menu'}>
          <li onClick={() => {
            navigate('/');
            setMobileMenu(false);
          }}>
            Home
          </li>
          {hostel && (
            <li onClick={() => {
              navigate('/control-hostel');
              setMobileMenu(false);
            }}>
              My works
            </li>
          )}
          <li>
            <Link
              to='about'
              smooth={true}
              offset={0}
              duration={500}
              onClick={() => setMobileMenu(false)}
            >
              About Us
            </Link>
          </li>
          {isAdmin && (
            <li
              onClick={() => {
                navigate('/unverified');
                setMobileMenu(false);
              }}
            >
              Verify
            </li>
          )}

          {isLogged ? (
            <li>
              <button onClick={removeToken} className='btn'>Logout</button>
            </li>
          ) : (
            <li>
              <button
                onClick={() => {
                  navigate('/login');
                  setMobileMenu(false);
                }}
                className='btn'
              >
                Login
              </button>
            </li>
          )}
        </ul>

        <img
          onClick={toggleMenu}
          src={menu_icon}
          alt="Menu"
          className='menu-icon'
        />
      </nav>
    </div>
  );
};

export default Navbar;
