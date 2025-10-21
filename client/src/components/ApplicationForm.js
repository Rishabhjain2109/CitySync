import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import './css/ApplicationForm.css';
import Button from "./BasicComponents/Button/Button";

const ApplicationForm = () => {
  const [applicationPreview, setApplicationPreview] = useState(null);
  const [govtIdPreview, setGovtIdPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      applicationImage: null,
      govtId: null,
      name: "",
      department: "",
      mobileNumber: "",
      email: "",
    },
    validationSchema: Yup.object({
      applicationImage: Yup.mixed().required("Application image is required"),
      govtId: Yup.mixed().required("Government ID proof is required"),
      name: Yup.string().required("Required"),
      department: Yup.string().required("Required"),
      mobileNumber: Yup.string()
        .matches(/^\d{10}$/, "Must be a 10-digit number")
        .required("Required"),
      email: Yup.string().email("Invalid email").required("Required"),
    }),
    onSubmit: async (values) => {
        setLoading(true);
        try {
          const formData = new FormData();
          formData.append("applicationImage", formik.values.applicationImage);
          formData.append("govtId", formik.values.govtId);
          formData.append("name", formik.values.name);
          formData.append("department", formik.values.department);
          formData.append("mobileNumber", formik.values.mobileNumber);
          formData.append("email", formik.values.email);

          const token = localStorage.getItem("token"); // if your backend requires auth

          const response = await fetch("http://localhost:5000/api/admin/submit-applications", {
            method: "POST",
            body: formData,
            headers: {
              Authorization: `Bearer ${token}`, // optional, only if backend uses JWT auth
            },
        });

        const data = await response.json();

        if (response.ok) {
          alert("Application submitted successfully!");
          console.log(data);
          formik.resetForm();
          setApplicationPreview(null);
          setGovtIdPreview(null);
        } else {
          alert(data.message || "Error submitting application");
        }
      } catch (error) {
        console.error("Error submitting application:", error);
        alert("Something went wrong");
      }
      setLoading(false);
    },
  });

  const handleApplicationImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      formik.setFieldValue("applicationImage", file);
      setApplicationPreview(URL.createObjectURL(file));
    }
  };

  const handleGovtId = (e) => {
    const file = e.target.files[0];
    if (file) {
      formik.setFieldValue("govtId", file);
      setGovtIdPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="application-form-container">
      <form onSubmit={formik.handleSubmit} className="application-form-card">
        <h2>Application Form</h2>

        {/* Physical Application Upload */}
        <div>
          <label>Physical Application Image</label>
          <input type="file" accept="image/*" onChange={handleApplicationImage} />
          {applicationPreview && (
            <img src={applicationPreview} alt="Application Preview" className="application-preview" />
          )}
          {formik.touched.applicationImage && formik.errors.applicationImage && (
            <p className="error">{formik.errors.applicationImage}</p>
          )}
        </div>

        {/* Government ID Upload */}
        <div>
          <label>Government ID Proof</label>
          <input type="file" accept="image/*" onChange={handleGovtId} />
          {govtIdPreview && (
            <img src={govtIdPreview} alt="Govt ID Preview" className="govtId-preview" />
          )}
          {formik.touched.govtId && formik.errors.govtId && (
            <p className="error">{formik.errors.govtId}</p>
          )}
        </div>

        {/* Name */}
        <div>
          <label>Name</label>
          <input type="text" name="name" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} />
          {formik.touched.name && formik.errors.name && <p className="error">{formik.errors.name}</p>}
        </div>

        {/* Department */}
        <div>
          <label>Department</label>
          <input type="text" name="department" value={formik.values.department} onChange={formik.handleChange} onBlur={formik.handleBlur} />
          {formik.touched.department && formik.errors.department && <p className="error">{formik.errors.department}</p>}
        </div>

        {/* Mobile Number */}
        <div>
          <label>Mobile Number</label>
          <input type="text" name="mobileNumber" value={formik.values.mobileNumber} onChange={formik.handleChange} onBlur={formik.handleBlur} />
          {formik.touched.mobileNumber && formik.errors.mobileNumber && <p className="error">{formik.errors.mobileNumber}</p>}
        </div>

        {/* Email */}
        <div>
          <label>Email</label>
          <input type="email" name="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} />
          {formik.touched.email && formik.errors.email && <p className="error">{formik.errors.email}</p>}
        </div>

        <Button disabled={loading} type="submit">Submit Application</Button>
      </form>
    </div>
  );
};

export default ApplicationForm;
