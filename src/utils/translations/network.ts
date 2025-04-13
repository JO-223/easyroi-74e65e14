
// Chiavi di traduzione relative al network
export const networkKeys = [
  "network",
  "message",
  "disconnect",
  "pending",
  "connect",
  "failedToLoadMessages",
  "failedToSendMessage",
  "messagingWith",
  "messageExchangeDesc",
  "searchInvestors",
  "investorsFound",
  "typeMessage",
  "noMessagesYet",
  "notificationsMarkedAsRead",
  "allNotificationsMarkedAsRead",
  "errorMarkingNotificationsAsRead",
  "notifications",
  "markAllAsRead",
  "noNotifications",
  "authRequired",
  "pleaseLoginToConnect",
  "connectionSent",
  "connectionSentMsg",
  "connectionRequestError",
  "pleaseLoginToDisconnect",
  "connectionRemoved",
  "connectionRemovedMsg",
  "connectionRemoveError",
  "pleaseLoginToMessage",
  "goToPrivacySettings",
  "networkDataError"
] as const;

export type NetworkKey = typeof networkKeys[number];
