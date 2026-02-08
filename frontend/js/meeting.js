
function initMeetingForm() {
    const meetingTypeSelect = document.getElementById("meetingType");
    const locationField = document.getElementById("location");
    if (!meetingTypeSelect || !locationField) return;

    if (meetingTypeSelect.value === "truc_tuyen") {
        locationField.value = "";
        locationField.disabled = true;
        locationField.style.borderColor = "gray";
    }
}

console.log("Meeting module loaded");
initMeetingForm();
// EVENT: MEETING TYPE CHANGE
document.addEventListener("change", function (e) {
  if (e.target.id !== "meetingType") return;

  console.log("Change fired", e.target.value);
  const locationField = document.getElementById("location");
  if (!locationField) return;

  if (e.target.value != "truc_tuyen") {
    locationField.focus();
    locationField.style.borderColor = "blue";
    locationField.disabled = false;
  }else {
    locationField.value = "";
    locationField.disabled = true;
    locationField.style.borderColor = "gray";
  }
});

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

function createMeetingAPI(data) {
    // Giả lập gọi API
    return new Promise((resolve, reject) => {
        console.log("Gửi dữ liệu lên server:", data);
        setTimeout(() => {
           // Giả lập thành công 90%
           if (Math.random() < 0.9) {
            resolve({
                success: true,
                meetingId: Date.now()
            });
           } else {
            reject("Server Error, vui lòng thử lại.");
           }
        }, 1200);
});
}

function handleCreateMeeting(data, form) {
    const msg = document.getElementById("formMessage");
    const btn = document.getElementById("btnCreate");
    btn.disabled = true;
    btn.textContent = "⏳ Đang tạo...";
    // Gọi API tạo cuộc họp
    createMeetingAPI(data)
    .then((res) => {
        msg.style.color = "green";
        msg.textContent = "✅ Cuộc họp đã được tạo thành công! ID: " + res.meetingId;
        form.reset();
        initMeetingForm();  // Reset trạng thái form
    })
    .catch((err) => {
        msg.style.color = "red";
        msg.textContent = "❌ Lỗi khi tạo cuộc họp: " + err;
    })
    .finally(() => {
        btn.disabled = false;
        btn.textContent = "➕ Tạo cuộc họp";
    });
}


// EVENT: FORM SUBMISSION
document.addEventListener("submit", function (e) {
  if (e.target.id !== "create-meeting-form") return;

  e.preventDefault();
  const form = e.target;
  const msg = document.getElementById("formMessage");
  msg.textContent = ""; // Xóa thông báo lỗi trước khi kiểm tra

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  //alert(JSON.stringify(now));
  //Checkbox cần xử lý riêng
  data.requireSignature = formData.has("requireSignature");

  // Validation
  const error = validateMeeting(data);
  if (error) {
    msg.style.color = "red";
    msg.textContent = error;
    return;
  }
  // Gọi API tạo cuộc họp
  handleCreateMeeting(data, form);
});
