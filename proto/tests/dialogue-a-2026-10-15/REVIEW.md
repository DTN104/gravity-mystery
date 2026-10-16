# Hội thoại mẫu A — kiểm tra tích hợp

Ngày 15/10/2026. Điểm vào: `proto/game.html`. Người dùng chọn mẫu A từ `proto/demo-dialogue.html`.

## Kết quả

Đã đặt chân dung, câu hỏi và lời thoại vào cùng cảnh hành lang. Lời thoại nằm ở đáy; nhật ký hội thoại và chọn vật chứng mở trong cảnh. Giao diện dùng tài nguyên và theme hiện có; kích thước/ngưỡng mới nằm trong `PARAMS.fullGame`.

| Kiểm tra | Kết quả | Bằng chứng thực tế |
|---|---|---|
| Ba nhân vật | PASS | Lâm, Thư, Khoa đều hiển thị đúng tên, chân dung và câu trả lời từ kịch bản. |
| Hỏi và ghi lời khai | PASS | Hỏi Lâm về ca trực: bộ đếm 1/7, câu hỏi có trạng thái đã hỏi, nhật ký chứa đúng lời khai. |
| Chưa có vật chứng | PASS | Khung chọn vật chứng hướng dẫn khám Lab A/phòng điều khiển và Ghi vào hồ sơ. |
| Đối chất thực tế | PASS | Thu thập Ticket bảo trì chốt trong phòng điều khiển, đưa cho Lâm, nhận đúng phản hồi. |
| Nhánh bị khóa | PASS | Xin quyền terminal của Lâm bị vô hiệu hóa khi chưa đủ 4 quy tắc; vật chứng E13 của Khoa chưa dùng được khi chưa có R4. |
| Thoại dài | PASS | Lời khai 22:10 của Khoa cuộn được trên mobile: vùng đọc 87 px, nội dung 186 px, tới cuối ở scrollTop 99 px trong kiểm tra 375 px. Nhãn cuộn đổi về trạng thái đã ghi khi đọc hết. 320 px tự thu vùng đọc để giữ chữ trong khung. |
| Câu hỏi ngoài vùng nhìn | PASS | Chọn câu hỏi cuối của Khoa cuộn danh sách; sau cập nhật vẫn giữ lựa chọn và vị trí cuộn. Có chỉ dẫn khi còn câu hỏi. |
| Bàn phím | PASS | Tab giữ focus trong nhật ký; Escape đóng và trả focus về nút Nhật ký. Đóng khung bằng chứng và Kết thúc về hành lang hoạt động. |
| Hiển thị / theme | PASS | 5 kích thước bên dưới không cuộn ngang, không chồng hai vùng, chân dung tỷ lệ 1:1. Màu nhấn tính thực tế `rgb(239,182,80)`; nền hộp thoại dùng gradient từ token của theme. Console: 0 error/warn. |

Đo từ DOM của giao diện thực; dữ liệu chi tiết trong [measurements.json](measurements.json).

| Viewport | Tỷ lệ khung chân dung | Cuộn ngang | Câu hỏi chồng lời thoại | Hai vùng nằm trong cảnh |
|---|---:|---|---|---|
| 320 × 900 | 1.00 | Không | Không | Có |
| 375 × 900 | 1.00 | Không | Không | Có |
| 768 × 900 | 1.00 | Không | Không | Có |
| 1280 × 900 | 1.00 | Không | Không | Có |
| 1176 × 750 | 1.00 | Không | Không | Có |

## Kiểm tra tự động

- `node proto/tests/game-ui.test.mjs`: **8/8 PASS**, gồm ghi lời khai, khóa terminal, thứ tự đối chất, schema nhật ký và cấu hình vật lý cũ.
- `node proto/tests/rules.test.mjs`: **2 nhóm PASS**, gồm luật thuần, mốc chu kỳ, chốt, chất lỏng, phủ gel, T17/T19 thuần.
- `node --check` cho `app.js`, `dialogue-ui.js`, `theme.js`, `params.js`: PASS.
- `git diff --check`: PASS.

## Review người mới và so với mẫu

Review riêng phát hiện thanh điều hướng cố định che câu hỏi trên mobile. Đã chuyển thanh xuống sau cảnh ở riêng màn hội thoại; review lại xác nhận thấy ba câu hỏi và hướng dẫn cuộn, không còn che nội dung. Kiểm tra thêm 320 px đã sửa việc tên xuống dòng làm dòng trạng thái tràn hộp; vùng đọc tự co lại. Ở tablet, vùng câu hỏi được giới hạn theo chiều cao tối đa của hộp thoại để luôn chừa khoảng cách.

Bố cục, hình nhân vật, màu và vị trí lời thoại khớp mẫu A. Game vẫn hiển thị câu xin quyền terminal nên Lâm có 7 lựa chọn; demo trình bày 6 câu hỏi thường.

## Hình và chuỗi thao tác

- [Lâm — mở đầu](01-lam-opening.jpg), [trả lời](02-lam-answer.jpg), [nhật ký](03-lam-journal.jpg).
- [Chọn ticket](05-evidence-ticket.jpg), [Lâm trả lời ticket](06-ticket-reply.jpg).
- [Thư](07-thu-answer.jpg), [Khoa — desktop](08-khoa-long-desktop.jpg), [Khoa — mobile](10-khoa-long-mobile.jpg), [320 px](13-khoa-320.jpg), [tablet](14-khoa-tablet.jpg).
- [Chuỗi thao tác dạng GIF](dialogue-a-walkthrough.gif): 6 trạng thái chụp trực tiếp lần lượt mở hội thoại → hỏi → nhật ký → đóng → chọn bằng chứng → đóng; đây là ảnh động các trạng thái, không phải phép đo tốc độ khung hình.

## Chưa làm / lệch spec

- Không có lỗi bố cục còn biết trong các kích thước đã kiểm tra.
- Chưa chạy lại toàn bộ T1–T21 hay đo FPS vật lý cho thay đổi giao diện này. Không dùng kết quả UI để khẳng định các test đó đã được chạy lại.
