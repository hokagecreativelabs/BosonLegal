import { useEffect, useState } from "react";
import { Link, useRoute } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LoginModal from "../auth/login-modal";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const { user, logoutMutation } = useAuth();
  
  const [isHomePage] = useRoute("/");
  const [isAboutPage] = useRoute("/about");
  const [isEventsPage] = useRoute("/events");
  const [isMembersPage] = useRoute("/members");
  const [isContactPage] = useRoute("/contact");
  
  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [isHomePage, isAboutPage, isEventsPage, isMembersPage, isContactPage]);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const handleOpenLoginModal = () => {
    setLoginModalOpen(true);
  };
  
  const handleCloseLoginModal = () => {
    setLoginModalOpen(false);
  };
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <>
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div 
                onClick={() => window.location.href = '/'}
                className="flex items-center space-x-2 cursor-pointer">
                <div className="h-10 w-10 bg-[#0F2C59] rounded-full flex items-center justify-center">
                  <span className="text-[#D4AF37] font-playfair font-bold text-lg">B</span>
                </div>
                <div>
                  <h1 className="text-[#0F2C59] font-playfair font-bold text-xl">BOSAN</h1>
                  <p className="text-xs text-gray-500">Body of Senior Advocates of Nigeria</p>
                </div>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8 items-center">
              <div
                onClick={() => window.location.href = '/'}
                className={`font-montserrat font-medium cursor-pointer ${isHomePage ? 'text-[#0F2C59]' : 'text-[#343A40]'} hover:text-[#D4AF37] transition duration-300`}
              >
                Home
              </div>
              <div
                onClick={() => window.location.href = '/about'}
                className={`font-montserrat font-medium cursor-pointer ${isAboutPage ? 'text-[#0F2C59]' : 'text-[#343A40]'} hover:text-[#D4AF37] transition duration-300`}
              >
                About
              </div>
              <div
                onClick={() => window.location.href = '/events'}
                className={`font-montserrat font-medium cursor-pointer ${isEventsPage ? 'text-[#0F2C59]' : 'text-[#343A40]'} hover:text-[#D4AF37] transition duration-300`}
              >
                Events
              </div>
              <div
                onClick={() => window.location.href = '/members'}
                className={`font-montserrat font-medium cursor-pointer ${isMembersPage ? 'text-[#0F2C59]' : 'text-[#343A40]'} hover:text-[#D4AF37] transition duration-300`}
              >
                Members
              </div>
              <div
                onClick={() => window.location.href = '/contact'}
                className={`font-montserrat font-medium cursor-pointer ${isContactPage ? 'text-[#0F2C59]' : 'text-[#343A40]'} hover:text-[#D4AF37] transition duration-300`}
              >
                Contact
              </div>
              
              {user ? (
                <div className="flex items-center space-x-4">
                  <div
                    onClick={() => window.location.href = '/dashboard'}
                    className="font-montserrat bg-[#0F2C59] text-white px-5 py-2 rounded hover:bg-opacity-90 transition duration-300 flex items-center space-x-2 cursor-pointer"
                  >
                    <span>Dashboard</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                  >
                    {logoutMutation.isPending ? "Logging out..." : "Logout"}
                  </Button>
                </div>
              ) : (
                <Button
                  className="font-montserrat bg-[#0F2C59] text-white px-5 py-2 rounded hover:bg-opacity-90 transition duration-300 flex items-center space-x-2"
                  onClick={handleOpenLoginModal}
                >
                  <span>Member Login</span>
                  <Lock className="h-4 w-4" />
                </Button>
              )}
            </nav>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                className="text-[#0F2C59] hover:text-[#D4AF37] focus:outline-none"
                onClick={toggleMobileMenu}
                aria-label="Toggle mobile menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden overflow-hidden"
              >
                <div className="px-2 pt-2 pb-4 space-y-1 border-t">
                  <div
                    onClick={() => window.location.href = '/'}
                    className="block px-3 py-2 text-[#0F2C59] font-medium hover:bg-[#F8F9FA] rounded cursor-pointer"
                  >
                    Home
                  </div>
                  <div
                    onClick={() => window.location.href = '/about'}
                    className="block px-3 py-2 text-[#343A40] font-medium hover:bg-[#F8F9FA] rounded cursor-pointer"
                  >
                    About
                  </div>
                  <div
                    onClick={() => window.location.href = '/events'}
                    className="block px-3 py-2 text-[#343A40] font-medium hover:bg-[#F8F9FA] rounded cursor-pointer"
                  >
                    Events
                  </div>
                  <div
                    onClick={() => window.location.href = '/members'}
                    className="block px-3 py-2 text-[#343A40] font-medium hover:bg-[#F8F9FA] rounded cursor-pointer"
                  >
                    Members
                  </div>
                  <div
                    onClick={() => window.location.href = '/contact'}
                    className="block px-3 py-2 text-[#343A40] font-medium hover:bg-[#F8F9FA] rounded cursor-pointer"
                  >
                    Contact
                  </div>
                  
                  {user ? (
                    <>
                      <div
                        onClick={() => window.location.href = '/dashboard'}
                        className="block w-full mt-2 font-montserrat bg-[#0F2C59] text-white px-5 py-2 rounded hover:bg-opacity-90 transition duration-300 text-center cursor-pointer"
                      >
                        Dashboard
                      </div>
                      <button 
                        className="block w-full mt-2 font-montserrat border border-[#0F2C59] text-[#0F2C59] px-5 py-2 rounded hover:bg-[#0F2C59] hover:text-white transition duration-300 text-center"
                        onClick={handleLogout}
                        disabled={logoutMutation.isPending}
                      >
                        {logoutMutation.isPending ? "Logging out..." : "Logout"}
                      </button>
                    </>
                  ) : (
                    <button 
                      className="w-full mt-2 font-montserrat bg-[#0F2C59] text-white px-5 py-2 rounded hover:bg-opacity-90 transition duration-300 flex items-center justify-center space-x-2"
                      onClick={handleOpenLoginModal}
                    >
                      <span>Member Login</span>
                      <Lock className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
      
      <LoginModal isOpen={loginModalOpen} onClose={handleCloseLoginModal} />
    </>
  );
};

export default Navbar;
