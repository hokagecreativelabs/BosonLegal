import { useState } from "react";
import AdminLayout from "@/components/admin/admin-layout";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Announcement, insertAnnouncementSchema } from "@shared/schema";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Loader2, 
  Edit, 
  Trash, 
  Megaphone, 
  Plus, 
  Calendar, 
  AlertCircle 
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

// Create announcement form schema
const announcementFormSchema = insertAnnouncementSchema;

type AnnouncementFormValues = z.infer<typeof announcementFormSchema>;

export default function AdminAnnouncementsPage() {
  const [isAddAnnouncementOpen, setIsAddAnnouncementOpen] = useState(false);
  const [isEditAnnouncementOpen, setIsEditAnnouncementOpen] = useState(false);
  const [isDeleteAnnouncementOpen, setIsDeleteAnnouncementOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const { toast } = useToast();

  // Fetch all announcements
  const { data: announcements, isLoading } = useQuery<Announcement[]>({
    queryKey: ["/api/announcements"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/announcements");
      return await res.json();
    },
  });

  // Add announcement mutation
  const addAnnouncementMutation = useMutation({
    mutationFn: async (data: AnnouncementFormValues) => {
      const res = await apiRequest("POST", "/api/admin/announcements", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/announcements"] });
      setIsAddAnnouncementOpen(false);
      toast({
        title: "Success",
        description: "Announcement added successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add announcement",
        variant: "destructive",
      });
    },
  });

  // Edit announcement mutation
  const editAnnouncementMutation = useMutation({
    mutationFn: async (data: Partial<Announcement> & { id: number }) => {
      const res = await apiRequest("PATCH", `/api/admin/announcements/${data.id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/announcements"] });
      setIsEditAnnouncementOpen(false);
      toast({
        title: "Success",
        description: "Announcement updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update announcement",
        variant: "destructive",
      });
    },
  });

  // Delete announcement mutation
  const deleteAnnouncementMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/admin/announcements/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/announcements"] });
      setIsDeleteAnnouncementOpen(false);
      toast({
        title: "Success",
        description: "Announcement deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete announcement",
        variant: "destructive",
      });
    },
  });

  // Form for adding new announcements
  const addForm = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementFormSchema),
    defaultValues: {
      title: "",
      content: "",
      type: "General",
      isImportant: false,
      link: "",
    },
  });

  // Form for editing announcements
  const editForm = useForm<Partial<AnnouncementFormValues>>({
    resolver: zodResolver(announcementFormSchema.partial()),
    defaultValues: {
      title: "",
      content: "",
      type: "",
      isImportant: false,
      link: "",
    },
  });

  const handleAddAnnouncement = (data: AnnouncementFormValues) => {
    addAnnouncementMutation.mutate(data);
  };

  const handleEditAnnouncement = (data: Partial<AnnouncementFormValues>) => {
    if (selectedAnnouncement) {
      editAnnouncementMutation.mutate({
        id: selectedAnnouncement.id,
        ...data,
      });
    }
  };

  const handleDeleteAnnouncement = () => {
    if (selectedAnnouncement) {
      deleteAnnouncementMutation.mutate(selectedAnnouncement.id);
    }
  };

  const openEditDialog = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    editForm.reset({
      title: announcement.title,
      content: announcement.content,
      type: announcement.type,
      isImportant: announcement.isImportant,
      link: announcement.link || "",
    });
    setIsEditAnnouncementOpen(true);
  };

  const openDeleteDialog = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setIsDeleteAnnouncementOpen(true);
  };

  const formatDate = (date: Date) => {
    return format(new Date(date), "MMMM d, yyyy");
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Event":
        return <Calendar className="h-4 w-4 mr-1" />;
      case "Important":
      case "Urgent":
        return <AlertCircle className="h-4 w-4 mr-1" />;
      default:
        return <Megaphone className="h-4 w-4 mr-1" />;
    }
  };

  const getTypeColor = (type: string, isImportant: boolean) => {
    if (isImportant) {
      return "bg-red-100 text-red-800";
    }
    
    const colors: { [key: string]: string } = {
      "General": "bg-blue-100 text-blue-800",
      "Event": "bg-green-100 text-green-800",
      "News": "bg-purple-100 text-purple-800",
      "Update": "bg-amber-100 text-amber-800",
      "Urgent": "bg-red-100 text-red-800",
      "Important": "bg-red-100 text-red-800",
    };
    
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  return (
    <AdminLayout activeTab="announcements">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-[#0F2C59]">Manage Announcements</h2>
          <Button
            onClick={() => setIsAddAnnouncementOpen(true)}
            className="bg-[#0F2C59] hover:bg-[#0F2C59]/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Announcement
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-[#0F2C59]" />
          </div>
        ) : announcements && announcements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {announcements.map((announcement) => (
              <Card key={announcement.id} className={`overflow-hidden ${announcement.isImportant ? 'border-red-300' : ''}`}>
                <CardHeader className="bg-gray-50 pb-2">
                  <div className="flex justify-between items-start mb-2">
                    <Badge className={`${getTypeColor(announcement.type, announcement.isImportant)} flex items-center`}>
                      {getTypeIcon(announcement.type)} {announcement.type}
                      {announcement.isImportant && <span className="ml-1">(Important)</span>}
                    </Badge>
                    <div className="text-xs text-gray-500">
                      {formatDate(announcement.createdAt)}
                    </div>
                  </div>
                  <CardTitle className="text-lg font-playfair text-[#0F2C59]">
                    {announcement.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="text-sm line-clamp-3">
                    {announcement.content}
                  </div>
                  {announcement.link && (
                    <div className="mt-2">
                      <a 
                        href={announcement.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#0F2C59] text-sm font-medium hover:underline inline-flex items-center"
                      >
                        More information
                      </a>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end pt-2 pb-4">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(announcement)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => openDeleteDialog(announcement)}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No announcements found</p>
            <Button
              onClick={() => setIsAddAnnouncementOpen(true)}
              variant="outline"
              className="mt-4"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add your first announcement
            </Button>
          </div>
        )}
      </div>

      {/* Add Announcement Dialog */}
      <Dialog open={isAddAnnouncementOpen} onOpenChange={setIsAddAnnouncementOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add New Announcement</DialogTitle>
            <DialogDescription>
              Create a new announcement for BOSAN members
            </DialogDescription>
          </DialogHeader>
          <Form {...addForm}>
            <form onSubmit={addForm.handleSubmit(handleAddAnnouncement)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={addForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Annual Conference Registration Open" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addForm.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <select
                          className="w-full p-2 border rounded-md"
                          {...field}
                        >
                          <option value="General">General</option>
                          <option value="Event">Event</option>
                          <option value="News">News</option>
                          <option value="Update">Update</option>
                          <option value="Important">Important</option>
                          <option value="Urgent">Urgent</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addForm.control}
                  name="isImportant"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-end space-x-2 rounded-md border p-2">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4 rounded border-gray-300 text-[#0F2C59] focus:ring-[#0F2C59]"
                        />
                      </FormControl>
                      <FormLabel className="m-0">Mark as Important</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={addForm.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Details of the announcement..." 
                          className="min-h-32" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addForm.control}
                  name="link"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Link (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/more-info" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddAnnouncementOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#0F2C59] hover:bg-[#0F2C59]/90"
                  disabled={addAnnouncementMutation.isPending}
                >
                  {addAnnouncementMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Add Announcement
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Announcement Dialog */}
      <Dialog open={isEditAnnouncementOpen} onOpenChange={setIsEditAnnouncementOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Announcement</DialogTitle>
            <DialogDescription>
              Update the details for this announcement
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditAnnouncement)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Annual Conference Registration Open" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <select
                          className="w-full p-2 border rounded-md"
                          {...field}
                        >
                          <option value="General">General</option>
                          <option value="Event">Event</option>
                          <option value="News">News</option>
                          <option value="Update">Update</option>
                          <option value="Important">Important</option>
                          <option value="Urgent">Urgent</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="isImportant"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-end space-x-2 rounded-md border p-2">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4 rounded border-gray-300 text-[#0F2C59] focus:ring-[#0F2C59]"
                        />
                      </FormControl>
                      <FormLabel className="m-0">Mark as Important</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Details of the announcement..." 
                          className="min-h-32" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="link"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Link (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/more-info" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditAnnouncementOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#0F2C59] hover:bg-[#0F2C59]/90"
                  disabled={editAnnouncementMutation.isPending}
                >
                  {editAnnouncementMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Announcement Dialog */}
      <Dialog open={isDeleteAnnouncementOpen} onOpenChange={setIsDeleteAnnouncementOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the announcement "{selectedAnnouncement?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteAnnouncementOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAnnouncement}
              disabled={deleteAnnouncementMutation.isPending}
            >
              {deleteAnnouncementMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}