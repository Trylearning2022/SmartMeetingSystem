fetch("meeting.html")
  .then((response) => response.text())
  .then((html) => {
    document.getElementById("content").innerHTML = html;
  })
  .catch((error) => {
    console.error("Không tải được nội dung:", error);
  });

document.addEventListener("change", function (e) {
  if (e.target.id !== "meetingType") return;

  console.log("Change fired", e.target.value);
  const locationField = document.getElementById("location");
  if (!locationField) return;

  if (e.target.value === "truc_tuyen") {
    locationField.value = "";
    locationField.disabled = true;
  } else {
    locationField.disabled = false;
  }
});
document.addEventListener("submit", function (e) {
  if (e.target.id !== "create-meeting-form") return;

  e.preventDefault();
  const form = e.target;
  const msg = document.getElementById("formMessage");
  msg.textContent = ""; // Xóa thông báo lỗi trước khi kiểm tra

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());
  const now = new Date();
  //alert(JSON.stringify(now));
  //Checkbox cần xử lý riêng
  data.requireSignature = formData.has("requireSignature");

  // Validation
  if (!data.title || data.title.trim().length < 5) {
    form.title.classList.add("error");
    msg.textContent = "❌ Tên cuộc họp phải có ít nhất 5 ký tự.";
    return;
  } else {
    form.title.classList.remove("error");
  }
  if (!data.startTime) {
    form.startTime.classList.add("error");
    msg.textContent = "❌ Vui lòng chọn thời gian bắt đầu cuộc họp.";
    return;
  }
  if (!data.endTime) {
    msg.textContent = "❌ Vui lòng chọn thời gian kết thúc cuộc họp.";
    return;
  }
  if (data.endTime <= data.startTime) {
    msg.textContent = "❌Thời gian kết thúc phải sau thời gian bắt đầu.";
    return;
  }
  if (!data.host || data.host.trim() === "") {
    msg.textContent = "❌ Vui lòng nhập tên người chủ trì cuộc họp.";
    return;
  }
  if (new Date(data.startTime) < now) {
    msg.textContent = "❌ Thời gian bắt đầu không thể là trong quá khứ.";
    return;
  }

  // UX Disable button
  const bnt = document.getElementById("btnCreate");
  bnt.disabled = true;
  bnt.textContent = "⏳ Đang tạo...";

  console.log("Dữ liệu hợp lệ:", data);
  // Giả lập gọi API
  setTimeout(() => {
    alert("Cuộc họp đã được tạo thành công!");
    form.reset();
    bnt.disabled = false;
    bnt.textContent = "➕ Tạo cuộc họp";
  }, 1200);
});
