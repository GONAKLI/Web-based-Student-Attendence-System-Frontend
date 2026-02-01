import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../css/teacher Css/MarkAttendance.module.css";

export default function MarkAttendance() {
  const navigate = useNavigate();
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [swipeDirection, setSwipeDirection] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const cardRef = useRef(null);
  const startXRef = useRef(0);
  const currentXRef = useRef(0);
  const [studentData, setStudentData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const res = await fetch(
          "https://backend.gonakli.com/teacher/getStudents",
          {
            credentials: "include",
          },
        );

        if (!res.ok) {
          throw new Error("Failed to fetch students");
        }

        const data = await res.json();
        setStudentData(data.students || data); // Handle both response formats
      } catch (err) {
        console.error("Error fetching students:", err);
        alert("Failed to load students. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  // Check if we have students and current student exists
  const currentStudent = studentData[currentStudentIndex];
  const allMarked = attendanceRecords.length === studentData.length;

  // Touch/Mouse event handlers
  const handleStart = (clientX) => {
    if (isAnimating) return;
    startXRef.current = clientX;
    currentXRef.current = clientX;
  };

  const handleMove = (clientX) => {
    if (isAnimating || !startXRef.current) return;
    currentXRef.current = clientX;
    const diff = currentXRef.current - startXRef.current;

    if (cardRef.current) {
      const rotation = diff / 20;
      cardRef.current.style.transform = `translateX(${diff}px) rotate(${rotation}deg)`;

      if (diff > 50) {
        cardRef.current.classList.add(styles["swipe-right-hint"]);
        cardRef.current.classList.remove(styles["swipe-left-hint"]);
      } else if (diff < -50) {
        cardRef.current.classList.add(styles["swipe-left-hint"]);
        cardRef.current.classList.remove(styles["swipe-right-hint"]);
      } else {
        cardRef.current.classList.remove(
          styles["swipe-right-hint"],
          styles["swipe-left-hint"],
        );
      }
    }
  };

  const handleEnd = () => {
    if (isAnimating || !startXRef.current) return;

    const diff = currentXRef.current - startXRef.current;
    const threshold = 100;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        markAttendance("present");
      } else {
        markAttendance("absent");
      }
    } else {
      if (cardRef.current) {
        cardRef.current.style.transform = "";
        cardRef.current.classList.remove(
          styles["swipe-right-hint"],
          styles["swipe-left-hint"],
        );
      }
    }

    startXRef.current = 0;
    currentXRef.current = 0;
  };

  const markAttendance = (status) => {
    if (isAnimating || !currentStudent) return;

    setIsAnimating(true);
    setSwipeDirection(status === "present" ? "right" : "left");

    if (cardRef.current) {
      const direction = status === "present" ? 1 : -1;
      cardRef.current.style.transform = `translateX(${direction * 1000}px) rotate(${direction * 30}deg)`;
      cardRef.current.style.opacity = "0";
    }

    // Record attendance with server data structure
    const record = {
      studentId: currentStudent._id || currentStudent.id,
      name: currentStudent.name,
      rollNumber: currentStudent.rollNumber,
      status: status,
    };

    setTimeout(() => {
      setAttendanceRecords((prev) => [...prev, record]);

      if (currentStudentIndex < studentData.length - 1) {
        setCurrentStudentIndex((prev) => prev + 1);
      }

      if (cardRef.current) {
        cardRef.current.style.transform = "";
        cardRef.current.style.opacity = "1";
        cardRef.current.classList.remove(
          styles["swipe-right-hint"],
          styles["swipe-left-hint"],
        );
      }

      setSwipeDirection("");
      setIsAnimating(false);
    }, 400);
  };

  const handleEdit = (studentId) => {
    const recordIndex = attendanceRecords.findIndex(
      (r) => r.studentId === studentId,
    );
    if (recordIndex !== -1) {
      setAttendanceRecords((prev) => prev.filter((_, i) => i !== recordIndex));

      const studentIndex = studentData.findIndex(
        (s) => (s._id || s.id) === studentId,
      );
      setCurrentStudentIndex(studentIndex);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        "https://backend.gonakli.com/mark-attendance",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            date: new Date().toISOString(),
            records: attendanceRecords,
          }),
        },
      );

      if (response.ok) {
        alert("Attendance submitted successfully!");
        navigate("/teacher/dashboard");
      } else {
        alert("Failed to submit attendance. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting attendance:", error);
      alert("An error occurred. Please try again.");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={styles["attendance-container"]}>
        <div className={styles["loading-container"]}>
          <div className={styles["spinner"]}></div>
          <p className={styles["loading-text"]}>Loading students...</p>
        </div>
      </div>
    );
  }

  // No students state
  if (studentData.length === 0) {
    return (
      <div className={styles["attendance-container"]}>
        <header className={styles["attendance-header"]}>
          <button
            className={styles["back-button"]}
            onClick={() => navigate("/teacher/dashboard")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.28 7.72a.75.75 0 010 1.06l-2.47 2.47H21a.75.75 0 010 1.5H4.81l2.47 2.47a.75.75 0 11-1.06 1.06l-3.75-3.75a.75.75 0 010-1.06l3.75-3.75a.75.75 0 011.06 0z"
                clipRule="evenodd"
              />
            </svg>
            Back
          </button>
          <div className={styles["header-title"]}>
            <h1>Mark Attendance</h1>
          </div>
        </header>
        <div className={styles["empty-state"]}>
          <h3>No Students Found</h3>
          <p>There are no students to mark attendance for.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles["attendance-container"]}>
      {/* Header */}
      <header className={styles["attendance-header"]}>
        <button
          className={styles["back-button"]}
          onClick={() => navigate("/teacher/dashboard")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7.28 7.72a.75.75 0 010 1.06l-2.47 2.47H21a.75.75 0 010 1.5H4.81l2.47 2.47a.75.75 0 11-1.06 1.06l-3.75-3.75a.75.75 0 010-1.06l3.75-3.75a.75.75 0 011.06 0z"
              clipRule="evenodd"
            />
          </svg>
          Back
        </button>
        <div className={styles["header-title"]}>
          <h1>Mark Attendance</h1>
          <p>Swipe right for Present • Swipe left for Absent</p>
        </div>
        <div className={styles["progress-indicator"]}>
          <span>
            {attendanceRecords.length}/{studentData.length}
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles["attendance-main"]}>
        {!allMarked && currentStudent ? (
          <div className={styles["swipe-section"]}>
            {/* Student Card */}
            <div
              ref={cardRef}
              className={`${styles["student-card"]} ${swipeDirection ? styles[swipeDirection] : ""}`}
              onMouseDown={(e) => handleStart(e.clientX)}
              onMouseMove={(e) => handleMove(e.clientX)}
              onMouseUp={handleEnd}
              onMouseLeave={handleEnd}
              onTouchStart={(e) => handleStart(e.touches[0].clientX)}
              onTouchMove={(e) => handleMove(e.touches[0].clientX)}
              onTouchEnd={handleEnd}
            >
              <div className={styles["card-overlay-left"]}>
                <div className={styles["overlay-content"]}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>ABSENT</span>
                </div>
              </div>
              <div className={styles["card-overlay-right"]}>
                <div className={styles["overlay-content"]}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>PRESENT</span>
                </div>
              </div>

              <div className={styles["student-profile-pic"]}>
                <img
                  src={
                    currentStudent.StudentImage
                      ? `https://backend.gonakli.com/${currentStudent.StudentImage}`
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(currentStudent.name)}&size=300&background=667eea&color=fff&bold=true`
                  }
                  alt={currentStudent.name}
                />
              </div>

              <div className={styles["student-info"]}>
                <h2 className={styles["student-name"]}>
                  {currentStudent.name}
                </h2>
                <div className={styles["student-details"]}>
                  <div className={styles["detail-item"]}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
                    </svg>
                    <span>{currentStudent.rollNumber}</span>
                  </div>
                  <div className={styles["detail-item"]}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
                    </svg>
                    <span>{currentStudent.department || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={styles["action-buttons"]}>
              <button
                className={`${styles["action-btn"]} ${styles["absent-btn"]}`}
                onClick={() => markAttendance("absent")}
                disabled={isAnimating}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
                Absent
              </button>
              <button
                className={`${styles["action-btn"]} ${styles["present-btn"]}`}
                onClick={() => markAttendance("present")}
                disabled={isAnimating}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                    clipRule="evenodd"
                  />
                </svg>
                Present
              </button>
            </div>
          </div>
        ) : (
          <div className={styles["completion-message"]}>
            <div className={styles["completion-icon"]}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2>All Done! 🎉</h2>
            <p>You've marked attendance for all students</p>
          </div>
        )}

        {/* Attendance Summary */}
        {attendanceRecords.length > 0 && (
          <div className={styles["attendance-summary"]}>
            <h3>Attendance Summary</h3>
            <div className={styles["summary-list"]}>
              {attendanceRecords.map((record, index) => (
                <div key={index} className={styles["summary-item"]}>
                  <div className={styles["summary-info"]}>
                    <div className={styles["summary-avatar"]}>
                      <img
                        src={
                          studentData.find(
                            (s) => (s._id || s.id) === record.studentId,
                          )?.StudentImage
                            ? `https://backend.gonakli.com/${studentData.find((s) => (s._id || s.id) === record.studentId)?.StudentImage}`
                            : `https://ui-avatars.com/api/?name=${encodeURIComponent(record.name)}&size=100&background=667eea&color=fff&bold=true`
                        }
                        alt={record.name}
                      />
                    </div>
                    <div className={styles["summary-details"]}>
                      <span className={styles["summary-name"]}>
                        {record.name}
                      </span>
                      <span className={styles["summary-roll"]}>
                        {record.rollNumber}
                      </span>
                    </div>
                  </div>
                  <div className={styles["summary-actions"]}>
                    <span
                      className={`${styles["status-badge"]} ${styles[record.status]}`}
                    >
                      {record.status === "present" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      {record.status.charAt(0).toUpperCase() +
                        record.status.slice(1)}
                    </span>
                    <button
                      className={styles["edit-btn"]}
                      onClick={() => handleEdit(record.studentId)}
                      title="Edit"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
                        <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {allMarked && (
              <button className={styles["submit-btn"]} onClick={handleSubmit}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                    clipRule="evenodd"
                  />
                </svg>
                Submit Attendance
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
