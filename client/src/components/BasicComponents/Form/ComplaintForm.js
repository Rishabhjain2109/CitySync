import React, { useState, useEffect } from "react";
import "./ComplaintForm.css";
import axios from "axios";
import Button from "../Button/Button";
// import dote

const ComplaintForm = () => {
  const [formData, setFormData] = useState({
    type: "",
    images: [],
    description: "",
    address: "",
    latitude: "",
    longitude: ""
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // 🌍 Get location when component mounts
  useEffect(() => {
    getLocation();
  }, []);

  // Get user's current location
  const getLocation = () => {
    if (navigator.geolocation) {
      setLoadingAddress(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prev) => ({ ...prev, latitude, longitude }));
          await getAddressFromCoords(latitude, longitude);
          setLoadingAddress(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Please allow location access to auto-fill your address.");
          setLoadingAddress(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  // 🧭 Reverse Geocoding using Google Maps API
  const getAddressFromCoords = async (lat, lng) => {
    try {
      const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`
      );

      if (response.data.results.length > 0) {
        const address = response.data.results[0].formatted_address;
        setFormData((prev) => ({ ...prev, address }));
      } else {
        console.warn("No address found for these coordinates.");
      }
    } catch (error) {
      console.error("Error in reverse geocoding:", error);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, files, value } = e.target;

    if (name === "images") {
      const selectedFiles = Array.from(files);
      const updatedImages = [...formData.images, ...selectedFiles];
      setFormData({ ...formData, images: updatedImages });

      const newPreviews = selectedFiles.map((file) =>
        URL.createObjectURL(file)
      );
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const removeImage = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updatedImages });
    setImagePreviews(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    setSubmitLoading(true);
    e.preventDefault();

    const data = new FormData();
    formData.images.forEach((img) => data.append("images", img));
    data.append("description", formData.description);
    data.append("address", formData.address);
    data.append("type", formData.type);
    data.append("latitude", formData.latitude);
    data.append("longitude", formData.longitude);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/complaints/userSubmit",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Complaint submitted successfully!");
      console.log(res.data);
    } catch (error) {
      console.error("Error submitting complaint:", error);
      alert("Error submitting complaint.");
    }

    setSubmitLoading(false);
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Submit Complaint</h2>

      <form className="complaint-form" onSubmit={handleSubmit}>
        {/* Complaint Type */}
        <div className="form-group">
          <label htmlFor="type">Select Problem Type</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
          >
            <option value="">-- Select --</option>
            <option value="garbage">Garbage</option>
            <option value="sewage">Sewage</option>
            <option value="electricity">Electricity</option>
            <option value="road">Road</option>
            <option value="water">Water</option>
          </select>
        </div>

        {/* Upload Images */}
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

        {/* Image Previews */}
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

        {/* Address (Auto-filled) */}
        <div className="form-group">
          <label htmlFor="address">
            Address{" "}
            {loadingAddress && (
              <span style={{ color: "gray" }}>(Fetching address...)</span>
            )}
          </label>
          <input
            type="text"
            id="address"
            name="address"
            placeholder="Fetching your location..."
            value={formData.address}
            
          />
        </div>

        <Button disabled={submitLoading} type="submit" className="submit-btn">
          {!submitLoading ? "Submit" : "Submitting"}
        </Button>
      </form>
    </div>
  );
};

export default ComplaintForm;
