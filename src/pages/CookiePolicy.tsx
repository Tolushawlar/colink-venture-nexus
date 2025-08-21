import React from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const CookiePolicy = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-gray-50">
        <div className="container-wide py-16">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-4xl font-bold text-colink-navy mb-6">Cookie Policy</h1>
            <div className="text-sm text-gray-600 mb-8">
              <p><strong>Effective Date:</strong> August 13, 2025</p>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-700 mb-6">
                This Cookie Policy explains how CoLink Venture ("we," "us," or "our") uses cookies and similar technologies on our website and web application (collectively, the "Platform"). By accessing or using our Platform, you consent to the use of cookies as described in this policy.
              </p>
              
              <p className="mb-6">
                For information on how we collect, use, and protect your personal data, please also refer to our Privacy Policy.
              </p>

              <h2 className="text-2xl font-bold text-colink-navy mt-8 mb-4">1. What Are Cookies?</h2>
              <p className="mb-4">
                Cookies are small text files that a website stores on your device when you visit it. They contain information such as your preferences, session data, and identifiers that help improve your experience and enable certain functionalities of the site.
              </p>
              <p className="mb-6">
                Cookies are widely used to make websites work, or work more efficiently, as well as to provide analytical and marketing insights.
              </p>

              <h2 className="text-2xl font-bold text-colink-navy mt-8 mb-4">2. Types of Cookies We Use</h2>
              <p className="mb-4">We use the following categories of cookies on the CoLink Venture Platform:</p>
              
              <h3 className="text-xl font-semibold text-colink-navy mt-6 mb-3">a. Essential Cookies</h3>
              <p className="mb-4">These cookies are necessary for the Platform to function properly and cannot be switched off in our systems. They are typically set in response to actions you take, such as logging in, filling out forms, or setting your privacy preferences.</p>
              <p className="mb-4">Examples:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Session cookies</li>
                <li>Login authentication</li>
                <li>CSRF tokens</li>
              </ul>

              <h3 className="text-xl font-semibold text-colink-navy mt-6 mb-3">b. Performance & Analytics Cookies</h3>
              <p className="mb-4">These cookies collect information about how visitors use our Platform, such as which pages are visited most often, the time spent on the site, and any error messages encountered.</p>
              <p className="mb-4">They help us improve the functionality and performance of our Platform.</p>
              <p className="mb-4">Examples:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Google Analytics</li>
                <li>Hotjar</li>
                <li>Heap</li>
              </ul>

              <h3 className="text-xl font-semibold text-colink-navy mt-6 mb-3">c. Functionality Cookies</h3>
              <p className="mb-4">These cookies allow the Platform to remember choices you make and provide enhanced features (e.g., language settings, user preferences, chat support history).</p>
              <p className="mb-4">Disabling these may reduce platform personalization and convenience.</p>

              <h3 className="text-xl font-semibold text-colink-navy mt-6 mb-3">d. Targeting & Advertising Cookies</h3>
              <p className="mb-4">We may work with advertising partners to deliver ads that are more relevant to you and your interests. These cookies may track your browsing habits across different sites.</p>
              <p className="mb-4">You may opt out of these cookies as described below.</p>
              <p className="mb-4">Examples:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Facebook Pixel</li>
                <li>LinkedIn Insights</li>
                <li>Google Ads</li>
              </ul>

              <h3 className="text-xl font-semibold text-colink-navy mt-6 mb-3">e. Third-Party Cookies</h3>
              <p className="mb-6">Some cookies are placed by third-party services that appear on our pages or that we use to enable embedded features (e.g., videos, social media widgets).</p>
              <p className="mb-6">Please refer to the respective third-party policies for more information on their use of cookies.</p>

              <h2 className="text-2xl font-bold text-colink-navy mt-8 mb-4">3. Why We Use Cookies</h2>
              <p className="mb-4">We use cookies and similar technologies for various purposes:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>To operate our Platform efficiently</li>
                <li>To remember user preferences and settings</li>
                <li>To provide personalized content</li>
                <li>To measure user engagement and improve usability</li>
                <li>To analyze traffic and user behavior</li>
                <li>To deliver targeted advertisements</li>
                <li>To enhance overall platform performance</li>
              </ul>
              <p className="mb-6">Cookies allow us to enhance your experience by making the Platform more responsive to your needs.</p>

              <h2 className="text-2xl font-bold text-colink-navy mt-8 mb-4">4. Cookie Consent and Control</h2>
              <p className="mb-4">When you visit our Platform for the first time, you will be presented with a cookie banner or pop-up that allows you to:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Accept all cookies</li>
                <li>Customize your preferences</li>
                <li>Decline non-essential cookies</li>
              </ul>
              <p className="mb-6">Your preferences will be saved and can be changed at any time.</p>

              <h3 className="text-xl font-semibold text-colink-navy mt-6 mb-3">a. Browser Settings</h3>
              <p className="mb-4">You can control cookies through your browser settings by:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Enabling or disabling all cookies</li>
                <li>Deleting stored cookies</li>
                <li>Blocking third-party cookies</li>
              </ul>
              <p className="mb-4">Here are links to manage cookie settings in common browsers:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Google Chrome</li>
                <li>Mozilla Firefox</li>
                <li>Safari</li>
                <li>Microsoft Edge</li>
              </ul>
              <p className="mb-6"><strong>Please note:</strong> Disabling cookies may affect the functionality of certain features on our Platform.</p>

              <h2 className="text-2xl font-bold text-colink-navy mt-8 mb-4">5. Third-Party Services and Cookies</h2>
              <p className="mb-4">We may use the following third-party services that set cookies through our Platform. These cookies may track your online activities across different websites:</p>
              
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Provider</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Purpose</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Link to Policy</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Google Analytics</td>
                      <td className="border border-gray-300 px-4 py-2">User analytics</td>
                      <td className="border border-gray-300 px-4 py-2">Privacy Policy</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Facebook Pixel</td>
                      <td className="border border-gray-300 px-4 py-2">Advertising & retargeting</td>
                      <td className="border border-gray-300 px-4 py-2">Privacy Policy</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">YouTube</td>
                      <td className="border border-gray-300 px-4 py-2">Embedded media</td>
                      <td className="border border-gray-300 px-4 py-2">Privacy Policy</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">LinkedIn</td>
                      <td className="border border-gray-300 px-4 py-2">Analytics and conversion tracking</td>
                      <td className="border border-gray-300 px-4 py-2">Privacy Policy</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <p className="mb-6">These providers may collect and use data independently. Please review their privacy policies for further details.</p>

              <h2 className="text-2xl font-bold text-colink-navy mt-8 mb-4">6. Your Rights and Choices</h2>
              <p className="mb-4">Under laws like the General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA), you have the right to:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Know what data is being collected through cookies</li>
                <li>Refuse the use of non-essential cookies</li>
                <li>Withdraw your consent at any time</li>
                <li>Request access or deletion of personal data collected via cookies</li>
              </ul>
              <p className="mb-6">To exercise these rights, please contact us using the information provided below.</p>

              <h2 className="text-2xl font-bold text-colink-navy mt-8 mb-4">7. Data Retention</h2>
              <p className="mb-4">Cookies are retained based on their type:</p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Session Cookies</strong> expire when you close your browser.</li>
                <li><strong>Persistent Cookies</strong> remain on your device for a set period or until deleted.</li>
                <li>Retention periods are specified within the cookie or based on browser settings.</li>
              </ul>
              <p className="mb-6">We do not retain personal data collected through cookies longer than necessary to fulfill their purpose.</p>

              <h2 className="text-2xl font-bold text-colink-navy mt-8 mb-4">8. Updates to This Cookie Policy</h2>
              <p className="mb-4">We reserve the right to update this Cookie Policy at any time to reflect changes in technology, legal requirements, or our practices. Any updates will be posted on this page with a new effective date.</p>
              <p className="mb-6">We encourage users to periodically review this policy to stay informed.</p>

              <h2 className="text-2xl font-bold text-colink-navy mt-8 mb-4">9. Contact Us</h2>
              <p className="mb-4">If you have any questions or concerns about our use of cookies or this Cookie Policy, please contact us:</p>
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

export default CookiePolicy;