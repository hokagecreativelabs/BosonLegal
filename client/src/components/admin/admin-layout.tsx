import { ReactNode } from "react";
import DashboardHeader from "../dashboard/dashboard-header";
import { useAuth } from "@/hooks/use-auth";
import { useMediaQuery } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { Redirect } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import {
  Users,
  CalendarDays,
  FileText,
  MessageSquare,
  Bell,
  CreditCard,
  Upload,
} from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
  activeTab: string;
}

const AdminLayout = ({ children, activeTab }: AdminLayoutProps) => {
  const { user } = useAuth();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // If not admin, redirect to dashboard
  if (user && user.role !== "admin") {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardHeader />

      <div className="flex">
        <main className="flex-1 p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <h1 className="text-2xl font-playfair font-bold text-[#0F2C59]">Admin Dashboard</h1>
              <p className="text-gray-600">
                Manage BOSAN website content and users
              </p>
            </div>

            <Card className="mb-6">
              <Tabs defaultValue={activeTab} className="w-full">
                <TabsList className="grid grid-cols-2 md:grid-cols-7 h-auto p-0">
                  <TabsTrigger
                    value="members"
                    className="py-3 data-[state=active]:bg-[#0F2C59] data-[state=active]:text-white"
                    asChild
                  >
                    <a href="/admin/members" className="flex items-center gap-2 justify-center">
                      <Users className="h-4 w-4" />
                      <span className={isMobile ? "hidden" : ""}>Members</span>
                    </a>
                  </TabsTrigger>
                  <TabsTrigger
                    value="events"
                    className="py-3 data-[state=active]:bg-[#0F2C59] data-[state=active]:text-white"
                    asChild
                  >
                    <a href="/admin/events" className="flex items-center gap-2 justify-center">
                      <CalendarDays className="h-4 w-4" />
                      <span className={isMobile ? "hidden" : ""}>Events</span>
                    </a>
                  </TabsTrigger>
                  <TabsTrigger
                    value="resources"
                    className="py-3 data-[state=active]:bg-[#0F2C59] data-[state=active]:text-white"
                    asChild
                  >
                    <a href="/admin/resources" className="flex items-center gap-2 justify-center">
                      <FileText className="h-4 w-4" />
                      <span className={isMobile ? "hidden" : ""}>Resources</span>
                    </a>
                  </TabsTrigger>
                  <TabsTrigger
                    value="announcements"
                    className="py-3 data-[state=active]:bg-[#0F2C59] data-[state=active]:text-white"
                    asChild
                  >
                    <a href="/admin/announcements" className="flex items-center gap-2 justify-center">
                      <Bell className="h-4 w-4" />
                      <span className={isMobile ? "hidden" : ""}>Announcements</span>
                    </a>
                  </TabsTrigger>
                  <TabsTrigger
                    value="messages"
                    className="py-3 data-[state=active]:bg-[#0F2C59] data-[state=active]:text-white"
                    asChild
                  >
                    <a href="/admin/messages" className="flex items-center gap-2 justify-center">
                      <MessageSquare className="h-4 w-4" />
                      <span className={isMobile ? "hidden" : ""}>Messages</span>
                    </a>
                  </TabsTrigger>
                  <TabsTrigger
                    value="payments"
                    className="py-3 data-[state=active]:bg-[#0F2C59] data-[state=active]:text-white"
                    asChild
                  >
                    <a href="/admin/payments" className="flex items-center gap-2 justify-center">
                      <CreditCard className="h-4 w-4" />
                      <span className={isMobile ? "hidden" : ""}>Payments</span>
                    </a>
                  </TabsTrigger>
                  <TabsTrigger
                    value="uploads"
                    className="py-3 data-[state=active]:bg-[#0F2C59] data-[state=active]:text-white"
                    asChild
                  >
                    <a href="/admin/uploads" className="flex items-center gap-2 justify-center">
                      <Upload className="h-4 w-4" />
                      <span className={isMobile ? "hidden" : ""}>Uploads</span>
                    </a>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </Card>

            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;