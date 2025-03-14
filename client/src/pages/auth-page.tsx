import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { motion } from "framer-motion";
import LoginForm from "@/components/auth/login-form";
import RegisterForm from "@/components/auth/register-form";
import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";

const AuthPage = () => {
  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { user, isLoading } = useAuth();

  // If user is already logged in, redirect to dashboard
  if (user && !isLoading) {
    return <Redirect to="/dashboard" />;
  }

  // Variants for animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-grow">
        {/* Page Header */}
        <section className="bg-[#0F2C59] py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-white font-playfair text-3xl md:text-4xl font-bold mb-4 text-center">Member Portal</h1>
              <div className="h-1 w-20 bg-[#D4AF37] mx-auto"></div>
              <p className="text-white/80 mt-6 max-w-2xl mx-auto text-center">
                Login to access exclusive BOSAN resources or register for a new account
              </p>
            </motion.div>
          </div>
        </section>

        {/* Authentication Forms */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-2 gap-8"
            >
              {/* Left Column - Login Form */}
              <motion.div variants={itemVariants}>
                <LoginForm />
              </motion.div>

              {/* Right Column - Registration Form */}
              <motion.div variants={itemVariants}>
                <RegisterForm />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Why Join BOSAN Section */}
        <section className="bg-[#F8F9FA] py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-[#0F2C59] font-playfair text-3xl font-bold mb-4">Membership Benefits</h2>
              <div className="h-1 w-20 bg-[#D4AF37] mx-auto"></div>
              <p className="text-[#343A40]/80 mt-6 max-w-2xl mx-auto">
                Discover the exclusive benefits of being a member of the Body of Senior Advocates of Nigeria
              </p>
            </motion.div>
            
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-[#0F2C59] font-playfair text-xl font-bold mb-3">Exclusive Resources</h3>
                <p className="text-gray-600">
                  Access a comprehensive library of legal resources, precedents, and research materials exclusive to BOSAN members.
                </p>
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-[#0F2C59] font-playfair text-xl font-bold mb-3">Networking Opportunities</h3>
                <p className="text-gray-600">
                  Connect with fellow Senior Advocates through exclusive events, conferences, and social gatherings organized by BOSAN.
                </p>
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-[#0F2C59] font-playfair text-xl font-bold mb-3">Professional Development</h3>
                <p className="text-gray-600">
                  Enhance your legal expertise through specialized workshops, seminars, and continuing legal education programs.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default AuthPage;
