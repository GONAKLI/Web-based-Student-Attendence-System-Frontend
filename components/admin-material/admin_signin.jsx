import { useEffect, useState } from "react";
import { GoFileSubmodule } from "react-icons/go";
import { MdEmail } from "react-icons/md";
import { RiAdminFill, RiLockPasswordFill } from "react-icons/ri";
import "../../css/adminsignin.css";
import { Navigate, redirect, useNavigate } from "react-router-dom";
import LoadingSpinner from "../Spinner/LoadingSpinner";




function Signin_admin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [response, setResponse] = useState(null);
  const [Loading, setLoading] = useState(false);
  
  useEffect(()=>{
     fetch("https://backend.gonakli.com/DirectAccessResources", {
       credentials: "include",
     }).then((res) => {
       if (res.status === 200) {
      return   navigate("/admin/dashboard");
       }
     });
    
    
  }, []);
 
  
  
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    const { email, password } = formData;

    if (!email || !password) {
      setResponse({ reason: "Please fill in both fields" });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("https://backend.gonakli.com/admin_signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      let status = await res.json();
      setResponse(status);
      if (status.reason === "user found") {
        navigate("/admin/dashboard");
        return;
      }
    } catch (err) {
      console.error("Error logging in:", err);
      setResponse({ reason: "Server error. Try again later." });
    }
    setLoading(false);
  }


  return (
    <div className="signin-container ">
      <p className="signin-caption">
        <RiAdminFill /> Admin Signin
      </p>
      <form className="signin-form" onSubmit={handleLogin}>
        {response && <p className="signin-error">{response.reason}</p>}

        <div className="signin-group">
          <label htmlFor="email" className="signin-label">
            <MdEmail /> Enter E-mail / Mobile Number
          </label>
          <input
            type="text"
            id="email"
            className="signin-input"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="signin-group">
          <label htmlFor="password" className="signin-label">
            <RiLockPasswordFill /> Password
          </label>
          <input
            type="password"
            id="password"
            className="signin-input"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        {Loading && <LoadingSpinner />}

        <button className="signin-button" disabled={Loading}>
          <GoFileSubmodule /> {Loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default Signin_admin;
