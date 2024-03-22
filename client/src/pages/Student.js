import { useEffect, useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import StudentDetails from '../components/StudentDetails';
import { useStudentsContext } from '../hooks/useStudentsContext';

const Students = () => {
    const { students, dispatch } = useStudentsContext();
    const { user } = useAuthContext();
    const [filter, setFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchStudents = async () => {
            const response = await fetch('/api/students', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const json = await response.json();

            if (response.ok) {
                dispatch({ type: 'SET_STUDENTS', payload: json });
            }
        };
        if (user) {
            fetchStudents();
        }
    }, [dispatch, user]);

    // Filtered and searched students
    const filteredStudents = students.filter(student => {
        return (
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (filter === '' || student.name === filter || student.course === filter)
        );
    });

    return (
        <div className="students-page">
            <input
                type="text"
                placeholder="Filter students..."
                onChange={(e) => setFilter(e.target.value)}
                value={filter}
            />
            <div className="students-list">
                {filteredStudents.map((student) => (
                    <StudentDetails key={student._id} student={student} />
                ))}
            </div>
        </div>
    );

}

export default Students;
