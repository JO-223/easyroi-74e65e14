
import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAdminRole } from "@/hooks/use-admin-role";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminRoute = () => {
  const { isAdmin, isLoading } = useAdminRole();
  const [isChecking, setIsChecking] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // When isLoading is false, we know the admin check is complete
    if (!isLoading) {
      if (!isAdmin) {
        toast({
          title: "Access Denied",
          description: "You do not have permission to access this area.",
          variant: "destructive",
        });
      }
      // Short timeout to avoid flashing content while redirecting
      setTimeout(() => setIsChecking(false), 100);
    }
  }, [isLoading, isAdmin, toast]);

  if (isChecking || isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-easyroi-gold" />
      </div>
    );
  }

  return isAdmin ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

export default AdminRoute;
