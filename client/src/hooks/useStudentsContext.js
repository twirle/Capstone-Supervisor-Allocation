import { StudentContext } from "../context/StudentContext";
import { useContext } from "react";

export const useStudentsContext = () => {
    const context = useContext(StudentContext)

    if (!context) {
        throw Error('useStudentContext must be used inside a StudentContextProvider')
    }

    return context
}