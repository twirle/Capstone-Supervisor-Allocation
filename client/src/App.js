import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";

// pages & components
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Student from "./pages/Student";
import AddStudent from "./pages/AddStudent";
import AdminUsersPage from "./pages/AdminUsersPage";
import FacultyRatingPage from "./pages/FacultyRatingPage";

function App() {
  const { user, loading } = useAuthContext();

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            <Route
              path="/"
              element={!loading && (user ? <Home /> : <Navigate to="/login" />)}
            />
            <Route
              path="/login"
              element={!loading && (!user ? <Login /> : <Navigate to="/" />)}
            />
            <Route
              path="/signup"
              element={
                !loading &&
                (user && user.role === "admin" ? (
                  <Signup />
                ) : (
                  <Navigate to="/" />
                ))
              }
            />
            <Route
              path="/students"
              element={<Student />}
              // limit to only faculty leads later
              // {user && user.role === 'faculty_lead' && <Link to="/students">Students</Link>}
            />
            <Route path="/AddStudent" element={<AddStudent />} />

            <Route
              path="/adminUsersPage"
              element={
                !loading &&
                (user && user.role === "admin" ? (
                  <AdminUsersPage />
                ) : (
                  <Navigate to="/" />
                ))
              }
            />
            <Route
              path="/facultyRating"
              element={
                !loading &&
                (user && user.role === "facultyMember" || "admin" ? (
                  <FacultyRatingPage />
                ) : (
                  <Navigate to="/" />
                ))
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
