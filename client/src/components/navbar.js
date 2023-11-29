import { Link } from "react-router-dom"
import { useLogout } from "../hooks/useLogout"
import { useAuthContext } from "../hooks/useAuthContext"

const Navbar = () => {
  const { logout } = useLogout()
  const { user } = useAuthContext()
  const handleClick = () => {
    logout()
  }

  return (
    <header>
      <div className="container">
        <Link to="/">
          <h1>IWSP Mentor-Student Assignments</h1>
        </Link>
        <nav>
          {user && user.role === 'admin' && (
            <div>
              <Link to="/addstudent">Add Students</Link>
              <Link to="/students">Manage Students</Link>
              <Link to="/signup">Signup</Link>
            </div>
          )}
          {user && (
            <div>
              <span> {user.email}</span>
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
  )
}

export default Navbar