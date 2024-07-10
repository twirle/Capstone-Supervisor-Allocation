import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";

// pages & components
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import SupervisorInfo from "./pages/SupervisorInfo";
import StudentInfo from "./pages/StudentInfo";
import AdminUsersPage from "./pages/AdminUsersPage";
import SupervisorInterestPage from "./pages/SupervisorInterestPage";

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
              path="/supervisorInterest"
              element={
                !loading &&
                (user &&
                (user.role === "facultyMember" ||
                  user.role === "admin" ||
                  user.role === "supervisor") ? (
                  <SupervisorInterestPage />
                ) : (
                  <Navigate to="/" />
                ))
              }
            />

            <Route
              path="/supervisorInfo"
              element={
                !loading &&
                (user && user.role === "supervisor" ? (
                  <SupervisorInfo />
                ) : (
                  <Navigate to="/" />
                ))
              }
            />

            <Route
              path="/studentInfo"
              element={
                !loading &&
                (user && (user.role === "student" || user.role === "admin") ? (
                  <StudentInfo />
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
