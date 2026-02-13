import { appState } from "../../state/state.js";
import { 
  fetchMeetings,
  createMeetingAPI,
  deleteMeetingAPI,
  updateMeetingAPI
} from "../../api/meeting.api.js";
import { renderApp } from "./meeting.render.js";
//INIT
export async function loadMeetings(){
  fetchMeetings().then((data) => {
    appState.meetings = data;
    appState.isLoading = false;
    renderApp();
  });
}
//Setselectmeeting
export function setSelectedMeeting(meeting){
// Nếu click lại cuộc họp đang chọn, toggle off
  if (appState.selectedMeeting && appState.selectedMeeting.id === meeting.id){
    appState.selectedMeeting = null;
  } else {
    appState.selectedMeeting = meeting;
  }
  renderApp();
}
export async function handleDeleteMeeting(id){
  await deleteMeetingAPI(id);
  appState.meetings = appState.meetings.filter(m => m.id !== id);
  appState.selectedMeeting = null;
  renderApp();
}

export async function handleUpdateMeeting(id, data){
  const updated = await updateMeetingAPI(id, data);
  appState.meetings = appState.meetings.map(m => m.id === id ? updated : m);

  appState.selectedMeeting = null;
  appStatde.editedId = null;
  renderApp();
}