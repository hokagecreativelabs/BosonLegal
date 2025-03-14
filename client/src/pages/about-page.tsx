import { useEffect } from "react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { motion } from "framer-motion";
import CallToAction from "@/components/home/call-to-action";

const AboutPage = () => {
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
              <h1 className="text-white font-playfair text-3xl md:text-4xl font-bold mb-4 text-center">About BOSAN</h1>
              <div className="h-1 w-20 bg-[#D4AF37] mx-auto"></div>
              <p className="text-white/80 mt-6 max-w-2xl mx-auto text-center">
                Learn about the history, mission, and leadership of the Body of Senior Advocates of Nigeria.
              </p>
            </motion.div>
          </div>
        </section>
        
        {/* History Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-[#0F2C59] font-playfair text-3xl font-bold mb-6 relative">
                  Our History
                  <span className="absolute bottom-[-10px] left-0 w-20 h-[3px] bg-[#D4AF37]"></span>
                </h2>
                <p className="text-[#343A40]/80 mb-4">
                  Founded in 1975, the Body of Senior Advocates of Nigeria (BOSAN) has been instrumental in shaping the legal landscape of Nigeria. The rank of Senior Advocate of Nigeria (SAN) is awarded to legal practitioners who have distinguished themselves and made significant contributions to the development of law in Nigeria.
                </p>
                <p className="text-[#343A40]/80 mb-4">
                  The BOSAN was established to bring together all recipients of the prestigious rank to promote the highest standards of legal practice, uphold the integrity of the legal profession, and contribute to the development and reform of Nigeria's legal system.
                </p>
                <p className="text-[#343A40]/80">
                  Over the decades, BOSAN has grown to become a cornerstone of Nigeria's judicial system, with its members occupying key positions in the judiciary, government, and private legal practice. The organization continues to play a pivotal role in legal education, judicial reform, and the advancement of the rule of law in Nigeria.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="rounded-lg overflow-hidden shadow-xl"
              >
                <img 
                  src="https://images.unsplash.com/photo-1593115057322-e94b77572f20?ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=80" 
                  alt="Nigerian Supreme Court" 
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Mission Section */}
        <section className="py-16 bg-[#F8F9FA]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-[#0F2C59] font-playfair text-3xl font-bold mb-4">Our Mission</h2>
              <div className="h-1 w-20 bg-[#D4AF37] mx-auto"></div>
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-[#0F2C59] font-playfair text-xl font-bold mb-3">Excellence in Legal Practice</h3>
                <p className="text-[#343A40]/80">
                  To promote and maintain the highest standards of legal practice, professional ethics, and integrity among Senior Advocates and the legal profession as a whole.
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <h3 className="text-[#0F2C59] font-playfair text-xl font-bold mb-3">Uphold Rule of Law</h3>
                <p className="text-[#343A40]/80">
                  To advocate for and uphold the rule of law, judicial independence, and the fundamental principles of justice and equity in Nigeria's legal system.
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-[#0F2C59] font-playfair text-xl font-bold mb-3">Legal Reform & Education</h3>
                <p className="text-[#343A40]/80">
                  To contribute to the development, reform, and advancement of Nigeria's legal system and provide leadership in legal education and professional development.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Leadership Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-[#0F2C59] font-playfair text-3xl font-bold mb-4">Leadership</h2>
              <div className="h-1 w-20 bg-[#D4AF37] mx-auto"></div>
              <p className="text-[#343A40]/80 mt-6 max-w-2xl mx-auto">
                Meet the distinguished leaders who guide the Body of Senior Advocates of Nigeria.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
              >
                <div className="h-64 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1556157382-97eda2f9e2bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" 
                    alt="Chief Justice" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-playfair font-bold text-[#0F2C59] text-xl mb-1">Chief J.B. Daudu, SAN</h3>
                  <p className="text-[#750E21] font-medium mb-3">Chairman, BOSAN</p>
                  <p className="text-[#343A40]/70 text-sm mb-4">
                    Leading BOSAN since 2020 with over 35 years of distinguished legal practice. Chief Daudu has made significant contributions to constitutional law and has represented Nigeria in international legal forums.
                  </p>
                  <div className="flex space-x-4">
                    <a href="#" className="text-[#0F2C59] hover:text-[#D4AF37] transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                    <a href="#" className="text-[#0F2C59] hover:text-[#D4AF37] transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
              >
                <div className="h-64 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" 
                    alt="Vice Chairman" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-playfair font-bold text-[#0F2C59] text-xl mb-1">Dr. Folake Solanke, SAN</h3>
                  <p className="text-[#750E21] font-medium mb-3">Vice Chairman, BOSAN</p>
                  <p className="text-[#343A40]/70 text-sm mb-4">
                    A pioneering female SAN with remarkable contributions to constitutional law. Dr. Solanke has broken barriers for women in the legal profession and championed gender equality in Nigeria's judicial system.
                  </p>
                  <div className="flex space-x-4">
                    <a href="#" className="text-[#0F2C59] hover:text-[#D4AF37] transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                    <a href="#" className="text-[#0F2C59] hover:text-[#D4AF37] transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
              >
                <div className="h-64 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" 
                    alt="Secretary" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-playfair font-bold text-[#0F2C59] text-xl mb-1">Barrister A.O. Adegbite, SAN</h3>
                  <p className="text-[#750E21] font-medium mb-3">Secretary, BOSAN</p>
                  <p className="text-[#343A40]/70 text-sm mb-4">
                    Renowned for his expertise in commercial litigation and arbitration. Barrister Adegbite has represented major corporations and has published extensively on business law in Nigeria.
                  </p>
                  <div className="flex space-x-4">
                    <a href="#" className="text-[#0F2C59] hover:text-[#D4AF37] transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                    <a href="#" className="text-[#0F2C59] hover:text-[#D4AF37] transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        <CallToAction />
      </div>
      <Footer />
    </div>
  );
};

export default AboutPage;
