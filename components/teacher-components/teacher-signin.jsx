import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../css/teacher Css/TeacherSignIn.module.css";

export default function TeacherSignIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
   useEffect(()=>{
       fetch("https://backend.gonakli.com/DirectAccessResources", {
         credentials: "include",
       }).then((res) => {
         if (res.status === 200) {
         return  navigate("/teacher/dashboard");
         }
       });
      
      
    }, []);
   
  
  
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("https://backend.gonakli.com/teacher-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed. Please try again.");
      } else if (response.status === 200) {
        navigate("/teacher/dashboard");
      }
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles["signin-container"]}>
      {/* Home Button */}
      <button
        onClick={() => navigate("/")}
        className={styles["home-button"]}
        aria-label="Go to home"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={styles["home-icon"]}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
        <span>Home</span>
      </button>

      {/* Sign In Card */}
      <div className={styles["signin-card-wrapper"]}>
        <div className={styles["signin-card"]}>
          {/* Header */}
          <div className={styles["signin-header"]}>
            <div className={styles["icon-wrapper"]}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={styles["teacher-icon"]}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
            </div>
            <h1 className={styles["signin-title"]}>Teacher Sign In</h1>
            <p className={styles["signin-subtitle"]}>
              Welcome back! Please enter your credentials
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className={styles["error-alert"]}>
              <div className={styles["error-content"]}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles["error-icon"]}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className={styles["error-text"]}>{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className={styles["signin-form"]}>
            {/* Email Field */}
            <div className={styles["form-group"]}>
              <label htmlFor="email" className={styles["form-label"]}>
                Email Address / Mobile Number
              </label>
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={styles["form-input"]}
                placeholder="teacher@example.com"
              />
            </div>

            {/* Password Field */}
            <div className={styles["form-group"]}>
              <label htmlFor="password" className={styles["form-label"]}>
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className={styles["form-input"]}
                placeholder="Enter your password"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={styles["submit-button"]}
            >
              {isLoading ? (
                <span className={styles["loading-content"]}>
                  <svg
                    className={styles["spinner"]}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className={styles["spinner-circle"]}
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className={styles["spinner-path"]}
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className={styles["signin-footer"]}>
            <p>Please contact your administrator if you need assistance</p>
          </div>
        </div>

        {/* Additional Info */}
        <p className={styles["copyright-text"]}>
          © 2024 Educational Platform. All rights reserved.
        </p>
      </div>
    </div>
  );
}
