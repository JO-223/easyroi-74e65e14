
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { addNewEvent } from "@/services/admin/eventService";
import { fetchProperties } from "@/services/admin/propertyService";
import { fetchDevelopmentProjects } from "@/services/admin/projectService";
import { useAdminActions } from "@/services/admin/hooks/useAdminActions";
import { AdminProperty, AdminDevelopmentProject } from "@/types/admin";
import { RpcResponse } from "@/services/admin/utils";
import { EventFormLayout } from "./event/EventFormLayout";
import { EventBasicInfoFields } from "./event/EventBasicInfoFields";
import { EventDateTimeFields } from "./event/EventDateTimeFields";
import { EventTypeFields } from "./event/EventTypeFields";
import { EventLocationFields } from "./event/EventLocationFields";
import { EventRelationFields } from "./event/EventRelationFields";
import { EventImageFields } from "./event/EventImageFields";
import { EventBadgeFields } from "./event/EventBadgeFields";
import { EventSubmitButton } from "./event/EventSubmitButton";
import { eventFormSchema, AdminEventFormValues } from "./event/types";

export function AdminEventForm() {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [properties, setProperties] = useState<AdminProperty[]>([]);
  const [projects, setProjects] = useState<AdminDevelopmentProject[]>([]);
  const { handleAdminAction } = useAdminActions();
  const { toast } = useToast();
  
  const form = useForm<AdminEventFormValues>({
    resolver: zodResolver(eventFormSchema),
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

  const onSubmit = async (data: AdminEventFormValues): Promise<RpcResponse> => {
    setIsSubmitting(true);
    
    return await handleAdminAction(
      async () => {
        return await addNewEvent({
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
      },
      t('eventAddedSuccessfully'),
      t('errorAddingEvent')
    );
  };

  return (
    <EventFormLayout form={form} onSubmit={onSubmit} isLoading={isLoading}>
      <EventBasicInfoFields form={form} />
      <EventDateTimeFields form={form} />
      <EventTypeFields form={form} />
      <EventLocationFields form={form} />
      <EventRelationFields form={form} properties={properties} projects={projects} />
      <EventImageFields form={form} />
      <EventBadgeFields form={form} />
      <EventSubmitButton isSubmitting={isSubmitting} />
    </EventFormLayout>
  );
}
