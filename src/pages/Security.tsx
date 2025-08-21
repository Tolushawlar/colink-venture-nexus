import React from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const Security = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-gray-50">
        <div className="container-wide py-16">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-4xl font-bold text-colink-navy mb-6">Security Policy</h1>
            <div className="text-sm text-gray-600 mb-8">
              <p><strong>Effective Date:</strong> August 13, 2025</p>
              <p><strong>Last Updated:</strong> August 13, 2025</p>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-700 mb-6">
                At CoLink Venture, we take the security of your data and the integrity of our platform seriously. This Security Policy outlines the measures we take to protect your information, the responsibilities of users, and our protocols for managing security threats, incidents, and vulnerabilities.
              </p>
              
              <p className="mb-6">
                This policy applies to all users of the CoLink Venture platform, including individuals, businesses, organizations, contractors, and internal personnel.
              </p>

              <h2 className="text-2xl font-bold text-colink-navy mt-8 mb-4">1. Our Commitment to Security</h2>
              <p className="mb-4">We are committed to ensuring that:</p>
              <ul className="list-disc pl-6 mb-6">
                <li>Your personal and organizational data remains confidential and secure.</li>
                <li>Our systems are protected against unauthorized access and malicious activity.</li>
                <li>Best practices in cybersecurity are implemented, monitored, and improved continuously.</li>
              </ul>
              <p className="mb-6">Security is not just a technical requirement — it's an ongoing responsibility.</p>

              <h2 className="text-2xl font-bold text-colink-navy mt-8 mb-4">2. Data Protection Practices</h2>
              <p className="mb-4">We implement a multi-layered approach to protect the information shared with us, including:</p>
              
              <h3 className="text-xl font-semibold text-colink-navy mt-6 mb-3">a. Data Encryption</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>All data in transit is encrypted using SSL/TLS protocols.</li>
                <li>Sensitive data stored in databases is encrypted using AES-256 or similar industry standards.</li>
              </ul>

              <h3 className="text-xl font-semibold text-colink-navy mt-6 mb-3">b. Secure Authentication</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>User accounts require strong passwords with complexity requirements.</li>
                <li>Login sessions are monitored and may be restricted after repeated failed attempts.</li>
                <li>Optional two-factor authentication (2FA) may be provided for enhanced protection.</li>
              </ul>

              <h3 className="text-xl font-semibold text-colink-navy mt-6 mb-3">c. Access Controls</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Role-based access is implemented to ensure that only authorized users have access to specific data.</li>
                <li>Internal administrative access is monitored and restricted to essential personnel.</li>
              </ul>

              <h3 className="text-xl font-semibold text-colink-navy mt-6 mb-3">d. Data Backup</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Automated, encrypted backups are performed regularly.</li>
                <li>Backup data is stored securely in geographically redundant locations.</li>
                <li>Restoration procedures are tested periodically to ensure system recoverability.</li>
              </ul>

              <h3 className="text-xl font-semibold text-colink-navy mt-6 mb-3">e. Network and Infrastructure Security</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Firewalls and intrusion detection/prevention systems are used to monitor and block malicious traffic.</li>
                <li>Servers are regularly patched and updated to address known vulnerabilities.</li>
                <li>APIs are protected with rate limits, authentication tokens, and encrypted communication.</li>
              </ul>

              <h2 className="text-2xl font-bold text-colink-navy mt-8 mb-4">3. User Responsibilities</h2>
              <p className="mb-4">Security is a shared responsibility. Users of the CoLink Venture platform must adhere to the following practices:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Maintain the confidentiality of login credentials.</li>
                <li>Use secure passwords and avoid reusing passwords across different platforms.</li>
                <li>Do not share your account with unauthorized individuals or third parties.</li>
                <li>Log out after each session, especially on shared or public devices.</li>
                <li>Report any suspicious activity or unauthorized access immediately to our support team.</li>
              </ul>
              <p className="mb-6">Failure to adhere to these responsibilities may result in restricted access or account termination.</p>

              <h2 className="text-2xl font-bold text-colink-navy mt-8 mb-4">4. Third-Party Services and Integrations</h2>
              <p className="mb-4">We carefully assess third-party vendors and service providers to ensure they meet security standards equivalent to our own. Examples include:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Hosting providers (e.g., AWS, Azure, etc.)</li>
                <li>Analytics tools</li>
                <li>Payment processors</li>
                <li>Customer support platforms</li>
              </ul>
              <p className="mb-4">All third-party integrations are governed by contracts that include confidentiality and data security clauses.</p>
              <p className="mb-6">We do not authorize any vendor to use user data for purposes beyond the scope of their service agreement.</p>

              <h2 className="text-2xl font-bold text-colink-navy mt-8 mb-4">5. Security Monitoring and Audits</h2>
              <p className="mb-4">We continuously monitor our systems for signs of malicious activity, suspicious behavior, and vulnerabilities.</p>
              <p className="mb-4">Our procedures include:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Real-time monitoring of server logs and traffic patterns.</li>
                <li>Security event alerts and automated response triggers.</li>
                <li>Regular internal security audits and code reviews.</li>
                <li>Penetration testing by qualified cybersecurity firms (as needed).</li>
              </ul>
              <p className="mb-6">Audit logs are preserved for security review and compliance purposes.</p>

              <h2 className="text-2xl font-bold text-colink-navy mt-8 mb-4">6. Incident Response Plan</h2>
              <p className="mb-4">In the unlikely event of a security breach or incident, we follow a structured incident response protocol:</p>
              
              <h3 className="text-xl font-semibold text-colink-navy mt-6 mb-3">Detection & Triage</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Identify the breach source and affected systems.</li>
                <li>Prioritize incident severity (critical, major, minor).</li>
              </ul>

              <h3 className="text-xl font-semibold text-colink-navy mt-6 mb-3">Containment</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Isolate affected systems to prevent further exposure.</li>
                <li>Temporarily suspend compromised user accounts if necessary.</li>
              </ul>

              <h3 className="text-xl font-semibold text-colink-navy mt-6 mb-3">Investigation & Resolution</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Determine root cause and scope of the breach.</li>
                <li>Apply patches, revoke compromised credentials, and restore systems.</li>
              </ul>

              <h3 className="text-xl font-semibold text-colink-navy mt-6 mb-3">Notification</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Notify affected users within 72 hours (in accordance with GDPR).</li>
                <li>Cooperate with regulators and legal authorities where required.</li>
              </ul>

              <h3 className="text-xl font-semibold text-colink-navy mt-6 mb-3">Post-Incident Review</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Document lessons learned.</li>
                <li>Revise internal procedures to prevent recurrence.</li>
              </ul>

              <h2 className="text-2xl font-bold text-colink-navy mt-8 mb-4">7. Employee and Internal Security Practices</h2>
              <p className="mb-4">Our internal team follows strict security protocols, including:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Background checks for employees and contractors.</li>
                <li>Confidentiality and non-disclosure agreements.</li>
                <li>Training on phishing, malware, and social engineering risks.</li>
                <li>Device encryption and multi-factor authentication for company access.</li>
                <li>Limited access based on role and responsibility.</li>
              </ul>

              <h2 className="text-2xl font-bold text-colink-navy mt-8 mb-4">8. Physical Security</h2>
              <p className="mb-4">For physical offices or servers:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Access is restricted to authorized personnel.</li>
                <li>Surveillance systems and entry logs are maintained.</li>
                <li>Redundant power, HVAC, and fire suppression systems protect critical infrastructure.</li>
              </ul>

              <h2 className="text-2xl font-bold text-colink-navy mt-8 mb-4">9. Compliance and Legal Considerations</h2>
              <p className="mb-4">We aim to comply with all applicable laws and regulations regarding data and cybersecurity, including but not limited to:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>General Data Protection Regulation (GDPR)</li>
                <li>California Consumer Privacy Act (CCPA)</li>
                <li>Children's Online Privacy Protection Act (COPPA)</li>
                <li>ePrivacy Directive (EU Cookie Law)</li>
                <li>Applicable local cybersecurity frameworks</li>
              </ul>
              <p className="mb-6">Any requests from regulatory bodies will be handled with full cooperation and transparency.</p>

              <h2 className="text-2xl font-bold text-colink-navy mt-8 mb-4">10. Updates to This Security Policy</h2>
              <p className="mb-4">We may update this policy from time to time to reflect changes in legal, technical, or business operations. Updates will be posted on this page with a revised effective date.</p>
              <p className="mb-6">We encourage users to review this policy regularly. Continued use of the platform after any changes indicates acceptance of the revised policy.</p>

              <h2 className="text-2xl font-bold text-colink-navy mt-8 mb-4">11. Contact Us</h2>
              <p className="mb-4">If you have questions, concerns, or believe your account or data may have been compromised, please contact us immediately:</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>CoLink Venture</strong></p>
                <p>Email: info@colinkventure.com</p>
                <p>Phone: (518) 913-2069</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Security;