import { appState } from "../../state/state.js";
import { getMeetingStatus } from "./meeting.utils.js";
import { setSelectedMeeting } from "./meeting.controller.js";
export function renderApp() {
  renderMessage();
  renderForm();
  renderMeetingList();
  renderMeetingDetail();
}
function renderMessage() {
  const msgEl = document.getElementById("formMessage");
  if (!msgEl) return;

  if (!appState.message) {
    msgEl.textContent = "";
    msgEl.className = "";
    return;
  }
  msgEl.textContent = appState.message.text;
  msgEl.className = appState.message.type;
}
function renderForm() {
  const locationField = document.getElementById("location");
  if (!locationField) return;
  if (!appState.islocationDisable) {
    locationField.focus();
    locationField.style.borderColor = "blue";
    locationField.disabled = false;
  } else {
    locationField.value = "";
    locationField.disabled = true;
    locationField.style.borderColor = "gray";
  }
}
//meeting list
function renderMeetingList() {
  const tbody = document.getElementById("meetingList");
  if (!tbody) return;

  if (appState.isLoading) {
    tbody.innerHTML = `
      <tr><td colspan="7">⏳ Đang tải dữ liệu...</td></tr>
    `;
    return;
  }

  let list = [...appState.meetings]; //dùng Spread Operator
  // Filter theo state
  if (appState.filter === "upcoming") {
    list = list.filter((m) => new Date(m.endTime) > new Date());
  }
  if (appState.filter === "finished") {
    list = list.filter((m) => new Date(m.endTime) < new Date());
  }
  if (list.length === 0) {
    tbody.innerHTML = `
      <tr><td colspan="7">Chưa có cuộc họp</td></tr>
    `;
    return;
  }

  tbody.innerHTML = "";

  list.forEach((meeting) => {
    const tr = document.createElement("tr");
    //Highlight nếu được chọn
    if (
      appState.selectedMeeting &&
      appState.selectedMeeting.id === meeting.id
    ) {
      tr.classList.add("selected");
    }
    tr.innerHTML = `
      <td>${meeting.title}</td>
      <td>${meeting.meetingType}</td>
      <td>${meeting.startTime} -> ${meeting.endTime}</td>
      <td>${meeting.location}</td>
      <td>${meeting.host}</td>
      <td>${meeting.description}</td>
      <td>${getMeetingStatus(meeting)}</td>
      <td> 
      <button class="edit-btn" data-id="${meeting.id}">✏️</button>
      <button class="delete-btn" data-id="${meeting.id}">🗑</button>
      </td>
    `;
    // Click = cập nhật State
    tr.onclick = () => {
      setSelectedMeeting(meeting);
    };

    tbody.appendChild(tr);
  });
}
function renderMeetingDetail() {
  const container = document.getElementById("meetingDetail");
  if (!container) return;

  //Nếu chưa chọn cuộc họp
  if (!appState.selectedMeeting) {
    container.innerHTML = "<i> Chọn một cuộc họp để xem chi tiết </i>";
    return;
  }
  const m = appState.selectedMeeting;

  container.innerHTML = `
    <h3> 📌 Chi tiết cuộc họp</h3>
    <p><b>Tiêu đề:</b> ${m.title}</p>
    <p><b>Loại:</b> ${m.meetingType}</p>
    <p><b>Thời gian:</b> ${m.startTime} → ${m.endTime}</p>
    <p><b>Chủ trì:</b> ${m.host}</p>
    <p><b>Địa điểm:</b> ${m.location}</p>
    <p><b>Nội dung:</b> ${m.description}</p>
    <p><b>Trạng thái:</b> ${getMeetingStatus(m)}</p>
    `;
}
