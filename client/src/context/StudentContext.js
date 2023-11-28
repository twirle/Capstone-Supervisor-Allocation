import { createContext, useReducer } from "react";

export const StudentContext = createContext()
export const studentsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_STUDENTS':
            return {
                // return student property
                students: action.payload
            }
        case 'CREATE_STUDENT':
            return {
                // add single student object
                students: [action.payload, ...state.students]
            }
        case 'DELETE_STUDENT':
            return {
                students: state.students.filter(s => s._id !== action.payload._id)
            }
        default:
            return state
    }
}

export const StudentContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(studentsReducer, {
        students: null
    })

    return (
        <StudentContext.Provider value={{ ...state, dispatch }}>
            {children}
        </StudentContext.Provider>
    )
}