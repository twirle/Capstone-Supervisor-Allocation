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
          <h1>Capstone Connect</h1>
        </Link>
        <nav>
          {user && user.role === "admin" && (
            <div className="nav-links">
              <Link to="/adminUsersPage">Manage Users</Link>
              <Link to="/supervisorInterest">Supervisor Interest</Link>
              <Link to="/matchManage">Match Management</Link>
            </div>
          )}

          {user && user.role === "supervisor" && (
            <div className="nav-links">
              <Link to="/supervisorInterest">Supervisor Interest</Link>
              <Link to="/supervisorInfo">Match Information</Link>
            </div>
          )}

          {user && user.role === "facultyMember" && (
            <div className="nav-links">
              <Link to="/supervisorInterest">Supervisor Interest</Link>
            </div>
          )}

          {user && user.role === "student" && (
            <div className="nav-links">
              <Link to="/studentInfo">Match Information</Link>
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
