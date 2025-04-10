
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import { useAdminRole } from "@/hooks/use-admin-role";
import { AccessDeniedAlert } from "@/components/property/AccessDeniedAlert";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Loader2, CheckCircle } from "lucide-react";

interface AddPropertyFormData {
  user_id: string;
  name: string;
  location: string;
  value: number;
  roi: number;
  status: string;
}

interface User {
  id: string;
  email: string;
  name?: string;
}

const AdminAddProperty = () => {
  const t = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAdmin, isLoading: isLoadingRole } = useAdminRole();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<AddPropertyFormData>({
    defaultValues: {
      status: 'active',
      roi: 0.05,  // 5% default ROI
    }
  });
  
  // Fetch users for selection dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, email, first_name, last_name');
        
        if (error) {
          throw error;
        }
        
        // Ensure proper typing for the mapped users array
        const formattedUsers: User[] = data.map(user => ({
          id: user.id as string,
          email: user.email as string,
          name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || undefined
        }));
        
        setUsers(formattedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: t('error'),
          description: t('errorFetchingUsers'),
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin, toast, t]);
  
  const onSubmit = async (data: AddPropertyFormData) => {
    setIsSubmitting(true);
    try {
      // Call the edge function to add property
      const response = await supabase.functions.invoke('add-property-for-user', {
        body: JSON.stringify({
          user_id: data.user_id,
          name: data.name,
          location: data.location,
          value: data.value,
          roi: data.roi,
          status: data.status,
        })
      });
      
      if (!response.data?.success) {
        throw new Error(response.data?.error || 'Unknown error');
      }
      
      // Success!
      toast({
        title: t('success'),
        description: t('propertyAddedSuccessfully'),
        variant: "default"
      });
      
      setIsSuccess(true);
      setTimeout(() => {
        reset();
        setIsSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error("Error adding property:", error);
      toast({
        title: t('error'),
        description: error.message || t('errorAddingProperty'),
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // If not admin, show access denied
  if (!isLoadingRole && !isAdmin) {
    return (
      <DashboardLayout title={t('addNewProperty')}>
        <AccessDeniedAlert />
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout title={t('addNewProperty')} subtitle={t('addPropertyForUser')}>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{t('addNewProperty')}</CardTitle>
          <CardDescription>{t('fillFormToAddProperty')}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="user_id">{t('selectUser')}</Label>
                <Select 
                  onValueChange={(value) => setValue("user_id", value)} 
                  defaultValue={watch("user_id")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectUser')} />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name ? `${user.name} (${user.email})` : user.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.user_id && <p className="text-sm text-destructive">{t('userRequired')}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">{t('propertyName')}</Label>
                <Input
                  id="name"
                  {...register("name", { required: true })}
                  placeholder={t('enterPropertyName')}
                />
                {errors.name && <p className="text-sm text-destructive">{t('propertyNameRequired')}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">{t('location')}</Label>
                <Input
                  id="location"
                  {...register("location", { required: true })}
                  placeholder={t('enterPropertyLocation')}
                />
                <p className="text-xs text-muted-foreground">{t('locationFormatExample')}: Milan, Italy</p>
                {errors.location && <p className="text-sm text-destructive">{t('locationRequired')}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="value">{t('value')} (€)</Label>
                <Input
                  id="value"
                  type="number"
                  {...register("value", { 
                    required: true,
                    valueAsNumber: true,
                    min: 1
                  })}
                  placeholder="500000"
                />
                {errors.value && <p className="text-sm text-destructive">{t('validValueRequired')}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="roi">ROI (%)</Label>
                <Input
                  id="roi"
                  type="number"
                  step="0.01"
                  {...register("roi", { 
                    required: true,
                    valueAsNumber: true,
                    min: 0,
                    max: 1
                  })}
                  placeholder="0.05"
                />
                <p className="text-xs text-muted-foreground">{t('roiFormatExample')}: 0.05 = 5%</p>
                {errors.roi && <p className="text-sm text-destructive">{t('validRoiRequired')}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">{t('status')}</Label>
                <Select 
                  onValueChange={(value) => setValue("status", value)} 
                  defaultValue={watch("status")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectStatus')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">{t('active')}</SelectItem>
                    <SelectItem value="development">{t('development')}</SelectItem>
                    <SelectItem value="sold">{t('sold')}</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && <p className="text-sm text-destructive">{t('statusRequired')}</p>}
              </div>
              
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full bg-easyroi-navy hover:bg-easyroi-navy/90" 
                  disabled={isSubmitting || isSuccess}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('adding')}...
                    </>
                  ) : isSuccess ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      {t('propertyAdded')}
                    </>
                  ) : (
                    t('addProperty')
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default AdminAddProperty;
