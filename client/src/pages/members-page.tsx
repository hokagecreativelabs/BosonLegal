import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CallToAction from "@/components/home/call-to-action";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface Member {
  id: number;
  fullName: string;
  specialty: string;
  yearElevated: string;
  profileImage: string;
}

const MembersPage = () => {
  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const membersPerPage = 12;

  const { data: members, isLoading, error } = useQuery<Member[]>({
    queryKey: ["/api/members"],
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const filteredMembers = members?.filter((member) =>
    member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (member.specialty?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Pagination
  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = filteredMembers?.slice(indexOfFirstMember, indexOfLastMember);
  const totalPages = filteredMembers ? Math.ceil(filteredMembers.length / membersPerPage) : 0;

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-center space-x-2 mt-12">
        <button
          onClick={() => currentPage > 1 && paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${
            currentPage === 1
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-[#0F2C59] text-white hover:bg-[#0F2C59]/90"
          }`}
        >
          Previous
        </button>
        
        <div className="flex space-x-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`w-10 h-10 rounded-full ${
                currentPage === i + 1
                  ? "bg-[#D4AF37] text-white"
                  : "bg-gray-200 text-[#0F2C59] hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
        
        <button
          onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded ${
            currentPage === totalPages
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-[#0F2C59] text-white hover:bg-[#0F2C59]/90"
          }`}
        >
          Next
        </button>
      </div>
    );
  };

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
              <h1 className="text-white font-playfair text-3xl md:text-4xl font-bold mb-4 text-center">Our Distinguished Members</h1>
              <div className="h-1 w-20 bg-[#D4AF37] mx-auto"></div>
              <p className="text-white/80 mt-6 max-w-2xl mx-auto text-center">
                BOSAN consists of Nigeria's most accomplished legal practitioners who have been conferred with the rank of Senior Advocate of Nigeria (SAN).
              </p>
            </motion.div>
          </div>
        </section>

        {/* Members Directory */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Search Bar */}
            <div className="mb-12">
              <div className="relative max-w-md mx-auto md:max-w-lg">
                <Input
                  type="text"
                  placeholder="Search for a member by name or specialty..."
                  className="w-full py-3 px-4 pl-10 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F2C59]"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Members Grid */}
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-10 w-10 animate-spin text-[#0F2C59]" />
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <svg className="w-12 h-12 mx-auto text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Members</h3>
                <p className="text-gray-500">Unable to load member information. Please try again later.</p>
              </div>
            ) : !filteredMembers || filteredMembers.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Members Found</h3>
                <p className="text-gray-500">No members match your search criteria. Please try a different search term.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {currentMembers?.map((member, index) => (
                    <motion.div
                      key={member.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-all duration-300"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                    >
                      <div className="h-60 overflow-hidden">
                        <img
                          src={member.profileImage || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"}
                          alt={member.fullName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4 text-center">
                        <h4 className="font-playfair font-bold text-[#0F2C59] text-xl">{member.fullName}</h4>
                        <p className="text-[#750E21] font-medium mb-2">{member.specialty || "Legal Practitioner"}</p>
                        <p className="text-[#343A40]/70 text-sm mb-3">{member.yearElevated ? `Elevated to SAN in ${member.yearElevated}` : ""}</p>
                        <div className="flex justify-center space-x-3">
                          <a href="#" className="text-[#0F2C59] hover:text-[#D4AF37] transition duration-300">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                          </a>
                          <a href="#" className="text-[#0F2C59] hover:text-[#D4AF37] transition duration-300">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {renderPagination()}
              </>
            )}
          </div>
        </section>

        <CallToAction />
      </div>
      <Footer />
    </div>
  );
};

export default MembersPage;
