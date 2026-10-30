import { NavLink } from "react-router-dom";

function Contact() {
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

          <a href="/get-started" className="get-started">
            <img src="/arrow-right.svg" alt="" />
            <span>Get Started</span>
          </a>
        </div>
      </header>

      <main className="contact-main">
        <h1 className="lets-talk">Let's Talk!</h1>
        <p className="contact-description">
           We’re thrilled to connect with you! Whether you have a question, need
           assistance, or want to discuss a potential project, we’re here to listen
           and help. At Mentor Token, we believe in the power of collaboration and are
           committed to providing you with the best support and solutions. Fill out
           the form below, and one of our team members will get back to you as soon as
           possible.
        <br />
          <span>Let’s create something amazing together!</span>
       </p>

       <div className="contact-inputs">
         <input
          className="contact-input full-name"
          type="text"
         placeholder="Full Name"
        />

       <input
       className="contact-input email-address"
       type="email"
       placeholder="Email Address"
        />
      </div>
        <img className="background5" src="/background5.png" alt="" />
        

        <textarea
        className="message-input"
        placeholder="Your Message">
        </textarea>

        <button className="send-message" type="submit">
         SEND MESSAGE
        </button>
      </main>

      <footer className="footer contact-footer">
  <img className="footer-logo" src="/logo.svg" alt="Logo" />

  <div className="footer-pages">
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

  <div className="footer-copyright">
    ©2024 Mentor Token. &nbsp;&nbsp; All right reserved.
  </div>

  <div className="footer-line"></div>
</footer>
    </>
  );
}

export default Contact;