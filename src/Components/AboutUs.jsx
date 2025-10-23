import React, { useEffect, useState } from "react";
import "./AboutUs";

// Import images
import vimala from "../assets/vimala.png";
import pavithra from "../assets/pavithra 1.png";
import riveta from "../assets/riveta.png";
import karthikeyan from "../assets/karthikeyan.png";
import kasthuri from "../assets/kasthuri.png";
import shyleja from "../assets/shyleja.png";
import Tarun from "../assets/Tarun.jpg";
import scrollIcon from "../assets/scrollbar.png"; // ✅ Scroll icon
import Footer from './Footer';
import { FaLinkedin } from "react-icons/fa";

// Team data
const teamMembers = [
  {
    name: "Vimalaasree Anandhan",
    role: "President",
    img: vimala,
    linkedin: "https://www.linkedin.com/in/vimalaasree/",
  },
  {
    name: "Pavithra Jayaprakash",
    role: "Vice President",
    img: pavithra,
    linkedin: "https://www.linkedin.com/in/pavithra-jayaprakash-2907b122/",
  },
  {
    name: "Riveta Das",
    role: "General Secretary",
    img: riveta,
    linkedin: "https://www.linkedin.com/in/riveta/",
  },
  {
    name: "Karthikeyan K",
    role: "Advisory Board",
    img: karthikeyan,
    linkedin: "https://www.linkedin.com/in/karthikeyan1337/",
  },
  {
    name: "Kasthuri Ganeshguru",
    role: "Innovation Strategist",
    img: kasthuri,
    linkedin: "https://www.linkedin.com/in/kasthuguru/",
  },
  {
    name: "Shyleja",
    role: "Content Creator",
    img: shyleja,
    linkedin: "https://www.linkedin.com/in/shyleja/",
  },
  {
    name: "D S Tarun",
    role: "Student Co-ordinator",
    img: Tarun,
    linkedin: "https://www.linkedin.com/in/tarun-d-s-02a365255/",
  },
];

function AboutUs() {
  const [showScroll, setShowScroll] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="aboutus-page">
      {/* Optional Scrollbar Styling */}
      <style>{`
        .scroll-top {
          position: fixed;
          bottom: 25px;
          right: 25px;
          z-index: 1000;
          display: none;
        }

        .scroll-top.visible {
          display: block;
        }

        .scroll-icon {
          width: 40px;
          height: 40px;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .scroll-icon:hover {
          transform: scale(1.1);
        }
      `}</style>

      {/* ✅ Navbar placeholder */}
      <div className="gallery-page"></div>
      <header className="header"></header>
      <section className="photo-gallery-section"></section>

      {/* About Header */}
      <header className="about-header">
        <h1 className="gallery-main-title">About Us</h1>
      </header>

      {/* Mission & Vision Section */}
      <section className="mission-section section-dark">
        <div className="container">
          <div className="eventss-title">Our Mission & Vision</div>
          <div className="mission-vision-wrapper">
            <div className="card-group">
              <h3 className="subheading">Mission</h3>
              <div className="content-block">
                <p>
               Our mission is to empower and advance the next generation of women in cybersecurity by providing mentorship, training, and opportunities for growth, fostering a diverse and inclusive community dedicated to shaping the future of cybersecurity.
                </p>
              </div>
            </div>

            <div className="card-group">
              <h3 className="subheading">Vision</h3>
              <div className="content-block">
                <p>
           To cultivate a dynamic and inclusive cybersecurity ecosystem where women thrive as leaders and innovators, driving transformative change and securing the digital landscape for all. Together, we envision a future where diverse voices unite to create resilient and forward-thinking solutions in cybersecurity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="team-section">
        <div className="eventss-titles">Meet the Team</div>
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div key={index} className="team-card">
              <img src={member.img} alt={member.name} className="team-img" />
              <h3 className="team-name">{member.name}</h3>
              {member.role && <p className="team-role">{member.role}</p>}
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLinkedin className="linkedin-icon" />
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* ✅ Scroll To Top Button */}
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
    </div>
  );
}

export default AboutUs;
