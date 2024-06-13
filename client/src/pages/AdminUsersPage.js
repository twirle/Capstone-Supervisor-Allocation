import React, { useEffect, useState } from "react";
import UserDetails from "../components/UserDetails";
import { useAuthContext } from "../hooks/useAuthContext";
import "../css/adminUsersPage.css";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState("All");
  const [selectedCourse, setSelectedCourse] = useState("All");
  const [activeRole, setActiveRole] = useState("student");

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  const { user } = useAuthContext();
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchFaculties(user.token);
    fetchAllCourses();
  }, [user.token]);

  useEffect(() => {
    fetchUsers(activeRole, user.token);
  }, [activeRole, user.token]);

  useEffect(() => {
    if (selectedFaculty !== "All") {
      updateCoursesForFaculty(selectedFaculty);
    } else {
      fetchAllCourses();
    }
  }, [selectedFaculty]);

  const changeActiveRole = (newRole) => {
    if (newRole !== activeRole) {
      setActiveRole(newRole);
      setSelectedFaculty("All");
      setSelectedCourse("All");
    }
  };

  const fetchUsers = async (role) => {
    try {
      const response = await fetch(`${apiUrl}/api/${role}`, {
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
      const res = await fetch(`${apiUrl}/api/faculty`, {
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

  const fetchAllCourses = async () => {
    const uniqueCourses = [
      "All",
      ...new Set(
        users.map((user) => user.courseName).filter((course) => course)
      ),
    ];
    setCourses(uniqueCourses);
  };

  const updateCoursesForFaculty = (faculty) => {
    const relevantUsers = users.filter((user) => user.facultyName === faculty);
    const uniqueCourses = [
      "All",
      ...new Set(relevantUsers.map((user) => user.courseName)),
    ];
    setCourses(uniqueCourses);
  };

  const formatUserData = (data) => {
    console.log("data", data);
    const formattedData = data.map((u) => ({
      ...u,
      email: u.user.email,
      facultyName: u.faculty ? u.faculty.name : "No Faculty",
      courseName: u.course || "No Course",
      company: u.company ? u.company.name : "No Company",
      // jobTitle: u.job ? u.job.title : "No Job Title",
      // jobScope: u.job ? u.job.scope : "No Job Scope",
      jobTitle:
        u.company && u.company.jobs
          ? u.company.jobs.map((job) => job.title).join(", ")
          : "No Job Title",
      jobScope:
        u.company && u.company.jobs
          ? u.company.jobs.map((job) => job.scope).join(", ")
          : "No Job Scope",

      supervisorName:
        activeRole === "student" && u.assignedSupervisor
          ? u.assignedSupervisor.name
          : undefined,
      studentNames:
        activeRole === "supervisor" && u.assignedStudents
          ? u.assignedStudents.map((student) => student.name).join(", ")
          : undefined,
    }));
    setUsers(formattedData);
    fetchAllCourses();
  };

  const filteredUsers = users
    .filter(
      (u) =>
        (selectedFaculty === "All" || u.facultyName === selectedFaculty) &&
        (selectedCourse === "All" || u.courseName === selectedCourse) &&
        (u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase())))
    )
    .sort((a, b) => {
      let sortOrder = sortDirection === "asc" ? 1 : -1;
      if (a[sortColumn] < b[sortColumn]) return -sortOrder;
      if (a[sortColumn] > b[sortColumn]) return sortOrder;
      return 0;
    });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
    const response = await fetch(`${apiUrl}/api/match/reset`, {
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
    const response = await fetch(`${apiUrl}/api/match/match`, {
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

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection((prevDirection) =>
        prevDirection === "asc" ? "desc" : "asc"
      );
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  return (
    <div className="admin-users-page">
      <h1>{activeRole.charAt(0).toUpperCase() + activeRole.slice(1)} Users</h1>
      <div className="role-buttons">
        <div className="role-controls">
          {["student", "supervisor", "facultyMember"].map((role) => (
            <button
              key={role}
              className={
                role === activeRole ? "role-button active" : "role-button"
              }
              onClick={() => changeActiveRole(role)}
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
          disabled={selectedFaculty === "All"} // Disable course selection when "All" faculties are selected
          hidden={activeRole !== "student"}
        >
          {courses.map((course) => (
            <option key={course} value={course}>
              {course}
            </option>
          ))}
        </select>
        <input
          type="text"
          className="search-input"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <table className="table-style">
        <thead>
          <tr>
            <th onClick={() => handleSort("name")}>Name</th>
            <th onClick={() => handleSort("facultyName")}>Faculty</th>
            {activeRole === "supervisor" && (
              <th onClick={() => handleSort("researchArea")}>Research Area</th>
            )}
            {activeRole === "supervisor" && (
              <th onClick={() => handleSort("studentNames")}>
                Assigned Students
              </th>
            )}
            {activeRole === "student" && (
              <>
                <th onClick={() => handleSort("courseName")}>Course</th>
                <th onClick={() => handleSort("company")}>Company</th>
                <th onClick={() => handleSort("jobTitle")}>Job Title</th>
                <th onClick={() => handleSort("supervisorName")}>Supervisor</th>
              </>
            )}
            <th onClick={() => handleSort("email")}>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
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
      <div className="pagination">
        {Array.from({
          length: Math.ceil(filteredUsers.length / usersPerPage),
        }).map((_, index) => (
          <button
            key={index}
            className={`page-button ${
              currentPage === index + 1 ? "active" : ""
            }`}
            onClick={() => paginate(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminUsersPage;
