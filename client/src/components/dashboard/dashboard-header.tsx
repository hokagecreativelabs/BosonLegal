import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useState } from "react";
import { Bell, Menu, X } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-mobile";
import Sidebar from "./sidebar";
import { motion, AnimatePresence } from "framer-motion";

const DashboardHeader = () => {
  const { user, logoutMutation } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  // Get user initials for avatar fallback
  const getInitials = () => {
    if (!user?.fullName) return 'U';
    
    const nameParts = user.fullName.split(' ');
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
    }
    return nameParts[0][0].toUpperCase();
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center">
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="mr-2">
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          )}
          
          <Link href="/">
            <a className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-[#0F2C59] rounded-full flex items-center justify-center">
                <span className="text-[#D4AF37] font-playfair font-bold text-sm">B</span>
              </div>
              <span className="text-[#0F2C59] font-playfair font-bold">BOSAN</span>
            </a>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          </Button>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium">{user?.fullName}</p>
              <p className="text-xs text-gray-500">{user?.specialty || 'Member'}</p>
            </div>
            
            <div className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.profileImage} alt={user?.fullName || 'User'} />
                <AvatarFallback className="bg-[#0F2C59] text-white">{getInitials()}</AvatarFallback>
              </Avatar>
              
              <div className="ml-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout} 
                  disabled={logoutMutation.isPending}
                  className="text-gray-500 text-xs"
                >
                  {logoutMutation.isPending ? "Logging out..." : "Logout"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile sidebar */}
      <AnimatePresence>
        {isMobile && mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex"
          >
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <Sidebar onItemClick={() => setMobileMenuOpen(false)} />
            </div>
            <div className="flex-shrink-0 w-14" onClick={() => setMobileMenuOpen(false)}></div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default DashboardHeader;
