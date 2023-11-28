import { useStudentsContext } from "../hooks/useStudentsContext"
import { useAuthContext } from "../hooks/useAuthContext"

// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const StudentDetails = ({ student }) => {
    const { dispatch } = useStudentsContext()
    const { user } = useAuthContext()

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

    return (
        <div className="student-details">
            <h4>{student.name}</h4>
            <p><strong>Course: </strong>{student.course}</p>
            <p><strong>Faculty: </strong>{student.faculty}</p>
            <p>{formatDistanceToNow(new Date(student.createdAt), { addSuffix: true })}</p>
            <span className='material-symbols-outlined' onClick={handleClick}>Delete</span>
        </div >
    )
}

export default StudentDetails