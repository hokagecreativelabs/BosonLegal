import { useState } from "react";
import AdminLayout from "@/components/admin/admin-layout";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Event, insertEventSchema } from "@shared/schema";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Edit, Trash, Plus, CalendarPlus, CalendarX } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Extend the event schema for the form
const eventFormSchema = insertEventSchema.extend({
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

export default function AdminEventsPage() {
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isEditEventOpen, setIsEditEventOpen] = useState(false);
  const [isDeleteEventOpen, setIsDeleteEventOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [activeTab, setActiveTab] = useState("upcoming");
  const { toast } = useToast();

  // Fetch upcoming events
  const { data: upcomingEvents, isLoading: isUpcomingLoading } = useQuery<Event[]>({
    queryKey: ["/api/events/upcoming"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/events/upcoming");
      return await res.json();
    },
  });

  // Fetch past events
  const { data: pastEvents, isLoading: isPastLoading } = useQuery<Event[]>({
    queryKey: ["/api/events/past"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/events/past");
      return await res.json();
    },
  });

  // Add event mutation
  const addEventMutation = useMutation({
    mutationFn: async (data: EventFormValues) => {
      // Convert string date to Date object
      const eventData = {
        ...data,
        date: new Date(data.date),
        isPast: false,
      };
      const res = await apiRequest("POST", "/api/admin/events", eventData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events/upcoming"] });
      queryClient.invalidateQueries({ queryKey: ["/api/events/past"] });
      setIsAddEventOpen(false);
      toast({
        title: "Success",
        description: "Event added successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add event",
        variant: "destructive",
      });
    },
  });

  // Edit event mutation
  const editEventMutation = useMutation({
    mutationFn: async (data: Partial<Event> & { id: number }) => {
      // If date is string, convert to Date object
      const eventData = {
        ...data,
        date: typeof data.date === "string" ? new Date(data.date) : data.date,
      };
      const res = await apiRequest("PATCH", `/api/admin/events/${data.id}`, eventData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events/upcoming"] });
      queryClient.invalidateQueries({ queryKey: ["/api/events/past"] });
      setIsEditEventOpen(false);
      toast({
        title: "Success",
        description: "Event updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update event",
        variant: "destructive",
      });
    },
  });

  // Delete event mutation
  const deleteEventMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/admin/events/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events/upcoming"] });
      queryClient.invalidateQueries({ queryKey: ["/api/events/past"] });
      setIsDeleteEventOpen(false);
      toast({
        title: "Success",
        description: "Event deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete event",
        variant: "destructive",
      });
    },
  });

  // Move event to past
  const moveEventToPastMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("PATCH", `/api/admin/events/${id}`, { isPast: true });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events/upcoming"] });
      queryClient.invalidateQueries({ queryKey: ["/api/events/past"] });
      toast({
        title: "Success",
        description: "Event moved to past events",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to move event",
        variant: "destructive",
      });
    },
  });

  // Form for adding new events
  const addForm = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      venue: "",
      date: format(new Date(), "yyyy-MM-dd"),
      time: "10:00",
      image: "",
    },
  });

  // Form for editing events
  const editForm = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      venue: "",
      date: "",
      time: "",
      image: "",
    },
  });

  const handleAddEvent = (data: EventFormValues) => {
    addEventMutation.mutate(data);
  };

  const handleEditEvent = (data: EventFormValues) => {
    if (selectedEvent) {
      editEventMutation.mutate({
        id: selectedEvent.id,
        ...data,
      });
    }
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      deleteEventMutation.mutate(selectedEvent.id);
    }
  };

  const handleMoveEventToPast = (eventId: number) => {
    moveEventToPastMutation.mutate(eventId);
  };

  const openEditDialog = (event: Event) => {
    setSelectedEvent(event);
    
    // Format date for the input field (yyyy-MM-dd)
    const formattedDate = format(new Date(event.date), "yyyy-MM-dd");
    
    editForm.reset({
      title: event.title,
      description: event.description,
      venue: event.venue,
      date: formattedDate,
      time: event.time,
      image: event.image || "",
    });
    
    setIsEditEventOpen(true);
  };

  const openDeleteDialog = (event: Event) => {
    setSelectedEvent(event);
    setIsDeleteEventOpen(true);
  };

  const formatEventDate = (date: Date) => {
    return format(new Date(date), "MMMM d, yyyy");
  };

  return (
    <AdminLayout activeTab="events">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-[#0F2C59]">Manage Events</h2>
          <Button
            onClick={() => setIsAddEventOpen(true)}
            className="bg-[#0F2C59] hover:bg-[#0F2C59]/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Event
          </Button>
        </div>

        <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="upcoming" className="flex gap-2">
              <CalendarPlus className="h-4 w-4" />
              Upcoming Events
            </TabsTrigger>
            <TabsTrigger value="past" className="flex gap-2">
              <CalendarX className="h-4 w-4" />
              Past Events
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            {isUpcomingLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-[#0F2C59]" />
              </div>
            ) : upcomingEvents && upcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcomingEvents.map((event) => (
                  <Card key={event.id} className="overflow-hidden">
                    <CardHeader className="bg-gray-50 pb-2">
                      <CardTitle className="text-lg font-playfair text-[#0F2C59]">
                        {event.title}
                      </CardTitle>
                      <CardDescription>
                        {formatEventDate(event.date)} at {event.time}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="text-sm">
                          <span className="font-medium">Venue:</span> {event.venue}
                        </div>
                        <div className="text-sm line-clamp-2">
                          <span className="font-medium">Description:</span> {event.description}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2 pb-4">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(event)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => openDeleteDialog(event)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleMoveEventToPast(event.id)}
                        disabled={moveEventToPastMutation.isPending}
                      >
                        {moveEventToPastMutation.isPending && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Mark as Past
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No upcoming events found</p>
                <Button
                  onClick={() => setIsAddEventOpen(true)}
                  variant="outline"
                  className="mt-4"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add your first event
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past">
            {isPastLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-[#0F2C59]" />
              </div>
            ) : pastEvents && pastEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pastEvents.map((event) => (
                  <Card key={event.id} className="overflow-hidden">
                    <CardHeader className="bg-gray-50 pb-2">
                      <CardTitle className="text-lg font-playfair text-[#0F2C59]">
                        {event.title}
                      </CardTitle>
                      <CardDescription>
                        {formatEventDate(event.date)} at {event.time}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="text-sm">
                          <span className="font-medium">Venue:</span> {event.venue}
                        </div>
                        <div className="text-sm line-clamp-2">
                          <span className="font-medium">Description:</span> {event.description}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end pt-2 pb-4">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(event)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => openDeleteDialog(event)}
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
                <p className="text-gray-500">No past events found</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Event Dialog */}
      <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
            <DialogDescription>
              Create a new event for BOSAN members
            </DialogDescription>
          </DialogHeader>
          <Form {...addForm}>
            <form onSubmit={addForm.handleSubmit(handleAddEvent)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={addForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Event Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Annual Conference 2023" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addForm.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addForm.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <FormControl>
                        <Input placeholder="10:00 AM" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addForm.control}
                  name="venue"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Venue</FormLabel>
                      <FormControl>
                        <Input placeholder="Lagos Continental Hotel, Victoria Island" {...field} />
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
                          placeholder="Event details and information" 
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
                  name="image"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Image URL (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/event-image.jpg" {...field} />
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
                  onClick={() => setIsAddEventOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#0F2C59] hover:bg-[#0F2C59]/90"
                  disabled={addEventMutation.isPending}
                >
                  {addEventMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Add Event
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Event Dialog */}
      <Dialog open={isEditEventOpen} onOpenChange={setIsEditEventOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>
              Update the details for {selectedEvent?.title}
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditEvent)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Event Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Annual Conference 2023" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <FormControl>
                        <Input placeholder="10:00 AM" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="venue"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Venue</FormLabel>
                      <FormControl>
                        <Input placeholder="Lagos Continental Hotel, Victoria Island" {...field} />
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
                          placeholder="Event details and information" 
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
                  name="image"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Image URL (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/event-image.jpg" {...field} />
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
                  onClick={() => setIsEditEventOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#0F2C59] hover:bg-[#0F2C59]/90"
                  disabled={editEventMutation.isPending}
                >
                  {editEventMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Event Dialog */}
      <Dialog open={isDeleteEventOpen} onOpenChange={setIsDeleteEventOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the event "{selectedEvent?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteEventOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteEvent}
              disabled={deleteEventMutation.isPending}
            >
              {deleteEventMutation.isPending && (
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