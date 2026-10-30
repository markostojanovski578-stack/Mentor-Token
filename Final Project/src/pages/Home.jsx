import React from 'react'
import { NavLink } from "react-router-dom";

function Home() {
  return (
    <>
      <header>
        <div className="logo">
          <img src="/logo.svg" alt="Logo" />
        </div>

        <nav>
           <NavLink to="/">Home</NavLink>
           <NavLink to="/about">About</NavLink>
           <NavLink to="/contact">Contact</NavLink>
        </nav>

        <div className="auth-buttons">
         <a href="/login">Login</a>

        <NavLink to="/register" className="get-started">
          <img src="/arrow-right.svg" alt="" />
           <span>Get Started</span>
          </NavLink>
         </div>
      </header>

      <main>
        <section className="main-window">
           <img src="/laptop.svg" alt="Laptop" className="laptop" />

          <div className="main-buttons">
             <NavLink to="/register" className="get-started">
            <img src="/arrow-right.svg" alt="" />
           <span>Get Started</span>
          </NavLink>

            <a href="/contact" className="get-in-touch">
             Get in Touch
            </a>
          </div>
           <img src="/Text.png" alt="" className="main-text" />
        </section>
        <section className="adobe-section">
          <img src="/adobe.svg" alt="Adobe" />
        </section>
        <section className="atlassian-section">
          <img src="/atlassian.svg" alt="Atlassian" />
        </section>

        <div className="startup-text">
          More than 25+ Startups around the world trusted Mentor Token.
        </div>

        <div className="next-window">
         <img src="/rocket.svg" alt="Rocket" className="rocket" />
         
         <div className="features">
          FEATURES
         </div>

         <div className="features-title">
          Boost Your Startup's Journey: Discover Mentor Token's Robust Features
          </div>
         
         <div className='feature-cards'>

          <div className="feature-card">
             <img src="/card1.png" alt="" />
             <div className="card-title">
               Goal Setting
             </div>

             <div className="card-description">
               Set clear and achievable goals for your startup's success.
              </div>
         </div>

         <div className="feature-card">
          <img src="/card2.png" alt="" />

          <div className="card-title">
           Performance Tracking
          </div>

           <div className="card-description">
             Monitor mentor performance in real-time and track progress.
           </div>
         </div>

         <div className="feature-card">
          <img src="/card3.png" alt="" />

          <div className="card-title">Reward System</div>
           
           <div className='card-description'>
            Motivate mentors with a secure and rewarding token-based reward system.
           </div>
         </div>

         <div className="feature-card">
           <img src="/card4.png" alt="" />

           <div className='card-title'>Knowledge Library</div>
           <div className='card-description'>
            Access a comprehensive knowledge library to equip mentors with the skills, and motivation
           </div>

         </div>
          
         </div>
        </div>
        <div className="success-title">
           Every <span>success</span> is rewarded!
        </div>

        <div className="success-window">
           <img src="/Mentors.svg" alt="Mentors" className="mentors-image" />
        </div>

        <footer className="footer">
          <img src="/logo.svg" alt="Mentor Token" className="footer-logo" />

          <div className='footer-pages'>
            <div className="footer-pages-title">Pages</div>
            <div className="footer-page-button">Home</div>
            <div className="footer-page-button">Contact</div>
          </div>

          <div className="footer-contact">
            <div className="footer-contact-title">Contact</div>
            <div className="footer-contact-info">info@mentortoken.com</div>
            <div className="footer-contact-info">+ ( 389 ) 123 456 789</div>
          </div>

          <div className="footer-follow">
           <div className="footer-follow-title">Follow us</div>
           <div className="social-icons">
             <img src="/twitter.png" alt="Twitter" />
             <img src="/facebook.png" alt="Facebook" />
             <img src="/linkedin.png" alt="LinkedIn" />
            </div>
           
          </div>
          <p className="footer-description">
            With Mentor Token, every failure transforms into an opportunity for 
            <br />growth.
          </p>
          <hr className="footer-line" />
          <div className="footer-copyright">
            ©2024 Mentor Token. &nbsp; All right reserved.
          </div>
        </footer>
        
      </main>
    </>
  );
}

export default Home ; 