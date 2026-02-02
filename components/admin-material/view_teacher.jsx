import React, { useEffect, useState } from "react";
import "../../css/ViewTeacher.css"; 

function ViewTeacher() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5005/admin/get-teachers", {
      method: "GET",
      credentials: "include", 
    })
      .then((res) => res.json())
      .then((data) => {
        setTeachers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching teachers:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="loader">Loading teachers...</div>;
  }

  return (
    <div className="teacher-container">
      <h2 className="teacher-title">👩‍🏫 Teachers List</h2>
      <div className="teacher-grid">
        {teachers.map((teacher) => (
          <div key={teacher._id} className="teacher-card">
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
                <strong>DOB:</strong> {teacher.dob}
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

export default ViewTeacher;
