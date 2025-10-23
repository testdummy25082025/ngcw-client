import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Event";
import Footer from "./Footer";
import scrollIcon from "../assets/scrollbar.png";

const Events = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [showScroll, setShowScroll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [backendAvailable, setBackendAvailable] = useState(true);

  const API_BASE = "http://localhost:5000";

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`${API_BASE}/api/events`, {
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) throw new Error("Failed to fetch events");
        const data = await response.json();

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        

        const filteredEvents = data
          .filter(
            (event) =>
              event.is_approved &&
              event.published &&
              new Date(event.end_date) >= today
          )
          .sort(
            (a, b) =>
              new Date(a.start_date || a.startdate) -
              new Date(b.start_date || b.startdate)
          );

        setEvents(filteredEvents);
        setBackendAvailable(true);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(err.message);
        setBackendAvailable(false);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const formatEventDate = (dateString) => {
    if (!dateString) return "";
    const parsedDate = new Date(dateString);
    if (isNaN(parsedDate)) return dateString;
    return parsedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const truncateText = (text, limit = 150) =>
    text && text.length > limit ? text.slice(0, limit) + "..." : text;

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setShowScroll(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigate to Event Details page
  const navigateToEventDetails = (event) => {
    navigate("/event-details", { state: { event } });
  };

  // Check if description is long enough to need "Read More"
  const isLongDescription = (description, limit = 150) => {
    return description && description.length > limit;
  };

  return (
    <div className="events-page">
      <h1 className="gallery-main-title">Events</h1>

      {loading ? (
        <div className="loading-message">Loading...</div>
      ) : error || !backendAvailable || events.length === 0 ? (
        <div className="events-grid">
          <div className="no-events-message">
            <h2>Events Coming Soon...</h2>
            <p>We're working on some amazing events for you. Stay tuned!</p>
          </div>
        </div>
      ) : (
        <div className="events-grid">
          {events.map((event) => {
            let imageUrl = "";
            if (event.image) {
              const cleanImagePath = event.image.replace(/['"]/g, "");
              if (cleanImagePath.startsWith("http")) imageUrl = cleanImagePath;
              else if (cleanImagePath.startsWith("/uploads/"))
                imageUrl = `${API_BASE}${cleanImagePath}`;
              else imageUrl = `${API_BASE}/uploads/${cleanImagePath}`;
            }

            const hasLongDescription = isLongDescription(event.description);

            return (
              <div key={event.id} className="event-card">
                <div className="image-wrapper">
                  <img
                    src={
                      imageUrl ||
                      "https://via.placeholder.com/300x300/2c2c2c/969696?text=No+Image"
                    }
                    alt={event.title}
                    className="event-image"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x300/2c2c2c/969696?text=No+Image";
                    }}
                  />
                </div>
                <div className="card-content">
                  <h3>{event.title}</h3>
                  <p className="event-date">
                    Start: {formatEventDate(event.startdate || event.start_date)}
                  </p>
                  {event.end_date && (
                    <p className="event-date">
                      End: {formatEventDate(event.end_date || event.endDate)}
                    </p>
                  )}
                  <div className="event-desc">
                    <span>
                      {hasLongDescription
                        ? truncateText(event.description)
                        : event.description || "No description available."}
                    </span>
                  </div>
                  
                  <div className="event-actions">
                    {hasLongDescription ? (
                      <button
                        className="read-more-btn"
                        onClick={() => navigateToEventDetails(event)}
                      >
                        Read More
                      </button>
                    ) : (
                      <button
                        className="register-btn"
                        onClick={() => navigateToEventDetails(event)}
                      >
                        Register Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <a
        href="#top"
        className={`scroll-top ${showScroll ? "visible" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <img src={scrollIcon} alt="Scroll to top" className="scroll-icon" />
      </a>

     
      <style>{`
  .events-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #151f6d, #151f6d, #151f6d);
    color: #fff;
    font-family: 'Arial', sans-serif;
    position: relative;
  }

  .gallery-main-title {
    font-size: 2rem;
    font-weight: bold;
    text-align: center;
    position: relative;
    margin-bottom: 30px;
    color: var(--color-secondary);
    margin-top: 5%;
  }

  .loading-message {
    text-align: center;
    font-size: 1.5rem;
    color: #ffd700;
    margin-top: 3rem;
  }

  .events-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2.5rem;
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
    align-items: stretch;
    justify-items: center;
  }

  .no-events-message {
    grid-column: 1 / -1;
    text-align: center;
    padding: 3rem 2rem;
    backdrop-filter: blur(10px);
  }

  .no-events-message h2 {
    color: #ffd700;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 5px rgba(0,0,0,0.6);
  }

  .no-events-message p {
    font-size: 1.2rem;
    color: #fff;
    max-width: 500px;
    margin: 0 auto;
    line-height: 1.6;
  }

  .event-card {
    background: rgba(255,255,255,0.1);
    backdrop-filter: blur(8px);
    border-radius: 1rem;
    color: #fff;
    padding: 0;
    display: flex;
    flex-direction: column;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    height: 100%;
    width: 100%;
    max-width: 380px;
    min-height: 580px;
    overflow: hidden;
    text-align: center;
    box-shadow: 0 8px 25px rgba(0,0,0,0.2);
  }

  .event-card:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 15px 40px rgba(31,38,135,0.6);
  }

  .image-wrapper {
    width: 100%;
    height: 250px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0;
    border-radius: 0.75rem 0.75rem 0 0;
    overflow: hidden;
    background: rgba(0,0,0,0.1);
    flex-shrink: 0;
    padding: 15px;
  }

  .event-image {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    object-fit: contain;
    border-radius: 0.5rem;
    transition: transform 0.4s ease;
  }

  .event-card:hover .event-image {
    transform: scale(1.08);
  }

  .card-content {
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
    flex: 1;
    height: 100%;
    min-height: 330px;
  }

  .event-card h3 {
    color: #ffd700;
    margin: 0.5rem 0 1rem 0;
    font-size: 1.4rem;
    font-weight: bold;
    min-height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1.3;
    flex-shrink: 0;
  }

  .event-date {
    color: #ffeb99;
    font-weight: 600;
    margin-bottom: 1rem;
    font-size: 0.95rem;
    flex-shrink: 0;
  }

  .event-desc {
    margin-bottom: 1.5rem;
    flex-grow: 1;
    color: #ddd;
    line-height: 1.6;
    min-height: 90px;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    overflow: hidden;
  }

  .event-desc span {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
  }

  .event-actions {
    margin-top: auto;
    display: flex;
    justify-content: center;
    flex-shrink: 0;
  }

  .read-more-btn, .register-btn {
    background: #ffcc00;
    color: #151f6d;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.3s ease;
    width: 100%;
    font-size: 1rem;
    min-height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .read-more-btn:hover, .register-btn:hover {
    background: #ffd633;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 204, 0, 0.4);
  }

  .scroll-top {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    background: rgba(255,255,255,0.2);
    border-radius: 50%;
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 1000;
  }

  .scroll-top.visible { opacity: 1; }
  .scroll-icon { width: 30px; height: 30px; }

  /* Modal */
  .modal-overlay {
    position: fixed;
    top:0; left:0; right:0; bottom:0;
    background-color: rgba(0,0,0,0.75);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    padding: 20px;
  }

  .modal-content {
    background: linear-gradient(135deg,#0d1440,#151f6d);
    border-radius: 1rem;
    padding: 2rem;
    max-width: 600px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    display: flex;
    flex-direction: column;
    box-shadow: 0 10px 25px rgba(0,0,0,0.7);
    text-align: center;
  }

  .modal-image-wrapper {
    width: 100%;
    height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
    border-radius: 0.75rem;
    overflow: hidden;
    background: rgba(0,0,0,0.1);
    padding: 20px;
  }

  .modal-image {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    object-fit: contain;
    border-radius: 0.75rem;
  }

  .modal-content h2 {
    color: #ffd700;
    margin-bottom: 0.5rem;
    font-size: 1.8rem;
  }

  .modal-date {
    color: #ffeb99;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .modal-description {
    color: #ddd;
    line-height: 1.6;
    margin-bottom: 1.5rem;
    white-space: pre-wrap;
    padding: 1rem;
    background: rgba(0,0,0,0.2);
    border-radius: 0.5rem;
    text-align: left;
  }

  /* Registration Form */
  .form-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 1rem;
  }

  .form-container input {
    padding: 10px 12px;
    border-radius: 6px;
    border: 1px solid #ccc;
    font-size: 1rem;
    width: 100%;
    transition: all 0.3s ease;
  }

  .form-container input:focus {
    outline: none;
    border-color: #ffd700;
    box-shadow: 0 0 8px #ffd70050;
  }

  .modal-register-button {
    background: linear-gradient(45deg,#ffd700,#ffcc33);
    color: #151f6d;
    font-weight: 700;
    padding: 12px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 10px;
  }

  .modal-register-button:hover {
    background: linear-gradient(45deg,#ff8e53,#ff6b6b);
    color: #fff;
    transform: translateY(-2px);
  }

  /* Special handling for 1-3 items to ensure good spacing */
  @media (min-width: 768px) {
    .events-grid:has(.event-card:nth-child(2):last-child) {
      grid-template-columns: repeat(2, minmax(350px, 1fr));
      justify-content: center;
      max-width: 900px;
    }
    
    .events-grid:has(.event-card:nth-child(1):last-child) {
      grid-template-columns: minmax(350px, 400px);
      justify-content: center;
    }
    
    .events-grid:has(.event-card:nth-child(3):last-child) {
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    }
  }

  @media (max-width: 1024px) {
    .events-grid {
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 2rem;
      padding: 1.5rem;
    }
  }

  @media (max-width: 768px){
    .events-grid { 
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      padding: 1rem; 
      gap: 2rem;
    }
    .gallery-main-title { 
      font-size: 2rem; 
      margin-top: 20%; 
    }
    .no-events-message h2 { 
      font-size: 2rem; 
    }
    .no-events-message p { 
      font-size: 1rem; 
    }
    .event-card {
      min-height: 550px;
      max-width: 100%;
    }
    .image-wrapper {
      height: 220px;
      padding: 12px;
    }
    .card-content {
      padding: 1.2rem;
      min-height: 300px;
    }
    .event-card h3 {
      font-size: 1.3rem;
      min-height: 55px;
    }
    .modal-image-wrapper {
      height: 300px;
      padding: 15px;
    }
    .read-more-btn, .register-btn {
      padding: 12px 20px;
      font-size: 1rem;
    }
  }

  @media (max-width: 480px) {
    .events-page {
      padding: 1rem;
    }
    .events-grid {
      grid-template-columns: 1fr;
      padding: 0.5rem;
      gap: 1.5rem;
    }
    .event-card {
      min-height: 520px;
      padding: 0;
      max-width: 100%;
    }
    .image-wrapper {
      height: 200px;
      padding: 10px;
    }
    .card-content {
      padding: 1rem;
      min-height: 280px;
    }
    .modal-image-wrapper {
      height: 250px;
      padding: 10px;
    }
    .event-card h3 {
      font-size: 1.2rem;
      min-height: 50px;
    }
    .event-desc {
      min-height: 80px;
    }
  }

  @media (max-width: 360px) {
    .events-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    .event-card {
      min-height: 500px;
    }
    .image-wrapper {
      height: 180px;
      padding: 8px;
    }
    .card-content {
      min-height: 260px;
    }
  }
`}</style> <Footer />
    </div>
  );
};

export default Events;