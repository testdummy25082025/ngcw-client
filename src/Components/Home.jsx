import React, { useEffect, useState } from "react";
import "./Home";
import "@fortawesome/fontawesome-free/css/all.min.css";

import securityImg from "../assets/security.png";
import speakerImg from "../assets/Export speaker.png";
import volunteersImg from "../assets/volunteers.png";
import globalImg from "../assets/global.png";

// Social Icons & QR codes
import facebookIcon from "../assets/facebook.png";
import twitterIcon from "../assets/twitter.png";
import instagramIcon from "../assets/instagram.png";
import linkedinIcon from "../assets/linkedin.png";
import youtubeIcon from "../assets/youtube.png";

import facebookQR from "../assets/facebookQR.png";
import twitterQR from "../assets/twitterQR.png";
import instagramQR from "../assets/instagramQR.png";
import linkedinQR from "../assets/linkedinQR.png";
import youtubeQR from "../assets/youtubeQR.png";
import Footer from "./Footer";
import { Calendar, Clock, MapPin } from "lucide-react";

import scrollIcon from "../assets/scrollbar.png";

function HomePage() {
  const eventDate = new Date("2025-08-30T09:00:00");

  const calculateRemaining = () => {
    const now = new Date();
    const difference = eventDate - now;
    return difference > 0 ? difference : 0;
  };

  const [remainingTime, setRemainingTime] = useState(calculateRemaining());
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    if (remainingTime > 0) {
      const timer = setInterval(() => {
        setRemainingTime(calculateRemaining());
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [remainingTime]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatTime = (ms) => {
    const pad = (num) => String(num).padStart(2, "0");

    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / (24 * 3600));
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      days: pad(days),
      hours: pad(hours),
      minutes: pad(minutes),
      seconds: pad(seconds),
    };
  };

  const timeLeft = formatTime(remainingTime);

  return (
    <section>
      <div className="home-page">
        {/* Header */}
        <header className="header"></header>

        <section className="hero">
          <h1>
            Empowering Women in &nbsp;
            <span className="yellow">Cybersecurity</span>
          </h1>
          <p>
            NexGenCyberWomen (NGCW) is a community to empower and advance the
            next generation of women in cybersecurity by providing mentorship,
            training, and opportunities for growth, fostering a diverse and
            inclusive community dedicated to shaping the future of
            cybersecurity.
          </p>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLScZznEVH2nfbkVxIxGU8u7U-DdSitm0Nm0jMMtcgy0hEQ5M7g/viewform?pli=1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="join-btn">Join Us</button>
          </a>
        </section>
        
        <section className="section-light">
          <h2 className="event-title">What We Do</h2>

          <div className="cards">
            <div className="glass-card">
              <h3>Training & Mentorship</h3>
              <p>
                Access comprehensive training programs and receive guidance from
                experienced cybersecurity professionals to advance your skills.
              </p>
            </div>

            <div className="glass-card">
              <h3>Cybersecurity Jobs</h3>
              <p>
                Discover exciting job opportunities in the cybersecurity field,
                connect with recruiters, and learn about career paths.
              </p>
            </div>

            <div className="glass-card">
              <h3>Networking Events</h3>
              <p>
                Attend networking events to connect with other women in cybersecurity,
                share knowledge, and build relationships.
              </p>
            </div>
          </div>
        </section>

        {/* Events Section */}
        <section className="testimonials-container">
          <div className="container">
            <div className="eventss">Upcoming Event</div>

            <div className="countdown-container">
              <div className="countdown">
                {remainingTime > 0 ? (
                  <>
                    <p className="upcoming">
                      NGCW 1st year Anniversary <span>in</span>
                    </p>
                    <div className="time-block">
                      <span className="number">{timeLeft.days}&nbsp;:</span>
                      <span className="label">DAYS</span>
                    </div>
                    <div className="time-block">
                      <span className="number">{timeLeft.hours}&nbsp;:</span>
                      <span className="label">HOURS</span>
                    </div>
                    <div className="time-block">
                      <span className="number">{timeLeft.minutes}&nbsp;:</span>
                      <span className="label">MINS</span>
                    </div>
                    <div className="time-block">
                      <span className="number">{timeLeft.seconds}</span>
                      <span className="label">SECS</span>
                    </div>
                  </>
                ) : (
                  <h2>
                    <span> NGCW 1st Anniversary - Community Meetup Started!</span>
                    <br />
                    All CyberWomen Assemble!
                  </h2>
                )}
              </div>

              {remainingTime > 0 && (
                <button className="register-btn">Registration Closed</button>
              )}
            </div>
          </div>
          
          <div className="events-details">
            <p>
              <Calendar style={{ color: "rgb(255, 181, 0)", marginRight: "10px" }} />
              August 30, 2025
            </p>
            <p>
              <Clock style={{ color: "rgb(255, 181, 0)", marginRight: "8px" }} />
              9:00 AM IST
            </p>
            <p>
              <MapPin style={{ color: "rgb(255, 181, 0)", marginRight: "8px" }} />
              Chennai, India
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="container stats">
            <div className="stat-card">
              <img src={volunteersImg} alt="Volunteers" />
              <h2>700+</h2>
              <p>Active Members</p>
            </div>
            <div className="stat-card">
              <img src={securityImg} alt="Security" />
              <h2>100+</h2>
              <p>Security Professionals</p>
            </div>
            <div className="stat-card">
              <img src={speakerImg} alt="Speakers" />
              <h2>50+</h2>
              <p>Guest Lecturers</p>
            </div>
            <div className="stat-card">
              <img src={globalImg} alt="Global" />
              <h2>10+</h2>
              <p>Physical/virtual Community Connect</p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="social">
          <div className="social-icons-wrapper">
            <div className="events">Contact</div>
            <div className="social-logos">
              <a
                href="https://www.facebook.com/people/NexGen-Cyber-Women/61572808730765/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={facebookIcon} alt="Facebook" />
              </a>
              <a
                href="https://x.com/nexgenwomen"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={twitterIcon} alt="Twitter" />
              </a>
              <a
                href="https://www.instagram.com/ngcyberwomen"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={instagramIcon} alt="Instagram" />
              </a>
              <a
                href="https://www.linkedin.com/company/nexgencyberwomen/?originalSubdomain=in"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={linkedinIcon} alt="LinkedIn" />
              </a>
              <a
                href="https://www.youtube.com/channel/UCWtcTQjt6hboL98Ew5xs_fg"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={youtubeIcon} alt="YouTube" />
              </a>
            </div>
            <div className="social-qr-codes">
              <a href={facebookQR} target="_blank" rel="noopener noreferrer">
                <img src={facebookQR} alt="Facebook QR" />
              </a>
              <a href={twitterQR} target="_blank" rel="noopener noreferrer">
                <img src={twitterQR} alt="Twitter QR" />
              </a>
              <a href={instagramQR} target="_blank" rel="noopener noreferrer">
                <img src={instagramQR} alt="Instagram QR" />
              </a>
              <a href={linkedinQR} target="_blank" rel="noopener noreferrer">
                <img src={linkedinQR} alt="LinkedIn QR" />
              </a>
              <a href={youtubeQR} target="_blank" rel="noopener noreferrer">
                <img src={youtubeQR} alt="YouTube QR" />
              </a>
            </div>
          </div>
        </section>

        {/* Scroll to top */}
        <a
          href="#top"
          className={`scroll-top ${showScroll ? "visible" : ""}`}
          onClick={scrollToTop}
        >
          <img src={scrollIcon} alt="Scroll to top" className="scroll-icon" />
        </a>
      </div>
      <Footer/>
    </section>
  );
}

export default HomePage;