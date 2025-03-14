import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";

const CallToAction = () => {
  const { user } = useAuth();

  return (
    <section className="py-12 bg-gradient-to-r from-[#0F2C59] to-[#750E21]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <motion.div 
            className="mb-6 md:mb-0 md:mr-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-white font-playfair font-bold text-2xl md:text-3xl mb-2">Ready to Connect with BOSAN?</h2>
            <p className="text-white/80">Join us in upholding excellence in Nigeria's legal profession.</p>
          </motion.div>
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <motion.div
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Link href="/events">
                <Button className="w-full sm:w-auto bg-[#D4AF37] text-[#0F2C59] font-montserrat font-medium py-3 px-6 rounded-md hover:bg-opacity-90 transition duration-300">
                  Register for an Event
                </Button>
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {user ? (
                <Link href="/dashboard">
                  <Button className="w-full sm:w-auto bg-white text-[#0F2C59] font-montserrat font-medium py-3 px-6 rounded-md hover:bg-opacity-90 transition duration-300">
                    Member Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/auth">
                  <Button className="w-full sm:w-auto bg-white text-[#0F2C59] font-montserrat font-medium py-3 px-6 rounded-md hover:bg-opacity-90 transition duration-300">
                    Member Login
                  </Button>
                </Link>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
