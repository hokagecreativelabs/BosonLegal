import { useEffect } from "react";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import ProfileForm from "@/components/dashboard/profile-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { format } from "date-fns";

const ProfilePage = () => {
  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { user } = useAuth();

  return (
    <DashboardLayout title="My Profile">
      <Tabs defaultValue="profile" className="w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="profile">Profile Information</TabsTrigger>
            <TabsTrigger value="account">Account Settings</TabsTrigger>
          </TabsList>
        </motion.div>

        <TabsContent value="profile">
          {/* Profile Form */}
          <ProfileForm />
        </TabsContent>

        <TabsContent value="account">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-[#0F2C59] font-playfair">Account Settings</CardTitle>
                <CardDescription>Manage your account security and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Account Information */}
                <div className="space-y-1">
                  <h3 className="text-lg font-medium">Account Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Username</p>
                      <p className="text-gray-900">{user?.username}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-gray-900">{user?.email}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Member Since</p>
                      <p className="text-gray-900">{user?.createdAt ? format(new Date(user.createdAt), 'MMMM dd, yyyy') : 'N/A'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Account Type</p>
                      <p className="text-gray-900">{user?.role === 'admin' ? 'Administrator' : 'Member'}</p>
                    </div>
                  </div>
                </div>

                {/* Password Reset */}
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium mb-4">Password Management</h3>
                  <div className="bg-[#F8F9FA] p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-4">For security reasons, we require a secure process to change your password.</p>
                    <button className="bg-[#0F2C59] text-white py-2 px-4 rounded hover:bg-[#0F2C59]/90 transition duration-300">
                      Change Password
                    </button>
                  </div>
                </div>

                {/* Account Activity */}
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium mb-4">Recent Account Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Successful login</p>
                        <p className="text-xs text-gray-500">Today at {format(new Date(), 'h:mm a')}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Profile information updated</p>
                        <p className="text-xs text-gray-500">Yesterday at 2:45 PM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default ProfilePage;
