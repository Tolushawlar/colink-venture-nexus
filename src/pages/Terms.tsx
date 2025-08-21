import React from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const Terms = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-gray-50">
        <div className="container-wide py-16">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-4xl font-bold text-colink-navy mb-6">Terms and Conditions</h1>
            <div className="text-sm text-gray-600 mb-8">
              <p><strong>Effective Date:</strong> August 13, 2025</p>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-700 mb-6">
                Welcome to CoLink Venture — an innovative platform designed to simplify and accelerate partnerships and sponsorships, providing users with efficient access to mutually beneficial services and resources.
              </p>
              
              <p className="mb-6">
                By accessing or using our web application or services, you agree to comply with and be legally bound by the terms and conditions set forth below. If you do not agree to these Terms, please do not use the Platform.
              </p>

              <h2 className="text-2xl font-bold text-colink-navy mt-8 mb-4">1. Acceptance of Terms</h2>
              <p className="mb-4">
                By using the CoLink Venture website, mobile application, or any related services (collectively referred to as the "Platform"), you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions ("Terms"). These Terms form a binding agreement between you and CoLink Venture ("we," "us," or "our").
              </p>
              <p className="mb-6">
                If you do not agree with these Terms in full, you are not authorized to use this Platform.
              </p>

              <h2 className="text-2xl font-bold text-colink-navy mt-8 mb-4">2. User Responsibilities</h2>
              <p className="mb-4">As a user of CoLink Venture, you agree to:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Use the Platform only for lawful purposes.</li>
                <li>Comply with all applicable local, state, national, and international laws and regulations.</li>
                <li>Refrain from engaging in any behavior that is harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, invasive of another's privacy, hateful, or racially or otherwise objectionable.</li>
                <li>Not impersonate any person or entity or falsely state or otherwise misrepresent your affiliation with a person or entity.</li>
                <li>Not attempt to gain unauthorized access to other user accounts, computer systems, or networks associated with the Platform.</li>
                <li>Not use the Platform to distribute unsolicited commercial content, spam, or chain messages.</li>
              </ul>

              <h2 className="text-2xl font-bold text-colink-navy mt-8 mb-4">3. Account Management</h2>
              <p className="mb-4">
                To access certain features of the Platform, users may be required to register for an account by providing accurate and complete information.
              </p>
              <p className="mb-4">You agree to:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Maintain the confidentiality of your login credentials.</li>
                <li>Be solely responsible for all activities that occur under your account.</li>
                <li>Immediately notify us of any unauthorized use or suspected breach of security.</li>
              </ul>
              <p className="mb-6">
                We reserve the right to suspend or terminate any account that violates these Terms or is found to be inactive, fraudulent, or inappropriate.
              </p>

              <h2 className="text-2xl font-bold text-colink-navy mt-8 mb-4">4. Intellectual Property</h2>
              <p className="mb-4">
                All content and materials on the Platform — including, but not limited to, text, images, graphics, logos, trademarks, software, audio, video, and design — are owned or licensed by CoLink Venture and are protected under copyright, trademark, and other intellectual property laws.
              </p>
              <p className="mb-4">Users may not:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Copy, reproduce, republish, upload, post, transmit, or distribute material from the Platform without prior written permission.</li>
                <li>Use any trademarks, logos, or branding from CoLink Venture without authorization.</li>
                <li>Create derivative works based on the content provided on the Platform.</li>
              </ul>
              <p className="mb-6">Limited, non-exclusive, and non-transferable use of the Platform is granted solely for personal or internal business use, subject to these Terms.</p>

              <h2 className="text-2xl font-bold text-colink-navy mt-8 mb-4">5. User Content</h2>
              <p className="mb-4">You may have opportunities to post, upload, or submit content through the Platform, including feedback, comments, or other user-generated content ("User Content").</p>
              <p className="mb-4">By submitting User Content, you:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Grant CoLink Venture a non-exclusive, royalty-free, worldwide, perpetual license to use, reproduce, modify, adapt, publish, translate, and distribute such content.</li>
                <li>Represent and warrant that you own or have the necessary licenses to post such content and that it does not violate any third-party rights or laws.</li>
              </ul>
              <p className="mb-6">We reserve the right to review, moderate, or remove any User Content that we believe violates these Terms or our policies.</p>

              <h2 className="text-2xl font-bold text-colink-navy mt-8 mb-4">6. Privacy Policy</h2>
              <p className="mb-4">Your use of the Platform is also governed by our Privacy Policy, which outlines how we collect, use, store, and share personal data. By agreeing to these Terms, you also acknowledge and accept the terms of our Privacy Policy.</p>
              <p className="mb-6">Please review it at our Privacy Policy page.</p>

              <h2 className="text-2xl font-bold text-colink-navy mt-8 mb-4">7. Limitation of Liability</h2>
              <p className="mb-4">
                To the fullest extent permitted by law, CoLink Venture shall not be liable for any direct, indirect, incidental, special, consequential, or exemplary damages resulting from:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>The use or inability to use the Platform;</li>
                <li>Unauthorized access to or alteration of your data;</li>
                <li>Statements or conduct of any third party on the Platform;</li>
                <li>Any other matter relating to the Platform.</li>
              </ul>
              <p className="mb-6">Our total liability to you for all claims arising out of or relating to the use of the Platform shall not exceed the amount paid by you, if any, for accessing our services.</p>

              <h2 className="text-2xl font-bold text-colink-navy mt-8 mb-4">8. Termination of Service</h2>
              <p className="mb-4">We reserve the right to suspend or terminate your access to the Platform at our sole discretion, without notice or liability, for any reason, including but not limited to:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Violation of these Terms;</li>
                <li>Illegal or unauthorized use of the Platform;</li>
                <li>Actions that may harm CoLink Venture's reputation, systems, or users.</li>
              </ul>
              <p className="mb-6">Upon termination, your right to use the Platform will immediately cease.</p>

              <h2 className="text-2xl font-bold text-colink-navy mt-8 mb-4">9. Dispute Resolution</h2>
              <p className="mb-4">Any disputes, controversies, or claims arising out of or relating to these Terms or your use of the Platform shall first be attempted to be resolved through informal discussions.</p>
              <p className="mb-4">If not resolved amicably, disputes shall be submitted to binding arbitration in accordance with applicable arbitration rules.</p>
              <p className="mb-6">These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles.</p>

              <h2 className="text-2xl font-bold text-colink-navy mt-8 mb-4">10. Amendments</h2>
              <p className="mb-4">We reserve the right to update, modify, or revise these Terms at any time. Any changes will be posted on this page with a revised effective date.</p>
              <p className="mb-6">Continued use of the Platform after such changes constitutes your acceptance of the updated Terms.</p>

              <h2 className="text-2xl font-bold text-colink-navy mt-8 mb-4">11. Contact Information</h2>
              <p className="mb-4">If you have any questions or concerns regarding these Terms, you may contact us at:</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p>Email: info@colinkventure.com</p>
                <p>Phone: (518) 913-2069</p>
              </div>

              <h2 className="text-2xl font-bold text-colink-navy mt-8 mb-4">12. Age Restrictions</h2>
              <p className="mb-4">
                The Platform is intended for users who are 18 years of age or older. By using the Platform, you confirm that you meet this age requirement.
              </p>
              <p className="mb-6">
                If you are under 18, you may only use the Platform under the supervision of a parent or legal guardian. We do not knowingly collect personal data from children under 13 in compliance with the Children's Online Privacy Protection Act (COPPA).
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;