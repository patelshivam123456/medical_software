
import Footer from "@/components/User/Footer";
import Header from "@/components/User/Header";
import Head from "next/head";

const Aboutus=()=> {
  return (
    <>
      <Head>
        <title>About Us | Shriji Pharmaceuticals</title>
        <meta name="description" content="Learn about Shriji - your trusted partner in medicine, medical supplies, and hospital solutions." />
      </Head>
<Header/>
      <div className="bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-24">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-center text-blue-700 mb-8">About Us</h1>

          <section className="mb-10">
            <p className="text-lg sm:text-xl text-gray-700 mb-4">
              Welcome to <strong>Shriji</strong> – your trusted partner in healthcare. We are committed to providing high-quality medicines, reliable medical equipment, and essential hospital supplies that ensure the health and safety of our communities.
            </p>
            <p className="text-lg text-gray-700">
              Whether you are a patient, healthcare provider, or hospital, Shriji is here to serve you with integrity, care, and excellence.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">Who We Are</h2>
            <p className="text-gray-700 text-lg">
              Founded with a mission to make healthcare more accessible and affordable, <strong>Shriji</strong> has become a trusted name in the pharmaceutical and healthcare supply industry. We ensure every product we offer meets strict quality and safety standards.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">What We Offer</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 text-lg">
              <li>Authentic and affordable prescription & OTC medicines</li>
              <li>Essential hospital and clinic supplies (gloves, masks, surgical tools, etc.)</li>
              <li>Medical equipment and diagnostic tools</li>
              <li>Support for hospitals, clinics, and healthcare professionals</li>
              <li>Dedicated customer service for guidance and support</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">Our Vision</h2>
            <p className="text-gray-700 text-lg">
              To become a leading and reliable healthcare partner by providing safe, effective, and affordable healthcare solutions throughout the country.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">Our Mission</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 text-lg">
              <li>Deliver high-quality and genuine medicines at affordable prices</li>
              <li>Empower hospitals and clinics with reliable medical inventory</li>
              <li>Promote a healthier society through trust and service excellence</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">Why Choose Shriji?</h2>
            <div className="grid sm:grid-cols-2 gap-4 text-lg text-gray-700">
              <p>✅ Trusted Quality Products</p>
              <p>✅ Certified and Compliant Supplies</p>
              <p>✅ Reliable & Timely Delivery</p>
              <p>✅ Transparent Business Values</p>
              <p>✅ Focused on Customer Satisfaction</p>
            </div>
          </section>

          <footer className="text-center mt-8 border-t pt-6 text-gray-600">
            Thank you for choosing <strong>Shriji</strong> – Where <span className="text-blue-700 font-semibold">Health Meets Trust</span>.
          </footer>
        </div>
      </div>
      <Footer/>
    </>
  );
}
export default Aboutus