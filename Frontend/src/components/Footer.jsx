import React from "react";
import {
  Box,
  Typography,
  Link,
  Divider,
  Stack,
  Container,
  IconButton,
  Grid,
  Chip,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  GitHub,
  Twitter,
  LinkedIn,
  YouTube,
  Email,
  Phone,
  LocationOn,
} from "@mui/icons-material";

const footerLinks = [
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Terms & Conditions", to: "/terms-and-conditions" },
  { label: "Cancellation & Refund", to: "/cancellation-refund" },
  { label: "Shipping & Delivery", to: "/shipping-delivery" },
  { label: "Contact Us", to: "/contact-us" },
];

const socialLinks = [
  {
    icon: GitHub,
    label: "GitHub",
    href: "https://github.com/VviratT/BarterSkills",
    color: "#333",
  },
  {
    icon: Twitter,
    label: "Twitter",
    href: "https://twitter.com/barterskills",
    color: "#1DA1F2",
  },
  {
    icon: LinkedIn,
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/dhananjay-borban-a18515250/",
    color: "#0077B5",
  },
  {
    icon: YouTube,
    label: "YouTube",
    href: "https://youtube.com/@barterskills",
    color: "#FF0000",
  },
];

const contactInfo = [
  {
    icon: Email,
    label: "borbanayush09@gmail.com",
    href: "mailto:borbanayush09@gmail.com",
  },
  { icon: Phone, label: "+91 9302720803", href: "tel:+919302720803" },
  {
    icon: LocationOn,
    label: "MANIT Bhopal",
    href: "https://share.google/wTJWy9tz3tWZGQo0T",
  },
];

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "background.paper",
        borderTop: "1px solid",
        borderColor: "divider",
        mt: 0,
        pt: 6,
        pb: 3,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} mb={4}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  background:
                    "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                BarterSkills
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{mr:10 ,mb: 3, lineHeight: 1.6 }}
              >
                Empowering creators to share knowledge, build communities, and
                monetize their expertise through innovative video content.
              </Typography>

              {/* Social Links */}
              <Stack direction="row" spacing={1}>
                {socialLinks.map((social) => (
                  <motion.div
                    key={social.label}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <IconButton
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        backgroundColor: "rgba(99, 102, 241, 0.1)",
                        color: "primary.main",
                        "&:hover": {
                          backgroundColor: "rgba(99, 102, 241, 0.2)",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      <social.icon />
                    </IconButton>
                  </motion.div>
                ))}
              </Stack>
            </motion.div>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Typography variant="h6" fontWeight={600} mb={3}>
                Quick Links
              </Typography>
              <Stack spacing={2}>
                {footerLinks.map((link) => (
                  <Link
                    key={link.to}
                    href={link.to}
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      textDecoration: "none",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        color: "primary.main",
                        transform: "translateX(4px)",
                      },
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </Stack>
            </motion.div>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Typography variant="h6" fontWeight={600} mb={3}>
                Contact Us
              </Typography>
              <Stack spacing={2}>
                {contactInfo.map((contact) => (
                  <Link
                    key={contact.label}
                    href={contact.href}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      textDecoration: "none",
                      color: "text.secondary",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        color: "primary.main",
                        transform: "translateX(4px)",
                      },
                    }}
                  >
                    <contact.icon sx={{ mr: 1, fontSize: 20 }} />
                    <Typography variant="body2">{contact.label}</Typography>
                  </Link>
                ))}
              </Stack>
            </motion.div>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 3 }} />

        {/* Bottom Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            pt: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary" textAlign="center">
            © {new Date().getFullYear()} BarterSkills. All rights reserved.
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            sx={{
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <Chip
              label="Made with ❤️"
              size="small"
              variant="outlined"
              sx={{
                borderColor: "rgba(99, 102, 241, 0.3)",
                color: "primary.main",
                "&:hover": {
                  borderColor: "primary.main",
                  backgroundColor: "rgba(99, 102, 241, 0.1)",
                },
              }}
            />
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
