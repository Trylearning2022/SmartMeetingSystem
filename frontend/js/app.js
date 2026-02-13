import { loadMeetingPage } from "./api/router.js";
import { initMeetingEvents } from "./modules/meeting/meeting.events.js";
import { loadMeetings } from "./modules/meeting/meeting.controller.js";

function initApp() {
  loadMeetingPage();
  setTimeout(() => {
  initMeetingEvents();
  loadMeetings();
    }, 0);
}
initApp();