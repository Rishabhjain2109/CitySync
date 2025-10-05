import React, { useState } from "react";
import "./ComplaintForm.css";
import axios from "axios";

const ComplaintForm = () => {
  const [formData, setFormData] = useState({
    images: [],
    description: "",
    address: ""
  });
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleChange = (e) => {
    const { name, files, value } = e.target;

    if (name === "images") {
      const selectedFiles = Array.from(files);

      // Append new images
      const updatedImages = [...formData.images, ...selectedFiles];
      setFormData({ ...formData, images: updatedImages });

      // Update previews
      const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Remove image handler
  const removeImage = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updatedImages });
    setImagePreviews(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    formData.images.forEach((img) => data.append("images", img));
    data.append("description", formData.description);
    data.append("address", formData.address);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/api/complaints/userSubmit", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      });
      alert("Complaint submitted successfully!");
      console.log(res.data);
    } catch (error) {
      console.error("Error submitting complaint:", error);
      alert("Error submitting complaint.");
    }
  };


  return (
    <div className="form-container">
      <h2 className="form-title">Submit Complaint</h2>
      <form className="complaint-form" onSubmit={handleSubmit}>
        {/* Image Input */}
        <div className="form-group">
          <label htmlFor="images">Upload Images</label>
          <input
            type="file"
            id="images"
            name="images"
            accept="image/*"
            multiple
            onChange={handleChange}
          />
        </div>

        {/* Image Previews with Remove Button */}
        {imagePreviews.length > 0 && (
          <div className="image-preview-container">
            {imagePreviews.map((src, index) => (
              <div key={index} className="image-preview-wrapper">
                <img
                  src={src}
                  alt={`Preview ${index + 1}`}
                  className="image-preview"
                />
                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={() => removeImage(index)}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            rows="5"
            placeholder="Enter complaint details"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Address */}
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            placeholder="Enter your address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ComplaintForm;
