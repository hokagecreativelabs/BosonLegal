import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const About = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };
  
  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <section id="about" className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 className="text-[#0F2C59] font-playfair font-bold text-3xl md:text-4xl mb-4">About BOSAN</h2>
          <div className="h-1 w-20 bg-[#D4AF37] mx-auto"></div>
          <p className="text-[#343A40]/80 mt-6 max-w-2xl mx-auto">The Body of Senior Advocates of Nigeria (BOSAN) is a prestigious association committed to upholding the integrity of the legal profession.</p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            <motion.div variants={fadeIn}>
              <h3 className="font-playfair text-2xl font-bold text-[#0F2C59] mb-4 relative">
                Our History
                <span className="absolute bottom-[-10px] left-0 w-20 h-[3px] bg-[#D4AF37]"></span>
              </h3>
              <p className="text-[#343A40]/80 mb-4">Founded in 1975, BOSAN has been instrumental in shaping the legal landscape of Nigeria. The rank of Senior Advocate of Nigeria (SAN) is awarded to legal practitioners who have distinguished themselves.</p>
              <p className="text-[#343A40]/80">Over the decades, BOSAN has grown to become a cornerstone of Nigeria's judicial system, with its members contributing significantly to legal development and reform.</p>
            </motion.div>
            
            <motion.div variants={fadeIn} className="mt-8">
              <h3 className="font-playfair text-2xl font-bold text-[#0F2C59] mb-4 relative">
                Our Mission
                <span className="absolute bottom-[-10px] left-0 w-20 h-[3px] bg-[#D4AF37]"></span>
              </h3>
              <p className="text-[#343A40]/80 mb-4">BOSAN is dedicated to promoting excellence in legal practice, upholding the rule of law, and contributing to the development of Nigeria's legal system.</p>
              <motion.ul className="space-y-2" variants={staggerChildren}>
                <motion.li className="flex items-start" variants={fadeIn}>
                  <svg className="w-5 h-5 text-[#D4AF37] mt-1 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Maintaining the highest ethical standards in legal practice</span>
                </motion.li>
                <motion.li className="flex items-start" variants={fadeIn}>
                  <svg className="w-5 h-5 text-[#D4AF37] mt-1 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Advocating for judicial independence and integrity</span>
                </motion.li>
                <motion.li className="flex items-start" variants={fadeIn}>
                  <svg className="w-5 h-5 text-[#D4AF37] mt-1 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Providing leadership in legal education and reform</span>
                </motion.li>
              </motion.ul>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="rounded-lg overflow-hidden shadow-xl"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1589391886645-d51941baf7fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
              alt="BOSAN gathering" 
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
        
        <motion.div 
          className="mt-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h3 className="font-playfair text-2xl font-bold text-[#0F2C59] mb-6 relative">
            Leadership
            <span className="absolute bottom-[-10px] left-0 w-20 h-[3px] bg-[#D4AF37]"></span>
          </h3>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div 
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
              variants={fadeIn}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1556157382-97eda2f9e2bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" 
                  alt="Chief Justice" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h4 className="font-playfair font-bold text-[#0F2C59] text-xl">Chief J.B. Daudu, SAN</h4>
                <p className="text-[#750E21] font-medium">Chairman, BOSAN</p>
                <p className="text-[#343A40]/70 mt-2 text-sm">Leading BOSAN since 2020 with over 35 years of distinguished legal practice.</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
              variants={fadeIn}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" 
                  alt="Vice Chairman" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h4 className="font-playfair font-bold text-[#0F2C59] text-xl">Dr. Folake Solanke, SAN</h4>
                <p className="text-[#750E21] font-medium">Vice Chairman, BOSAN</p>
                <p className="text-[#343A40]/70 mt-2 text-sm">A pioneering female SAN with remarkable contributions to constitutional law.</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
              variants={fadeIn}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" 
                  alt="Secretary" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h4 className="font-playfair font-bold text-[#0F2C59] text-xl">Barrister A.O. Adegbite, SAN</h4>
                <p className="text-[#750E21] font-medium">Secretary, BOSAN</p>
                <p className="text-[#343A40]/70 mt-2 text-sm">Renowned for his expertise in commercial litigation and arbitration.</p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <Link href="/about">
            <Button className="bg-transparent border border-[#0F2C59] text-[#0F2C59] font-montserrat font-medium py-2 px-6 rounded-md hover:bg-[#0F2C59] hover:text-white transition duration-300">
              Learn More About BOSAN
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
