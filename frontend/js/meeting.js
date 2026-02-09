console.log("Meeting Module loaded");
import { appState } from "./state.js";
function fetchMeetings() {
  appState.isLoading = true;
  renderApp();

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          title: "Họp chuyển đổi số",
          startTime: "2026-02-10T09:00",
          endTime: "2026-02-10T10:00",
          meetingType: "truc_tiep",
          description: "Họp thống nhất giải pháp",
          location: "Phòng A",
          host: "Nguyễn Văn A",
        },
      ]);
    }, 800);
  });
}
function createMeetingAPI(data) {
  // Giả lập gọi API
  return new Promise((resolve) => {
    console.log("Gửi dữ liệu lên server:", data);
    setTimeout(() => {
      resolve({
        ...data,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      });
    }, 800);
  });
}
//INIT
fetchMeetings().then((data) => {
  appState.meetings = data;
  appState.isLoading = false;
  renderApp();
});
function renderApp() {
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
//helper
function getMeetingStatus(meeting) {
  //Tách riêng logic
  return new Date(meeting.endTime) < new Date() ? "Đã kết thúc" : "Sắp diễn ra";
}
function formatTime(timeStr) {
  const date = new Date(timeStr);
  return date.toLocaleString("vi-VN");
}
//Setselectmeeting
function setSelectedMeeting(meeting){
// Nếu click lại cuộc họp đang chọn, toggle off
  if (appState.selectedMeeting && appState.selectedMeeting.id === meeting.id){
    appState.selectedMeeting = null;
  } else {
    appState.selectedMeeting = meeting;
  }
  renderApp();
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

//Form submit
// EVENT: FORM SUBMISSION
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
  // Gọi API tạo cuộc họp
  handleCreateMeeting(data);
  e.target.reset();
});

document.addEventListener("change", function (e) {
  if (e.target.id === "filterSelect") {
    console.log("Change fired", e.target.value);
    appState.filter = e.target.value;
    appState.selectedMeeting = null;
    renderApp();
  } else if (e.target.id === "meetingType") {
    console.log("Change fired", e.target.value);
    if (e.target.value === "truc_tuyen"){
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
