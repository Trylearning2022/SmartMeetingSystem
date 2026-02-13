//helper
export function getMeetingStatus(meeting) {
  //Tách riêng logic
  return new Date(meeting.endTime) < new Date() ? "Đã kết thúc" : "Sắp diễn ra";
}
export function formatTime(timeStr) {
  const date = new Date(timeStr);
  return date.toLocaleString("vi-VN");
}