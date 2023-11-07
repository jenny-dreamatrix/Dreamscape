import './NavBar.css'
import { Link } from 'react-router-dom';
import { UserContext } from '../../context/UserContext'
import { useContext } from 'react';

const NavBar = () => {
    const { isLoggedIn, logout } = useContext(UserContext);

    return ( 
        <nav>
        <Link to="/home">Home</Link>
        {!isLoggedIn && (
          <>
          <Link to="/signup">Signup</Link>
          <Link to="/login">Login</Link>
          </>
        )}
        {isLoggedIn && (
          <>
          <Link to="/profile">Profile</Link>
            <button type="button" onClick={logout}>
              Logout
            </button>
          </>
        )}
        </nav>
    );
}

export default NavBar;