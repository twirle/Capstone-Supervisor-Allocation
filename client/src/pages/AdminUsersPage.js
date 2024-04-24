import { useEffect, useState } from "react";
import UserDetails from "../components/UserDetails";
import { useAuthContext } from "../hooks/useAuthContext";
import "../css/adminUsersPage.css";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState("All");
  const [selectedCourse, setSelectedCourse] = useState("All");
  const { user } = useAuthContext();
  const [activeRole, setActiveRole] = useState("student");

  const baseUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchFaculties(user.token);
  }, []); // Fetch faculties on component mount

  useEffect(() => {
    fetchUsers(activeRole, user.token);
  }, [activeRole, user.token]);

  const fetchUsers = async (role) => {
    if (!role) {
      console.error("Role is undefined");
      return;
    }
    try {
      const response = await fetch(`${baseUrl}/api/${role}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        formatUserData(data);
      } else {
        console.error("Failed to fetch data:", data.error);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const fetchFaculties = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/faculty`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setFaculties(["All", ...data.map((f) => f.name)]);
      } else {
        console.error("Failed to fetch faculties:", data.error);
      }
    } catch (err) {
      console.error("Error fetching faculties:", err);
    }
  };

  const formatUserData = (data) => {
    const formattedData = data.map((u) => ({
      ...u,
      email: u.user.email,
      facultyName: u.faculty ? u.faculty.name : "No Faculty",
      courseName: u.course || "No Course",
      mentorName:
        activeRole === "student" && u.assignedMentor
          ? u.assignedMentor.name
          : undefined,
      studentNames:
        activeRole === "mentor" && u.assignedStudents
          ? u.assignedStudents.map((student) => student.name).join(", ")
          : undefined,
    }));
    setUsers(formattedData);
    setCourses(["All", ...new Set(formattedData.map((u) => u.courseName))]); // Extract unique courses
  };

  const filteredUsers = users.filter(
    (u) =>
      (selectedFaculty === "All" || u.facultyName === selectedFaculty) &&
      (selectedCourse === "All" || u.courseName === selectedCourse)
  );

  const handleUserSave = (updatedUser) => {
    setUsers(
      users.map((user) => (user._id === updatedUser._id ? updatedUser : user))
    );
    fetchUsers(activeRole);
  };

  const handleUserDelete = (userId) => {
    setUsers(users.filter((u) => u._id !== userId));
    fetchUsers(activeRole);
  };

  const resetAssignments = async () => {
    // Call endpoint to reset assignments
    const response = await fetch(`${baseUrl}/api/match/reset`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (response.ok) {
      fetchUsers(activeRole); // Refetch users to update UI post-reset
      console.log("Assignments reset successfully");
    } else {
      console.error("Failed to reset assignments");
    }
  };

  const testMatch = async () => {
    const response = await fetch(`${baseUrl}/api/match/match`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (response.ok) {
      fetchUsers(activeRole); // Refetch users to update UI post-reset
      console.log("Test match executed successfully");
    } else {
      console.error("Failed to execute test match");
    }
  };

  return (
    <div className="admin-users-page">
      <h1>{activeRole.charAt(0).toUpperCase() + activeRole.slice(1)} Users</h1>
      <div className="role-buttons">
        <div className="role-controls">
          {["student", "mentor", "facultyMember", "admin"].map((role) => (
            <button
              key={role}
              className={
                role === activeRole ? "role-button active" : "role-button"
              }
              onClick={() => setActiveRole(role)}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          ))}
        </div>
        <div>
          <div className="match-buttons">
            <button className="match-button" onClick={resetAssignments}>
              Reset Assignments
            </button>
            <button className="match-button" onClick={testMatch}>
              Test Match
            </button>
          </div>
        </div>
      </div>
      <div className="filters">
        <select
          value={selectedFaculty}
          onChange={(e) => setSelectedFaculty(e.target.value)}
        >
          {faculties.map((faculty) => (
            <option key={faculty} value={faculty}>
              {faculty}
            </option>
          ))}
        </select>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          disabled={activeRole !== "student"}
        >
          {courses.map((course) => (
            <option key={course} value={course}>
              {course}
            </option>
          ))}
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Faculty</th>
            {activeRole === "mentor" && <th>Research Area</th>}
            {activeRole === "mentor" && <th>Assigned Students</th>}
            {activeRole === "student" && <th>Course</th>}
            {activeRole === "student" && <th>Company</th>}
            {activeRole === "student" && <th>Mentor</th>}
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <UserDetails
              key={user._id}
              userDetail={user}
              role={activeRole}
              onSave={handleUserSave}
              onDelete={handleUserDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsersPage;
