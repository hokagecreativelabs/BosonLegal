import { useState } from "react";
import AdminLayout from "@/components/admin/admin-layout";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { User, insertUserSchema } from "@shared/schema";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Edit, Trash, UserPlus } from "lucide-react";
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

// Extend the insertUserSchema for the form
const memberFormSchema = insertUserSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type MemberFormValues = z.infer<typeof memberFormSchema>;

export default function AdminMembersPage() {
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isEditMemberOpen, setIsEditMemberOpen] = useState(false);
  const [isDeleteMemberOpen, setIsDeleteMemberOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<User | null>(null);
  const { toast } = useToast();

  // Fetch all members
  const { data: members, isLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/members"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/admin/members");
      return await res.json();
    },
  });

  // Add member mutation
  const addMemberMutation = useMutation({
    mutationFn: async (data: MemberFormValues) => {
      const res = await apiRequest("POST", "/api/admin/members", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/members"] });
      setIsAddMemberOpen(false);
      toast({
        title: "Success",
        description: "Member added successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add member",
        variant: "destructive",
      });
    },
  });

  // Edit member mutation
  const editMemberMutation = useMutation({
    mutationFn: async (data: Partial<User>) => {
      const res = await apiRequest("PATCH", `/api/admin/members/${data.id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/members"] });
      setIsEditMemberOpen(false);
      toast({
        title: "Success",
        description: "Member updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update member",
        variant: "destructive",
      });
    },
  });

  // Delete member mutation
  const deleteMemberMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/admin/members/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/members"] });
      setIsDeleteMemberOpen(false);
      toast({
        title: "Success",
        description: "Member deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete member",
        variant: "destructive",
      });
    },
  });

  // Form for adding new members
  const addForm = useForm<MemberFormValues>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      specialty: "",
      yearElevated: "",
      role: "member",
    },
  });

  // Form for editing members
  const editForm = useForm<Partial<User>>({
    resolver: zodResolver(insertUserSchema.partial()),
    defaultValues: {
      fullName: "",
      email: "",
      specialty: "",
      yearElevated: "",
      profileImage: "",
    },
  });

  const handleAddMember = (data: MemberFormValues) => {
    // Remove confirmPassword as it's not needed in the API
    const { confirmPassword, ...memberData } = data;
    addMemberMutation.mutate(memberData);
  };

  const handleEditMember = (data: Partial<User>) => {
    if (selectedMember) {
      editMemberMutation.mutate({
        id: selectedMember.id,
        ...data,
      });
    }
  };

  const handleDeleteMember = () => {
    if (selectedMember) {
      deleteMemberMutation.mutate(selectedMember.id);
    }
  };

  const openEditDialog = (member: User) => {
    setSelectedMember(member);
    editForm.reset({
      fullName: member.fullName,
      email: member.email,
      specialty: member.specialty || "",
      yearElevated: member.yearElevated || "",
      profileImage: member.profileImage || "",
    });
    setIsEditMemberOpen(true);
  };

  const openDeleteDialog = (member: User) => {
    setSelectedMember(member);
    setIsDeleteMemberOpen(true);
  };

  return (
    <AdminLayout activeTab="members">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-[#0F2C59]">Manage Members</h2>
          <Button
            onClick={() => setIsAddMemberOpen(true)}
            className="bg-[#0F2C59] hover:bg-[#0F2C59]/90"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add Member
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-[#0F2C59]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members?.map((member) => (
              <Card key={member.id} className="overflow-hidden">
                <CardHeader className="bg-gray-50 pb-2">
                  <CardTitle className="text-lg font-playfair text-[#0F2C59]">
                    {member.fullName}
                  </CardTitle>
                  <CardDescription>{member.email}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="text-sm">
                      <span className="font-medium">Username:</span> {member.username}
                    </div>
                    {member.specialty && (
                      <div className="text-sm">
                        <span className="font-medium">Specialty:</span> {member.specialty}
                      </div>
                    )}
                    {member.yearElevated && (
                      <div className="text-sm">
                        <span className="font-medium">Year Elevated:</span> {member.yearElevated}
                      </div>
                    )}
                    <div className="text-sm">
                      <span className="font-medium">Role:</span>{" "}
                      <span className="capitalize">{member.role}</span>
                    </div>
                    <div className="flex space-x-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(member)}
                        className="flex-1"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => openDeleteDialog(member)}
                        className="flex-1"
                        disabled={member.role === "admin"} // Prevent deleting admin
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add Member Dialog */}
      <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add New Member</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new BOSAN member
            </DialogDescription>
          </DialogHeader>
          <Form {...addForm}>
            <form onSubmit={addForm.handleSubmit(handleAddMember)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={addForm.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="johndoe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addForm.control}
                  name="specialty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specialty</FormLabel>
                      <FormControl>
                        <Input placeholder="Constitutional Law" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addForm.control}
                  name="yearElevated"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year Elevated</FormLabel>
                      <FormControl>
                        <Input placeholder="2010" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <select
                          className="w-full p-2 border rounded-md"
                          {...field}
                        >
                          <option value="member">Member</option>
                          <option value="admin">Admin</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="******" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="******" {...field} />
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
                  onClick={() => setIsAddMemberOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#0F2C59] hover:bg-[#0F2C59]/90"
                  disabled={addMemberMutation.isPending}
                >
                  {addMemberMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Add Member
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Member Dialog */}
      <Dialog open={isEditMemberOpen} onOpenChange={setIsEditMemberOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Member</DialogTitle>
            <DialogDescription>
              Update the details for {selectedMember?.fullName}
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditMember)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="specialty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specialty</FormLabel>
                      <FormControl>
                        <Input placeholder="Constitutional Law" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="yearElevated"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year Elevated</FormLabel>
                      <FormControl>
                        <Input placeholder="2010" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="profileImage"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Profile Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image.jpg" {...field} />
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
                  onClick={() => setIsEditMemberOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#0F2C59] hover:bg-[#0F2C59]/90"
                  disabled={editMemberMutation.isPending}
                >
                  {editMemberMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Member Dialog */}
      <Dialog open={isDeleteMemberOpen} onOpenChange={setIsDeleteMemberOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedMember?.fullName}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteMemberOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteMember}
              disabled={deleteMemberMutation.isPending}
            >
              {deleteMemberMutation.isPending && (
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