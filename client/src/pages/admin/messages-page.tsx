import { useState } from "react";
import AdminLayout from "@/components/admin/admin-layout";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ContactMessage } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Loader2, 
  Trash, 
  CheckCircle, 
  Mail, 
  Eye, 
  MessageSquare 
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function AdminMessagesPage() {
  const [isViewMessageOpen, setIsViewMessageOpen] = useState(false);
  const [isDeleteMessageOpen, setIsDeleteMessageOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const { toast } = useToast();

  // Fetch all contact messages
  const { data: messages, isLoading } = useQuery<ContactMessage[]>({
    queryKey: ["/api/admin/contact-messages"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/admin/contact-messages");
      return await res.json();
    },
  });

  // Mark message as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("PATCH", `/api/admin/contact-messages/${id}`, { isRead: true });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contact-messages"] });
      toast({
        title: "Success",
        description: "Message marked as read",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update message status",
        variant: "destructive",
      });
    },
  });

  // Delete message mutation
  const deleteMessageMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/admin/contact-messages/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contact-messages"] });
      setIsDeleteMessageOpen(false);
      toast({
        title: "Success",
        description: "Message deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete message",
        variant: "destructive",
      });
    },
  });

  const handleMarkAsRead = (id: number) => {
    markAsReadMutation.mutate(id);
  };

  const handleDeleteMessage = () => {
    if (selectedMessage) {
      deleteMessageMutation.mutate(selectedMessage.id);
    }
  };

  const openViewDialog = (message: ContactMessage) => {
    setSelectedMessage(message);
    
    // Mark as read when opened
    if (!message.isRead) {
      handleMarkAsRead(message.id);
    }
    
    setIsViewMessageOpen(true);
  };

  const openDeleteDialog = (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsDeleteMessageOpen(true);
  };

  const formatDate = (date: Date) => {
    return format(new Date(date), "MMMM d, yyyy 'at' h:mm a");
  };

  return (
    <AdminLayout activeTab="messages">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-[#0F2C59]">Contact Messages</h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-[#0F2C59]" />
          </div>
        ) : messages && messages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {messages.map((message) => (
              <Card 
                key={message.id} 
                className={`overflow-hidden ${!message.isRead ? 'border-blue-300 bg-blue-50/30' : ''}`}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2 text-[#0F2C59]" />
                      <span className="font-medium">{message.name}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(message.createdAt)}
                    </div>
                  </div>
                  <CardTitle className="text-lg font-playfair text-[#0F2C59]">
                    {message.subject}
                    {!message.isRead && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        New
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Mail className="h-4 w-4 mr-1" /> 
                    <span>{message.email}</span>
                  </div>
                  <div className="text-sm line-clamp-2">
                    {message.message}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end pt-2 pb-4">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openViewDialog(message)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                    {!message.isRead && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleMarkAsRead(message.id)}
                        disabled={markAsReadMutation.isPending}
                      >
                        {markAsReadMutation.isPending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle className="mr-2 h-4 w-4" />
                        )}
                        Mark as Read
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => openDeleteDialog(message)}
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
            <p className="text-gray-500">No contact messages found</p>
          </div>
        )}
      </div>

      {/* View Message Dialog */}
      <Dialog open={isViewMessageOpen} onOpenChange={setIsViewMessageOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{selectedMessage?.subject}</DialogTitle>
            <DialogDescription>
              From: {selectedMessage?.name} ({selectedMessage?.email})
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2 space-y-4">
            <div className="text-sm text-gray-500">
              Received on {selectedMessage && formatDate(selectedMessage.createdAt)}
            </div>
            <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">
              {selectedMessage?.message}
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsViewMessageOpen(false)}
            >
              Close
            </Button>
            <a 
              href={`mailto:${selectedMessage?.email}`}
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button type="button">
                <Mail className="mr-2 h-4 w-4" />
                Reply via Email
              </Button>
            </a>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Message Dialog */}
      <Dialog open={isDeleteMessageOpen} onOpenChange={setIsDeleteMessageOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this message from {selectedMessage?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteMessageOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteMessage}
              disabled={deleteMessageMutation.isPending}
            >
              {deleteMessageMutation.isPending && (
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