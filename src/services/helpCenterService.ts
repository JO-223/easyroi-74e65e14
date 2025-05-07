
import { HelpCategory } from "@/types/help";

// This would typically fetch from an API or database
// For now, we'll use mock data
export async function fetchHelpCategories(): Promise<HelpCategory[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    {
      id: "payments",
      title: "payments",
      articles: [
        {
          id: "payment-methods",
          title: "Quali metodi di pagamento accettate?",
          content: "Accettiamo diversi metodi di pagamento tra cui bonifico bancario, carta di credito (Visa, Mastercard, American Express), PayPal e criptovalute (Bitcoin, Ethereum). Per i trasferimenti internazionali, consigliamo di utilizzare servizi come TransferWise per ridurre le commissioni bancarie.",
          links: [
            { text: "Politica commissioni", url: "#fees" },
            { text: "Configurare pagamenti automatici", url: "#auto-pay" }
          ]
        },
        {
          id: "payment-schedule",
          title: "Quando vengono effettuati i pagamenti dei rendimenti?",
          content: "I pagamenti dei rendimenti vengono effettuati mensilmente, di solito entro i primi 10 giorni del mese successivo al periodo di riferimento. I fondi vengono trasferiti direttamente sul conto bancario registrato nel tuo profilo. Per progetti di sviluppo, i pagamenti seguono il piano finanziario specifico del progetto.",
          links: [
            { text: "Calendario pagamenti", url: "#payment-calendar" }
          ]
        },
        {
          id: "payment-issues",
          title: "Ho riscontrato un problema con il mio pagamento, cosa devo fare?",
          content: "Se noti irregolarità nei tuoi pagamenti, ti invitiamo a contattare immediatamente il nostro team finanziario. Assicurati di fornire dettagli come la data prevista del pagamento, l'importo atteso e qualsiasi riferimento alla proprietà o all'investimento in questione. Il nostro team risponderà entro 24 ore lavorative.",
          links: [
            { text: "Contatta il team finanziario", url: "#contact-finance" }
          ]
        }
      ]
    },
    {
      id: "contracts",
      title: "contracts",
      articles: [
        {
          id: "contract-signing",
          title: "Come funziona il processo di firma dei contratti?",
          content: "Utilizziamo un sistema di firma elettronica sicuro e legalmente vincolante. Una volta finalizzati i dettagli dell'investimento, riceverai un'email con un link per rivedere e firmare elettronicamente il contratto. Il processo è completamente digitale e conforme alle normative europee eIDAS per le firme elettroniche.",
          links: [
            { text: "Verifica identità digitale", url: "#digital-identity" }
          ]
        },
        {
          id: "contract-amendments",
          title: "Posso modificare il mio contratto dopo la firma?",
          content: "Modifiche ai contratti già firmati richiedono l'approvazione di tutte le parti coinvolte. Per richiedere una modifica, contatta il tuo consulente dedicato specificando chiaramente quali termini desideri modificare e perché. Ogni modifica richiederà una nuova procedura di firma e potrebbe comportare costi amministrativi aggiuntivi.",
          links: [
            { text: "Procedura di modifica", url: "#amendment-procedure" }
          ]
        },
        {
          id: "contract-termination",
          title: "Quali sono i termini per rescindere un contratto?",
          content: "I termini di rescissione variano in base al tipo di investimento. In generale, gli investimenti a lungo termine prevedono un periodo minimo di permanenza, con penali per uscite anticipate. Le condizioni specifiche sono dettagliate nella sezione 'Termini di rescissione' del tuo contratto. Ti consigliamo di consultare il tuo consulente prima di intraprendere qualsiasi azione di rescissione.",
          links: [
            { text: "Calcolo penali", url: "#penalty-calculator" }
          ]
        }
      ]
    },
    {
      id: "maintenance",
      title: "maintenance",
      articles: [
        {
          id: "maintenance-responsibility",
          title: "Chi è responsabile della manutenzione delle proprietà?",
          content: "La responsabilità della manutenzione dipende dal tipo di investimento. Per proprietà completamente gestite, la società si occupa di tutta la manutenzione ordinaria e straordinaria, con costi inclusi nelle spese di gestione. Per investimenti in comproprietà, le responsabilità sono condivise secondo quanto stabilito nell'accordo di comproprietà. Tutte le attività di manutenzione vengono documentate e sono accessibili nella sezione 'Reportistica' della proprietà.",
          links: [
            { text: "Politica manutenzioni", url: "#maintenance-policy" }
          ]
        },
        {
          id: "maintenance-requests",
          title: "Come posso richiedere un intervento di manutenzione?",
          content: "Puoi richiedere interventi di manutenzione direttamente dalla piattaforma, nella sezione dedicata alla proprietà. Clicca su 'Richiedi Manutenzione', compila il modulo specificando il problema, la sua urgenza e allega eventuali foto. Il nostro team tecnico valuterà la richiesta e risponderà entro 24-48 ore, o immediatamente per emergenze.",
          links: [
            { text: "Form richiesta manutenzione", url: "#maintenance-request" }
          ]
        },
        {
          id: "maintenance-costs",
          title: "Come vengono calcolati i costi di manutenzione straordinaria?",
          content: "I costi di manutenzione straordinaria vengono ripartiti in base alle quote di proprietà. Prima di procedere con interventi di manutenzione straordinaria significativi (superiori a €5.000), viene convocata una riunione con tutti i proprietari per approvare l'intervento e il relativo budget. I fondi vengono raccolti prima dell'inizio dei lavori e ogni spesa viene documentata con fatture accessibili nella piattaforma.",
          links: [
            { text: "Storia manutenzioni", url: "#maintenance-history" }
          ]
        }
      ]
    },
    {
      id: "investments",
      title: "investments",
      articles: [
        {
          id: "min-investment",
          title: "Qual è l'investimento minimo richiesto?",
          content: "L'investimento minimo varia in base al tipo di opportunità. Per progetti di sviluppo, l'importo minimo è generalmente €50.000. Per proprietà già operative, l'investimento minimo è di €100.000. Offriamo anche opzioni di diversificazione che consentono di investire in un portafoglio diversificato con un minimo di €250.000, distribuito su diverse proprietà e località.",
          links: [
            { text: "Opzioni di investimento", url: "#investment-options" }
          ]
        },
        {
          id: "roi-calculation",
          title: "Come viene calcolato il ROI delle proprietà?",
          content: "Il ROI (Return on Investment) viene calcolato dividendo il rendimento netto annuale per l'importo investito iniziale. Il rendimento netto considera tutti i ricavi (affitti, apprezzamento del valore) meno le spese (manutenzione, tasse, assicurazioni, commissioni di gestione). Forniamo sia proiezioni basate su dati storici che aggiornamenti mensili sul ROI effettivo di ogni proprietà nel tuo portafoglio.",
          links: [
            { text: "Metodologia di calcolo ROI", url: "#roi-methodology" }
          ]
        },
        {
          id: "investment-risks",
          title: "Quali sono i rischi principali degli investimenti immobiliari?",
          content: "Gli investimenti immobiliari comportano diversi rischi, tra cui: fluttuazioni del mercato immobiliare, rischi legati alla posizione (disastri naturali, cambiamenti demografici), rischi operativi (vacanze locative, danni alla proprietà), rischi economici (variazioni dei tassi d'interesse, inflazione) e rischi normativi (cambiamenti della legislazione fiscale o edilizia). Il nostro team analizza e mitiga questi rischi attraverso diversificazione geografica, assicurazioni complete e gestione professionale.",
          links: [
            { text: "Politica di gestione del rischio", url: "#risk-management" }
          ]
        }
      ]
    },
    {
      id: "taxes",
      title: "taxes",
      articles: [
        {
          id: "tax-implications",
          title: "Quali sono le implicazioni fiscali degli investimenti?",
          content: "Le implicazioni fiscali variano in base alla tua residenza fiscale e al tipo di investimento. In generale, i redditi da locazione sono soggetti a imposte sul reddito, mentre la vendita di proprietà può generare imposte sulle plusvalenze. Per investitori internazionali, esistono convenzioni contro le doppie imposizioni che possono ridurre il carico fiscale. Forniamo reportistica annuale per facilitare le dichiarazioni fiscali, ma consigliamo sempre di consultare un commercialista specializzato.",
          links: [
            { text: "Documentazione fiscale", url: "#tax-docs" }
          ]
        },
        {
          id: "tax-deductions",
          title: "Quali spese posso dedurre fiscalmente?",
          content: "Molte spese relative agli investimenti immobiliari possono essere fiscalmente deducibili, come interessi sui mutui, assicurazioni, tasse di proprietà, manutenzione, ammortamenti e costi di gestione. La piattaforma tiene traccia automaticamente di queste spese e genera report annuali che puoi condividere con il tuo commercialista. Le regole specifiche variano in base alla giurisdizione fiscale.",
          links: [
            { text: "Guida alle deduzioni fiscali", url: "#tax-deductions-guide" }
          ]
        },
        {
          id: "tax-reporting",
          title: "Come gestite la reportistica fiscale?",
          content: "Alla fine di ogni anno fiscale, generiamo automaticamente report completi che includono tutti i redditi percepiti, le spese sostenute e i calcoli preliminari delle imposte dovute in base alla tua giurisdizione fiscale. Questi report possono essere scaricati dalla sezione 'Documenti Fiscali' del tuo profilo e sono disponibili in formati compatibili con i principali software di dichiarazione dei redditi.",
          links: [
            { text: "Accedi ai report fiscali", url: "#access-tax-reports" }
          ]
        }
      ]
    },
    {
      id: "userAccounts",
      title: "userAccounts",
      articles: [
        {
          id: "account-security",
          title: "Come proteggete la sicurezza del mio account?",
          content: "Utilizziamo tecnologie di sicurezza all'avanguardia, inclusa l'autenticazione a due fattori (2FA), crittografia end-to-end per tutti i dati sensibili e monitoraggio continuo delle attività dell'account per rilevare accessi sospetti. Ti consigliamo di attivare la 2FA nelle impostazioni del tuo account e di aggiornare regolarmente la tua password, utilizzando combinazioni complesse di caratteri.",
          links: [
            { text: "Attiva 2FA", url: "#enable-2fa" },
            { text: "Politica di sicurezza", url: "#security-policy" }
          ]
        },
        {
          id: "account-access",
          title: "Posso concedere l'accesso al mio account ad altre persone?",
          content: "Sì, puoi aggiungere utenti secondari al tuo account con diversi livelli di accesso. Gli utenti possono essere configurati come 'Visualizzatori' (possono solo vedere i dati), 'Analisti' (possono vedere e scaricare report) o 'Manager' (hanno accesso completo tranne per le operazioni finanziarie). Questa funzionalità è particolarmente utile per consentire ai tuoi consulenti o familiari di accedere alle informazioni necessarie.",
          links: [
            { text: "Gestione accessi", url: "#access-management" }
          ]
        },
        {
          id: "lost-access",
          title: "Cosa fare se ho perso l'accesso al mio account?",
          content: "Se hai perso l'accesso al tuo account, puoi utilizzare la funzione 'Password dimenticata' nella pagina di login. Se hai cambiato anche l'email o il numero di telefono associati all'account, contatta il nostro team di supporto fornendo documenti di identificazione per verificare la tua identità. Per motivi di sicurezza, il ripristino dell'accesso in questi casi richiede verifiche aggiuntive e può richiedere fino a 48 ore.",
          links: [
            { text: "Recupero account", url: "#account-recovery" }
          ]
        }
      ]
    }
  ];
}

export async function searchHelpArticles(query: string): Promise<HelpArticle[]> {
  // This would typically search through articles in a database
  // For now, we'll simulate this functionality
  if (!query || query.trim() === '') {
    return [];
  }
  
  const allCategories = await fetchHelpCategories();
  const allArticles = allCategories.flatMap(category => category.articles);
  
  return allArticles.filter(article => 
    article.title.toLowerCase().includes(query.toLowerCase()) || 
    article.content.toLowerCase().includes(query.toLowerCase())
  );
}
