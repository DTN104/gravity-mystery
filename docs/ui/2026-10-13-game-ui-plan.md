# Kế hoạch dựng UI A

Đặc tả đã được người dùng duyệt ngày 13/10/2026. Thực hiện trong chat hiện tại, nối UI theo từng phần rồi kiểm tra kết quả chạy thật.

1. Chuẩn bị nền hành lang, Lab A, phòng điều khiển và chân dung riêng cùng phong cách A. Mọi chữ, nút và trường nhập được dựng bằng HTML/CSS thật.
2. Thêm `proto/game.html`, lớp trình bày, dữ liệu kịch bản và trạng thái điều tra trong `src/game/`. Thêm nhánh UI trong `PARAMS`; không sửa tham số vật lý hiện có.
3. Dựng menu, hành lang, Lab A, hội thoại, hồ sơ và phòng điều khiển. Kiểm tra ghi bằng chứng không trùng, khóa nội dung theo quy tắc và quyền, nhật ký không chứa hướng.
4. Tích hợp cùng phiên sandbox hiện có, thêm giao diện A có phạm vi riêng và cầu nối trạng thái được kiểm tra nguồn. Điều hướng không vượt cửa khóa, không reset vật hay quy tắc.
5. Dựng tái hiện minh hoạ theo kịch bản và kết luận ba lựa chọn. Kiểm tra lựa chọn thiếu, phản hồi sai, nhánh đối chất và kết thúc sớm.
6. Chạy các test luật hiện có, test trạng thái điều tra mới và kiểm tra UI trong trình duyệt ở desktop/màn hẹp. Ghi ảnh và chuỗi thao tác; nhờ review riêng từ góc nhìn người mới theo frontend-design-workflow. Sửa lỗi tìm được, mở bản chơi và ghi báo cáo UI.

Các file hiện có dự kiến sửa: `proto/src/params.js`, `proto/src/game/scene.js`, `proto/src/game/panel-ui.js`, `proto/sandbox.html`, `proto/README.md`. Các file mới ở `proto/src/game/`, `proto/assets/ui/`, `proto/tests/` và tài liệu UI. Giữ nguyên `proto/index.html`, `rules/`, `world/`, tiêu chí test vật lý và các bản feedback người dùng đã điền.

Không thêm framework, dịch vụ bên ngoài, lưu game hoặc âm thanh. Không dùng ảnh mockup nguyên tấm làm trang tương tác.

## Kết quả

Đã triển khai các màn, nối buồng hiện có, chạy kiểm thử trạng thái/luật và kiểm tra trình duyệt. Review từ góc nhìn người mới đã được sửa và kiểm tra lại. Chi tiết bằng chứng và giới hạn: `proto/UI-TEST-REPORT.md`.
