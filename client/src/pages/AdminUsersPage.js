import { useEffect, useState } from 'react';
import UserDetails from '../components/UserDetails';
import { useAuthContext } from '../hooks/useAuthContext';

const AdminUsersPage = () => {
    const [users, setUsers] = useState([]);
    const { user } = useAuthContext();
    const [activeRole, setActiveRole] = useState('student');

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
                    setUsers(data.map(u => ({
                        ...u,
                        email: u.user.email, // Assuming `user` is populated
                        facultyName: u.faculty ? u.faculty.name : 'No Faculty',
                        mentorName: role === 'student' && u.assignedMentor ? u.assignedMentor.name : undefined, // Only add mentorName if role is 'student'
                        studentNames: role === 'mentor' && u.assignedStudents ? u.assignedStudents.map(student => student.name).join(', ') : undefined // Map and join names for display
                    })));
                } else {
                    console.error('Failed to fetch data:', data.error);
                }
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };
        fetchUsers(activeRole);
    }, [activeRole, user.token]);


    const roles = ['student', 'mentor', 'facultyMember', 'admin']; // Add other roles as necessary

    return (
        <div className="admin-users-page">
            <h1>{activeRole.charAt(0).toUpperCase() + activeRole.slice(1)} Users</h1>
            <div className="role-buttons">
                {roles.map(role => (
                    <button
                        key={role}
                        className={role === activeRole ? "role-button active" : "role-button"}
                        onClick={() => setActiveRole(role)}
                    >
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                    </button>
                ))}
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
                    {users.map(user => (
                        <UserDetails
                            key={user._id}
                            userDetail={user}
                            role={activeRole} // Passing role for conditional rendering
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminUsersPage;
