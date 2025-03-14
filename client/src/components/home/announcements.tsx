import { useQuery } from "@tanstack/react-query";
import { Announcement } from "@shared/schema";
import { Link } from "wouter";
import { motion } from "framer-motion";

const Announcements = () => {
  const { data: announcements, isLoading, error } = useQuery<Announcement[]>({
    queryKey: ["/api/announcements"],
  });

  if (isLoading) {
    return (
      <section className="bg-[#F8F9FA] py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-4">
            <h2 className="text-[#0F2C59] font-playfair font-bold text-xl">Latest Announcements</h2>
            <div className="ml-4 h-[1px] bg-gray-300 flex-grow"></div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !announcements || announcements.length === 0) {
    return (
      <section className="bg-[#F8F9FA] py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-4">
            <h2 className="text-[#0F2C59] font-playfair font-bold text-xl">Latest Announcements</h2>
            <div className="ml-4 h-[1px] bg-gray-300 flex-grow"></div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-gray-300">
            <p className="text-gray-500">No announcements available at this time.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#F8F9FA] py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-4">
          <h2 className="text-[#0F2C59] font-playfair font-bold text-xl">Latest Announcements</h2>
          <div className="ml-4 h-[1px] bg-gray-300 flex-grow"></div>
        </div>
        
        {announcements.map((announcement) => (
          <motion.div 
            key={announcement.id}
            className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-[#D4AF37] mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-start">
              <div className="bg-[#0F2C59]/10 rounded-full p-2 mr-4">
                <svg className="w-5 h-5 text-[#0F2C59]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-montserrat font-semibold text-[#0F2C59]">{announcement.title}</h3>
                <p className="text-[#343A40]/80 mt-1">{announcement.content}</p>
                <div className="mt-2">
                  <Link href={`/announcements/${announcement.id}`}>
                    <a className="text-[#750E21] font-medium text-sm inline-flex items-center hover:text-opacity-80">
                      Learn More
                      <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Announcements;
