import { useState } from "react";
import AdminLayout from "@/components/admin/admin-layout";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Payment, User } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Loader2, 
  ArrowDownUp, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  CreditCard,
  Search,
  Download,
  Filter,
  RefreshCw
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminPaymentsPage() {
  const [isViewPaymentOpen, setIsViewPaymentOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch all payments
  const { data: payments, isLoading, refetch } = useQuery<Payment[]>({
    queryKey: ["/api/admin/payments"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/admin/payments");
      return await res.json();
    },
  });

  // Fetch all users for member lookups
  const { data: users } = useQuery<User[]>({
    queryKey: ["/api/admin/members"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/admin/members");
      return await res.json();
    },
  });

  // Update payment status mutation
  const updatePaymentStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await apiRequest("PATCH", `/api/admin/payments/${id}`, { status });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/payments"] });
      toast({
        title: "Success",
        description: "Payment status updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update payment status",
        variant: "destructive",
      });
    },
  });

  const handleUpdatePaymentStatus = (id: number, status: string) => {
    updatePaymentStatusMutation.mutate({ id, status });
  };

  const openViewDialog = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsViewPaymentOpen(true);
  };

  const formatDate = (date: Date) => {
    return format(new Date(date), "MMMM d, yyyy");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      "pending": "bg-yellow-100 text-yellow-800",
      "successful": "bg-green-100 text-green-800",
      "failed": "bg-red-100 text-red-800",
      "refunded": "bg-purple-100 text-purple-800",
    };
    
    return colors[status.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "successful":
        return <CheckCircle2 className="h-4 w-4 mr-1" />;
      case "failed":
        return <XCircle className="h-4 w-4 mr-1" />;
      case "pending":
        return <Clock className="h-4 w-4 mr-1" />;
      case "refunded":
        return <ArrowDownUp className="h-4 w-4 mr-1" />;
      default:
        return <CreditCard className="h-4 w-4 mr-1" />;
    }
  };

  const getMemberName = (userId: number) => {
    const user = users?.find(user => user.id === userId);
    return user ? user.fullName : `User #${userId}`;
  };

  // Filter payments by search query and status
  const filteredPayments = payments?.filter(payment => {
    const memberName = getMemberName(payment.userId);
    const matchesSearch = 
      searchQuery === "" || 
      memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.purpose.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === null || payment.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout activeTab="payments">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-[#0F2C59]">Payment Transactions</h2>
          <Button
            variant="outline"
            onClick={() => refetch()}
            className="flex items-center"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Payments Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-sm text-gray-500">Successful</div>
                <div className="text-xl font-bold text-green-600">
                  {payments?.filter(p => p.status.toLowerCase() === "successful").length || 0}
                </div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="text-sm text-gray-500">Pending</div>
                <div className="text-xl font-bold text-yellow-600">
                  {payments?.filter(p => p.status.toLowerCase() === "pending").length || 0}
                </div>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <div className="text-sm text-gray-500">Failed</div>
                <div className="text-xl font-bold text-red-600">
                  {payments?.filter(p => p.status.toLowerCase() === "failed").length || 0}
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm text-gray-500">Total Amount</div>
                <div className="text-xl font-bold text-blue-600">
                  {formatCurrency(
                    payments
                      ?.filter(p => p.status.toLowerCase() === "successful")
                      .reduce((sum, p) => sum + p.amount, 0) || 0
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search by name, reference or purpose..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto">
                    <Filter className="mr-2 h-4 w-4" />
                    {statusFilter ? `Status: ${statusFilter}` : "Filter by Status"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                    All Statuses
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("successful")}>
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                    Successful
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                    <Clock className="mr-2 h-4 w-4 text-yellow-600" />
                    Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("failed")}>
                    <XCircle className="mr-2 h-4 w-4 text-red-600" />
                    Failed
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-[#0F2C59]" />
              </div>
            ) : filteredPayments && filteredPayments.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Member</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="whitespace-nowrap">
                          {formatDate(payment.createdAt)}
                        </TableCell>
                        <TableCell className="font-medium">
                          {getMemberName(payment.userId)}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {payment.reference}
                        </TableCell>
                        <TableCell>
                          {payment.purpose}
                        </TableCell>
                        <TableCell className="whitespace-nowrap font-medium">
                          {formatCurrency(payment.amount)}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(payment.status)}>
                            <div className="flex items-center">
                              {getStatusIcon(payment.status)}
                              <span className="capitalize">{payment.status}</span>
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openViewDialog(payment)}
                            >
                              View
                            </Button>
                            {payment.status.toLowerCase() === "pending" && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    Update
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    onClick={() => handleUpdatePaymentStatus(payment.id, "successful")}
                                    className="text-green-600"
                                  >
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Mark as Successful
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleUpdatePaymentStatus(payment.id, "failed")}
                                    className="text-red-600"
                                  >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Mark as Failed
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No payment transactions found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* View Payment Dialog */}
      <Dialog open={isViewPaymentOpen} onOpenChange={setIsViewPaymentOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>
              Transaction information for payment #{selectedPayment?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2 space-y-4">
            <div className="border rounded-md">
              <div className="grid grid-cols-2 gap-2 p-4">
                <div>
                  <div className="text-sm text-gray-500">Transaction Date</div>
                  <div className="font-medium">
                    {selectedPayment && formatDate(selectedPayment.createdAt)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Reference</div>
                  <div className="font-mono font-medium">
                    {selectedPayment?.reference}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Member</div>
                  <div className="font-medium">
                    {selectedPayment && getMemberName(selectedPayment.userId)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Amount</div>
                  <div className="font-medium">
                    {selectedPayment && formatCurrency(selectedPayment.amount)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Purpose</div>
                  <div className="font-medium">
                    {selectedPayment?.purpose}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Status</div>
                  <div>
                    {selectedPayment && (
                      <Badge className={getStatusColor(selectedPayment.status)}>
                        <div className="flex items-center">
                          {getStatusIcon(selectedPayment.status)}
                          <span className="capitalize">{selectedPayment.status}</span>
                        </div>
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsViewPaymentOpen(false)}
            >
              Close
            </Button>
            {selectedPayment?.status.toLowerCase() === "pending" && (
              <div className="flex space-x-2">
                <Button 
                  variant="destructive"
                  onClick={() => {
                    handleUpdatePaymentStatus(selectedPayment.id, "failed");
                    setIsViewPaymentOpen(false);
                  }}
                  disabled={updatePaymentStatusMutation.isPending}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Mark as Failed
                </Button>
                <Button 
                  variant="default"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    handleUpdatePaymentStatus(selectedPayment.id, "successful");
                    setIsViewPaymentOpen(false);
                  }}
                  disabled={updatePaymentStatusMutation.isPending}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Mark as Successful
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}