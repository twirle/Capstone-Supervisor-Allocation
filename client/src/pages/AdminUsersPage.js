import React, { useEffect, useState } from "react";
import UserDetails from "../components/UserDetails";
import ImportService from "../services/importService";
import { useAuthContext } from "../hooks/useAuthContext";
import "../css/adminUsersPage.css";

const AdminUsersPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState("All");
  const [selectedCourse, setSelectedCourse] = useState("All");
  const [activeRole, setActiveRole] = useState("student");

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
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
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/${role}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error("Failed to fetch users: " + data.error);
      }

      // Extract job IDs and remove duplicates
      const jobIds = [
        ...new Set(
          data
            .filter((user) => user.job)
            .map((user) => {
              // console.log("user job object:", user.job);
              return user.job;
            })
        ),
      ];

      // Combine user data with job details and format faculty, course, and other attributes
      const usersWithDetails = data.map((user) => ({
        ...user,
        email: user.user.email,
        facultyName: user.faculty ? user.faculty.name : "No Faculty",
        courseName: user.course || "No Course",
        company: user.company ? user.company.name : "No Company",
        jobTitle: user.job ? user.job.title : "No Job Defined",
        jobScope: user.job ? user.job.scope : "No Job Scope Defined",
        supervisorName: user.assignedSupervisor
          ? user.assignedSupervisor.name
          : "No Supervisor Assigned",
        studentNames: user.assignedStudents
          ? user.assignedStudents.map((stu) => stu.name).join(", ")
          : "No Students Assigned",
      }));

      setUsers(usersWithDetails);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Error fetching user data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFaculties = async () => {
    setLoading(true);
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
      setError("Error fetching faculties:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCourses = async () => {
    try {
      const uniqueCourses = [
        "All",
        ...new Set(
          users.map((user) => user.courseName).filter((course) => course)
        ),
      ];
      setCourses(uniqueCourses);
    } catch (err) {
      console.error("Error fetching courses", err);
      setError("Error fetching courses", err);
    }
  };

  const updateCoursesForFaculty = (faculty) => {
    try {
      const relevantUsers = users.filter(
        (user) => user.facultyName === faculty
      );
      const uniqueCourses = [
        "All",
        ...new Set(relevantUsers.map((user) => user.courseName)),
      ];
      setCourses(uniqueCourses);
    } catch (err) {
      console.log("Error updating courses");
      setError("Error updating courses");
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileName = file.name.toLowerCase();
      let role;

      if (fileName.includes("students_data.csv")) {
        role = "student";
      } else if (fileName.includes("supervisors_data.csv")) {
        role = "supervisor";
      } else {
        console.error(
          'Invalid file name. Please use "students_data.csv" or "supervisors_data.csv".'
        );
        return;
      }

      try {
        setLoading(true);
        await ImportService.uploadFile(file, user.token, role);
        console.log("File uploaded successfully");
      } catch (err) {
        console.error("Failed to upload file:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
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

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  useEffect(() => {
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    } else if (currentPage < 1) {
      setCurrentPage(1);
    }
  }, [filteredUsers.length, currentPage, usersPerPage]);

  useEffect(() => {
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    if (currentPage > totalPages) {
      setCurrentPage(totalPages > 0 ? totalPages : 1); // Ensure the page is at least 1
    }
  }, [filteredUsers.length, currentPage, usersPerPage]);

  const paginate = (pageNumber) => {
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleUserSave = (updatedUser) => {
    try {
      setUsers(
        users.map((user) => (user._id === updatedUser._id ? updatedUser : user))
      );
      fetchUsers(activeRole);
    } catch (err) {
      console.log("Error saving user update");
      setError("Error saving user update");
    }
  };

  const handleUserDelete = (userId) => {
    try {
      setUsers(users.filter((u) => u._id !== userId));
      fetchUsers(activeRole);
    } catch (err) {
      console.log("Error deleting user");
      setError("Error deleting user");
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

  if (loading) return <p>Loading..</p>;
  if (error) return <p>{error}..</p>;

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
          // onChange={(e) => setSearchTerm(e.target.value)}
          onChange={handleSearch}
        />
        <div className="import-buttons">
          <input
            type="file"
            accept=".csv"
            id="fileInput"
            style={{ display: "none" }}
            onChange={handleImport}
          />
          <button
            className="import-button"
            disabled={loading}
            onClick={() => document.getElementById("fileInput").click()}
          >
            Import CSV
          </button>
        </div>
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
        {Array.from(
          {
            length: Math.ceil(filteredUsers.length / usersPerPage),
          },
          // }).map((_, index) => (
          (_, index) => (
            <button
              key={index}
              className={`page-button ${
                currentPage === index + 1 ? "active" : ""
              }`}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
