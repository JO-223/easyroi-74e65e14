import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLanguage } from "@/contexts/LanguageContext";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { addNewEvent, fetchDevelopmentProjects, fetchProperties, useAdminActions } from "@/services/admin/adminService";
import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, CalendarCheck, Link, Loader2, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AdminProperty, AdminDevelopmentProject } from "@/types/admin";

const formSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(10, "Description is required (min 10 characters)"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  location: z.string().min(1, "Location is required"),
  eventType: z.string().min(1, "Event type is required"),
  maxAttendees: z.number().optional(),
  propertyId: z.string().optional(),
  projectId: z.string().optional(),
  imageUrl: z.string().optional(),
  isOnline: z.boolean().default(false),
  requiredBadges: z.array(z.string()).optional(),
});

const investorLevelOptions = [
  { value: "starter", label: "Starter" },
  { value: "bronze", label: "Bronze" },
  { value: "silver", label: "Silver" },
  { value: "gold", label: "Gold" },
  { value: "ruby", label: "Ruby" },
  { value: "emerald", label: "Emerald" },
  { value: "platinum", label: "Platinum" },
  { value: "diamond", label: "Diamond" }
];

export function AdminEventForm() {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [properties, setProperties] = useState<AdminProperty[]>([]);
  const [projects, setProjects] = useState<AdminDevelopmentProject[]>([]);
  const { handleAdminAction } = useAdminActions();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      date: new Date().toISOString().split('T')[0],
      time: "18:00",
      location: "",
      eventType: "presentation",
      maxAttendees: undefined,
      propertyId: undefined,
      projectId: undefined,
      imageUrl: undefined,
      isOnline: false,
      requiredBadges: ["bronze", "silver", "gold", "platinum", "diamond"],
    },
  });

  // Fetch properties and projects on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [propertiesData, projectsData] = await Promise.all([
          fetchProperties(),
          fetchDevelopmentProjects()
        ]);
        
        setProperties(propertiesData);
        setProjects(projectsData);
      } catch (error) {
        console.error("Error fetching related data:", error);
        toast({
          title: t('errorLoadingData'),
          description: t('errorFetchingRelatedData'),
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [toast, t]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    await handleAdminAction(
      async () => {
        await addNewEvent({
          title: data.title,
          description: data.description,
          date: data.date,
          time: data.time,
          location: data.location,
          eventType: data.eventType,
          maxAttendees: data.maxAttendees,
          propertyId: data.propertyId,
          projectId: data.projectId,
          imageUrl: data.imageUrl,
          isOnline: data.isOnline,
          requiredBadges: data.requiredBadges,
        });
        form.reset();
      },
      t('eventAddedSuccessfully'),
      t('errorAddingEvent')
    );
    
    setIsSubmitting(false);
  };

  // Show loading state while fetching data
  if (isLoading) {
    return (
      <div className="p-6 bg-slate-50 rounded-lg border">
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-easyroi-gold" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 rounded-lg border">
      <h3 className="text-xl font-semibold mb-4">{t('addEvent')}</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('eventTitle')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('enterEventTitle')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('description')}</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder={t('enterEventDescription')} 
                    className="min-h-[100px]" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('date')}</FormLabel>
                  <div className="flex items-center">
                    <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('time')}</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="eventType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('eventType')}</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="presentation">{t('presentation')}</SelectItem>
                      <SelectItem value="workshop">{t('workshop')}</SelectItem>
                      <SelectItem value="networking">{t('networking')}</SelectItem>
                      <SelectItem value="property_tour">{t('propertyTour')}</SelectItem>
                      <SelectItem value="investment_conference">{t('investmentConference')}</SelectItem>
                      <SelectItem value="webinar">{t('webinar')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="maxAttendees"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('maxAttendees')}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={1}
                      placeholder="50" 
                      {...field}
                      onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormDescription>
                    {t('leaveBlankForUnlimited')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('location')}</FormLabel>
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input placeholder={t('enterLocation')} {...field} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="isOnline"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 mt-8">
                  <FormControl>
                    <Checkbox 
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      {t('isOnlineEvent')}
                    </FormLabel>
                    <FormDescription>
                      {t('onlineEventDescription')}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="propertyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('relatedProperty')}</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('selectProperty')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">{t('none')}</SelectItem>
                      {properties.map((property) => (
                        <SelectItem key={property.id} value={property.id}>
                          {property.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {t('optionalField')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('relatedProject')}</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('selectProject')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">{t('none')}</SelectItem>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {t('optionalField')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('imageUrl')}</FormLabel>
                <div className="flex items-center">
                  <Link className="mr-2 h-4 w-4 text-muted-foreground" />
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                </div>
                <FormDescription>
                  {t('optionalField')}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="requiredBadges"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">{t('requiredInvestorLevels')}</FormLabel>
                  <FormDescription>
                    {t('selectInvestorLevelsEvent')}
                  </FormDescription>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {investorLevelOptions.map((level) => (
                    <FormField
                      key={level.value}
                      control={form.control}
                      name="requiredBadges"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={level.value}
                            className="flex flex-row items-center space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(level.value)}
                                onCheckedChange={(checked) => {
                                  const current = field.value || [];
                                  if (checked) {
                                    field.onChange([...current, level.value]);
                                  } else {
                                    field.onChange(current.filter((val) => val !== level.value));
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {level.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full md:w-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('processing')}
              </>
            ) : (
              <>
                <CalendarCheck className="mr-2 h-4 w-4" />
                {t('addEvent')}
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
