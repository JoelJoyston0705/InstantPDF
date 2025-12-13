# Security Policy

## 🔒 Reporting a Vulnerability

We take the security of InstantPDF seriously. If you discover a security vulnerability, please follow these guidelines:

### How to Report

**Please DO NOT create a public GitHub issue for security vulnerabilities.**

Instead, please email security concerns to:
- **Email**: joeljoyston0705@gmail.com
- **Subject**: [SECURITY] InstantPDF Vulnerability Report

### What to Include

Please include the following information:
- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact
- Suggested fix (if available)
- Your contact information

### Response Time

- We will acknowledge receipt of your vulnerability report within **48 hours**
- We will provide a detailed response within **7 days**
- We will work with you to understand and resolve the issue promptly

---

## 🛡️ Supported Versions

We release security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | ✅ Supported |
| < 1.0   | ❌ Not supported |

---

## 🔐 Security Measures

InstantPDF implements the following security measures:

### Data Protection
- ✅ **Automatic File Deletion**: All uploaded files are automatically deleted after processing
- ✅ **No Permanent Storage**: We do not store user files on our servers
- ✅ **Temporary Processing**: Files exist only in memory during conversion
- ✅ **No Data Collection**: We do not collect or store personal information

### Authentication & Authorization
- ✅ **JWT Tokens**: Secure JSON Web Token authentication
- ✅ **BCrypt Hashing**: Industry-standard password hashing
- ✅ **Session Management**: Secure session handling

### Infrastructure Security
- ✅ **HTTPS/TLS**: All data transmitted over secure connections
- ✅ **Environment Variables**: Sensitive credentials stored securely
- ✅ **API Rate Limiting**: Protection against abuse
- ✅ **Input Validation**: All user inputs are validated and sanitized

### Code Security
- ✅ **Dependency Scanning**: Regular dependency updates
- ✅ **Security Audits**: Periodic security reviews
- ✅ **CORS Protection**: Cross-Origin Resource Sharing configured
- ✅ **SQL Injection Prevention**: Parameterized queries using SQLAlchemy
- ✅ **XSS Protection**: Input sanitization and output encoding

---

## 📋 Security Best Practices

When using InstantPDF:

1. **Do not upload sensitive documents** containing:
   - Passwords or credentials
   - Financial information (credit cards, bank details)
   - Personal identification numbers (SSN, passport numbers)
   - Confidential business information

2. **Use HTTPS**: Always access InstantPDF via HTTPS://instant-pdf-neon.vercel.app/

3. **Verify URL**: Ensure you're on the official InstantPDF domain

4. **Report Issues**: If you notice suspicious activity, report it immediately

---

## 🚨 Known Security Considerations

### File Processing
- Files are processed server-side and temporarily stored during conversion
- Files are automatically deleted after successful conversion or after 1 hour
- We recommend not uploading documents with highly sensitive information

### Third-Party Services
InstantPDF uses the following trusted services:
- **Vercel** (Frontend hosting) - SOC 2 Type II certified
- **Railway** (Backend hosting) - Secure cloud infrastructure

---

## 📞 Contact

For security-related inquiries:
- **Email**: joeljoyston0705@gmail.com
- **GitHub**: [@JoelJoyston0705](https://github.com/JoelJoyston0705)
- **LinkedIn**: [Joel Joyston](https://linkedin.com/in/joeljoyston)

---

## 🙏 Acknowledgments

We appreciate the security research community and responsible disclosure. Security researchers who report vulnerabilities will be:
- Acknowledged in our security changelog (with permission)
- Kept informed of the fix progress
- Credited for their contribution

---

**Last Updated**: December 13, 2025

**Security Version**: 1.0.0
