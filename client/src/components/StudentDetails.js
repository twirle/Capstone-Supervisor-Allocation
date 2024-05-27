import { useStudentsContext } from "../hooks/useStudentsContext"
import { useAuthContext } from "../hooks/useAuthContext"
import { useState } from "react"

const StudentDetails = ({ student }) => {
    const { dispatch } = useStudentsContext()
    const { user } = useAuthContext()
    const [isEditing, setIsEditing] = useState(false);
    const [assignedSupervisor, setAssignedSupervisor] = useState(student.assignedSupervisor || '');


    const handleClick = async () => {
        if (!user) {
            return
        }

        const response = await fetch('/api/students/' + student._id,
            {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
        const json = await response.json()

        if (response.ok) {
            dispatch({ type: 'DELETE_STUDENT', payload: json })
        }
    }
    const handleEdit = async () => {
        const response = await fetch('/api/students/' + student._id, {
            method: 'PATCH',
            body: JSON.stringify({ assignedSupervisor }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        });
        const json = await response.json();

        if (response.ok) {
            setAssignedSupervisor(json.assignedSupervisor);
            setIsEditing(false);
            // Update the student context or state as needed
            dispatch({ type: 'UPDATE_STUDENT', payload: json });
        }
        // Handle errors if necessary
    };


    return (
        <div className="student-details">
            <h4>{student.name}</h4>
            {/* <p><strong>User ID: </strong>{student.user}</p> */}
            <p><strong>Course: </strong>{student.course}</p>
            <p><strong>Faculty: </strong>{student.faculty}</p>
            <p><strong>Assigned to: </strong>{isEditing ? (
                <input
                    type="text"
                    value={assignedSupervisor}
                    onChange={(e) => setAssignedSupervisor(e.target.value)}
                />
            ) : (
                assignedSupervisor || 'Not assigned'
            )}</p>
            (user && user.role === 'admin' || user.role === 'supervisor' && (
            <div>
                {isEditing ? (
                    <button onClick={handleEdit}>Save</button>
                ) : (
                    <button onClick={() => setIsEditing(true)}>Edit</button>
                )}
                <span className="material-symbols-outlined" onClick={handleClick}>Delete</span>
            </div>
            ))
        </div >
    )
}

export default StudentDetails