import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Event, Announcement, Resource } from "@shared/schema";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Calendar, Users, FileText, Bell } from "lucide-react";
import Resources from "@/components/dashboard/resources";

const DashboardPage = () => {
  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Query upcoming events
  const { data: upcomingEvents } = useQuery<Event[]>({
    queryKey: ["/api/events/upcoming"],
  });

  // Query announcements
  const { data: announcements } = useQuery<Announcement[]>({
    queryKey: ["/api/announcements"],
  });

  // Query resources
  const { data: resources } = useQuery<Resource[]>({
    queryKey: ["/api/resources"],
  });

  return (
    <DashboardLayout title="Dashboard">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingEvents?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                {upcomingEvents && upcomingEvents.length > 0
                  ? `Next: ${upcomingEvents[0].title} on ${format(new Date(upcomingEvents[0].date), 'MMM d, yyyy')}`
                  : "No upcoming events"}
              </p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Available Resources</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resources?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                Legal documents, templates, and research materials
              </p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Recent Announcements</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{announcements?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                {announcements && announcements.length > 0
                  ? `Latest: ${announcements[0].title}`
                  : "No recent announcements"}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Announcements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-8"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-[#0F2C59] font-playfair">Recent Announcements</CardTitle>
            <CardDescription>Important updates from BOSAN</CardDescription>
          </CardHeader>
          <CardContent>
            {!announcements || announcements.length === 0 ? (
              <div className="text-center py-6">
                <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No announcements at this time</p>
              </div>
            ) : (
              <div className="space-y-4">
                {announcements.slice(0, 3).map((announcement) => (
                  <div key={announcement.id} className="border-l-4 border-[#D4AF37] pl-4 py-2">
                    <h3 className="font-medium text-[#0F2C59]">{announcement.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{announcement.content}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {format(new Date(announcement.createdAt), 'MMM dd, yyyy')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Upcoming Events */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mb-8"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-[#0F2C59] font-playfair">Upcoming Events</CardTitle>
            <CardDescription>Stay connected with BOSAN activities</CardDescription>
          </CardHeader>
          <CardContent>
            {!upcomingEvents || upcomingEvents.length === 0 ? (
              <div className="text-center py-6">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No upcoming events at this time</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {upcomingEvents.slice(0, 3).map((event) => (
                  <div key={event.id} className="flex items-start space-x-4 border-b pb-4 last:border-0 last:pb-0">
                    <div className="bg-[#0F2C59] text-white p-2 rounded text-center min-w-[60px]">
                      <span className="block text-xs font-medium">
                        {format(new Date(event.date), 'MMM').toUpperCase()}
                      </span>
                      <span className="block text-lg font-bold">
                        {format(new Date(event.date), 'd')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-[#0F2C59]">{event.title}</h3>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {event.venue}
                      </div>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {event.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Resources Section */}
      <Resources />
    </DashboardLayout>
  );
};

export default DashboardPage;
