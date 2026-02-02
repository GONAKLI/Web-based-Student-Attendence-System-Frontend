import { useState } from "react";
import { MdEmail, MdDriveFileRenameOutline } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { RiLockPasswordFill, RiAdminFill } from "react-icons/ri";
import { GiConfirmed } from "react-icons/gi";
import { GoFileSubmodule } from "react-icons/go";
import "../../css/adminsignup.css";
import LoadingSpinner from "../Spinner/LoadingSpinner"; // ✅ import spinner

function Signup_admin({ setType }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirm_password: "",
    gender: "",
  });
  const [response, setResponse] = useState(null);
  const [Loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); // ✅ start spinner

    if (formData.password !== formData.confirm_password) {
      setResponse({ reason: "Passwords do not match" });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("https://backend.gonakli.com/admin_signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      const data = await res.json();
      console.log(data);

      if (res.status === 200) {
        setResponse({ reason: "Signup successful! Please sign in." });
        setTimeout(() => setType("signin"), 1500);
      } else {
        setResponse({ reason: "Signup failed. Try again." });
      }
    } catch (err) {
      console.error("Error signing up:", err);
      setResponse({ reason: "Server error. Try again later." });
    }
    setLoading(false); // ✅ stop spinner
  }

  return (
    <div className="signup-container">
      {/* ✅ Overlay spinner */}
      {Loading && (
        <div className="overlay">
          <LoadingSpinner />
        </div>
      )}

      <p className="signup-caption">
        <RiAdminFill /> Admin Signup
      </p>
      <form className="signup-form" onSubmit={handleSubmit}>
        {response && <p className="signup-error">{response.reason}</p>}

        <div className="signup-group">
          <label htmlFor="name" className="signup-label">
            <MdDriveFileRenameOutline /> Enter your name
          </label>
          <input
            type="text"
            id="name"
            className="signup-input"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="signup-group">
          <label htmlFor="email" className="signup-label">
            <MdEmail /> Enter E-mail
          </label>
          <input
            type="email"
            id="email"
            className="signup-input"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="signup-group">
          <label htmlFor="mobile" className="signup-label">
            <FaPhoneAlt /> Mobile Number
          </label>
          <input
            type="number"
            id="mobile"
            className="signup-input"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
          />
        </div>

        {/* ✅ Gender Radio Buttons */}
        <div className="signup-group">
          <label className="signup-label">Select Gender</label>
          <div className="signup-radio">
            <label>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === "male"}
                onChange={handleChange}
                required
              />
              Male
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === "female"}
                onChange={handleChange}
              />
              Female
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="other"
                checked={formData.gender === "other"}
                onChange={handleChange}
              />
              Other
            </label>
          </div>
        </div>

        <div className="signup-group">
          <label htmlFor="password" className="signup-label">
            <RiLockPasswordFill /> Password
          </label>
          <input
            type="password"
            id="password"
            className="signup-input"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="signup-group">
          <label htmlFor="confirm_password" className="signup-label">
            <GiConfirmed /> Confirm Password
          </label>
          <input
            type="password"
            id="confirm_password"
            className="signup-input"
            name="confirm_password"
            value={formData.confirm_password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="signup-button" disabled={Loading}>
          <GoFileSubmodule /> {Loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default Signup_admin;
