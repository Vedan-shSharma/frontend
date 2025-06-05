import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <div style={styles.container}>
      {/* Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={styles.nav}
      >
        <div style={styles.navContent}>
          <img 
            src="/assets/edusync-newlogo.webp" 
            alt="EduSync Logo" 
            style={styles.navLogo}
          />
          <div style={styles.navButtons}>
            <Link to="/login" style={styles.navButton}>Login</Link>
            <Link to="/register" style={styles.navButtonPrimary}>Register</Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={styles.heroSection}
      >
        <div style={styles.heroOverlay}></div>
        <div style={styles.heroContent}>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            style={styles.heroTitle}
          >
            Welcome to <span style={styles.highlight}>EduSync</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            style={styles.heroSubtitle}
          >
            Your Gateway to Interactive Learning and Teaching Excellence
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            style={styles.servicesGrid}
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                style={styles.serviceCard}
              >
                <div style={styles.serviceIcon}>{service.icon}</div>
                <h3 style={styles.serviceTitle}>{service.title}</h3>
                <p style={styles.serviceDescription}>{service.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        style={styles.featuresSection}
      >
        <h2 style={styles.sectionTitle}>Why Choose EduSync?</h2>
        <div style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              viewport={{ once: true }}
              style={styles.featureCard}
            >
              <div style={styles.featureIcon}>{feature.icon}</div>
              <h3 style={styles.featureTitle}>{feature.title}</h3>
              <p style={styles.featureDescription}>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Testimonials Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        style={styles.testimonialsSection}
      >
        <h2 style={styles.sectionTitle}>What Our Users Say</h2>
        <div style={styles.testimonialsGrid}>
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              viewport={{ once: true }}
              style={styles.testimonialCard}
            >
              <p style={styles.testimonialText}>{testimonial.text}</p>
              <div style={styles.testimonialAuthor}>
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name} 
                  style={styles.avatar}
                />
                <div>
                  <h4 style={styles.authorName}>{testimonial.name}</h4>
                  <p style={styles.authorRole}>{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerSection}>
            <h3 style={styles.footerTitle}>EduSync</h3>
            <p style={styles.footerText}>
              Empowering education through technology
            </p>
          </div>
          <div style={styles.footerSection}>
            <h4 style={styles.footerSubtitle}>Quick Links</h4>
            <Link to="/about" style={styles.footerLink}>About Us</Link>
            <Link to="/contact" style={styles.footerLink}>Contact</Link>
            <Link to="/privacy" style={styles.footerLink}>Privacy Policy</Link>
          </div>
          <div style={styles.footerSection}>
            <h4 style={styles.footerSubtitle}>Connect With Us</h4>
            <div style={styles.socialLinks}>
              <a href="#" style={styles.socialLink}>Twitter</a>
              <a href="#" style={styles.socialLink}>LinkedIn</a>
              <a href="#" style={styles.socialLink}>Facebook</a>
            </div>
          </div>
        </div>
        <div style={styles.footerBottom}>
          <p style={styles.copyright}>© 2024 EduSync. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const services = [
  {
    icon: "📚",
    title: "Interactive Learning",
    description: "Engage with dynamic content and real-time feedback"
  },
  {
    icon: "🎯",
    title: "Smart Assessments",
    description: "Personalized quizzes and progress tracking"
  },
  {
    icon: "👨‍🏫",
    title: "Expert Guidance",
    description: "Learn from experienced educators"
  }
];

const features = [
  {
    icon: "📚",
    title: "Comprehensive Learning",
    description: "Access a wide range of courses and learning materials tailored to your needs."
  },
  {
    icon: "🎯",
    title: "Interactive Assessments",
    description: "Engage with dynamic quizzes and tests to track your progress effectively."
  },
  {
    icon: "👨‍🏫",
    title: "Expert Instructors",
    description: "Learn from experienced educators dedicated to your success."
  },
  {
    icon: "📊",
    title: "Progress Tracking",
    description: "Monitor your learning journey with detailed analytics and insights."
  }
];

const testimonials = [
  {
    text: "EduSync has transformed how I teach. The platform is intuitive and my students love it!",
    name: "Sarah Johnson",
    role: "Instructor",
    avatar: "https://i.pravatar.cc/150?img=1"
  },
  {
    text: "The best learning platform I've used. The assessments are challenging and engaging.",
    name: "Michael Chen",
    role: "Student",
    avatar: "https://i.pravatar.cc/150?img=2"
  },
  {
    text: "As an instructor, I can easily track student progress and provide timely feedback.",
    name: "Emily Davis",
    role: "Instructor",
    avatar: "https://i.pravatar.cc/150?img=3"
  }
];

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
  },
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    padding: '1rem 2rem',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  navContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navLogo: {
    height: '40px',
    width: 'auto',
  },
  navButtons: {
    display: 'flex',
    gap: '1rem',
  },
  navButton: {
    padding: '0.5rem 1.5rem',
    color: '#4f46e5',
    textDecoration: 'none',
    fontWeight: 600,
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#f1f5f9',
    },
  },
  navButtonPrimary: {
    padding: '0.5rem 1.5rem',
    backgroundColor: '#4f46e5',
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 600,
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#4338ca',
    },
  },
  heroSection: {
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6rem 2rem 4rem',
    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    overflow: 'hidden',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
    opacity: 0.1,
  },
  heroContent: {
    maxWidth: '1000px',
    textAlign: 'center',
    color: '#fff',
    position: 'relative',
    zIndex: 1,
  },
  heroTitle: {
    fontSize: '4.5rem',
    fontWeight: 800,
    marginBottom: '1.5rem',
    lineHeight: 1.1,
    background: 'linear-gradient(to right, #fff, #e0e7ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  highlight: {
    color: '#fff',
    WebkitTextFillColor: '#fff',
  },
  heroSubtitle: {
    fontSize: '1.5rem',
    color: '#e0e7ff',
    marginBottom: '4rem',
    lineHeight: 1.6,
    fontWeight: 500,
  },
  servicesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    marginTop: '2rem',
  },
  serviceCard: {
    padding: '2rem',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
    },
  },
  serviceIcon: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
  },
  serviceTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: '#fff',
    marginBottom: '0.5rem',
  },
  serviceDescription: {
    fontSize: '1rem',
    color: '#e0e7ff',
    lineHeight: 1.6,
  },
  featuresSection: {
    padding: '4rem 2rem',
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: '2.5rem',
    fontWeight: 700,
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: '3rem',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  featureCard: {
    padding: '2rem',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'translateY(-5px)',
    },
  },
  featureIcon: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
  },
  featureTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: '#1e293b',
    marginBottom: '0.5rem',
  },
  featureDescription: {
    color: '#64748b',
    lineHeight: 1.6,
  },
  testimonialsSection: {
    padding: '4rem 2rem',
    backgroundColor: '#f8fafc',
  },
  testimonialsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  testimonialCard: {
    padding: '2rem',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  testimonialText: {
    fontSize: '1.1rem',
    color: '#1e293b',
    lineHeight: 1.6,
    marginBottom: '1.5rem',
  },
  testimonialAuthor: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  avatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  authorName: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#1e293b',
    margin: 0,
  },
  authorRole: {
    fontSize: '0.9rem',
    color: '#64748b',
    margin: 0,
  },
  footer: {
    backgroundColor: '#1e293b',
    color: '#fff',
    padding: '4rem 2rem 2rem',
  },
  footerContent: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  footerSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  footerTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    margin: 0,
  },
  footerText: {
    color: '#94a3b8',
    lineHeight: 1.6,
  },
  footerSubtitle: {
    fontSize: '1.1rem',
    fontWeight: 600,
    margin: 0,
  },
  footerLink: {
    color: '#94a3b8',
    textDecoration: 'none',
    transition: 'color 0.2s',
    '&:hover': {
      color: '#fff',
    },
  },
  socialLinks: {
    display: 'flex',
    gap: '1rem',
  },
  socialLink: {
    color: '#94a3b8',
    textDecoration: 'none',
    transition: 'color 0.2s',
    '&:hover': {
      color: '#fff',
    },
  },
  footerBottom: {
    maxWidth: '1200px',
    margin: '2rem auto 0',
    paddingTop: '2rem',
    borderTop: '1px solid #334155',
    textAlign: 'center',
  },
  copyright: {
    color: '#94a3b8',
    margin: 0,
  },
};

export default Home; 