
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, UserPlus, Building2, CheckCircle2 } from "lucide-react";
import { addNewInvestor, addPropertyForUser, fetchInvestors, fetchPropertyTypes } from "@/services/admin/adminService";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const AdminFunctionTester = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [testInvestorId, setTestInvestorId] = useState<string | null>(null);
  const [testPropertyId, setTestPropertyId] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [expandedTests, setExpandedTests] = useState<string[]>([]);

  const addLogEntry = (entry: any) => {
    setTestResults(prev => [entry, ...prev]);
    
    // Auto-expand the latest test
    if (entry.id) {
      setExpandedTests(prev => [...prev, entry.id]);
    }
  };

  // Test per creare un nuovo investitore
  const testAddNewInvestor = async () => {
    setLoading(true);
    
    const testId = Date.now().toString();
    const startTime = performance.now();
    
    try {
      // Dati per l'investitore di test
      const randomSuffix = Math.floor(Math.random() * 10000);
      const investorData = {
        email: `demo.investor${randomSuffix}@easyroi.test`,
        first_name: "Demo",
        last_name: `Test${randomSuffix}`,
        password: "Password123!",
        initialInvestment: 500000 // 500k di investimento iniziale
      };
      
      // Log dell'inizio del test
      addLogEntry({
        id: testId,
        title: "Test add_new_investor",
        status: "running",
        request: JSON.stringify(investorData, null, 2),
        timestamp: new Date().toISOString()
      });
      
      // Chiamata alla funzione RPC
      await addNewInvestor(investorData);
      
      // Recupera l'id dell'utente creato
      const investors = await fetchInvestors();
      const createdInvestor = investors.find(inv => inv.email === investorData.email);
      
      if (createdInvestor) {
        setTestInvestorId(createdInvestor.id);
        
        // Log del successo
        addLogEntry({
          id: testId,
          title: "Test add_new_investor",
          status: "success",
          request: JSON.stringify(investorData, null, 2),
          response: `Investitore creato con ID: ${createdInvestor.id}`,
          executionTime: `${(performance.now() - startTime).toFixed(0)}ms`,
          timestamp: new Date().toISOString()
        });
        
        toast({
          title: "Test completato",
          description: `Investitore creato: ${investorData.first_name} ${investorData.last_name}`,
        });
      } else {
        throw new Error("Investitore creato ma non trovato nei risultati");
      }
    } catch (error: any) {
      // Log dell'errore
      addLogEntry({
        id: testId,
        title: "Test add_new_investor",
        status: "error",
        request: "Dati investitore di test",
        error: error.message || "Errore sconosciuto",
        executionTime: `${(performance.now() - startTime).toFixed(0)}ms`,
        timestamp: new Date().toISOString()
      });
      
      toast({
        title: "Errore nel test",
        description: error.message || "Errore sconosciuto",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Test per aggiungere una proprietà all'investitore
  const testAddPropertyForUser = async () => {
    if (!testInvestorId) {
      toast({
        title: "Errore",
        description: "Prima crea un investitore di test",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    const testId = Date.now().toString();
    const startTime = performance.now();
    
    try {
      // Recupera i tipi di proprietà disponibili
      const propertyTypes = await fetchPropertyTypes();
      if (propertyTypes.length === 0) {
        throw new Error("Nessun tipo di proprietà disponibile");
      }
      
      // Dati per la proprietà di test
      const propertyData = {
        name: `Appartamento Test ${Math.floor(Math.random() * 1000)}`,
        address: "Via Test 123",
        city: "Milano",
        country: "Italy",
        zone: "Centro",
        typeId: propertyTypes[0].id,
        price: 350000,
        sizeSqm: 85,
        bedrooms: 2,
        bathrooms: 1,
        occupationStatus: "vacant",
        status: "active",
        roiPercentage: 5.2,
        serviceCharges: 1200
      };
      
      // Log dell'inizio del test
      addLogEntry({
        id: testId,
        title: "Test add_property_for_user",
        status: "running",
        request: JSON.stringify({ userId: testInvestorId, ...propertyData }, null, 2),
        timestamp: new Date().toISOString()
      });
      
      // Chiamata alla funzione RPC
      const result = await addPropertyForUser(testInvestorId, propertyData);
      setTestPropertyId(result ? "Success" : "Failed");
      
      // Log del successo
      addLogEntry({
        id: testId,
        title: "Test add_property_for_user",
        status: "success",
        request: JSON.stringify({ userId: testInvestorId, ...propertyData }, null, 2),
        response: "Proprietà aggiunta con successo",
        executionTime: `${(performance.now() - startTime).toFixed(0)}ms`,
        timestamp: new Date().toISOString()
      });
      
      toast({
        title: "Test completato",
        description: `Proprietà aggiunta: ${propertyData.name}`,
      });
    } catch (error: any) {
      // Log dell'errore
      addLogEntry({
        id: testId,
        title: "Test add_property_for_user",
        status: "error",
        request: "Dati proprietà di test",
        error: error.message || "Errore sconosciuto",
        executionTime: `${(performance.now() - startTime).toFixed(0)}ms`,
        timestamp: new Date().toISOString()
      });
      
      toast({
        title: "Errore nel test",
        description: error.message || "Errore sconosciuto",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t('adminFunctionTester')}</CardTitle>
        <CardDescription>{t('adminFunctionTesterDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">1. {t('testAddNewInvestor')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {t('testAddNewInvestorDescription')}
              </p>
              {testInvestorId ? (
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Investor ID: {testInvestorId}</span>
                </div>
              ) : null}
            </CardContent>
            <CardFooter>
              <Button 
                onClick={testAddNewInvestor} 
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <UserPlus className="mr-2 h-4 w-4" />
                )}
                {t('runTest')}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">2. {t('testAddPropertyForUser')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {t('testAddPropertyForUserDescription')}
              </p>
              {testPropertyId ? (
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Result: {testPropertyId}</span>
                </div>
              ) : null}
            </CardContent>
            <CardFooter>
              <Button 
                onClick={testAddPropertyForUser} 
                disabled={loading || !testInvestorId}
                className="w-full"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Building2 className="mr-2 h-4 w-4" />
                )}
                {t('runTest')}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Separator />

        <div className="space-y-2">
          <h3 className="text-lg font-medium">{t('testResults')}</h3>
          
          {testResults.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('noTestResultsYet')}</p>
          ) : (
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <Accordion
                  key={index}
                  type="single" 
                  collapsible
                  value={expandedTests.includes(result.id) ? result.id : undefined}
                  onValueChange={(value) => {
                    if (value) {
                      setExpandedTests(prev => [...prev, result.id]);
                    } else {
                      setExpandedTests(prev => prev.filter(id => id !== result.id));
                    }
                  }}
                >
                  <AccordionItem value={result.id || index.toString()}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center space-x-2 text-sm">
                        <span className={`h-2 w-2 rounded-full ${
                          result.status === 'success' ? 'bg-green-500' : 
                          result.status === 'error' ? 'bg-red-500' : 'bg-amber-500'
                        }`} />
                        <span className="font-medium">{result.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(result.timestamp).toLocaleTimeString()}
                        </span>
                        {result.executionTime && (
                          <span className="text-xs bg-slate-100 px-2 py-0.5 rounded">
                            {result.executionTime}
                          </span>
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 text-sm">
                        {result.request && (
                          <div>
                            <h4 className="font-medium text-xs">Request:</h4>
                            <pre className="bg-slate-50 p-2 rounded text-xs overflow-x-auto">
                              {typeof result.request === 'string' 
                                ? result.request 
                                : JSON.stringify(result.request, null, 2)
                              }
                            </pre>
                          </div>
                        )}
                        
                        {result.response && (
                          <div>
                            <h4 className="font-medium text-xs">Response:</h4>
                            <pre className="bg-slate-50 p-2 rounded text-xs overflow-x-auto">
                              {typeof result.response === 'string' 
                                ? result.response 
                                : JSON.stringify(result.response, null, 2)
                              }
                            </pre>
                          </div>
                        )}
                        
                        {result.error && (
                          <div>
                            <h4 className="font-medium text-xs text-red-500">Error:</h4>
                            <pre className="bg-red-50 p-2 rounded text-xs overflow-x-auto text-red-600">
                              {result.error}
                            </pre>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
