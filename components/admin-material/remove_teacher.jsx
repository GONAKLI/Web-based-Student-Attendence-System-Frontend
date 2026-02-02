import React, { useEffect, useState } from "react";
import "../../css/RemoveTeacher.css";

function RemoveTeacher() {
  const [teachers, setTeachers] = useState([]);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5005/admin/get-teachers", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setTeachers(data))
      .catch((err) => console.error("Error fetching teachers:", err));
  }, []);

  const handleDelete = (id) => {
    setDeleting(id);

    fetch(`http://localhost:5005/admin/delete-teacher/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => res.json())
      .then(() => {
        setTimeout(() => {
          setTeachers((prev) => prev.filter((t) => t._id !== id));
          setDeleting(null);
        }, 600); // match CSS animation duration
      })
      .catch((err) => {
        console.error("Error deleting teacher:", err);
        setDeleting(null);
      });
  };

  return (
    <div className="teacher-container">
      <h2 className="teacher-title">🗑️ Remove Teachers</h2>
      <div className="teacher-grid">
        {teachers.map((teacher) => (
          <div
            key={teacher._id}
            className={`teacher-card ${deleting === teacher._id ? "fade-out" : ""}`}
          >
            <button
              className="delete-btn"
              onClick={() => handleDelete(teacher._id)}
            >
              🪣
            </button>
            <img
              src={`http://localhost:5005/${teacher.profilePic}`}
              alt={teacher.name}
              className="teacher-img"
            />
            <div className="teacher-info">
              <h3>{teacher.name}</h3>
              <p>
                <strong>Email:</strong> {teacher.email}
              </p>
              <p>
                <strong>Mobile:</strong> {teacher.mobile}
              </p>

              <p>
                <strong>Qualification:</strong> {teacher.qualification}
              </p>
              <p>
                <strong>assigned department:</strong> {teacher.department}
              </p>
              <p className="added-by">Added by: {teacher.admin_name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RemoveTeacher;
