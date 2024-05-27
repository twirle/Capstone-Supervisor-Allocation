import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();
  const apiUrl = process.env.REACT_APP_API_URL;

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}/api/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await response.json();

      if (!response.ok) {
        setError(json.error);
      } else {
        localStorage.setItem(
          "user",
          JSON.stringify({
            _id: json._id, // Ensure _id is included here
            email: json.email,
            token: json.token,
            role: json.role,
          })
        );
        dispatch({
          type: "LOGIN",
          payload: {
            _id: json._id,
            email: json.email,
            token: json.token,
            role: json.role,
          },
        });
      }
    } catch (err) {
      setError("Failed to login");
    }

    setIsLoading(false);
  };

  return { login, isLoading, error };
};
