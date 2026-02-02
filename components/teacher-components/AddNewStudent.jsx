import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// Import styles as 'styles' (standard convention)
import styles from "../../css/teacher Css/AddNewStudent.module.css";

export default function AddStudent() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    studentImage: null,
    name: "",
    gender: "",
    fatherName: "",
    motherName: "",
    email: "",
    mobileNumber: "",
    parentContact: "",
    rollNumber: "",
    department: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please upload a valid image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        studentImage: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      studentImage: null,
    }));
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.studentImage) {
      alert("Please upload a student image");
      return;
    }

    setIsLoading(true);

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append("studentImage", formData.studentImage);
      submitData.append("name", formData.name);
      submitData.append("gender", formData.gender);
      submitData.append("fatherName", formData.fatherName);
      submitData.append("motherName", formData.motherName);
      submitData.append("email", formData.email);
      submitData.append("mobileNumber", formData.mobileNumber);
      submitData.append("parentContact", formData.parentContact);
      submitData.append("rollNumber", formData.rollNumber);
      submitData.append("department", formData.department);

      const response = await fetch(
        "https://backend.gonakli.com/teacher/Add-New-Student",
        {
          method: "POST",
          body: submitData,
          credentials: "include",
        },
      );

      const data = await response.json();

      if (response.status === 201 ) {
        alert(data.message || "Student added successfully! ✅");
        // Reset form
        setFormData({
          studentImage: null,
          name: "",
          gender: "",
          fatherName: "",
          motherName: "",
          email: "",
          mobileNumber: "",
          parentContact: "",
          rollNumber: "",
          department: "",
        });
        setImagePreview(null);
        // Optionally navigate back
        // navigate('/teacher/dashboard');
      } else {
        alert(data.message || "Failed to add student. Please try again.");
      }
    } catch (error) {
      console.error("Error adding student:", error);
      alert("An error occurred while adding the student. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles["add-student-container"]}>
      {/* Loading Spinner Overlay */}
      {isLoading && (
        <div className={styles["loading-overlay"]}>
          <div className={styles["spinner-wrapper"]}>
            <div className={styles["spinner"]}></div>
            <p className={styles["loading-text"]}>Adding Student...</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className={styles["add-student-header"]}>
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
          <h1>Add New Student</h1>
          <p>Fill in the student information below</p>
        </div>
        <div className={styles["header-spacer"]}></div>
      </header>

      {/* Main Form */}
      <main className={styles["add-student-main"]}>
        <div className={styles["form-container"]}>
          <form
            onSubmit={handleSubmit}
            className={styles["student-form"]}
            encType="multipart/form-data"
          >
            {/* Image Upload Section */}
            <div className={styles["form-section"]}>
              <h3 className={styles["section-title"]}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Student Photo
              </h3>

              <div className={styles["image-upload-wrapper"]}>
                {imagePreview ? (
                  <div className={styles["image-preview-container"]}>
                    <img
                      src={imagePreview}
                      alt="Student Preview"
                      className={styles["image-preview"]}
                    />
                    <button
                      type="button"
                      className={styles["remove-image-btn"]}
                      onClick={removeImage}
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
                    </button>
                  </div>
                ) : (
                  <label className={styles["image-upload-label"]}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className={styles["image-input"]}
                      required
                    />
                    <div className={styles["upload-placeholder"]}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Click to upload student photo</span>
                      <span className={styles["upload-hint"]}>
                        PNG, JPG up to 5MB
                      </span>
                    </div>
                  </label>
                )}
              </div>
            </div>

            {/* Personal Information */}
            <div className={styles["form-section"]}>
              <h3 className={styles["section-title"]}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                    clipRule="evenodd"
                  />
                </svg>
                Personal Information
              </h3>

              <div className={styles["form-grid"]}>
                <div className={styles["form-group"]}>
                  <label htmlFor="name" className={styles["form-label"]}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={styles["form-input"]}
                    placeholder="Enter student's full name"
                    required
                  />
                </div>

                <div className={styles["form-group"]}>
                  <label htmlFor="gender" className={styles["form-label"]}>
                    Gender *
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className={styles["form-select"]}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className={styles["form-group"]}>
                  <label htmlFor="rollNumber" className={styles["form-label"]}>
                    Roll Number *
                  </label>
                  <input
                    type="number"
                    id="rollNumber"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleInputChange}
                    className={styles["form-input"]}
                    placeholder="e.g., CS-2024-001"
                    required
                  />
                </div>

                <div className={styles["form-group"]}>
                  <label htmlFor="department" className={styles["form-label"]}>
                    Department *
                  </label>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className={styles["form-select"]}
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Technology">
                      Information Technology
                    </option>
                    <option value="Electronics">Electronics</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Civil">Civil</option>
                    <option value="Electrical">Electrical</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Parent Information */}
            <div className={styles["form-section"]}>
              <h3 className={styles["section-title"]}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                </svg>
                Parent/Guardian Information
              </h3>

              <div className={styles["form-grid"]}>
                <div className={styles["form-group"]}>
                  <label htmlFor="fatherName" className={styles["form-label"]}>
                    Father's Name *
                  </label>
                  <input
                    type="text"
                    id="fatherName"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleInputChange}
                    className={styles["form-input"]}
                    placeholder="Enter father's name"
                    required
                  />
                </div>

                <div className={styles["form-group"]}>
                  <label htmlFor="motherName" className={styles["form-label"]}>
                    Mother's Name *
                  </label>
                  <input
                    type="text"
                    id="motherName"
                    name="motherName"
                    value={formData.motherName}
                    onChange={handleInputChange}
                    className={styles["form-input"]}
                    placeholder="Enter mother's name"
                    required
                  />
                </div>

                <div className={styles["form-group"]}>
                  <label
                    htmlFor="parentContact"
                    className={styles["form-label"]}
                  >
                    Parent Contact *
                  </label>
                  <input
                    type="number"
                    id="parentContact"
                    name="parentContact"
                    value={formData.parentContact}
                    onChange={handleInputChange}
                    className={styles["form-input"]}
                    placeholder="+91 9876543210"
                    pattern="[0-9+\s-]+"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className={styles["form-section"]}>
              <h3 className={styles["section-title"]}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
                    clipRule="evenodd"
                  />
                </svg>
                Contact Information
              </h3>

              <div className={styles["form-grid"]}>
                <div className={styles["form-group"]}>
                  <label htmlFor="email" className={styles["form-label"]}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={styles["form-input"]}
                    placeholder="student@example.com"
                    required
                  />
                </div>

                <div className={styles["form-group"]}>
                  <label
                    htmlFor="mobileNumber"
                    className={styles["form-label"]}
                  >
                    Mobile Number *
                  </label>
                  <input
                    type="number"
                    id="mobileNumber"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    className={styles["form-input"]}
                    placeholder="+91 9876543210"
                    pattern="[0-9+\s-]+"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className={styles["form-actions"]}>
              <button
                type="submit"
                className={styles["submit-btn"]}
                disabled={isLoading}
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
                Add Student
              </button>
              <button
                type="button"
                className={styles["cancel-btn"]}
                onClick={() => navigate("/teacher/dashboard")}
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
