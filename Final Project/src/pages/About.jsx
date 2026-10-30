import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";

function About() {
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

      <main>
        <div className="about-vector">
          <img src="/about-vector.svg" alt="" />
          <h2 className="meet-members">Meet our members</h2>
          <p className="members-description">
          We Focus on the details of everything we do. All to help businesses around the world
          <br />Focus on what's most important to them.
          </p>
          <Link to="/contact" className="about-get-in-touch">
           <img src="/arrow-right.svg" alt="" />
           <span>Get in Touch</span>
          </Link>
        </div>

        <div className="members-container">

  <div className="members-top">

    <div className="member-card">
      <img className="member-image" src="/Ian.svg" alt="Ian Sorell" />
      <div className="member-name">Ian Sorell</div>
      <div className="member-role">CEO</div>
      <p className="member-description">
        Enjoys adventurous travel, seeks new<br />
        cultures and offbeat<br />
        destinations.
      </p>
      <img className="three-icons" src="/3icons.svg" alt="" />
    </div>

    <div className="member-card">
      <img className="member-image" src="/Maya.svg" alt="Maya Matt" />
      <div className="member-name">Maya Matt</div>
      <div className="member-role">Founder</div>
      <p className="member-description">
        Pop music lover, seeks joy and<br />
        exciting pop concerts.
      </p>
      <img className="three-icons" src="/3icons.svg" alt="" />
    </div>

    <div className="member-card">
      <img className="member-image" src="/Alex.png" alt="Alex Jensen" />
      <div className="member-name">Alex Jensen</div>
      <div className="member-role">CTO</div>
      <p className="member-description">
        Bookworm, creative software<br />
        developer with precision
      </p>
      <img className="three-icons" src="/3icons.svg" alt="" />
    </div>

    <div className="member-card">
      <img className="member-image" src="/Keira.svg" alt="Kiera Battye" />
      <div className="member-name">Kiera Battye</div>
      <div className="member-role">Product Designer</div>
      <p className="member-description">
        Creative painter capturing beauty<br />
        with imaginative artwork
      </p>
      <img className="three-icons" src="/3icons.svg" alt="" />
    </div>

  </div>

  <div className="members-bottom">

    <div className="member-card">
      <img className="member-image" src="/Dominic.svg" alt="Dominic Game" />
      <div className="member-name">Dominic Game</div>
      <div className="member-role">3D Artist</div>
      <p className="member-description">
        Football enthusiast, enjoys movie<br />
        nights with friends
      </p>
      <img className="three-icons" src="/3icons.svg" alt="" />
    </div>

    <div className="member-card">
      <img className="member-image" src="/James.svg" alt="James Vial" />
      <div className="member-name">James Vial</div>
      <div className="member-role">Head of front end</div>
      <p className="member-description">
        Culinary artist, explores diverse<br />
        flavors, skilled in cooking
      </p>
      <img className="three-icons" src="/3icons.svg" alt="" />
    </div>

  </div>

</div>
        
      </main>

      <footer className="footer about-footer">

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

export default About;