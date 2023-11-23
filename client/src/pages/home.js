import { useEffect} from 'react'


// Components
import StudentDetails from '../components/StudentDetails'
import StudentForm from '../components/StudentForm'
import { useStudentsContext } from '../hooks/useStudentsContext'

const Home = () => {
    const { students, dispatch } = useStudentsContext()

    useEffect(() => {
        const fetchStudents = async () => {
            const response = await fetch('/api/students')
            const json = await response.json()

            if (response.ok) {
                dispatch({ type: 'SET_STUDENTS', payload: json })
            }
        }
        fetchStudents()
    }, [dispatch])

    return (
        <div className="home">
            <div className="students">
                {students && students.map((student) => (
                    <StudentDetails key={student._id} student={student} />
                ))}
            </div>
            <StudentForm />ππ
        </div>
    )
}

export default Home