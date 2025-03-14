import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import { Loader2 } from "lucide-react";

// Public pages
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AboutPage from "@/pages/about-page";
import EventsPage from "@/pages/events-page";
import MembersPage from "@/pages/members-page";
import ContactPage from "@/pages/contact-page";
import AuthPage from "@/pages/auth-page";
import AdminLoginPage from "@/pages/admin-login-page";

// Member dashboard pages
import DashboardPage from "@/pages/dashboard-page";
import ProfilePage from "@/pages/profile-page";
import PaymentPage from "@/pages/payment-page";

// Admin pages
import AdminMembersPage from "@/pages/admin/members-page";
import AdminEventsPage from "@/pages/admin/events-page";
import AdminResourcesPage from "@/pages/admin/resources-page";
import AdminAnnouncementsPage from "@/pages/admin/announcements-page";
import AdminMessagesPage from "@/pages/admin/messages-page";
import AdminPaymentsPage from "@/pages/admin/payments-page";
import AdminUploadsPage from "@/pages/admin/uploads-page";

// Admin role check component
import { useAuth } from "@/hooks/use-auth";

// Component to protect admin routes
function AdminRoute({ component: Component, ...rest }: any) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }
  
  if (!user) {
    return <Route {...rest}><Redirect to="/admin/login" /></Route>;
  }
  
  if (user.role !== "admin") {
    return <Route {...rest}><div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
      <p className="text-muted-foreground text-center mb-4">Your account does not have administrative privileges.</p>
      <a href="/" className="text-primary hover:underline">Return to Home Page</a>
    </div></Route>;
  }
  
  return <Route {...rest} component={Component} />;
}

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={HomePage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/events" component={EventsPage} />
      <Route path="/members" component={MembersPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/admin/login" component={AdminLoginPage} />
      
      {/* Member Dashboard Routes */}
      <ProtectedRoute path="/dashboard" component={DashboardPage} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      <ProtectedRoute path="/payments" component={PaymentPage} />
      
      {/* Admin Routes */}
      <AdminRoute path="/admin" component={AdminMembersPage} />
      <AdminRoute path="/admin/dashboard" component={AdminMembersPage} />
      <AdminRoute path="/admin/members" component={AdminMembersPage} />
      <AdminRoute path="/admin/events" component={AdminEventsPage} />
      <AdminRoute path="/admin/resources" component={AdminResourcesPage} />
      <AdminRoute path="/admin/announcements" component={AdminAnnouncementsPage} />
      <AdminRoute path="/admin/messages" component={AdminMessagesPage} />
      <AdminRoute path="/admin/payments" component={AdminPaymentsPage} />
      <AdminRoute path="/admin/uploads" component={AdminUploadsPage} />
      
      {/* 404 Route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
