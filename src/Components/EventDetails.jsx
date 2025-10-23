import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "./Footer";

const EventDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { event } = location.state || {};

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    phone: "",
    whatsapp: "",
    joinGroup: "",
    linkedin: "",
    city: "",
    domain: "",
    experience: "",
    organization: "",
  });
  const [errors, setErrors] = useState({});

  if (!event) {
    navigate("/events");
    return <div className="error">Event not found</div>;
  }

  const API_BASE = "http://localhost:5000";

  let imageUrl = "";
  if (event.image) {
    const cleanPath = event.image.replace(/['"]/g, "");
    if (cleanPath.startsWith("http")) imageUrl = cleanPath;
    else if (cleanPath.startsWith("/uploads/")) imageUrl = `${API_BASE}${cleanPath}`;
    else imageUrl = `${API_BASE}/uploads/${cleanPath}`;
  }

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Limit phone fields to 10 digits
    if ((name === "phone" || name === "whatsapp") && value.length > 10) return;

    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  // ✅ Validation Logic
  const validateForm = () => {
    const newErrors = {};

    if (!/^[A-Za-z\s]+$/.test(formData.firstName))
      newErrors.firstName = "Enter a valid first name (letters only)";
    if (!/^[A-Za-z\s]+$/.test(formData.lastName))
      newErrors.lastName = "Enter a valid last name (letters only)";

    if (!formData.gender) newErrors.gender = "Please select gender";

    if (!/^[6-9]\d{9}$/.test(formData.phone))
      newErrors.phone = "Enter a valid 10-digit Indian mobile number";

    if (formData.whatsapp && !/^[6-9]\d{9}$/.test(formData.whatsapp))
      newErrors.whatsapp = "Enter a valid 10-digit WhatsApp number";

    if (
      formData.linkedin &&
      !/^https?:\/\/(www\.)?linkedin\.com\/.*$/i.test(formData.linkedin)
    )
      newErrors.linkedin = "Enter a valid LinkedIn profile URL";

    if (!/^[A-Za-z\s]+$/.test(formData.city))
      newErrors.city = "Enter a valid city name";

    if (formData.joinGroup && !/^(yes|no)$/i.test(formData.joinGroup.trim()))
      newErrors.joinGroup = 'Enter "Yes" or "No" for Join Group';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("⚠️ Please correct the errors before submitting.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          eventId: event.id || event._id,
          eventTitle: event.title,
          eventEndDate: event.end_date || event.endDate,
        }),
      });

      if (response.ok) {
        alert("✅ Registration Successful!");
        setShowForm(false);
        setFormData({
          firstName: "",
          lastName: "",
          gender: "",
          phone: "",
          whatsapp: "",
          joinGroup: "",
          linkedin: "",
          city: "",
          domain: "",
          experience: "",
          organization: "",
        });
      } else {
        alert("❌ Registration failed. Try again.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("❌ Server error. Please try later.");
    }
  };

  return (
    <div className="event-details-page">
      {/* Back Button */}
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back to Events
      </button>

      <div className="event-details-container">
        <div className="event-header">
          <h1>{event.title}</h1>
        </div>

        <div className="event-image-wrapper">
          <img
            src={imageUrl || "https://via.placeholder.com/800x600/2c2c2c/969696?text=No+Image"}
            alt={event.title}
            className="event-details-image"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/800x600/2c2c2c/969696?text=No+Image";
            }}
          />
        </div>

        <div className="event-content">
          <div className="event-meta">
            <p className="event-date">
              Start: {formatDate(event.startdate || event.start_date)}
            </p>
            {event.end_date && (
              <p className="event-date">
                End: {formatDate(event.end_date || event.endDate)}
              </p>
            )}
          </div>

          <div className="event-description">{event.description}</div>

          <div className="event-actions">
            <button className="register-button" onClick={() => setShowForm(true)}>
              Register Now
            </button>
          </div>
        </div>
      </div>

      {/* Popup Form */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2>Register for {event.title}</h2>
            <form onSubmit={handleSubmit} className="register-form">
              <input
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              {errors.firstName && <p className="error-text">{errors.firstName}</p>}

              <input
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
              {errors.lastName && <p className="error-text">{errors.lastName}</p>}

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <p className="error-text">{errors.gender}</p>}

              <input
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                maxLength="10"
                required
              />
              {errors.phone && <p className="error-text">{errors.phone}</p>}

              <input
                name="whatsapp"
                placeholder="WhatsApp (Optional)"
                value={formData.whatsapp}
                onChange={handleChange}
                maxLength="10"
              />
              {errors.whatsapp && <p className="error-text">{errors.whatsapp}</p>}

              <input
                name="joinGroup"
                placeholder='Join Group ("Yes" or "No")'
                value={formData.joinGroup}
                onChange={handleChange}
              />
              {errors.joinGroup && <p className="error-text">{errors.joinGroup}</p>}

              <input
                name="linkedin"
                placeholder="LinkedIn Profile URL (Optional)"
                value={formData.linkedin}
                onChange={handleChange}
              />
              {errors.linkedin && <p className="error-text">{errors.linkedin}</p>}

              <input
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                required
              />
              {errors.city && <p className="error-text">{errors.city}</p>}

              <input
                name="domain"
                placeholder="Domain (Optional)"
                value={formData.domain}
                onChange={handleChange}
              />
              <input
                name="experience"
                placeholder="Experience (Optional)"
                value={formData.experience}
                onChange={handleChange}
              />
              <input
                name="organization"
                placeholder="Organization (Optional)"
                value={formData.organization}
                onChange={handleChange}
              />

              <div className="form-actions">
                <button type="submit">Submit</button>
                <button type="button" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />

      <style>{`
        .event-details-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #151f6d, #151f6d, #151f6d);
          color: white;
          padding: 2rem;
          overflow-x: hidden;
        }

        .back-button {
          position: absolute;
          top: 110px;
          left: 30px;
          padding: 10px 20px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-weight: 500;
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }

        .back-button:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .event-details-container {
          max-width: 900px;
          margin: 5rem auto 2rem auto;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          overflow: hidden;
          backdrop-filter: blur(12px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .event-header {
          padding: 2.5rem 2.5rem 1rem;
          text-align: center;
          background: rgba(0, 0, 0, 0.2);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .event-header h1 {
          font-size: 2.8rem;
          margin-bottom: 1rem;
          color: #ffd700;
          font-weight: 700;
          line-height: 1.2;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .event-image-wrapper {
          width: 100%;
          height: 500px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.1);
          padding: 2rem;
        }

        .event-details-image {
          max-width: 100%;
          max-height: 100%;
          width: auto;
          height: auto;
          object-fit: contain;
          border-radius: 12px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
          transition: transform 0.3s ease;
        }

        .event-details-image:hover {
          transform: scale(1.02);
        }

        .event-content {
          padding: 2.5rem;
        }

        .event-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2.5rem;
          padding: 1.2rem 1.5rem;
          background: rgba(0, 0, 0, 0.25);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          flex-wrap: wrap;
          gap: 1rem;
        }

        .event-date {
          color: #ffeb99;
          font-weight: 600;
          font-size: 1.1rem;
          margin: 0;
        }

        .event-description {
          font-size: 1.15rem;
          line-height: 1.9;
          white-space: pre-wrap;
          text-align: justify;
          color: #e8e8e8;
          margin-bottom: 2rem;
        }

        .event-actions {
          display: flex;
          justify-content: center;
        }

        .register-button {
          background: #ffcc00;
          color: #151f6d;
          border: none;
          padding: 15px 30px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
          font-size: 1.1rem;
          transition: all 0.3s ease;
        }

        .register-button:hover {
          background: #ffd633;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 204, 0, 0.4);
        }

        /* Modal styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-container {
          background: linear-gradient(135deg, #0d1440, #151f6d);
          color: #fff;
          padding: 2.5rem;
          border-radius: 16px;
          width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .modal-container h2 {
          color: #ffd700;
          text-align: center;
          margin-bottom: 1.5rem;
          font-size: 1.8rem;
        }

        .register-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .register-form input, .register-form select {
          padding: 12px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          font-size: 1rem;
        }

        .register-form input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        .register-form input:focus, .register-form select:focus {
          outline: none;
          border-color: #ffd700;
          box-shadow: 0 0 8px rgba(255, 215, 0, 0.3);
        }

        .error-text {
          color: #ff6b6b;
          font-size: 0.9rem;
          margin-top: -8px;
          margin-bottom: 5px;
        }

        .form-actions {
          display: flex;
          justify-content: space-between;
          margin-top: 1.5rem;
          gap: 1rem;
        }

        .form-actions button {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.3s ease;
          flex: 1;
        }

        .form-actions button[type="submit"] {
          background: #ffcc00;
          color: #151f6d;
        }

        .form-actions button[type="submit"]:hover {
          background: #ffd633;
          transform: translateY(-2px);
        }

        .form-actions button[type="button"] {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }

        .form-actions button[type="button"]:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        @media (max-width: 900px) {
          .event-details-page {
            padding: 1.5rem;
          }
          
          .event-header, .event-content {
            padding: 2rem;
          }
          
          .event-header h1 {
            font-size: 2.3rem;
          }
          
          .event-image-wrapper {
            height: 400px;
            padding: 1.5rem;
          }
        }

        @media (max-width: 768px) {
          .event-details-page {
            padding: 1rem;
          }
          
          .back-button {
            top: 90px;
            left: 20px;
            padding: 8px 16px;
            font-size: 0.9rem;
          }
          
          .event-header, .event-content {
            padding: 1.5rem;
          }
          
          .event-header h1 {
            font-size: 2rem;
          }
          
          .event-image-wrapper {
            height: 350px;
            padding: 1rem;
          }
          
          .event-meta {
            flex-direction: column;
            gap: 0.8rem;
            text-align: center;
          }
          
          .event-description {
            font-size: 1.05rem;
            line-height: 1.7;
          }

          .modal-container {
            width: 90%;
            padding: 2rem;
          }
        }

        @media (max-width: 480px) {
          .event-header h1 {
            font-size: 1.8rem;
          }
          
          .event-image-wrapper {
            height: 300px;
            padding: 0.8rem;
          }
          
          .event-meta {
            padding: 1rem;
          }
          
          .event-date {
            font-size: 1rem;
          }
          
          .event-description {
            font-size: 1rem;
            line-height: 1.6;
          }

          .form-actions {
            flex-direction: column;
          }
        }

        @media (max-width: 360px) {
          .event-image-wrapper {
            height: 250px;
          }
          
          .event-header h1 {
            font-size: 1.6rem;
          }
        }
      `}</style>
    </div>
  );
};

export default EventDetails;