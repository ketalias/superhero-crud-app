import React from "react";
import HeroesList from "../components/HeroesList";
import Footer from "../components/Footer";

const HeroSection: React.FC = () => {
  return (
    <div>
      <section className="welcome-section">
        <div className="welcome-overlay">
          <div className="welcome-content">
            <h1 className="fade-slide">Superhero <span className="db">Database</span></h1>
            <p className="fade-slide delay-1">
              Discover the world of your favorite superheroes and their amazing powers.
            </p>
            <button className="fade-slide delay-2">Explore Now</button>
          </div>
        </div>
      </section>
      <section>
        <HeroesList />
      </section>
      <section>
        <Footer />
      </section>
    </div>
  );
};

export default HeroSection;
