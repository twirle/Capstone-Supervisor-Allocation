import { useState } from "react"
import { useStudentsContext } from "../hooks/useStudentsContext"
import { useAuthContext } from "../hooks/useAuthContext"

const StudentForm = () => {
    const { dispatch } = useStudentsContext()
    const { user } = useAuthContext()

    // const [userId, setUserId] = useState('');
    const [name, setName] = useState('')
    const [course, setCourse] = useState('')
    const [faculty, setFaculty] = useState('')
    const [company, setCompany] = useState('')
    const [assignedMentor, setAssignedMentor] = useState('');

    const [error, setError] = useState('')
    const [emptyFields, setEmptyFields] = useState([])

    const handleSubmit = async (e) => {
        e.preventDefault()

        // error for not logged in auth
        if (!user) {
            setError('You must be logged in.')
            return
        }

        const student = { name, course, faculty, company, assignedMentor };


        const response = await fetch('/api/students', {
            method: 'POST',
            body: JSON.stringify(student),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (!response.ok) {
            setError(json.error)
            // setEmptyFields(json.emptyFields)
            setEmptyFields(json.emptyFields || []);
        }
        if (response.ok) {
            setName('')
            setCourse('')
            setFaculty('')
            setCompany('')
            setAssignedMentor('')
            setError(null)
            setEmptyFields([])
            console.log('New student added', json)
            dispatch({ type: 'CREATE_STUDENT', payload: json })
        }
    }


    return (
        <form className="create" onSubmit={handleSubmit}>
            <h3>Add a new Student</h3>

            {/* <label>User ID</label>
            <input
                type="text"
                onChange={(e) => setUserId(e.target.value)}
                value={userId}
                className={emptyFields.includes('userId') ? 'error' : ''}
            /> */}

            <label>Student Name</label>
            <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
                className={emptyFields.includes('name') ? 'error' : ''}
            />

            <label>Course</label>
            <input
                type="text"
                onChange={(e) => setCourse(e.target.value)}
                value={course}
                className={emptyFields.includes('course') ? 'error' : ''}
            />

            <label>Faculty</label>
            <input
                type="text"
                onChange={(e) => setFaculty(e.target.value)}
                value={faculty}
                className={emptyFields.includes('faculty') ? 'error' : ''}
            />

            <label>Company</label>
            <input
                type="text"
                onChange={(e) => setCompany(e.target.value)}
                value={company}
                className={emptyFields.includes('company') ? 'error' : ''}
            />

            <label>Assigned To (Mentor)</label>
            <input
                type="text"
                onChange={(e) => setAssignedMentor(e.target.value)}
                value={assignedMentor}
                className={emptyFields.includes('assignedMentor') ? 'error' : ''}
            />

            <button>Add Student</button>
            {error && <div className="error">{error}</div>}
        </form >
    )
}

export default StudentForm