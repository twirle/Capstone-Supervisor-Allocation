import { useAuthContext } from "../hooks/useAuthContext";
const Home = () => {
    // const { user } = useAuthContext();

    return (
        <div className="home">
            <h1>Welcome to the Dashboard</h1>
            {/* Other dashboard content */}
        </div>
    );
}

export default Home;
