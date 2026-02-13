console.log("Meeting Module loaded");
import { appState } from "../../state/state.js";
import { createMeetingAPI, deleteMeetingAPI } from "../../api/meeting.api.js";
import { renderApp } from "./meeting.render.js";
import { MEETING_FITLERS } from "../../constants/enums.js";
import { MEETING_TYPES } from "../../constants/enums.js";

export function initMeetingEvents() {
  initFormSubmit();
  initChangeEvents();
  initClearMessageEvent();
  initActionButtons();
}

//Form submit
// EVENT: FORM SUBMISSION
function initFormSubmit() {
document.addEventListener("submit", function (e) {
  if (e.target.id !== "create-meeting-form") return;
  console.log("Đã nhấn Submit");
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());
  //alert(JSON.stringify(now));
  //Checkbox cần xử lý riêng
  data.requireSignature = formData.has("requireSignature");

  // Validation
  const error = validateMeeting(data);
  if (error) {
    appState.message = { text: error, type: "error" };
    renderApp();
    return;
  }
  if (appState.editingId){
    handleUpdateMeeting(appState.editingId, data);
    appState.editingId = null;
  } else {
  // Gọi API tạo cuộc họp
  handleCreateMeeting(data);
  }

  e.target.reset();
});
}
function initActionButtons() {
  document.addEventListener("click", (e) => {
    // DELETE
    if (e.target.classList.contains("delete-btn")){
      const id = Number(e.target.id);
      if (confirm("Bạn chắc chắn muốn xóa?")){
        handleDeleteMeeting(id);
      }
    } else if (e.target.classList.contains("edit-btn")){
      const id = Number(e.target.dataset.id);
      const meeting = appState.meetings.find(m => m.id === id);
      appState.selectedMeeting = meeting;
      fillFormForEdit(meeting);
      renderApp();
    } else {
      return;
    }
  });
}

function handleDeleteMeeting(id){
  appState.isLoading = true;
  appState.message = { text: "⏳ Đang xóa cuộc họp...", type: "info" };
  renderApp();
  deleteMeetingAPI(id).then(() => {
    appState.meetings = appState.meetings.filter(m => m.id !== id);
    appState.isLoading = false;
    appState.message = { text: "✅ Xóa cuộc họp thành công", type: "success" };
    renderApp();
  });
}

//Create meeting
function handleCreateMeeting(data) {
  appState.isLoading = true;
  appState.message = { text: "⏳ Đang tạo cuộc họp...", type: "info" };
  renderApp();

  createMeetingAPI(data).then((meeting) => {
    appState.meetings.push(meeting);
    appState.isLoading = false;
    appState.message = {
      text: "✅ Tạo cuộc họp thành công",
      type: "success",
    };
    renderApp();
  });
}
function initChangeEvents() {
document.addEventListener("change", function (e) {
  if (e.target.id === "filterSelect") {
    console.log("Change fired", e.target.value);
    appState.filter = e.target.value;
    appState.selectedMeeting = null;
    renderApp();
  } else if (e.target.id === "meetingType") {
    console.log("Change fired", e.target.value);
    if (e.target.value === MEETING_TYPES.TRUC_TUYEN){
      appState.islocationDisable = true;
      renderApp();
    }else{
      appState.islocationDisable = false;
      renderApp();
    }
  } else {
    return;
  }
});
}
function initClearMessageEvent() {
   //UX: CLEAR MESAGE
  document.addEventListener("input", function (e) {
    const msg = document.getElementById("formMessage");
    if (msg) msg.textContent = "";
  });
}
function fillFormForEdit(meeting){
  const form = document.getElementById("create-meeting-form");
  if (!form) return;
  form.title.value = meeting.title;
  form.description.value = meeting.description;
  form.meetingType.value = meeting.meetingType;
  form.startTime.value = meeting.startTime;
  form.endTime.value = meeting.endTime;
  form.location.value = meeting.location;
  form.host.value = meeting.host;
  form.description.value = meeting.description;
  form.location.value = meeting.location;
  form.requireSignature.checked = meeting.requireSignature;
  form.participants.value = meeting.participants.join(", ");
  appState.islocationDisable = meeting.meetingType === MEETING_TYPES.TRUC_TUYEN;
  appState.editingId = meeting.id;
}
//Validation
function validateMeeting(data) {
  const now = new Date();
  // Validation
  if (!data.title || data.title.trim().length < 5) {
    return "❌ Tên cuộc họp phải có ít nhất 5 ký tự.";
  }
  if (!data.startTime) {
    return "❌ Vui lòng chọn thời gian bắt đầu cuộc họp.";
  }
  if (!data.endTime) {
    return "❌ Vui lòng chọn thời gian kết thúc cuộc họp.";
  }
  if (data.endTime <= data.startTime) {
    return "❌Thời gian kết thúc phải sau thời gian bắt đầu.";
  }
  if (!data.host || data.host.trim() === "") {
    return "❌ Vui lòng nhập tên người chủ trì cuộc họp.";
  }
  if (new Date(data.startTime) < now) {
    return "❌ Thời gian bắt đầu không thể là trong quá khứ.";
  }
  return null;
}
