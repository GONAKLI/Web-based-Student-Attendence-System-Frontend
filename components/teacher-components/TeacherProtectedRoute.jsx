import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function TeacherProtectedRoute({ children }) {
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        let res = await fetch("https://backend.gonakli.com/teacher/", {
          credentials: "include",
          method: "GET",
        });

        if (res.status === 200) {
          setIsValid(true);
        } else {
          setIsValid(false);
        }
      } catch {
        setIsValid(false);
      }
    };

    checkAuth();
  }, []);

  if (isValid === null) {
    return <p>Loading...</p>; // spinner bhi laga sakte ho
  }

  return isValid ? children : <Navigate to="/teacher" />;
}

export default TeacherProtectedRoute;
