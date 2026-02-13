import { appState } from "../state/state.js";
import { renderApp } from "../modules/meeting/meeting.render.js";

let fakeMeetingDB = [
  {       id: 1,
          title: "Họp chuyển đổi số",
          startTime: "2026-02-10T09:00",
          endTime: "2026-02-10T10:00",
          meetingType: "truc_tuyen",
          participants: ["Nguyễn Văn A", "Trần Thị B"],
          description: "Họp thống nhất giải pháp",
          location: "Phòng A",
          requireSignature: false,
          host: "Nguyễn Văn A",
  },
    ];
export function fetchMeetings() {
  appState.isLoading = true;
  renderApp();

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...fakeMeetingDB]);   //clone DB
    }, 800);
  });
}
export function createMeetingAPI(data) {
  // Giả lập gọi API
  return new Promise((resolve) => {
    console.log("Gửi dữ liệu lên server:", data);
    setTimeout(() => {
      const newMeeting = {
        ...data,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      };
      fakeMeetingDB.push(newMeeting);
      resolve(newMeeting);
    }, 800);
  });
}

export function deleteMeetingAPI(id){
  return new Promise((resolve) => {
    console.log("Gửi yêu cầu xóa cuộc họp id=", id);
    setTimeout(() => {
      fakeMeetingDB = fakeMeetingDB.filter(m => m.id !== id);
      resolve(true);
    }, 500);
});
}

export function updateMeetingAPI(id, data){
  return new Promise((resolve)=>{
    console.log("Gửi yêu cầu cập nhật cuộc họp id=", id, data);
    setTimeout(() => {
      const index = fakeMeetingDB.findIndex(m => m.id ===id);
      if (index !== -1){
        fakeMeetingDB[index] = { ...fakeMeetingDB[index], ...data };
      }
      resolve(fakeMeetingDB[index]);
    },  600);
  });
}