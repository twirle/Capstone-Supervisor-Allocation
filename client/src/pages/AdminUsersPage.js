import { useEffect, useState } from 'react';
import UserDetails from '../components/UserDetails';
import { useAuthContext } from '../hooks/useAuthContext';

const AdminUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedFaculty, setSelectedFaculty] = useState('All');
    const [selectedCourse, setSelectedCourse] = useState('All');
    const { user } = useAuthContext();
    const [activeRole, setActiveRole] = useState('student'); // Default to 'student'

    useEffect(() => {
        fetchFaculties();
    }, []); // Fetch faculties on component mount

    useEffect(() => {
        const fetchUsers = async (role) => {
            if (!role) {
                console.error('Role is undefined');
                return;
            }
            try {
                const response = await fetch(`/api/${role}`, {
                    headers: { 'Authorization': `Bearer ${user.token}` },
                });
                const data = await response.json();
                if (response.ok) {
                    const formattedData = data.map(u => ({
                        ...u,
                        email: u.user.email, // Assuming `user` is populated
                        facultyName: u.faculty ? u.faculty.name : 'No Faculty',
                        courseName: u.course || 'No Course', // Assuming course is available in data
                        mentorName: role === 'student' && u.assignedMentor ? u.assignedMentor.name : undefined,
                        studentNames: role === 'mentor' && u.assignedStudents ? u.assignedStudents.map(student => student.name).join(', ') : undefined
                    }));
                    setUsers(formattedData);
                    setCourses(['All', ...new Set(formattedData.map(u => u.courseName))]); // Extract unique courses
                } else {
                    console.error('Failed to fetch data:', data.error);
                }
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };
        fetchUsers(activeRole);
    }, [activeRole, user.token]);

    const fetchFaculties = async () => {
        try {
            const res = await fetch('/api/faculty', {
                headers: { 'Authorization': `Bearer ${user.token}` },
            });
            const data = await res.json();
            if (res.ok) {
                setFaculties(['All', ...data.map(f => f.name)]);
            } else {
                console.error('Failed to fetch faculties:', data.error);
            }
        } catch (err) {
            console.error('Error fetching faculties:', err);
        }
    };

    const filteredUsers = users.filter(u =>
        (selectedFaculty === 'All' || u.facultyName === selectedFaculty) &&
        (selectedCourse === 'All' || u.courseName === selectedCourse)
    );

    return (
        <div className="admin-users-page">
            <h1>{activeRole.charAt(0).toUpperCase() + activeRole.slice(1)} Users</h1>
            <div className="role-buttons">
                {['student', 'mentor', 'facultyMember', 'admin'].map(role => (
                    <button
                        key={role}
                        className={role === activeRole ? "role-button active" : "role-button"}
                        onClick={() => setActiveRole(role)}
                    >
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                    </button>
                ))}
            </div>
            <div className="filters">
                <select value={selectedFaculty} onChange={(e) => setSelectedFaculty(e.target.value)}>
                    {faculties.map(faculty => <option key={faculty} value={faculty}>{faculty}</option>)}
                </select>
                <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} disabled={activeRole !== 'student'}>
                    {courses.map(course => <option key={course} value={course}>{course}</option>)}
                </select>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Faculty</th>
                        {activeRole === 'mentor' && <th>Research Area</th>}
                        {activeRole === 'mentor' && <th>Assigned Students</th>}
                        {activeRole === 'student' && <th>Course</th>}
                        {activeRole === 'student' && <th>Mentor</th>}
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map(user => (
                        <UserDetails
                            key={user._id}
                            userDetail={user}
                            role={activeRole}
                            onDelete={() => setUsers(users.filter(u => u._id !== user._id))}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminUsersPage;
