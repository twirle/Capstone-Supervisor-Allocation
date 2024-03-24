import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

const UserDetails = ({ userDetail, onDelete }) => {
    const { user } = useAuthContext();
    const [isEditing, setIsEditing] = useState(false);
    const [editedRole, setEditedRole] = useState(userDetail.role);

    const handleEdit = async () => {
        if (!user) {
            return;
        }

        const response = await fetch(`/api/user/${userDetail._id}/role`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({ role: editedRole })
        });
        const json = await response.json();

        if (response.ok) {
            setIsEditing(false);
            // Update the user list context or state as needed
            // dispatch({ type: 'UPDATE_USER', payload: json });
        }
    };

    const handleDelete = async () => {
        if (!user) {
            return;
        }

        const response = await fetch(`/api/user/${userDetail._id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });

        if (response.ok) {
            onDelete(userDetail._id);
        }
    };


    return (
        <div className="user-details">
            <h4>{userDetail.email}</h4>
            <p>
                <strong>Role: </strong>
                {isEditing ? (
                    <select
                        value={editedRole}
                        onChange={(e) => setEditedRole(e.target.value)}
                    >
                        <option value="student">Student</option>
                        <option value="mentor">Mentor</option>
                        <option value="admin">Admin</option>
                        {/* Add other roles as needed */}
                    </select>
                ) : (
                    userDetail.role
                )}
            </p>
            {user && user.role === 'admin' && (
                <div>
                    {isEditing ? (
                        <button onClick={handleEdit}>Save</button>
                    ) : (
                        <button onClick={() => setIsEditing(true)}>Edit</button>
                    )}
                    {/* Add delete functionality if needed */}
                    <button onClick={handleDelete}>Delete</button>
                    
                </div>
            )}
        </div>
    );
};

export default UserDetails;
