fetch("meeting.html")
  .then((response) => response.text())
  .then((html) => {
    document.getElementById("content").innerHTML = html;
  })
  .catch((error) => {
    console.error("Không tải được nội dung:", error);
  });
document.addEventListener("submit", function(e) {
  if (e.target && e.target.id === "create-meeting-form") {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    //Checkbox cần xử lý riêng
    data.requireSignature = formData.has("requireSignature");
    console.log("Dữ liệu biểu mẫu:", data);
    alert("Cuộc họp đã được tạo thành công!");
  }
});