import { ReactNode } from "react";
import Sidebar from "./sidebar";
import DashboardHeader from "./dashboard-header";
import { useAuth } from "@/hooks/use-auth";
import { useMediaQuery } from "@/hooks/use-mobile";
import { motion } from "framer-motion";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  const { user } = useAuth();
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardHeader />
      
      <div className="flex">
        {/* Sidebar for desktop */}
        {!isMobile && <Sidebar />}
        
        <main className="flex-1 p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <h1 className="text-2xl font-playfair font-bold text-[#0F2C59]">{title}</h1>
              <p className="text-gray-600">
                Welcome back, {user?.fullName?.split(' ')[0] || 'Member'}
              </p>
            </div>
            
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
