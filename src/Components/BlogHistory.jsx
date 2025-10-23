import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from './Footer';

const BlogHistory = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { blog } = location.state || {};

  React.useEffect(() => {
    if (!blog) {
      navigate("/blog");
    }
  });

  if (!blog) {
    return <div className="error">Blog not found</div>;
  }

  const API_BASE = 'http://localhost:5000';
  let imageUrl = '';
  if (blog.image_url) {
    const cleanPath = blog.image_url.replace(/['"]/g, '');
    if (cleanPath.startsWith('http')) imageUrl = cleanPath;
    else if (cleanPath.startsWith('/uploads/')) imageUrl = `${API_BASE}${cleanPath}`;
    else imageUrl = `${API_BASE}/uploads/${cleanPath}`;
  }

  return (
    <div className="blog-history-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back to Blog
      </button>

      <div className="blog-history-container">
        <div className="blog-header">
          <h1>{blog.title}</h1>
          <p className="blog-history-snippet">{blog.snippet}</p>
        </div>

        <div className="blog-history-image-wrapper">
          <img
            src={imageUrl || "https://via.placeholder.com/800x600/2c2c2c/969696?text=No+Image"}
            alt={blog.title}
            className="blog-history-image"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/800x600/2c2c2c/969696?text=No+Image";
            }}
          />
        </div>

        <div className="blog-history-content">
          <div className="blog-history-meta">
            <div className="meta-item">
              <span className="meta-label">Published on:</span>
              <span className="meta-value">{new Date(blog.published_at || blog.created_at).toLocaleDateString()}</span>
            </div>
            {blog.views !== undefined && (
              <div className="meta-item">
                <span className="meta-label">Views:</span>
                <span className="meta-value">{blog.views}</span>
              </div>
            )}
            <div className="meta-item">
              <span className="meta-label">Author:</span>
              <span className="meta-value">{blog.author || "Admin"}</span>
            </div>
          </div>

          <div className="blog-history-description">
            {blog.description}
          </div>
        </div>
      </div>

      <Footer />

      <style>{`
        /* Hide scrollbar for all browsers */
        .blog-history-page::-webkit-scrollbar {
          display: none;
        }
        
        .blog-history-page {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        
        .blog-history-page {
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
          transition: all 0.3s ease;
        }

        .back-button:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .blog-history-container {
          max-width: 900px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          overflow: hidden;
          backdrop-filter: blur(12px);
          margin-top: 5rem;
          margin-bottom: 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .blog-header {
          padding: 2.5rem 2.5rem 1rem;
          text-align: center;
          background: rgba(0, 0, 0, 0.2);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .blog-header h1 {
          font-size: 2.8rem;
          margin-bottom: 1rem;
          color: #ffd700;
          font-weight: 700;
          line-height: 1.2;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .blog-history-snippet {
          font-size: 1.3rem;
          color: #ffeb99;
          margin-bottom: 1rem;
          font-weight: 600;
          font-style: italic;
          line-height: 1.4;
        }

        .blog-history-image-wrapper {
          width: 100%;
          height: 500px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.1);
          padding: 2rem;
        }

        .blog-history-image {
          max-width: 100%;
          max-height: 100%;
          width: auto;
          height: auto;
          object-fit: contain;
          border-radius: 12px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
          transition: transform 0.3s ease;
        }

        .blog-history-image:hover {
          transform: scale(1.02);
        }

        .blog-history-content {
          padding: 2.5rem;
        }

        .blog-history-meta {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 2.5rem;
          padding: 1rem 1.5rem;
          background: rgba(0, 0, 0, 0.25);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          flex-wrap: wrap;
          gap: 1.5rem;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }

        .meta-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0.3rem;
          min-width: 120px;
        }

        .meta-label {
          color: #ffd700;
          font-weight: 600;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .meta-value {
          color: #ffeb99;
          font-weight: 500;
          font-size: 0.95rem;
        }

        .blog-history-description {
          font-size: 1.15rem;
          line-height: 1.9;
          white-space: pre-wrap;
          text-align: justify;
          color: #e8e8e8;
        }

        .blog-history-description p {
          margin-bottom: 1.5rem;
        }

        .blog-history-description img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 1rem 0;
        }

        @media (max-width: 900px) {
          .blog-history-page {
            padding: 1.5rem;
          }
          
          .blog-header, .blog-history-content {
            padding: 2rem;
          }
          
          .blog-header h1 {
            font-size: 2.3rem;
          }
          
          .blog-history-image-wrapper {
            height: 400px;
            padding: 1.5rem;
          }
          
          .blog-history-meta {
            gap: 1.2rem;
            max-width: 450px;
          }
        }

        @media (max-width: 768px) {
          .blog-history-page {
            padding: 1rem;
          }
          
          .back-button {
            top: 90px;
            left: 20px;
            padding: 8px 16px;
            font-size: 0.9rem;
          }
          
          .blog-header, .blog-history-content {
            padding: 1.5rem;
          }
          
          .blog-header h1 {
            font-size: 2rem;
          }
          
          .blog-history-image-wrapper {
            height: 350px;
            padding: 1rem;
          }
          
          .blog-history-meta {
            flex-direction: row;
            gap: 1rem;
            max-width: 400px;
            padding: 0.8rem 1.2rem;
          }
          
          .meta-item {
            min-width: 100px;
          }
          
          .meta-label {
            font-size: 0.8rem;
          }
          
          .meta-value {
            font-size: 0.9rem;
          }
          
          .blog-history-description {
            font-size: 1.05rem;
            line-height: 1.7;
          }
        }

        @media (max-width: 600px) {
          .blog-history-meta {
            flex-direction: column;
            gap: 0.8rem;
            max-width: 300px;
            padding: 1rem;
          }
          
          .meta-item {
            flex-direction: row;
            justify-content: space-between;
            width: 100%;
            min-width: auto;
            gap: 1rem;
          }
          
          .meta-label {
            font-size: 0.85rem;
          }
          
          .meta-value {
            font-size: 0.9rem;
          }
        }

        @media (max-width: 480px) {
          .blog-header h1 {
            font-size: 1.8rem;
          }
          
          .blog-history-snippet {
            font-size: 1.1rem;
          }
          
          .blog-history-image-wrapper {
            height: 300px;
            padding: 0.8rem;
          }
          
          .blog-history-meta {
            padding: 0.8rem;
            max-width: 280px;
          }
          
          .meta-label {
            font-size: 0.8rem;
          }
          
          .meta-value {
            font-size: 0.85rem;
          }
          
          .blog-history-description {
            font-size: 1rem;
            line-height: 1.6;
          }
        }

        @media (max-width: 360px) {
          .blog-history-image-wrapper {
            height: 250px;
          }
          
          .blog-header h1 {
            font-size: 1.6rem;
          }
          
          .blog-history-snippet {
            font-size: 1rem;
          }
          
          .blog-history-meta {
            max-width: 250px;
            padding: 0.6rem;
          }
          
          .meta-item {
            gap: 0.5rem;
          }
          
          .meta-label {
            font-size: 0.75rem;
          }
          
          .meta-value {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default BlogHistory;