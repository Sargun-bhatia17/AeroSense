import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';
import logo from '../assets/Aerosense_Logo_with_Wing_and_Signal_Icon-removebg-preview.png';

export default function Landing() {
  return (
    <div className="landing-wrapper">
      {/* Soft floating background particles */}
      <div className="particles-container">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 20 + 10}px`,
              height: `${Math.random() * 20 + 10}px`,
              animationDuration: `${Math.random() * 10 + 10}s`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <nav className="landing-nav">
        <div className="landing-logo" style={{ display: 'flex', alignItems: 'center' }}>
          <img src={logo} alt="Aerosense Logo" style={{ height: '40px', width: 'auto', marginRight: '12px' }} />
          <span>AEROSENSE</span>
        </div>
        <div className="landing-nav-actions">
          <Link to="/dashboard" className="btn-primary">Get Started</Link>
        </div>
      </nav>

      <main>
        <section className="landing-hero">
          <div className="hero-content">
            <p className="hero-tagline" style={{ color: 'var(--landing-btn-primary)', fontWeight: 600 }}>Live Environmental Intelligence</p>
            <h1 className="hero-title">The Smartest Way<br/>to Check Your Space</h1>
            <p className="hero-tagline">Real-time air quality tracking, pollution data visualization, and personalized health risks. Understand what you breathe, before you step outside.</p>
            <div className="hero-cta-group">
              <Link to="/dashboard" className="btn-primary-large">View Dashboard</Link>
            </div>
          </div>
          
          <div className="hero-demo-cards">
             <div className="demo-card">
               <span className="demo-label">PM2.5 Level</span>
               <div className="demo-value-group">
                 <span className="demo-value">42</span>
                 <span className="demo-unit">µg/m³</span>
               </div>
               <span className="demo-category safe">Moderate</span>
             </div>
             <div className="demo-card offset">
               <span className="demo-label">Risk Profile</span>
               <div className="demo-value-group">
                 <span className="demo-value" style={{fontSize: '2.5rem'}}>Low</span>
               </div>
               <span className="demo-category safe">Safe to go out</span>
             </div>
          </div>
        </section>

        <section className="how-it-works">
          <h2 className="section-title">Core Capabilities</h2>
          <div className="workflow-diagram">
            <div className="workflow-step">
              <div className="step-icon">📊</div>
              <h3>Real-time AQI</h3>
              <p>Continuous tracking of PM2.5, PM10, and overarching AQI.</p>
            </div>
            <div className="workflow-arrow animated-arrow">→</div>
            <div className="workflow-step">
              <div className="step-icon">🗺️</div>
              <h3>Data Visualization</h3>
              <p>Clear, intuitive graphs and spatial mapping of pollutants.</p>
            </div>
            <div className="workflow-arrow animated-arrow">→</div>
            <div className="workflow-step">
              <div className="step-icon">🛡️</div>
              <h3>Personal Exposure</h3>
              <p>Custom Health Risk Indices computed from personal profiles.</p>
            </div>
          </div>
        </section>

        <section className="health-preview">
          <h2 className="section-title">More than just data. Meaningful protection.</h2>
          <p className="section-subtitle">Aerosense translates complex meteorological data into an understandable platform, adjusting guidance based on your unique health profile.</p>
          
          <div className="preview-container">
            <div className="preview-controls" style={{textAlign: 'center', justifyContent: 'center', width: '100%'}}>
              <h3 style={{fontSize: '2rem', color: 'var(--landing-btn-primary)', marginBottom: '1rem'}}>Ready to monitor your environment?</h3>
              <p style={{color: 'var(--landing-secondary)', marginBottom: '2rem'}}>Join Aerosense today and start leveraging cutting-edge sensor arrays to understand exactly what you and your family are breathing.</p>
              <Link to="/dashboard" className="btn-primary-large">Explore Data</Link>
            </div>
          </div>
        </section>
      </main>

      <footer style={{ padding: '2rem', textAlign: 'center', color: 'var(--landing-secondary)', borderTop: '1px solid rgba(11, 60, 93, 0.05)', marginTop: '4rem', position: 'relative', zIndex: 10 }}>
        <p>© 2026 Aerosense Intelligence. All rights reserved.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1rem' }}>
            <Link to="/dashboard" style={{ color: 'var(--landing-btn-primary)', textDecoration: 'none', fontWeight: 600 }}>Dashboard</Link>
            <Link to="/map" style={{ color: 'var(--landing-btn-primary)', textDecoration: 'none', fontWeight: 600 }}>Map</Link>
            <Link to="/profile" style={{ color: 'var(--landing-btn-primary)', textDecoration: 'none', fontWeight: 600 }}>Profile</Link>
        </div>
      </footer>
    </div>
  );
}