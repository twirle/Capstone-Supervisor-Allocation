import { createContext, useReducer, useEffect } from "react";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { ...state, user: action.payload, loading: false };
        case 'LOGOUT':
            return { ...state, user: null, loading: false };
        default:
            return state;
    }
};

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
        loading: true
    });

    // maintain user login through AuthContext dispatch
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));

        if (user) {
            dispatch({ type: 'LOGIN', payload: user });
        } else {
            dispatch({ type: "LOGOUT" });
        }
    }, []);

    console.log('AuthContext state:', state);

    if (state.loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};
