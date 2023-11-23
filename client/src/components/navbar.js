import { Link } from "react-router-dom"
const Navbar = () => {
  return (
    <header>
      <div className="contrainer">
        <Link to="/">
          <h1>Students List</h1>
        </Link>
      </div>
    </header>
  )
}

export default Navbar