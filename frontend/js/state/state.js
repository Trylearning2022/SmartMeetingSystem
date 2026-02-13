export const appState = {
    meetings: [],   //Danh sách meeting hiện tại đang được render trên UI.
    selectedMeeting: null,     // Meeting đang được chọn để hiển thị chi tiết (null nếu chưa chọn)
    islocationDisable: false,
    message: null,
    isloading: false,      //Trạng thái hệ thống đang chờ dữ liệu từ API.
    filter: "all",      // Trạng thái lọc danh sách (all | upcoming | finished)
    editedId: null      // ID của meeting đang được chỉnh sửa (null nếu đang ở chế độ tạo mới)
}

