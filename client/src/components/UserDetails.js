import { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import "../css/userDetails.css";

const UserDetails = ({ userDetail, onDelete, role, onSave }) => {
  const { user } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(userDetail.name);
  const [editedEmail, setEditedEmail] = useState(userDetail.email);
  const [editedFaculty, setEditedFaculty] = useState(
    userDetail.faculty ? userDetail.faculty._id : ""
  );
  const [editedCourse, setEditedCourse] = useState(userDetail.course || "");
  const [editedCompany, setEditedCompany] = useState(userDetail.company || "");
  const [editedJobTitle, setEditedJobTitle] = useState(
    userDetail.jobTitle || ""
  );
  const [editedJobScope, setEditedJobScope] = useState(
    userDetail.jobScope || ""
  );
  const [editedResearchArea, setEditedResearchArea] = useState(
    userDetail.researchArea || ""
  );

  const apiUrl = process.env.REACT_APP_API_URL;
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setEditedName(userDetail.name);
    setEditedEmail(userDetail.email);
    setEditedFaculty(userDetail.faculty ? userDetail.faculty._id : "");
    setEditedCourse(userDetail.course || "");
    setEditedCompany(userDetail.company || "");
    setEditedJobTitle(userDetail.jobTitle || "");
    setEditedJobScope(userDetail.jobScope || "");
    setEditedResearchArea(userDetail.researchArea || "");
  }, [userDetail]);

  const handleSave = async () => {
    if (!user) return;

    let patchUrl;
    let requestBody = {};

    switch (role) {
      case "student":
        patchUrl = `/api/student/${userDetail.user._id}`;
        requestBody = {
          name: editedName,
          faculty: editedFaculty,
          course: editedCourse,
          company: editedCompany,
          jobTitle: editedJobTitle,
          jobScope: editedJobScope,
        };
        break;
      case "supervisor":
        patchUrl = `/api/supervisor/${userDetail.user._id}`;
        requestBody = {
          name: editedName,
          faculty: editedFaculty,
          researchArea: editedResearchArea, // Assuming you manage researchArea state
        };
        break;
      case "facultyMember":
        patchUrl = `/api/facultyMember/${userDetail.user._id}`;
        requestBody = {
          name: editedName,
          faculty: editedFaculty,
        };
        break;
      default:
        console.error("Unsupported role for updating:", role);
        return;
    }

    try {
      const response = await fetch(`${apiUrl}${patchUrl}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const updatedData = await response.json();
        onSave(updatedData); // Update the local state to reflect the changes
        setIsEditing(false);
      } else {
        console.error("Failed to save user:", await response.json());
      }
    } catch (err) {
      console.error("Failed to save user:", err);
    }
  };

  const handleDelete = async () => {
    if (!user || isDeleting) return;

    setIsDeleting(true);

    try {
      const response = await fetch(
        `${apiUrl}/api/user/${userDetail.user._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        onDelete(userDetail.user._id);
        console.log("User deleted successfully");
      } else {
        console.error("Failed to delete user:", await response.json());
      }
    } catch (err) {
      console.error("Failed to delete user:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <tr>
      <td>
        {isEditing ? (
          <input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
          />
        ) : (
          userDetail.name
        )}
      </td>
      <td>
        {isEditing ? (
          <select
            value={editedFaculty}
            onChange={(e) => setEditedFaculty(e.target.value)}
          >
            {/* Add options for faculties here */}
          </select>
        ) : (
          userDetail.facultyName || "-"
        )}
      </td>
      {role === "supervisor" && (
        <td>
          {isEditing ? (
            <input
              type="text"
              value={editedResearchArea}
              onChange={(e) => setEditedResearchArea(e.target.value)}
            />
          ) : Array.isArray(userDetail.researchArea) &&
            userDetail.researchArea.length > 0 ? (
            userDetail.researchArea
              .map((item) =>
                item
                  .split("#")
                  .filter(Boolean)
                  .map((tag) => `#${tag}`)
                  .join(", ")
              )
              .join(", ")
          ) : (
            "-"
          )}
        </td>
      )}
      {role === "supervisor" && (
        <td>{userDetail.studentNames || "No Students Assigned"}</td>
      )}
      {role === "student" && (
        <>
          <td>
            {isEditing ? (
              <input
                type="text"
                value={editedCourse}
                onChange={(e) => setEditedCourse(e.target.value)}
              />
            ) : (
              userDetail.course || "-"
            )}
          </td>
          <td>
            {isEditing ? (
              <input
                type="text"
                value={editedCompany}
                onChange={(e) => setEditedCompany(e.target.value)}
              />
            ) : (
              userDetail.company || "No Company"
            )}
          </td>
          <td>
            {isEditing ? (
              <input
                type="text"
                value={editedJobTitle}
                onChange={(e) => setEditedJobTitle(e.target.value)}
              />
            ) : (
              userDetail.jobTitle || "No Job Title"
            )}
          </td>
          <td>{userDetail.supervisorName || "No Supervisor Assigned"}</td>
        </>
      )}
      <td>
        {isEditing ? (
          <input
            type="email"
            value={editedEmail}
            onChange={(e) => setEditedEmail(e.target.value)}
          />
        ) : (
          userDetail.email
        )}
      </td>
      <td className="action-buttons">
        {isEditing ? (
          <>
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </>
        ) : (
          <>
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={handleDelete} disabled={isDeleting}>
              Delete
            </button>
          </>
        )}
      </td>
    </tr>
  );
};

export default UserDetails;
