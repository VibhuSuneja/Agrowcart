# Security Policy - AgrowCart

## Reporting Vulnerabilities
We take the security of our agricultural value-chain platform seriously. If you discover a security vulnerability within AgrowCart, please reach out to us immediately.

### Security Guarantees
1. **End-to-End Authentication:** Every API route (except public exploration) is guarded by NextAuth.js (v5) with JWT strategy and session validation.
2. **Role-Based Access Control (RBAC):** We implement strict role checks (Farmer, Admin, Buyer, etc.) at the API layer to prevent privilege escalation.
3. **Data Protection:** All sensitive user data is encrypted. We comply with the Digital Personal Data Protection (DPDP) Act of India.
4. **AI Liability:** Our AI insights are probabilistic. We utilize cryptographic signatures for AI webhooks to prevent spoofing.

## Contact
Please report security issues to:
**Security Response Team**
Email: security@agrowcart.com | vibhusun01@gmail.com

## Secure Workflows
1. **Marketplace:** Only authorized buyers can initiate negotiations.
2. **Traceability:** Product journeys are verified; only admins can certify high-level quality grades.
3. **Logistics:** Delivery agents only have access to active order coordinates.

---
© 2026 AgrowCart Platform
