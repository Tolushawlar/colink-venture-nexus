import React from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const Privacy = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-gray-50">
        <div className="container-wide py-16">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-4xl font-bold text-colink-navy mb-6">Privacy Policy</h1>
            <div className="text-sm text-gray-600 mb-8">
              <p><strong>Effective Date:</strong> August 13, 2025</p>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-700 mb-6">
                At CoLink Venture ("we", "us", or "our"), your privacy is a top priority. This Privacy Policy outlines how we collect, use, share, and safeguard your personal data when you use our website or services. It also explains your privacy rights and how the law protects you.
              </p>
              
              <p className="mb-6">
                By using our platform, you consent to the practices described in this policy.
              </p>

              <h2 className="text-2xl font-bold text-colink-navy mt-8 mb-4">1. Information We Collect</h2>
              <p className="mb-4">We collect personal data to provide you with better service, to improve your experience on our platform, and to comply with legal obligations. This includes:</p>
              
              <h3 className="text-xl font-semibold text-colink-navy mt-6 mb-3">a. Personal Information Provided by You</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Full Name</li>
                <li>Email Address</li>
                <li>Phone Number</li>
                <li>Mailing Address (optional)</li>
                <li>Any other information voluntarily submitted via contact forms, registration, or communication with us</li>
              </ul>

              <h3 className="text-xl font-semibold text-colink-navy mt-6 mb-3">b. Automatically Collected Information</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Time zone settings and location</li>
                <li>Device type and identifiers</li>
                <li>Pages visited and time spent on our site</li>
                <li>Clickstream data, traffic patterns, and other analytics data</li>
              </ul>

              <h3 className="text-xl font-semibold text-colink-navy mt-6 mb-3">c. Cookies and Tracking Technologies</h3>
              <p className="mb-4">We use cookies and similar technologies to enhance user experience, analyze traffic, and remember user preferences. For full details, please refer to our Cookie Policy.</p>

              <h2 className="text-2xl font-bold text-colink-navy mt-8 mb-4">2. How We Use Your Information</h2>
              <p className="mb-4">We use your information for the following purposes:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>To provide services — to register users, respond to inquiries, and fulfill requests.</li>
                <li>To communicate with you — including notifications, newsletters, platform updates, and customer support.</li>
                <li>To improve our platform — by analyzing user behavior, preferences, and interactions.</li>
                <li>To ensure legal compliance — by maintaining records, enforcing our policies, and responding to lawful requests.</li>
                <li>To prevent fraud and ensure security — including user verification, abuse detection, and investigation of suspicious activity.</li>
              </ul>
              <p className="mb-6">We do not sell or rent your personal data to third parties.</p>

              <h2 className="text-2xl font-bold text-colink-navy mt-8 mb-4">3. Legal Basis for Processing (GDPR Compliance)</h2>
              <p className="mb-4">If you are in the European Economic Area (EEA), our legal basis for collecting and using your personal information depends on the context:</p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Consent:</strong> When you voluntarily provide your information or accept cookies.</li>
                <li><strong>Contractual necessity:</strong> To perform obligations under a user agreement.</li>
                <li><strong>Legal obligation:</strong> To comply with tax, data retention, and regulatory laws.</li>
                <li><strong>Legitimate interests:</strong> For security, fraud prevention, and internal analytics.</li>
              </ul>
              <p className="mb-6">You have the right to withdraw your consent at any time.</p>

              <h2 className="text-2xl font-bold text-colink-navy mt-8 mb-4">4. Sharing of Information</h2>
              <p className="mb-4">We may share your data in the following limited circumstances:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>With trusted service providers who help us operate our platform (e.g., hosting providers, analytics services, CRM tools). These third parties are bound by confidentiality agreements.</li>
                <li>To comply with legal obligations such as a subpoena, court order, or other legal process.</li>
                <li>To protect rights and safety, including to prevent fraud, enforce our policies, or respond to security threats.</li>
                <li>With your consent, if you authorize us to share your information in specific situations.</li>
              </ul>
              <p className="mb-6">We do not sell user data to advertisers or third parties for profit.</p>

              <h2 className="text-2xl font-bold text-colink-navy mt-8 mb-4">5. Data Retention</h2>
              <p className="mb-4">We retain your personal data only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, including:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Legal, accounting, or reporting obligations.</li>
                <li>Platform functionality and customer support.</li>
                <li>Security and fraud prevention.</li>
              </ul>
              <p className="mb-6">When no longer needed, we securely delete or anonymize your data.</p>

              <h2 className="text-2xl font-bold text-colink-navy mt-8 mb-4">6. Data Security</h2>
              <p className="mb-4">We take data security seriously. The following safeguards are in place:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>SSL encryption across all web pages and form submissions</li>
                <li>Access control and authentication for stored data</li>
                <li>Firewalls and anti-malware protection</li>
                <li>Regular audits and updates to infrastructure security</li>
              </ul>
              <p className="mb-6">Despite our efforts, no transmission method over the Internet is 100% secure. You use the Platform at your own risk, and we encourage you to use strong passwords and safeguard your credentials.</p>

              <h2 className="text-2xl font-bold text-colink-navy mt-8 mb-4">7. Your Rights and Choices</h2>
              <p className="mb-4">Depending on your location, you may have specific rights over your personal data. These include:</p>
              
              <h3 className="text-xl font-semibold text-colink-navy mt-6 mb-3">a. Access and Portability</h3>
              <p className="mb-4">You may request a copy of the personal data we hold about you.</p>
              
              <h3 className="text-xl font-semibold text-colink-navy mt-6 mb-3">b. Correction and Deletion</h3>
              <p className="mb-4">You may request that we correct inaccurate data or delete your information.</p>

              <h3 className="text-xl font-semibold text-colink-navy mt-6 mb-3">c. Objection and Restriction</h3>
              <p className="mb-4">You may object to certain processing or request we restrict processing under certain conditions.</p>

              <h3 className="text-xl font-semibold text-colink-navy mt-6 mb-3">d. Withdraw Consent</h3>
              <p className="mb-4">If we rely on your consent to process data, you can withdraw it at any time.</p>

              <h3 className="text-xl font-semibold text-colink-navy mt-6 mb-3">e. Lodge a Complaint</h3>
              <p className="mb-4">You have the right to lodge a complaint with your local data protection authority if you believe your rights are being violated.</p>

              <p className="mb-6">To exercise any of these rights, contact us at the information provided below.</p>

              <h2 className="text-2xl font-bold text-colink-navy mt-8 mb-4">8. Children's Privacy (COPPA Compliance)</h2>
              <p className="mb-4">Our services are not intended for children under the age of 13. We do not knowingly collect personal data from children. If we become aware that a child under 13 has provided us with personal information, we will take steps to delete it.</p>
              <p className="mb-6">If you are a parent or guardian and believe your child has provided us with information, please contact us immediately.</p>

              <h2 className="text-2xl font-bold text-colink-navy mt-8 mb-4">9. International Data Transfers</h2>
              <p className="mb-4">If you are accessing our services from outside the United States, please note that your data may be transferred to and processed in countries with different data protection laws.</p>
              <p className="mb-6">We take appropriate safeguards (e.g., contractual clauses, encryption) to ensure your data remains protected regardless of location.</p>

              <h2 className="text-2xl font-bold text-colink-navy mt-8 mb-4">10. Updates to This Privacy Policy</h2>
              <p className="mb-4">We may update this Privacy Policy from time to time. Changes will be posted on this page with a revised "Effective Date" and, where required, we will notify users by email or prominent notice on our site.</p>
              <p className="mb-6">We encourage users to review this policy periodically.</p>

              <h2 className="text-2xl font-bold text-colink-navy mt-8 mb-4">11. Contact Us</h2>
              <p className="mb-4">If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, you can reach us at:</p>
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

export default Privacy;