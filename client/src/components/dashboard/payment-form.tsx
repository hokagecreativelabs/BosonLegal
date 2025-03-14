import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { insertPaymentSchema } from "@shared/schema";
import { useQueryClient } from "@tanstack/react-query";

// Custom payment form schema with validations
const paymentFormSchema = z.object({
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  purpose: z.string().min(1, "Please select a payment purpose"),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

const PaymentForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      amount: "",
      purpose: "",
    },
  });
  
  const onSubmit = async (data: PaymentFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Convert amount to number for API
      const paymentData = {
        amount: parseInt(data.amount),
        purpose: data.purpose,
      };
      
      await apiRequest("POST", "/api/payments", paymentData);
      
      toast({
        title: "Payment initiated",
        description: "Your payment has been initiated successfully. Proceed to complete the transaction.",
      });
      
      // Reset form and refresh payments data
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/payments"] });
      
    } catch (error) {
      toast({
        title: "Payment failed",
        description: error instanceof Error ? error.message : "Could not process payment",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-[#0F2C59] font-playfair">Make a Payment</CardTitle>
          <CardDescription>Complete your BOSAN membership dues and other payments</CardDescription>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="purpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Purpose</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment purpose" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="membership_renewal">Annual Membership Renewal</SelectItem>
                        <SelectItem value="conference_fee">Conference Registration Fee</SelectItem>
                        <SelectItem value="donation">Donation</SelectItem>
                        <SelectItem value="other">Other Payment</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the purpose for your payment
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (₦)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter amount"
                        {...field}
                        type="number"
                        min="1"
                        step="1"
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the amount you wish to pay in Naira
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-[#0F2C59] text-white hover:bg-[#0F2C59]/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Proceed to Payment"}
              </Button>
            </form>
          </Form>
        </CardContent>
        
        <CardFooter className="flex flex-col">
          <div className="text-sm text-gray-500 mt-2">
            <div className="flex items-center mb-2">
              <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Secured by SSL encryption</span>
            </div>
            <p>All payments are processed securely. We do not store your card details.</p>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default PaymentForm;
