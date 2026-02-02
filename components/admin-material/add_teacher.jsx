import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Avatar,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  FormControlLabel,
} from "@mui/material";
import "../../css/addteacher.css";

function AddTeacherForm() {
  const [error, seterror] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    dob: "",
    mobile: "",
    qualification: "",
    department: "",
    profilePic: null,
    gender: "", // ✅ new field
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("address", formData.address);
    data.append("email", formData.email);
    data.append("dob", formData.dob);
    data.append("mobile", formData.mobile);
    data.append("qualification", formData.qualification);
    data.append("department", formData.department);
    data.append("gender", formData.gender);
    data.append("profilePic", formData.profilePic); // file field

    fetch("http://localhost:5005/admin/add-teacher", {
      method: "POST",
      body: data, // no JSON.stringify
      credentials: "include",
    }).then((res) => {
      if (res.status === 200) {
        alert("teacher added successfully");
        setFormData({
          name: "",
          address: "",
          email: "",
          dob: "",
          mobile: "",
          department: "",
          qualification: "",
          profilePic: null,
          gender: "",
        });
      } else {
        seterror("unable to save teacher details..... try again");
      }
    });
  };


  return (
    <Container maxWidth="sm" style={{ marginTop: "40px" }}>
      <Paper elevation={6} style={{ padding: "30px", borderRadius: "12px" }}>
        <Typography variant="h4" align="center" gutterBottom>
          ➕ Add Teacher
        </Typography>
        {error && (
          <Typography variant="h4" align="center" gutterBottom>
            {error}
          </Typography>
        )}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <Grid container spacing={2}>
            {/* Existing fields */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="email"
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="date"
                label="Date of Birth"
                name="dob"
                InputLabelProps={{ shrink: true }}
                value={formData.dob}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label="Mobile Number"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Qualification"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="department assigned"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* ✅ Gender Radio Buttons */}
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Gender</FormLabel>
                <RadioGroup
                  row
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <FormControlLabel
                    value="male"
                    control={<Radio />}
                    label="Male"
                  />
                  <FormControlLabel
                    value="female"
                    control={<Radio />}
                    label="Female"
                  />
                  <FormControlLabel
                    value="other"
                    control={<Radio />}
                    label="Other"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>

            {/* Profile Pic */}
            <Grid item xs={12} style={{ textAlign: "center" }}>
              <input
                type="file"
                name="profilePic"
                accept="image/*"
                onChange={handleChange}
                required
              />
              {formData.profilePic && (
                <Avatar
                  src={URL.createObjectURL(formData.profilePic)}
                  alt="Profile Preview"
                  sx={{ width: 80, height: 80, margin: "10px auto" }}
                />
              )}
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                style={{ padding: "12px", fontSize: "16px" }}
              >
                Add Teacher
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}

export default AddTeacherForm;
