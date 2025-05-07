
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Property } from "@/services/dashboard/dashboardService";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";

interface PropertiesTableProps {
  properties: Property[];
}

export const PropertiesTable = ({ properties }: PropertiesTableProps) => {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('properties')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('propertyName')}</TableHead>
              <TableHead>{t('propertyLocation')}</TableHead>
              <TableHead>{t('propertyROI')}</TableHead>
              <TableHead>{t('propertyValue')}</TableHead>
              <TableHead>{t('ownership')}</TableHead>
              <TableHead>{t('propertyStatus')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {t('noData')}
                </TableCell>
              </TableRow>
            ) : (
              properties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell className="font-medium">{property.name}</TableCell>
                  <TableCell>{property.location}</TableCell>
                  <TableCell>{property.roi}</TableCell>
                  <TableCell>{property.value}</TableCell>
                  <TableCell>
                    {property.ownership ? `${property.ownership}%` : '100%'}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        property.status === "active"
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-orange-100 text-orange-800 hover:bg-orange-200"
                      }
                    >
                      {property.status === "active" ? t('active') : t('development')}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
