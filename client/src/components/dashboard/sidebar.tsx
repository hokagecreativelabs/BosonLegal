import { Link, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  User, 
  Calendar, 
  CreditCard, 
  FileText, 
  Settings,
  LogOut
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

interface SidebarProps {
  onItemClick?: () => void;
}

const Sidebar = ({ onItemClick }: SidebarProps) => {
  const { logoutMutation } = useAuth();
  const [isDashboard] = useRoute("/dashboard");
  const [isProfile] = useRoute("/profile");
  const [isPayments] = useRoute("/payments");
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <aside className="bg-[#0F2C59] text-white w-64 min-h-screen flex flex-col">
      <div className="p-6">
        <h2 className="text-xl font-playfair font-bold">Member Portal</h2>
      </div>
      
      <nav className="flex-1 px-4 py-4">
        <ul className="space-y-1">
          <li>
            <Link href="/dashboard">
              <a 
                className={cn(
                  "flex items-center space-x-2 px-4 py-3 rounded-md transition-colors",
                  isDashboard 
                    ? "bg-white/20 text-white" 
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
                onClick={onItemClick}
              >
                <LayoutDashboard className="h-5 w-5" />
                <span>Dashboard</span>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/profile">
              <a 
                className={cn(
                  "flex items-center space-x-2 px-4 py-3 rounded-md transition-colors",
                  isProfile
                    ? "bg-white/20 text-white" 
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
                onClick={onItemClick}
              >
                <User className="h-5 w-5" />
                <span>My Profile</span>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/events">
              <a 
                className="flex items-center space-x-2 px-4 py-3 rounded-md text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                onClick={onItemClick}
              >
                <Calendar className="h-5 w-5" />
                <span>Events</span>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/payments">
              <a 
                className={cn(
                  "flex items-center space-x-2 px-4 py-3 rounded-md transition-colors",
                  isPayments
                    ? "bg-white/20 text-white" 
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
                onClick={onItemClick}
              >
                <CreditCard className="h-5 w-5" />
                <span>Payments</span>
              </a>
            </Link>
          </li>
          
          <li className="pt-4">
            <div className="px-4 py-2 text-xs text-white/50 uppercase font-medium">Resources</div>
          </li>
          <li>
            <a 
              href="#" 
              className="flex items-center space-x-2 px-4 py-3 rounded-md text-white/70 hover:bg-white/10 hover:text-white transition-colors"
              onClick={onItemClick}
            >
              <FileText className="h-5 w-5" />
              <span>Documents</span>
            </a>
          </li>
          <li>
            <a 
              href="#" 
              className="flex items-center space-x-2 px-4 py-3 rounded-md text-white/70 hover:bg-white/10 hover:text-white transition-colors"
              onClick={onItemClick}
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </a>
          </li>
        </ul>
      </nav>
      
      <div className="p-4 border-t border-white/10">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-white/70 hover:bg-white/10 hover:text-white"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
        >
          <LogOut className="h-5 w-5 mr-2" />
          {logoutMutation.isPending ? "Logging out..." : "Logout"}
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
