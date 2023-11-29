import { useStudentsContext } from "../hooks/useStudentsContext"
import { useAuthContext } from "../hooks/useAuthContext"
import { useState } from "react"

// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const StudentDetails = ({ student }) => {
    const { dispatch } = useStudentsContext()
    const { user } = useAuthContext()
    const [isEditing, setIsEditing] = useState(false);
    const [assignedMentor, setAssignedMentor] = useState(student.assignedMentor || '');


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
            body: JSON.stringify({ assignedMentor }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        });
        const json = await response.json();

        if (response.ok) {
            setAssignedMentor(json.assignedMentor);
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
                    value={assignedMentor}
                    onChange={(e) => setAssignedMentor(e.target.value)}
                />
            ) : (
                assignedMentor || 'Not assigned'
            )}</p>
            {/* <p>{formatDistanceToNow(new Date(student.createdAt), { addSuffix: true })}</p> */}
            {user && user.role === 'admin' && (
                <div>
                    {isEditing ? (
                        <button onClick={handleEdit}>Save</button>
                    ) : (
                        <button onClick={() => setIsEditing(true)}>Edit</button>
                    )}
                    <span className="material-symbols-outlined" onClick={handleClick}>Delete</span>
                </div>
            )}
        </div >
    )
}

export default StudentDetails