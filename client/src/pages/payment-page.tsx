import { useEffect } from "react";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import PaymentForm from "@/components/dashboard/payment-form";
import PaymentHistory from "@/components/dashboard/payment-history";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

const PaymentPage = () => {
  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <DashboardLayout title="Payments">
      <Tabs defaultValue="make-payment" className="w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="make-payment">Make Payment</TabsTrigger>
            <TabsTrigger value="payment-history">Payment History</TabsTrigger>
          </TabsList>
        </motion.div>

        <TabsContent value="make-payment">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <PaymentForm />
            </div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#0F2C59] font-playfair">Payment Guide</CardTitle>
                  <CardDescription>How to complete your payment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-[#0F2C59] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 shrink-0">
                      <span>1</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Select Payment Purpose</h4>
                      <p className="text-sm text-gray-500">Choose the appropriate reason for your payment from the dropdown menu.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-[#0F2C59] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 shrink-0">
                      <span>2</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Enter Amount</h4>
                      <p className="text-sm text-gray-500">Input the amount you wish to pay in Naira (₦).</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-[#0F2C59] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 shrink-0">
                      <span>3</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Payment Gateway</h4>
                      <p className="text-sm text-gray-500">You'll be redirected to our secure payment processor to complete your transaction.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-[#0F2C59] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 shrink-0">
                      <span>4</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Confirmation</h4>
                      <p className="text-sm text-gray-500">Once payment is successful, you'll receive a receipt via email and in your payment history.</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 mt-4 border-t">
                    <h4 className="font-medium mb-2">Payment Categories</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between">
                        <span>Annual Membership Dues</span>
                        <span className="font-medium">₦150,000</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Conference Registration</span>
                        <span className="font-medium">₦75,000</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Special Levy</span>
                        <span className="font-medium">₦50,000</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="payment-history">
          <PaymentHistory />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default PaymentPage;
