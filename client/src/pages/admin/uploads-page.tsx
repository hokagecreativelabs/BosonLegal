import { useState } from "react";
import AdminLayout from "@/components/admin/admin-layout";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Loader2, 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  File, 
  Trash,
  CheckCircle,
  X
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

// Define schemas for the upload forms
const documentUploadSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  fileUrl: z.string().url("A valid URL is required").min(1, "File URL is required"),
  category: z.string().min(1, "Category is required"),
});

const eventImageUploadSchema = z.object({
  title: z.string().min(1, "Title is required"),
  eventId: z.string().min(1, "Event selection is required"),
  imageUrl: z.string().url("A valid URL is required").min(1, "Image URL is required"),
});

const profileImageUploadSchema = z.object({
  memberId: z.string().min(1, "Member selection is required"),
  imageUrl: z.string().url("A valid URL is required").min(1, "Image URL is required"),
});

// Type definitions for form values
type DocumentUploadFormValues = z.infer<typeof documentUploadSchema>;
type EventImageUploadFormValues = z.infer<typeof eventImageUploadSchema>;
type ProfileImageUploadFormValues = z.infer<typeof profileImageUploadSchema>;

// Type definition for upload record
interface UploadRecord {
  id: number;
  type: string;
  title: string;
  url: string;
  uploadedAt: Date;
  status: string;
}

export default function AdminUploadsPage() {
  const [activeTab, setActiveTab] = useState("documents");
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedUpload, setSelectedUpload] = useState<UploadRecord | null>(null);
  const { toast } = useToast();

  // Mock upload records for demonstration
  const mockUploads: UploadRecord[] = [
    {
      id: 1,
      type: "document",
      title: "Annual Report 2023",
      url: "https://example.com/reports/annual-2023.pdf",
      uploadedAt: new Date(2023, 10, 15),
      status: "success"
    },
    {
      id: 2,
      type: "image",
      title: "Conference Banner",
      url: "https://example.com/images/conf-banner.jpg",
      uploadedAt: new Date(2023, 11, 5),
      status: "success"
    },
    {
      id: 3,
      type: "document",
      title: "Meeting Minutes",
      url: "https://example.com/docs/minutes-nov.pdf",
      uploadedAt: new Date(2023, 10, 30),
      status: "success"
    }
  ];

  // Fetch member data for the profile image upload form
  const { data: members, isLoading: isMembersLoading } = useQuery({
    queryKey: ["/api/admin/members"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/admin/members");
      return await res.json();
    },
  });

  // Fetch event data for the event image upload form
  const { data: events, isLoading: isEventsLoading } = useQuery({
    queryKey: ["/api/events"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/events");
      return await res.json();
    },
  });

  // Document upload form
  const documentForm = useForm<DocumentUploadFormValues>({
    resolver: zodResolver(documentUploadSchema),
    defaultValues: {
      title: "",
      description: "",
      fileUrl: "",
      category: "Legal Document",
    },
  });

  // Event image upload form
  const eventImageForm = useForm<EventImageUploadFormValues>({
    resolver: zodResolver(eventImageUploadSchema),
    defaultValues: {
      title: "",
      eventId: "",
      imageUrl: "",
    },
  });

  // Profile image upload form
  const profileImageForm = useForm<ProfileImageUploadFormValues>({
    resolver: zodResolver(profileImageUploadSchema),
    defaultValues: {
      memberId: "",
      imageUrl: "",
    },
  });

  // Document upload mutation
  const documentUploadMutation = useMutation({
    mutationFn: async (data: DocumentUploadFormValues) => {
      const res = await apiRequest("POST", "/api/admin/resources", {
        title: data.title,
        description: data.description,
        fileUrl: data.fileUrl,
        category: data.category,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resources"] });
      documentForm.reset();
      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to upload document",
        variant: "destructive",
      });
    },
  });

  // Event image upload mutation
  const eventImageMutation = useMutation({
    mutationFn: async (data: EventImageUploadFormValues) => {
      const res = await apiRequest("PATCH", `/api/admin/events/${data.eventId}`, {
        image: data.imageUrl,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      eventImageForm.reset();
      toast({
        title: "Success",
        description: "Event image uploaded successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to upload event image",
        variant: "destructive",
      });
    },
  });

  // Profile image upload mutation
  const profileImageMutation = useMutation({
    mutationFn: async (data: ProfileImageUploadFormValues) => {
      const res = await apiRequest("PATCH", `/api/admin/members/${data.memberId}`, {
        profileImage: data.imageUrl,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/members"] });
      profileImageForm.reset();
      toast({
        title: "Success",
        description: "Profile image uploaded successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to upload profile image",
        variant: "destructive",
      });
    },
  });

  // Handle document upload
  const handleDocumentUpload = (data: DocumentUploadFormValues) => {
    documentUploadMutation.mutate(data);
  };

  // Handle event image upload
  const handleEventImageUpload = (data: EventImageUploadFormValues) => {
    eventImageMutation.mutate(data);
  };

  // Handle profile image upload
  const handleProfileImageUpload = (data: ProfileImageUploadFormValues) => {
    profileImageMutation.mutate(data);
  };

  const handleDeleteUpload = (upload: UploadRecord) => {
    setSelectedUpload(upload);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDeleteUpload = () => {
    if (selectedUpload) {
      // Delete upload logic would go here
      toast({
        title: "Success",
        description: `${selectedUpload.title} deleted successfully`,
      });
      setIsDeleteConfirmOpen(false);
    }
  };

  return (
    <AdminLayout activeTab="uploads">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-[#0F2C59]">Media Uploads</h2>
        </div>

        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="documents" className="flex gap-2">
              <FileText className="h-4 w-4" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="event-images" className="flex gap-2">
              <ImageIcon className="h-4 w-4" />
              Event Images
            </TabsTrigger>
            <TabsTrigger value="profile-images" className="flex gap-2">
              <ImageIcon className="h-4 w-4" />
              Profile Images
            </TabsTrigger>
            <TabsTrigger value="recent-uploads" className="flex gap-2">
              <Upload className="h-4 w-4" />
              Recent Uploads
            </TabsTrigger>
          </TabsList>
          
          {/* Documents Upload Tab */}
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upload Legal Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...documentForm}>
                  <form onSubmit={documentForm.handleSubmit(handleDocumentUpload)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={documentForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormLabel>Document Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Annual Report 2023" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={documentForm.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem className="col-span-2 md:col-span-1">
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                              <select
                                className="w-full p-2 border rounded-md"
                                {...field}
                              >
                                <option value="Legal Document">Legal Document</option>
                                <option value="Journal">Journal</option>
                                <option value="Newsletter">Newsletter</option>
                                <option value="Publication">Publication</option>
                                <option value="Report">Report</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={documentForm.control}
                        name="fileUrl"
                        render={({ field }) => (
                          <FormItem className="col-span-2 md:col-span-1">
                            <FormLabel>Document URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://example.com/file.pdf" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={documentForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Brief description of the document" 
                                className="min-h-20" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="bg-[#0F2C59] hover:bg-[#0F2C59]/90"
                      disabled={documentUploadMutation.isPending}
                    >
                      {documentUploadMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="mr-2 h-4 w-4" />
                      )}
                      Upload Document
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Event Images Upload Tab */}
          <TabsContent value="event-images">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upload Event Images</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...eventImageForm}>
                  <form onSubmit={eventImageForm.handleSubmit(handleEventImageUpload)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={eventImageForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormLabel>Image Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Conference Banner" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={eventImageForm.control}
                        name="eventId"
                        render={({ field }) => (
                          <FormItem className="col-span-2 md:col-span-1">
                            <FormLabel>Select Event</FormLabel>
                            <FormControl>
                              <select
                                className="w-full p-2 border rounded-md"
                                {...field}
                                disabled={isEventsLoading}
                              >
                                <option value="">Select an event</option>
                                {events?.map((event) => (
                                  <option key={event.id} value={event.id}>
                                    {event.title}
                                  </option>
                                ))}
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={eventImageForm.control}
                        name="imageUrl"
                        render={({ field }) => (
                          <FormItem className="col-span-2 md:col-span-1">
                            <FormLabel>Image URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://example.com/image.jpg" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="bg-[#0F2C59] hover:bg-[#0F2C59]/90"
                      disabled={eventImageMutation.isPending}
                    >
                      {eventImageMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="mr-2 h-4 w-4" />
                      )}
                      Upload Event Image
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Profile Images Upload Tab */}
          <TabsContent value="profile-images">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upload Member Profile Images</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...profileImageForm}>
                  <form onSubmit={profileImageForm.handleSubmit(handleProfileImageUpload)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={profileImageForm.control}
                        name="memberId"
                        render={({ field }) => (
                          <FormItem className="col-span-2 md:col-span-1">
                            <FormLabel>Select Member</FormLabel>
                            <FormControl>
                              <select
                                className="w-full p-2 border rounded-md"
                                {...field}
                                disabled={isMembersLoading}
                              >
                                <option value="">Select a member</option>
                                {members?.map((member) => (
                                  <option key={member.id} value={member.id}>
                                    {member.fullName}
                                  </option>
                                ))}
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileImageForm.control}
                        name="imageUrl"
                        render={({ field }) => (
                          <FormItem className="col-span-2 md:col-span-1">
                            <FormLabel>Profile Image URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://example.com/profile.jpg" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="bg-[#0F2C59] hover:bg-[#0F2C59]/90"
                      disabled={profileImageMutation.isPending}
                    >
                      {profileImageMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="mr-2 h-4 w-4" />
                      )}
                      Upload Profile Image
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Recent Uploads Tab */}
          <TabsContent value="recent-uploads">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Uploads</CardTitle>
              </CardHeader>
              <CardContent>
                {mockUploads.length > 0 ? (
                  <div className="space-y-4">
                    {mockUploads.map((upload) => (
                      <div 
                        key={upload.id}
                        className="flex items-center justify-between p-4 border rounded-md hover:bg-gray-50"
                      >
                        <div className="flex items-center">
                          {upload.type === "document" ? (
                            <FileText className="h-8 w-8 text-blue-500 mr-4" />
                          ) : (
                            <ImageIcon className="h-8 w-8 text-green-500 mr-4" />
                          )}
                          <div>
                            <div className="font-medium">{upload.title}</div>
                            <div className="text-sm text-gray-500 mt-1">
                              Uploaded on {new Date(upload.uploadedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-green-100 text-green-800 flex items-center">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Success
                          </Badge>
                          <a
                            href={upload.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#0F2C59] hover:underline text-sm"
                          >
                            View
                          </a>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUpload(upload)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No recent uploads found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the upload "{selectedUpload?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteUpload} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}