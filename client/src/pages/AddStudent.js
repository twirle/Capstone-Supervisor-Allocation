import React, { useEffect } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';
import StudentForm from '../components/StudentForm';

const AddStudent = () => {
    
    const { user } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }
    }, [user, navigate]);

    return (
        <div>
            <h1>Students</h1>
            <StudentForm />
        </div>
    );
};

export default AddStudent;
