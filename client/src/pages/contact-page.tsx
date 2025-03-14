import { useEffect } from "react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { motion } from "framer-motion";
import Contact from "@/components/home/contact";

const ContactPage = () => {
  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        {/* Page Header */}
        <section className="bg-[#0F2C59] py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-white font-playfair text-3xl md:text-4xl font-bold mb-4 text-center">Contact Us</h1>
              <div className="h-1 w-20 bg-[#D4AF37] mx-auto"></div>
              <p className="text-white/80 mt-6 max-w-2xl mx-auto text-center">
                Have questions about BOSAN? We're here to help. Reach out to us through any of the following channels.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Information Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <div className="w-12 h-12 bg-[#0F2C59]/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[#0F2C59]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-[#0F2C59] font-playfair text-xl font-bold mb-3">Visit Us</h3>
                <p className="text-gray-600 mb-1">Nigerian Law School Complex</p>
                <p className="text-gray-600 mb-1">Victoria Island</p>
                <p className="text-gray-600">Lagos, Nigeria</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <div className="w-12 h-12 bg-[#0F2C59]/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[#0F2C59]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-[#0F2C59] font-playfair text-xl font-bold mb-3">Email Us</h3>
                <p className="text-gray-600 mb-1">info@bosan.org.ng</p>
                <p className="text-gray-600 mb-1">secretary@bosan.org.ng</p>
                <p className="text-gray-600">membership@bosan.org.ng</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <div className="w-12 h-12 bg-[#0F2C59]/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[#0F2C59]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-[#0F2C59] font-playfair text-xl font-bold mb-3">Call Us</h3>
                <p className="text-gray-600 mb-1">+234 (0) 1234 5678</p>
                <p className="text-gray-600 mb-1">+234 (0) 9876 5432</p>
                <p className="text-gray-600">Monday - Friday, 9:00 AM - 5:00 PM</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Google Maps Section */}
        <section className="py-12 bg-[#F8F9FA]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white p-4 rounded-lg shadow-md"
            >
              <div className="aspect-w-16 aspect-h-9">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.7330070397!2d3.4235413142437957!3d6.426133125704266!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103bf53aec4dd92d%3A0x5e34fe6a84cddd53!2sNigerian%20Law%20School%2C%20Lagos%20Campus!5e0!3m2!1sen!2sng!4v1652354589722!5m2!1sen!2sng" 
                  width="100%" 
                  height="450" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact Form Section */}
        <Contact />
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;
