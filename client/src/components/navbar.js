import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";
import "../css/navbar.css";

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const handleClick = () => {
    logout();
  };

  return (
    <header>
      <div className="container navbar-container">
        <Link to="/">
          <h1>Capstone Supervisor-Student Matching</h1>
        </Link>
        <nav>
          {user && (user.role === "admin" || user.role === "facultyMember") && (
            <div className="nav-links">
              {user.role === "admin" && <Link to="/signup">Signup</Link>}
              {user.role === "admin" && (
                <Link to="/adminUsersPage">Manage Users</Link>
              )}
              <Link to="/facultyInterest">Faculty Interest</Link>
            </div>
          )}
          {user && (
            <div className="user-info">
              <span>{user.email}</span>
              <button onClick={handleClick}>Log Out</button>
            </div>
          )}
          {!user && (
            <div>
              <Link to="/login">Login</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
