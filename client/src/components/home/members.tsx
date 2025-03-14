import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

interface Member {
  id: number;
  fullName: string;
  specialty: string;
  yearElevated: string;
  profileImage: string;
}

const Members = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: members, isLoading, error } = useQuery<Member[]>({
    queryKey: ["/api/members"],
  });
  
  const filteredMembers = members?.filter((member) => 
    member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.specialty?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-[#0F2C59] font-playfair font-bold text-3xl md:text-4xl mb-4">Our Distinguished Members</h2>
            <div className="h-1 w-20 bg-[#D4AF37] mx-auto"></div>
            <p className="text-[#343A40]/80 mt-6 max-w-2xl mx-auto">BOSAN consists of Nigeria's most accomplished legal practitioners who have been conferred with the rank of Senior Advocate of Nigeria (SAN).</p>
          </div>
          
          <div className="mb-8">
            <div className="relative max-w-md mx-auto md:max-w-lg">
              <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4 text-center">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto mb-3"></div>
                  <div className="flex justify-center space-x-3">
                    <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                    <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  
  if (error || !members) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-[#0F2C59] font-playfair font-bold text-3xl md:text-4xl mb-4">Our Distinguished Members</h2>
            <div className="h-1 w-20 bg-[#D4AF37] mx-auto"></div>
            <p className="text-[#343A40]/80 mt-6 max-w-2xl mx-auto">BOSAN consists of Nigeria's most accomplished legal practitioners who have been conferred with the rank of Senior Advocate of Nigeria (SAN).</p>
          </div>
          
          <div className="text-center py-10">
            <p className="text-gray-500">Unable to load member information. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="members" className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-[#0F2C59] font-playfair font-bold text-3xl md:text-4xl mb-4">Our Distinguished Members</h2>
          <div className="h-1 w-20 bg-[#D4AF37] mx-auto"></div>
          <p className="text-[#343A40]/80 mt-6 max-w-2xl mx-auto">BOSAN consists of Nigeria's most accomplished legal practitioners who have been conferred with the rank of Senior Advocate of Nigeria (SAN).</p>
        </motion.div>
        
        <div className="mb-8">
          <div className="relative max-w-md mx-auto md:max-w-lg">
            <Input
              type="text" 
              placeholder="Search for a member..." 
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
        
        {filteredMembers?.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500">No members found matching your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredMembers?.slice(0, 4).map((member) => (
              <motion.div 
                key={member.id}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              >
                <div className="h-48 overflow-hidden">
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
        )}
        
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <Link href="/members">
            <Button className="bg-transparent border border-[#0F2C59] text-[#0F2C59] font-montserrat font-medium py-2 px-6 rounded-md hover:bg-[#0F2C59] hover:text-white transition duration-300">
              View All Members
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Members;
