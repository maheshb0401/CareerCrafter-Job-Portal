import React from 'react';
import './Footer.css';
import { Box, Typography, Link, Grid, IconButton, Container } from '@mui/material';
import { Facebook, LinkedIn, Instagram, YouTube, Twitter } from '@mui/icons-material';

// Social media links
const socialLinks = [
  { icon: Facebook, label: 'Facebook', url: '#' },
  { icon: LinkedIn, label: 'LinkedIn', url: '#' },
  { icon: Instagram, label: 'Instagram', url: '#' },
  { icon: YouTube, label: 'YouTube', url: '#' },
  { icon: Twitter, label: 'Twitter', url: '#' }
];

const Footer = () => (
  <Box component="footer" className="footer-main">
    <Container maxWidth="lg">
      {/* Top Section */}
      <Grid container spacing={3}>
        {/* Logo and Social Links */}
        <Grid item xs={12} md={4}>
          <Box className="footer-logo-section">
            <Typography variant="h6" className="footer-logo-text">
              CareerCrafter
            </Typography>
            <Typography variant="caption" className="footer-subtitle">
              No. 1 Job Site for Professionals
            </Typography>
            <Box className="social-links">
              {socialLinks.map(({ icon: Icon, label }) => (
                <IconButton
                  key={label}
                  className="social-icon"
                  aria-label={label}
                  size="small"
                >
                  <Icon fontSize="small" />
                </IconButton>
              ))}
            </Box>
          </Box>
        </Grid>

        {/* Footer Links */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            {/* Column 1 */}
            <Grid item xs={6}>
              <Box className="footer-links-section">
                <Link href="/" className="footer-link">Home</Link>
                <Link href="/terms" className="footer-link">Terms & Conditions</Link>
                <Link href="/privacy" className="footer-link">Privacy Policy</Link>
                <Link href="/security" className="footer-link">Security Advice</Link>
              </Box>
            </Grid>
            {/* Column 2 */}
            <Grid item xs={6}>
              <Box className="footer-links-section">
                <Link href="/about" className="footer-link">About Us</Link>
                <Link href="/contact" className="footer-link">Contact Us</Link>
                <Link href="/feedback" className="footer-link">Feedback</Link>
                <Link href="/faqs" className="footer-link">FAQs</Link>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Bottom Section */}
      <Box className="footer-bottom">
        <Typography variant="caption">
          All trademarks are properties of their respective owners.
        </Typography>
        <Typography variant="caption">
          &copy; {new Date().getFullYear()} CareerCrafter Ltd. All rights reserved.
        </Typography>
      </Box>
    </Container>
  </Box>
);

export default Footer;