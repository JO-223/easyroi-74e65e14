
// This file now serves as an aggregator for all event-related services
import { fetchEvents, fetchEvent } from "./events/fetchEvents";
import { registerForEvent, cancelEventRegistration } from "./events/eventRegistration";
import { filterEvents, checkUserEligibility } from "./events/eventFilters";

export {
  fetchEvents,
  fetchEvent,
  registerForEvent,
  cancelEventRegistration,
  filterEvents,
  checkUserEligibility
};
