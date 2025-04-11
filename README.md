

# ✅ EasyROI – Checklist di Implementazione (a cura di Lovable)

Lovable, aggiorna questa checklist ogni volta che completi una delle voci.

Per ogni punto completato:
- Segna con `✅`
- Aggiungi un breve commento su cosa è stato fatto e dove
- Non modificare il testo originale

---

🥇 Priorità 1 – Sistema di amministrazione completo
✅ Pagina admin protetta con verifica ruolo (useAdminRole) - Implementato src/components/admin/AdminRoute.tsx che verifica il ruolo dell'utente
✅ Form per inserimento nuovi investitori - Creato src/components/admin/AdminInvestorForm.tsx con form completo e validazioni
✅ Form per aggiungere proprietà a investitori esistenti - Creato src/components/admin/AdminPropertyForm.tsx con form completo
✅ Form per gestione delle proprietà in vendita - Creato src/components/admin/AdminForSalePropertyForm.tsx con form completo
✅ Form per gestione dei progetti in sviluppo - Creato src/components/admin/AdminDevelopmentProjectForm.tsx con form completo
✅ Form per gestione eventi (creazione, modifica, eliminazione) - Creato src/components/admin/AdminEventForm.tsx con form completo
✅ Correzione degli errori TypeScript nei form admin - Aggiunto src/types/admin.ts con interfacce e sistemato typing nei componenti
✅ Funzione client: addNewInvestor() - Implementata in src/services/admin/adminService.ts con tipi corretti e gestione errori
✅ Funzione client: addNewPropertyForUser() - Implementata in src/services/admin/adminService.ts con tipi corretti e gestione errori
✅ Funzione client: addPropertyForSale() - Implementata in src/services/admin/adminService.ts con tipi corretti e gestione errori
✅ Funzione client: addNewDevelopmentProject() - Implementata in src/services/admin/adminService.ts con tipi corretti e gestione errori
✅ Funzione client: addNewEvent() - Implementata in src/services/admin/adminService.ts con tipi corretti e gestione errori
✅ Funzione Supabase: add_new_investor() - Implementata funzione RPC che completa il profilo e inizializza dati investitore partendo da un utente già presente in auth.users
✅ Funzione Supabase: add_property_for_user() - Implementata funzione RPC che aggiorna proprietà, investimenti e allocazione portafoglio
✅ Edge Function: create-owner-user() - Creata funzione edge che crea utente in auth.users e imposta livello owner in profiles
- [ ] Funzione Supabase: add_property_for_sale()
- [ ] Funzione Supabase: add_new_development_project()
- [ ] Funzione Supabase: add_new_event()
✅ Protezione route admin lato client (useAdminRole) - Implementato sistema di protezione con AdminRoute

 Controlli autorizzazione nelle funzioni RPC

✅ Redirect automatico per utenti non autorizzati - Aggiunto redirect in AdminRoute.tsx con toast di notifica

---

## 🎖️ Priorità 2 – Sistema badge utente

- [ ] Verifica collegamento trigger `update_user_level` a `user_investments`
- [ ] Test aggiornamento badge al cambio proprietà
- [ ] Visualizzazione badge in Dashboard
- [ ] Visualizzazione badge nella Sidebar
- [ ] Visualizzazione badge nel Profilo
- [ ] Uso del componente `BadgeLevel`
- [ ] Implementazione logica soglie badge (starter → diamond)

---

## 📊 Priorità 3 – Gestione dati coerente

- [ ] Formattazione currency coerente (€3,450,000 o €3.45M)
- [ ] Status proprietà localizzati (development, active, sold)
- [ ] Portfolio aggregation per paese (non città)
- [ ] Funzione RPC: `updateUserDashboardData()`
- [ ] Refetch/Invalidate query con React Query
- [ ] Stato condiviso via Context

---

## 💎 Priorità 4 – Demo Account Platinum

- [ ] Creazione utente demo con 3 proprietà in diverse location
- [ ] Inserimento dati ROI e crescita mensile dal 2024
- [ ] Portafoglio con almeno 2 paesi diversi
- [ ] ROI realistico e variegato
- [ ] Funzione: `createDemoPlatinumUser()`
- [ ] Accesso UI a funzione demo (admin-only)

---

## 🎨 Priorità 5 – UI, fallback e localizzazione

- [ ] Placeholder visivi quando mancano dati
- [ ] Component skeletons per caricamento
- [ ] Error boundaries attivi
- [ ] Responsive testato su desktop, tablet, mobile
- [ ] Layout alternativi per grafici su mobile
- [ ] Tutte le stringhe passano tramite `t()`
- [ ] Completate traduzioni in IT / EN / ES / DE
- [ ] Verifica visiva interfaccia in tutte le lingue

---

## 🧠 Tabelle Supabase mappate

_(Solo revisione, nessun check-off richiesto)_

- Utenti: `profiles`, `security_settings`, `display_settings`, `notification_settings`
- Proprietà: `properties`, `property_locations`, `property_types`, etc.
- Progetti: `development_projects`, `project_images`
- Eventi: `events`, `event_attendees`
- Dati utente: `user_properties`, `user_roi`, `user_investment_growth`, etc.
- Social: `connections`, `messages`, `notifications`

---

## 📌 Note per Lovable

- Questo file è una **checklist operativa**, non un file di specifiche.
- Aggiornalo ogni volta che completi una voce, con una riga tipo:

```md
✅ Form per inserimento nuovi investitori – creato `AdminAddInvestor.tsx`, integrato form con funzione `addNewInvestor()`
```

