import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../css/teacher Css/TeacherDashboard.module.css";

export default function TeacherDashboard() {
  // Initialize as null to handle "loading" state
  const [teacherData, setTeacherData] = useState(null);
  const [studentData, setStudentData] = useState([]);
 
  const navigate = useNavigate();



  // 2. Fetch Teacher Data
  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const res = await fetch(
          "https://backend.gonakli.com/teacher/TeacherDetails",
          {
            credentials: "include",
          },
        );

        if (!res.ok) {
          throw new Error("Failed to fetch teacher details");
        }

        const data = await res.json();
        setTeacherData(data);
      } catch (err) {
        console.error("Error fetching teacher details:", err);
        // Optional: Navigate to login if fetch fails due to auth
        // navigate("/");
      }
    };

    fetchTeacherData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      let res = await fetch("https://backend.gonakli.com/teacher/logout", {
        method: "POST",
        credentials: "include",
      });
      if (res.status === 200) {
        navigate("/");
      } else {
        alert("Unable To Logout");
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const dashboardCards = [
    {
      id: 1,
      title: "Mark Attendance",
      description: "Record student attendance for classes",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "blue",
      route: "/teacher/dashboard/mark-attendance",
    },
    {
      id: 2,
      title: "Add Student",
      description: "Register new students to the system",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" />
          <path d="M12 14a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1z" />
          <circle cx="12" cy="10" r="3" />
          <path d="M12 14c2.21 0 4 1.79 4 4v2H8v-2c0-2.21 1.79-4 4-4z" />
          <path d="M19 13h-2v2h-2v2h2v2h2v-2h2v-2h-2v-2z" />
        </svg>
      ),
      color: "green",
      route: "/teacher/dashboard/add-student",
    },
    {
      id: 3,
      title: "View Students Course Wise",
      description: "Browse students organized by courses",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 14l9-5-9-5-9 5 9 5z" />
          <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
          />
        </svg>
      ),
      color: "purple",
      route: "/view-students-course",
    },
    {
      id: 4,
      title: "View Student Data & Report",
      description: "Access detailed student records and reports",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path
            fillRule="evenodd"
            d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
            clipRule="evenodd"
          />
        </svg>
      ),
      color: "orange",
      route: "/view-student-reports",
    },
  ];

  const handleCardClick = (route) => {
    navigate(route);
  };

  // Prevent rendering if data is not loaded yet to avoid "Cannot read property of null" errors
  if (!teacherData) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className={styles["dashboard-container"]}>
      {/* Header */}
      <header className={styles["dashboard-header"]}>
        <div className={styles["header-content"]}>
          <div className={styles["header-left"]}>
            <div className={styles["logo-section"]}>
              <div className={styles["logo-icon"]}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
                  <path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 13.18v1.27a1.5 1.5 0 00-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 00.551-1.608 1.5 1.5 0 00.14-2.67v-.645a48.549 48.549 0 013.44 1.668 2.25 2.25 0 002.12 0z" />
                  <path d="M4.462 19.462c.42-.419.753-.89 1-1.394.453.213.902.434 1.347.661a6.743 6.743 0 01-1.286 1.794.75.75 0 11-1.06-1.06z" />
                </svg>
              </div>
              <div className={styles["logo-text"]}>
                <h1>Teacher Portal</h1>
                <p>Education Management System</p>
              </div>
            </div>
          </div>
          <div className={styles["header-right"]}>
            <div className={styles["teacher-info"]}>
              <div className={styles["teacher-avatar"]}>
                <span>
                  {/* Added safety check in case profilePic is missing */}
                  <img
                    style={{ height: "51px", borderRadius: "50%" }}
                    src={
                      teacherData.profilePic
                        ? `https://backend.gonakli.com/${teacherData.profilePic}`
                        : "https://via.placeholder.com/51"
                    }
                    alt="Profile"
                  />
                </span>
              </div>
              <div className={styles["teacher-details"]}>
                <span className={styles["teacher-name"]}>
                  {teacherData.name}
                </span>
                <span className={styles["teacher-role"]}>Faculty Member</span>
              </div>
            </div>
            <button className={styles["logout-button"]} onClick={handleLogout}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm10.72 4.72a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H9a.75.75 0 010-1.5h10.94l-1.72-1.72a.75.75 0 010-1.06z"
                  clipRule="evenodd"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles["dashboard-main"]}>
        <div className={styles["welcome-section"]}>
          <h2 className={styles["welcome-title"]}>
            Welcome Back, {teacherData.name}! 👋
          </h2>
          <p className={styles["welcome-subtitle"]}>
            Manage your students and classes efficiently
          </p>
        </div>

        {/* Dashboard Cards Grid */}
        <div className={styles["cards-grid"]}>
          {dashboardCards.map((card) => (
            <div
              key={card.id}
              className={`${styles["dashboard-card"]} ${styles[`card-${card.color}`]}`}
              onClick={() => handleCardClick(card.route)}
            >
              <div className={styles["card-icon-wrapper"]}>
                <div
                  className={`${styles["card-icon"]} ${styles[`icon-${card.color}`]}`}
                >
                  {card.icon}
                </div>
              </div>
              <div className={styles["card-content"]}>
                <h3 className={styles["card-title"]}>{card.title}</h3>
                <p className={styles["card-description"]}>{card.description}</p>
              </div>
              <div className={styles["card-arrow"]}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats - Hardcoded for now, but you can replace '245' with studentData.length */}
        <div className={styles["stats-section"]}>
          <h3 className={styles["stats-title"]}>Quick Overview</h3>
          <div className={styles["stats-grid"]}>
            <div className={styles["stat-card"]}>
              <div
                className={`${styles["stat-icon"]} ${styles["stat-icon-blue"]}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                </svg>
              </div>
              <div className={styles["stat-info"]}>
                {/* Dynamically showing student count if available */}
                <span className={styles["stat-value"]}>
                  {studentData.length > 0 ? studentData.length : 245}
                </span>
                <span className={styles["stat-label"]}>Total Students</span>
              </div>
            </div>
            {/* ... other stat cards ... */}
            <div className={styles["stat-card"]}>
              <div
                className={`${styles["stat-icon"]} ${styles["stat-icon-green"]}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
                </svg>
              </div>
              <div className={styles["stat-info"]}>
                <span className={styles["stat-value"]}>12</span>
                <span className={styles["stat-label"]}>Active Courses</span>
              </div>
            </div>
            <div className={styles["stat-card"]}>
              <div
                className={`${styles["stat-icon"]} ${styles["stat-icon-purple"]}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className={styles["stat-info"]}>
                <span className={styles["stat-value"]}>18</span>
                <span className={styles["stat-label"]}>Classes This Week</span>
              </div>
            </div>
            <div className={styles["stat-card"]}>
              <div
                className={`${styles["stat-icon"]} ${styles["stat-icon-orange"]}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.25 13.5a8.25 8.25 0 018.25-8.25.75.75 0 01.75.75v6.75H18a.75.75 0 01.75.75 8.25 8.25 0 01-16.5 0z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M12.75 3a.75.75 0 01.75-.75 8.25 8.25 0 018.25 8.25.75.75 0 01-.75.75h-7.5a.75.75 0 01-.75-.75V3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className={styles["stat-info"]}>
                <span className={styles["stat-value"]}>89%</span>
                <span className={styles["stat-label"]}>Avg Attendance</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
