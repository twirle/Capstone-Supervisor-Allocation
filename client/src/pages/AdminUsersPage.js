import { useEffect, useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import UserDetails from '../components/UserDetails';

const AdminUsersPage = () => {
    const [users, setUsers] = useState([]);
    const { user } = useAuthContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            if (user && user.role === 'admin') {
                try {
                    const response = await fetch('/api/user/all', {
                        headers: {
                            'Authorization': `Bearer ${user.token}`
                        },
                    });
                    const data = await response.json();
                    if (response.ok) {
                        setUsers(data);
                    }
                } catch (err) {
                    console.error(err);
                }
            }
        };

        fetchUsers();
    }, [user]);

    // Filtered and searched users
    const filteredUsers = users.filter(userDetail => {
        const emailMatch = userDetail.email.toLowerCase().includes(searchTerm.toLowerCase());
        const roleMatch = filter === '' || userDetail.role.toLowerCase().startsWith(filter.toLowerCase());
        return emailMatch && roleMatch;
    });

    const handleUserDelete = (userId) => {
        setUsers(users.filter(user => user._id !== userId));
    };

    return (
        <div className="admin-users-page">
            <h1>All Users</h1>
            <input
                type="text"
                placeholder="Search users..."
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
            />
            <input
                type="text"
                placeholder="Filter by role..."
                onChange={(e) => setFilter(e.target.value)}
                value={filter}
            />
            <div className="users-list">
                {filteredUsers.map(userDetail => (
                    <UserDetails
                        key={userDetail._id}
                        userDetail={userDetail}
                        onDelete={handleUserDelete}
                    />
                ))}
            </div>
        </div>
    );
};

export default AdminUsersPage;
