import { useContext, useState } from "react"
import { useSignup } from "../hooks/useSignup"
import { AuthContext } from "../context/AuthContext"

const Signup = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('')
    const { signup, error, isLoading } = useSignup()
    const { user } = useContext(AuthContext)

    const handleSubmit = async (e) => {
        e.preventDefault()
        await signup(email, password, role)
    }

    // admin check
    if (!user || user.role !== 'admin') {
        return <p>Access Denied.</p>
    }

    return (
        <form className="signup" onSubmit={handleSubmit}>
            <h3>Sign up</h3>
            <label>Email</label>
            <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
            />

            <label>Password</label>
            <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
            />

            <label>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="">Select a role</option>
                <option value="student">Student</option>
                <option value="mentor">Mentor</option>
                <option value="admin">Admin</option>
                {/* Add other roles as needed */}
            </select>

            <button className="signup-button" disabled={isLoading}>Sign Up</button>
            {error && <div className="error">{error}</div>}
        </form>
    )
}

export default Signup