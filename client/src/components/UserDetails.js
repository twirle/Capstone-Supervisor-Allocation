import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

const UserDetails = ({ userDetail, onDelete, role, onSave }) => {
    const { user } = useAuthContext();
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(userDetail.name);
    const [editedEmail, setEditedEmail] = useState(userDetail.email);
    const [editedFaculty, setEditedFaculty] = useState(userDetail.faculty ? userDetail.faculty._id : '');
    const [editedCourse, setEditedCourse] = useState(userDetail.course || '');
    const [editedCompany, setEditedCompany] = useState(userDetail.company || '');
    const [editedResearchArea, setEditedResearchArea] = useState(userDetail.company || '');


    const handleSave = async () => {
        if (!user) return;

        let patchUrl;
        let requestBody = {};

        switch (role) {
            case 'student':
                patchUrl = `/api/student/${userDetail.user._id}`;
                requestBody = {
                    name: editedName,
                    faculty: editedFaculty,
                    course: editedCourse,
                    company: editedCompany,
                    // assignedMentor: editedMentor
                };
                break;
            case 'mentor':
                patchUrl = `/api/mentor/${userDetail.user._id}`;
                requestBody = {
                    name: editedName,
                    faculty: editedFaculty,
                    researchArea: editedResearchArea, // Assuming you manage researchArea state
                };
                break;
            case 'facultyMember':
                patchUrl = `/api/facultyMember/${userDetail.user._id}`;
                requestBody = {
                    name: editedName,
                    faculty: editedFaculty,
                };
                break;
            default:
                console.error('Unsupported role for updating:', role);
                return;
        }

        const response = await fetch(patchUrl, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify(requestBody),
        });

        if (response.ok) {
            const updatedData = await response.json();
            onSave(updatedData); // Update the local state to reflect the changes
            setIsEditing(false);
        } else {
            console.error('Failed to save user:', await response.json());
        }
    };

    const handleDelete = async () => {
        if (!user) return; // Guard clause to ensure there is a user
        const response = await fetch(`/api/user/${userDetail.user._id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${user.token}` },
        });
        if (response.ok) {
            onDelete(userDetail.user._id);
            console.log('User deleted successfully');
        } else {
            console.error('Failed to delete user');
        }
    };

    return (
        <tr>
            <td>{isEditing ? <input type="text" value={editedName} onChange={e => setEditedName(e.target.value)} /> : userDetail.name}</td>
            <td>{isEditing ? (
                <select value={editedFaculty} onChange={e => setEditedFaculty(e.target.value)}>
                    {/* Add options for faculties here */}
                </select>
            ) : userDetail.facultyName || '-'}</td>
            {role === 'mentor' && <td>{isEditing ? <input type="text" value={userDetail.researchArea} onChange={e => setEditedResearchArea(e.target.value)} /> : userDetail.researchArea || '-'}</td>}
            {role === 'mentor' && <td>{userDetail.studentNames || 'No Students Assigned'}</td>}

            {role === 'student' && <td>{isEditing ? <input type="text" value={editedCourse} onChange={e => setEditedCourse(e.target.value)} /> : userDetail.course || '-'}</td>}
            {role === 'student' && <td>{isEditing ? <input type="text" value={editedCompany} onChange={e => setEditedCompany(e.target.value)} /> : userDetail.company || 'No Company'}</td>}
            {role === 'student' && <td>{userDetail.mentorName || 'No Mentor Assigned'}</td>}
            <td>{isEditing ? <input type="email" value={editedEmail} onChange={e => setEditedEmail(e.target.value)} /> : userDetail.email}</td>
            <td>
                {isEditing ? (
                    <>
                        <button onClick={handleSave}>Save</button>
                        <button onClick={() => setIsEditing(false)}>Cancel</button>
                    </>
                ) : (
                    <>
                        <button onClick={() => setIsEditing(true)}>Edit</button>
                        <button onClick={handleDelete}>Delete</button>
                    </>
                )}
            </td>
        </tr>
    );
};

export default UserDetails