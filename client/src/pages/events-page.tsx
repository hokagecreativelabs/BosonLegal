import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Event } from "@shared/schema";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CallToAction from "@/components/home/call-to-action";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

const EventsPage = () => {
  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { user } = useAuth();
  const { toast } = useToast();
  const [registering, setRegistering] = useState<number | null>(null);

  const {
    data: upcomingEvents,
    isLoading: upcomingLoading,
    error: upcomingError,
  } = useQuery<Event[]>({
    queryKey: ["/api/events/upcoming"],
  });

  const {
    data: pastEvents,
    isLoading: pastLoading,
    error: pastError,
  } = useQuery<Event[]>({
    queryKey: ["/api/events/past"],
  });

  const handleRegister = async (eventId: number) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to register for events",
        variant: "destructive",
      });
      return;
    }

    try {
      setRegistering(eventId);
      await apiRequest("POST", `/api/events/${eventId}/register`);
      toast({
        title: "Registration Successful",
        description: "You have been registered for this event",
      });

      // Invalidate event cache to reflect updated status
      queryClient.invalidateQueries({ queryKey: ["/api/events/upcoming"] });
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Could not register for event",
        variant: "destructive",
      });
    } finally {
      setRegistering(null);
    }
  };

  const renderEventCard = (event: Event) => {
    const eventDate = new Date(event.date);
    const monthAbbr = format(eventDate, 'MMM').toUpperCase();
    const day = format(eventDate, 'd');
    
    return (
      <motion.div
        key={event.id}
        className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        whileHover={{ y: -5 }}
      >
        <div className="relative">
          <img
            src={event.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"}
            alt={event.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-0 right-0 bg-[#0F2C59] text-white p-2 m-2 rounded">
            <div className="text-center">
              <span className="block text-sm font-medium">{monthAbbr}</span>
              <span className="block text-xl font-bold">{day}</span>
            </div>
          </div>
        </div>
        <div className="p-4">
          <h4 className="font-playfair font-bold text-[#0F2C59] text-xl mb-2">{event.title}</h4>
          <div className="flex items-center text-[#343A40]/70 text-sm mb-3">
            <svg className="w-4 h-4 mr-2 text-[#750E21]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{event.venue}</span>
          </div>
          <div className="flex items-center text-[#343A40]/70 text-sm mb-4">
            <svg className="w-4 h-4 mr-2 text-[#750E21]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{event.time}</span>
          </div>
          <p className="text-[#343A40]/80 mb-4 text-sm">{event.description}</p>
          
          {!event.isPast && (
            <Button
              className="w-full bg-[#0F2C59] text-white py-2 rounded hover:bg-opacity-90 transition duration-300 flex items-center justify-center"
              onClick={() => handleRegister(event.id)}
              disabled={registering === event.id}
            >
              {registering === event.id ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  <span>Register Now</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </Button>
          )}
        </div>
      </motion.div>
    );
  };

  const renderLoading = () => (
    <div className="flex justify-center items-center h-56">
      <Loader2 className="h-8 w-8 animate-spin text-[#0F2C59]" />
    </div>
  );

  const renderError = (errorMessage: string) => (
    <div className="text-center py-12">
      <svg className="w-12 h-12 mx-auto text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Events</h3>
      <p className="text-gray-500">{errorMessage}</p>
    </div>
  );

  const renderEmpty = (message: string) => (
    <div className="text-center py-12">
      <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No Events Found</h3>
      <p className="text-gray-500">{message}</p>
    </div>
  );

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
              <h1 className="text-white font-playfair text-3xl md:text-4xl font-bold mb-4 text-center">Events & Conferences</h1>
              <div className="h-1 w-20 bg-[#D4AF37] mx-auto"></div>
              <p className="text-white/80 mt-6 max-w-2xl mx-auto text-center">
                Stay updated with BOSAN's upcoming events, conferences, and professional development opportunities.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Events Tabs */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-10">
                <TabsTrigger value="upcoming" className="text-base">Upcoming Events</TabsTrigger>
                <TabsTrigger value="past" className="text-base">Past Events</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming">
                {upcomingLoading ? (
                  renderLoading()
                ) : upcomingError ? (
                  renderError("Failed to load upcoming events")
                ) : !upcomingEvents || upcomingEvents.length === 0 ? (
                  renderEmpty("There are no upcoming events scheduled at this time. Please check back later.")
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingEvents.map(renderEventCard)}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="past">
                {pastLoading ? (
                  renderLoading()
                ) : pastError ? (
                  renderError("Failed to load past events")
                ) : !pastEvents || pastEvents.length === 0 ? (
                  renderEmpty("There are no past events to display.")
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pastEvents.map(renderEventCard)}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <CallToAction />
      </div>
      <Footer />
    </div>
  );
};

export default EventsPage;
