import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Blog";
import Footer from "./Footer";
import scrollIcon from "../assets/scrollbar.png";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showScroll, setShowScroll] = useState(false);
  const [backendAvailable, setBackendAvailable] = useState(true);
  const navigate = useNavigate();

  const API_BASE = "http://localhost:5000";

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // Set a timeout for the fetch request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        const response = await fetch(`${API_BASE}/api/blogs`, {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) throw new Error("Failed to fetch blogs");
        const data = await response.json();
        const filteredBlogs = data.filter((b) => b.approved && b.published);
        setBlogs(filteredBlogs);
        setBackendAvailable(true);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError(err.message);
        setBackendAvailable(false);
        setBlogs([]); // Ensure blogs array is empty
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const closeModal = () => {
    setSelectedBlog(null);
  };

  const navigateToBlogHistory = (blog) => {
    navigate(`/bloghistory/${blog.id}`, { state: { blog } });
  };

  useEffect(() => {
    const handleScroll = () => setShowScroll(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="blog-page">
      <h1 className="gallery-main-title">Blog</h1>
      
      {loading ? (
        <div className="loading-message">Loading...</div>
      ) : error || !backendAvailable || blogs.length === 0 ? (
        <div className="blogs-grid">
          <div className="no-blogs-message">
            <h2>Blog Coming Soon...</h2>
            <p>We're working on some amazing content for you. Stay tuned!</p>
          </div>
        </div>
      ) : (
        <div className="blogs-grid">
          {blogs.map((blog) => {
            let imageUrl = "";
            if (blog.image_url) {
              const cleanPath = blog.image_url.replace(/['"]/g, "");
              if (cleanPath.startsWith("http")) imageUrl = cleanPath;
              else if (cleanPath.startsWith("/uploads/")) imageUrl = `${API_BASE}${cleanPath}`;
              else imageUrl = `${API_BASE}/uploads/${cleanPath}`;
            }

            return (
              <div key={blog.id} className="blog-card">
                <div className="image-wrapper">
                  <img
                    src={imageUrl || "https://via.placeholder.com/300x300/2c2c2c/969696?text=No+Image"}
                    alt={blog.title}
                    className="blog-image"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x300/2c2c2c/969696?text=No+Image";
                    }}
                  />
                </div>
                <div className="card-content">
                  <h3 className="blog-title">{blog.title}</h3>
                  <p className="blog-snippet">{blog.snippet}</p>
                  
                  <div className="blog-actions">
                    <button
                      className="read-full-btn"
                      onClick={() => navigateToBlogHistory(blog)}
                    >
                      Read More
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for blog description */}
      {selectedBlog && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            
            <div className="modal-image-wrapper">
              <img
                src={
                  selectedBlog.image_url 
                    ? `${API_BASE}${selectedBlog.image_url.replace(/['"]/g, '')}`
                    : "https://via.placeholder.com/500x500/2c2c2c/969696?text=No+Image"
                }
                alt={selectedBlog.title}
                className="modal-image"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/500x500/2c2c2c/969696?text=No+Image";
                }}
              />
            </div>
            
            <h2>{selectedBlog.title}</h2>
            <p className="blog-modal-snippet">{selectedBlog.snippet}</p>
            
            <div className="blog-modal-description">
              {selectedBlog.description}
            </div>
            
            <div className="modal-actions">
              <button 
                className="read-full-btn"
                onClick={() => {
                  closeModal();
                  navigateToBlogHistory(selectedBlog);
                }}
              >
                Read Full Article
              </button>
              <button className="modal-close-btn-1" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      <a
        href="#top"
        className={`scroll-top ${showScroll ? "visible" : ""}`}
        onClick={(e) => {
          e.preventDefault();
          scrollToTop();
        }}
      >
        <img src={scrollIcon} alt="Scroll to top" className="scroll-icon" />
      </a>

      <style>{`
  .blog-page {
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

  .blogs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2.5rem;
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
    align-items: stretch;
    justify-items: center;
  }

  .no-blogs-message {
    grid-column: 1 / -1;
    text-align: center;
    padding: 3rem 2rem;
    backdrop-filter: blur(10px);
  }

  .no-blogs-message h2 {
    color: #ffd700;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 5px rgba(0,0,0,0.6);
  }

  .no-blogs-message p {
    font-size: 1.2rem;
    color: #fff;
    max-width: 500px;
    margin: 0 auto;
    line-height: 1.6;
  }

  .blog-card {
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

  .blog-card:hover {
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

  .blog-image {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    object-fit: contain;
    border-radius: 0.5rem;
    transition: transform 0.4s ease;
  }

  .blog-card:hover .blog-image {
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

  .blog-title {
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

  .blog-snippet {
    color: #ffeb99;
    font-weight: 500;
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

  .blog-snippet span {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
  }

  .blog-actions {
    margin-top: auto;
    display: flex;
    justify-content: center;
    flex-shrink: 0;
  }

  .read-full-btn {
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

  .read-full-btn:hover {
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

  /* Modal Styles */
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

  .modal-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    color: white;
    font-size: 2rem;
    cursor: pointer;
    z-index: 10;
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

  .blog-modal-snippet {
    color: #ffeb99;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .blog-modal-description {
    color: #ddd;
    line-height: 1.6;
    margin-bottom: 1.5rem;
    white-space: pre-wrap;
    padding: 1rem;
    background: rgba(0,0,0,0.2);
    border-radius: 0.5rem;
    text-align: left;
  }

  .modal-actions {
    display: flex;
    gap: 10px;
    justify-content: center;
    flex-shrink: 0;
  }

  .modal-close-btn-1 {
    background: #ff6b6b;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.3s ease;
    min-height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal-close-btn-1:hover {
    background: #ff5252;
    transform: translateY(-2px);
  }

  /* Special handling for 1-3 items to ensure good spacing */
  @media (min-width: 768px) {
    .blogs-grid:has(.blog-card:nth-child(2):last-child) {
      grid-template-columns: repeat(2, minmax(350px, 1fr));
      justify-content: center;
      max-width: 900px;
    }
    
    .blogs-grid:has(.blog-card:nth-child(1):last-child) {
      grid-template-columns: minmax(350px, 400px);
      justify-content: center;
    }
    
    .blogs-grid:has(.blog-card:nth-child(3):last-child) {
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    }
  }

  @media (max-width: 1024px) {
    .blogs-grid {
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 2rem;
      padding: 1.5rem;
    }
  }

  @media (max-width: 768px){
    .blogs-grid { 
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      padding: 1rem; 
      gap: 2rem;
    }
    .gallery-main-title { 
      font-size: 2rem; 
      margin-top: 20%; 
    }
    .no-blogs-message h2 { 
      font-size: 2rem; 
    }
    .no-blogs-message p { 
      font-size: 1rem; 
    }
    .blog-card {
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
    .blog-title {
      font-size: 1.3rem;
      min-height: 55px;
    }
    .modal-image-wrapper {
      height: 300px;
      padding: 15px;
    }
    .read-full-btn {
      padding: 12px 20px;
      font-size: 1rem;
    }
    .modal-actions {
      flex-direction: column;
    }
    .modal-content {
      max-width: 95%;
      padding: 1.5rem;
    }
  }

  @media (max-width: 480px) {
    .blog-page {
      padding: 1rem;
    }
    .blogs-grid {
      grid-template-columns: 1fr;
      padding: 0.5rem;
      gap: 1.5rem;
    }
    .blog-card {
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
    .blog-title {
      font-size: 1.2rem;
      min-height: 50px;
    }
    .blog-snippet {
      min-height: 80px;
    }
  }

  @media (max-width: 360px) {
    .blogs-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    .blog-card {
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
`}</style>
      <Footer />
    </div>
  );
};

export default Blog;