
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";
import { Property } from "@/services/dashboard/dashboardService";

interface PropertiesTableProps {
  properties: Property[];
}

export const PropertiesTable = ({ properties }: PropertiesTableProps) => {
  const t = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('yourProperties')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium">{t('property')}</th>
                <th className="text-left py-3 px-4 font-medium">{t('location')}</th>
                <th className="text-left py-3 px-4 font-medium">{t('roi')}</th>
                <th className="text-left py-3 px-4 font-medium">{t('value')}</th>
                <th className="text-left py-3 px-4 font-medium">{t('status')}</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr key={property.id} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4">{property.name}</td>
                  <td className="py-3 px-4">{property.location}</td>
                  <td className="py-3 px-4 text-easyroi-success">{property.roi}</td>
                  <td className="py-3 px-4">{property.value}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      property.status === 'active' ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                    }`}>
                      {property.status === 'active' ? t('active') : t('development')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
