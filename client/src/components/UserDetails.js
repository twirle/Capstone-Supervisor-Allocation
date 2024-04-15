import { useAuthContext } from "../hooks/useAuthContext";

const UserDetails = ({ userDetail, onDelete, role }) => {
    const { user } = useAuthContext(); // Using AuthContext to get the user and token

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
            <td>{userDetail.name}</td>
            <td>{userDetail.facultyName || '-'}</td>
            {role === 'mentor' && <td>{userDetail.researchArea || '-'}</td>}
            {role === 'mentor' && <td>{userDetail.studentNames || 'No Students Assigned'}</td>}
            {role === 'student' && <td>{userDetail.course || '-'}</td>}
            {role === 'student' && <td>{userDetail.mentorName || 'No Mentor Assigned'}</td>}
            <td>{userDetail.email}</td>
            <td>
                <button onClick={() => console.log('Edit user')}>Edit</button>
                <button onClick={handleDelete}>Delete</button>
            </td>
        </tr>
    );
};

export default UserDetails;
