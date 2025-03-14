import { useQuery } from "@tanstack/react-query";
import { Event } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const Events = () => {
  const { data: events, isLoading, error } = useQuery<Event[]>({
    queryKey: ["/api/events/upcoming"],
  });
  
  const { user } = useAuth();
  const { toast } = useToast();
  const [registering, setRegistering] = useState<number | null>(null);
  
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
  
  if (isLoading) {
    return (
      <section className="py-16 bg-[#F8F9FA]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-[#0F2C59] font-playfair font-bold text-3xl md:text-4xl mb-4">Events & Conferences</h2>
            <div className="h-1 w-20 bg-[#D4AF37] mx-auto"></div>
            <p className="text-[#343A40]/80 mt-6 max-w-2xl mx-auto">Stay updated with BOSAN's upcoming events, conferences, and professional development opportunities.</p>
          </div>
          
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-playfair text-2xl font-bold text-[#0F2C59]">Upcoming Events</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  
  if (error || !events || events.length === 0) {
    return (
      <section className="py-16 bg-[#F8F9FA]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-[#0F2C59] font-playfair font-bold text-3xl md:text-4xl mb-4">Events & Conferences</h2>
            <div className="h-1 w-20 bg-[#D4AF37] mx-auto"></div>
            <p className="text-[#343A40]/80 mt-6 max-w-2xl mx-auto">Stay updated with BOSAN's upcoming events, conferences, and professional development opportunities.</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 mb-4">No upcoming events at this time.</p>
            <p className="text-gray-500">Please check back later for new events.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="events" className="py-16 bg-[#F8F9FA]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-[#0F2C59] font-playfair font-bold text-3xl md:text-4xl mb-4">Events & Conferences</h2>
          <div className="h-1 w-20 bg-[#D4AF37] mx-auto"></div>
          <p className="text-[#343A40]/80 mt-6 max-w-2xl mx-auto">Stay updated with BOSAN's upcoming events, conferences, and professional development opportunities.</p>
        </motion.div>
        
        <div className="flex justify-between items-center mb-8">
          <h3 className="font-playfair text-2xl font-bold text-[#0F2C59]">Upcoming Events</h3>
          <div className="flex space-x-2">
            <button className="text-[#0F2C59] hover:text-[#D4AF37] transition duration-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="text-[#0F2C59] hover:text-[#D4AF37] transition duration-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
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
                  <Button 
                    className="w-full bg-[#0F2C59] text-white py-2 rounded hover:bg-opacity-90 transition duration-300 flex items-center justify-center"
                    onClick={() => handleRegister(event.id)}
                    disabled={registering === event.id}
                  >
                    <span>{registering === event.id ? "Registering..." : "Register Now"}</span>
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <Link href="/events">
            <Button className="bg-transparent border border-[#0F2C59] text-[#0F2C59] font-montserrat font-medium py-2 px-6 rounded-md hover:bg-[#0F2C59] hover:text-white transition duration-300">
              View All Events
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Events;
