import Footer from "@/components/User/Footer";
import Header from "@/components/User/Header";
import Head from "next/head";

const PrivacyPolicy=()=> {
  return (
    <>
      <Head>
        <title>Privacy Policy | Shriji Pharmaceuticals</title>
        <meta name="description" content="Read our privacy policy to understand how Shriji Pharmaceuticals collects, uses, and protects your information." />
      </Head>
<Header/>
      <div className="bg-white min-h-screen py-10 px-4 sm:px-6 lg:px-24">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-center text-blue-700 mb-10">
            Privacy Policy
          </h1>

          <p className="text-gray-700 text-lg mb-6">
            At <strong>Shriji Pharmaceuticals</strong>, your privacy is important to us. This Privacy Policy outlines how we collect, use, protect, and disclose your personal information when you use our website or services.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-blue-600 mb-3">1. Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 text-lg">
              <li><strong>Personal Information:</strong> Name, contact number, email, address, and billing details when you make a purchase or contact us.</li>
              <li><strong>Technical Information:</strong> IP address, browser type, device information, and usage data collected through cookies and analytics tools.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-blue-600 mb-3">2. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 text-lg">
              <li>To process your orders and provide requested services</li>
              <li>To respond to your queries and support requests</li>
              <li>To improve our website and user experience</li>
              <li>To send updates, offers, or important notifications (with your consent)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-blue-600 mb-3">3. Data Protection & Security</h2>
            <p className="text-gray-700 text-lg">
              We use industry-standard security measures (such as HTTPS, encryption, and secure databases) to protect your personal information from unauthorized access, disclosure, or misuse.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-blue-600 mb-3">4. Sharing Your Information</h2>
            <p className="text-gray-700 text-lg mb-2">
              We do <strong>not sell or rent</strong> your personal information to third parties. We may share your data with:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 text-lg">
              <li>Trusted partners and service providers (such as delivery or payment services)</li>
              <li>Legal authorities if required by law or to protect our rights</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-blue-600 mb-3">5. Your Rights</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 text-lg">
              <li>You can request access to your personal data</li>
              <li>You can request corrections or deletion of your data</li>
              <li>You can opt out of marketing emails at any time</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-blue-600 mb-3">6. Cookies</h2>
            <p className="text-gray-700 text-lg">
              We use cookies to enhance your browsing experience and understand site usage. You can control cookies through your browser settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-blue-600 mb-3">7. Changes to This Policy</h2>
            <p className="text-gray-700 text-lg">
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-blue-600 mb-3">8. Contact Us</h2>
            <p className="text-gray-700 text-lg">
              If you have any questions or concerns about this Privacy Policy, feel free to contact us at: <br />
              📧 <a href="mailto:info@shrijipharm.com" className="text-blue-600 underline">info@shrijipharm.com</a><br />
              📞 +91-XXXXXXXXXX
            </p>
          </section>

          <footer className="text-center mt-10 border-t pt-4 text-sm text-gray-500">
            Last Updated: July 20, 2025
          </footer>
        </div>
      </div>
      <Footer/>
    </>
  );
}
export default PrivacyPolicy