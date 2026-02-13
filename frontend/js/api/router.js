export function loadMeetingPage() {
  fetch("meeting.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("content").innerHTML = html;
    //   //load meeting.js
    //   const script = document.createElement("script");
    //   script.type = "module";
    //   script.src = "./js/meeting.js";
    //   document.body.appendChild(script);
    })
    .catch((error) => {
      console.error("Không tải được nội dung:", error);
    });
}
