import { useQuery } from "@tanstack/react-query";
import { Resource } from "@shared/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { FileText, Download, Loader2 } from "lucide-react";
import { format } from "date-fns";

const Resources = () => {
  const { data: resources, isLoading, error } = useQuery<Resource[]>({
    queryKey: ["/api/resources"],
  });
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-[#0F2C59] font-playfair">Exclusive Resources</CardTitle>
          <CardDescription>Access member-only documents and resources</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-[#0F2C59]" />
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-[#0F2C59] font-playfair">Exclusive Resources</CardTitle>
          <CardDescription>Access member-only documents and resources</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Failed to load resources. Please try again later.</p>
        </CardContent>
      </Card>
    );
  }
  
  if (!resources || resources.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-[#0F2C59] font-playfair">Exclusive Resources</CardTitle>
          <CardDescription>Access member-only documents and resources</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-10">
            <FileText className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-center">No resources available at this time.</p>
            <p className="text-gray-400 text-sm text-center mt-1">Check back later for new resources.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-[#0F2C59] font-playfair">Exclusive Resources</CardTitle>
          <CardDescription>Access member-only documents and resources</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.map((resource, index) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start">
                  <div className="p-2 bg-[#0F2C59]/10 rounded-md mr-3">
                    <FileText className="h-6 w-6 text-[#0F2C59]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-[#0F2C59]">{resource.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{resource.description}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-gray-400">
                        Added: {format(new Date(resource.createdAt), 'MMM dd, yyyy')}
                      </span>
                      <a 
                        href={resource.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-[#750E21] hover:underline"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Resources;
