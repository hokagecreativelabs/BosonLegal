import { useState } from "react";
import AdminLayout from "@/components/admin/admin-layout";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Resource, insertResourceSchema } from "@shared/schema";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Edit, Trash, Plus, FileText, Download, ExternalLink } from "lucide-react";
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

// Extend the resource schema for the form
const resourceFormSchema = insertResourceSchema.extend({
  category: z.string().min(1, "Category is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  fileUrl: z.string().min(1, "File URL is required"),
});

type ResourceFormValues = z.infer<typeof resourceFormSchema>;

export default function AdminResourcesPage() {
  const [isAddResourceOpen, setIsAddResourceOpen] = useState(false);
  const [isEditResourceOpen, setIsEditResourceOpen] = useState(false);
  const [isDeleteResourceOpen, setIsDeleteResourceOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const { toast } = useToast();

  // Fetch all resources
  const { data: resources, isLoading } = useQuery<Resource[]>({
    queryKey: ["/api/resources"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/resources");
      return await res.json();
    },
  });

  // Add resource mutation
  const addResourceMutation = useMutation({
    mutationFn: async (data: ResourceFormValues) => {
      const res = await apiRequest("POST", "/api/admin/resources", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resources"] });
      setIsAddResourceOpen(false);
      toast({
        title: "Success",
        description: "Resource added successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add resource",
        variant: "destructive",
      });
    },
  });

  // Edit resource mutation
  const editResourceMutation = useMutation({
    mutationFn: async (data: Partial<Resource> & { id: number }) => {
      const res = await apiRequest("PATCH", `/api/admin/resources/${data.id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resources"] });
      setIsEditResourceOpen(false);
      toast({
        title: "Success",
        description: "Resource updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update resource",
        variant: "destructive",
      });
    },
  });

  // Delete resource mutation
  const deleteResourceMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/admin/resources/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resources"] });
      setIsDeleteResourceOpen(false);
      toast({
        title: "Success",
        description: "Resource deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete resource",
        variant: "destructive",
      });
    },
  });

  // Form for adding new resources
  const addForm = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "Legal Document",
      fileUrl: "",
      thumbnail: "",
    },
  });

  // Form for editing resources
  const editForm = useForm<Partial<ResourceFormValues>>({
    resolver: zodResolver(resourceFormSchema.partial()),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      fileUrl: "",
      thumbnail: "",
    },
  });

  const handleAddResource = (data: ResourceFormValues) => {
    addResourceMutation.mutate(data);
  };

  const handleEditResource = (data: Partial<ResourceFormValues>) => {
    if (selectedResource) {
      editResourceMutation.mutate({
        id: selectedResource.id,
        ...data,
      });
    }
  };

  const handleDeleteResource = () => {
    if (selectedResource) {
      deleteResourceMutation.mutate(selectedResource.id);
    }
  };

  const openEditDialog = (resource: Resource) => {
    setSelectedResource(resource);
    editForm.reset({
      title: resource.title,
      description: resource.description,
      category: resource.category,
      fileUrl: resource.fileUrl,
      thumbnail: resource.thumbnail || "",
    });
    setIsEditResourceOpen(true);
  };

  const openDeleteDialog = (resource: Resource) => {
    setSelectedResource(resource);
    setIsDeleteResourceOpen(true);
  };

  const formatDate = (date: Date) => {
    return format(new Date(date), "MMMM d, yyyy");
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Legal Document": "bg-blue-100 text-blue-800",
      "Journal": "bg-green-100 text-green-800",
      "Newsletter": "bg-purple-100 text-purple-800",
      "Publication": "bg-amber-100 text-amber-800",
      "Report": "bg-rose-100 text-rose-800",
    };
    
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <AdminLayout activeTab="resources">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-[#0F2C59]">Manage Resources</h2>
          <Button
            onClick={() => setIsAddResourceOpen(true)}
            className="bg-[#0F2C59] hover:bg-[#0F2C59]/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Resource
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-[#0F2C59]" />
          </div>
        ) : resources && resources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resources.map((resource) => (
              <Card key={resource.id} className="overflow-hidden">
                <CardHeader className="bg-gray-50 pb-2">
                  <div className="flex justify-between items-start mb-2">
                    <Badge className={`${getCategoryColor(resource.category)}`}>
                      {resource.category}
                    </Badge>
                    <div className="text-xs text-gray-500">
                      Added on {formatDate(resource.createdAt)}
                    </div>
                  </div>
                  <CardTitle className="text-lg font-playfair text-[#0F2C59]">
                    {resource.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="text-sm line-clamp-2">
                      {resource.description}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <FileText className="h-4 w-4 mr-1" /> 
                      <span className="truncate max-w-[250px]">{resource.fileUrl.split('/').pop()}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2 pb-4">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(resource)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => openDeleteDialog(resource)}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                  <a 
                    href={resource.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex"
                  >
                    <Button size="sm" variant="secondary">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View
                    </Button>
                  </a>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No resources found</p>
            <Button
              onClick={() => setIsAddResourceOpen(true)}
              variant="outline"
              className="mt-4"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add your first resource
            </Button>
          </div>
        )}
      </div>

      {/* Add Resource Dialog */}
      <Dialog open={isAddResourceOpen} onOpenChange={setIsAddResourceOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add New Resource</DialogTitle>
            <DialogDescription>
              Upload a new resource for BOSAN members
            </DialogDescription>
          </DialogHeader>
          <Form {...addForm}>
            <form onSubmit={addForm.handleSubmit(handleAddResource)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={addForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="2023 Legal Practice Guidelines" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
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
                  control={addForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Brief description of the resource" 
                          className="min-h-20" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addForm.control}
                  name="fileUrl"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>File URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/document.pdf" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addForm.control}
                  name="thumbnail"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Thumbnail URL (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/thumbnail.jpg" {...field} />
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
                  onClick={() => setIsAddResourceOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#0F2C59] hover:bg-[#0F2C59]/90"
                  disabled={addResourceMutation.isPending}
                >
                  {addResourceMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Add Resource
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Resource Dialog */}
      <Dialog open={isEditResourceOpen} onOpenChange={setIsEditResourceOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Resource</DialogTitle>
            <DialogDescription>
              Update the details for {selectedResource?.title}
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditResource)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="2023 Legal Practice Guidelines" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
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
                  control={editForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Brief description of the resource" 
                          className="min-h-20" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="fileUrl"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>File URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/document.pdf" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="thumbnail"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Thumbnail URL (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/thumbnail.jpg" {...field} />
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
                  onClick={() => setIsEditResourceOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#0F2C59] hover:bg-[#0F2C59]/90"
                  disabled={editResourceMutation.isPending}
                >
                  {editResourceMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Resource Dialog */}
      <Dialog open={isDeleteResourceOpen} onOpenChange={setIsDeleteResourceOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the resource "{selectedResource?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteResourceOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteResource}
              disabled={deleteResourceMutation.isPending}
            >
              {deleteResourceMutation.isPending && (
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