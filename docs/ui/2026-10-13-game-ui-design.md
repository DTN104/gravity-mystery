# UI toàn game — Trạm Thiên Bình

Ngày 13/10/2026. Trạng thái: **đã được người dùng duyệt; đã triển khai tại `proto/game.html`**.

## 1. Mục tiêu và nguồn

Dựng giao diện người chơi có thể bấm và đi qua toàn bộ các màn của vụ án: menu, hành lang, khám hiện trường, hội thoại, hồ sơ, phòng điều khiển, buồng hiệu chuẩn, tái hiện và kết luận. Ưu tiên người mới biết mình đang ở đâu, có thể làm gì và vừa quan sát được điều gì.

Người dùng chọn **hai bảng toàn game nền tối của A**, không phối với B, C hoặc D:

- [Menu / điều tra / hội thoại / hồ sơ](2026-10-13-full-game-a-core.png).
- [Hành lang / điều khiển / tái hiện / kết luận](2026-10-13-full-game-a-flow.png).
- [Buồng hiệu chuẩn cùng phong cách A](2026-10-13-option-a.png).

Nội dung dựa trên `docs/concept-v0.2.md` và `docs/script-characters-v0.2.md`. Buồng hiệu chuẩn dùng cơ chế hiện có theo `spec-sandbox-v0.3.md`, cùng hướng dẫn đang chạy. Không sáng tác thêm vụ án, nhân vật, căn phòng hay bằng chứng.

## 2. Phong cách chung

- Nền than và xanh xám, chữ sáng, màu vàng cho hành động chính và lựa chọn hiện tại; viền mảnh, góc bo vừa phải theo mẫu A.
- Chữ tiếng Việt có dấu; tên hướng viết đầy đủ. Thời lượng hiển thị **1 phút / 5 phút / 15 phút**. Nhãn chính xác là **Chu kỳ tới khi về Xuống**, thay cho nhãn mơ hồ trong ảnh mẫu.
- Mỗi màn có tên địa điểm hoặc công việc, hành động chính rõ và đường quay lại. Các nút giữ cùng hình dạng, cỡ chữ, trạng thái chọn, focus và disabled.
- Cảnh phòng vẫn là game **2D nhìn ngang**. Phối cảnh trong ảnh mẫu chỉ minh hoạ không khí; không chuyển engine sang 3D hoặc dùng ảnh có sẵn các nút thay cho UI thật.
- Quan sát hiện trường nằm cạnh cảnh. Hội thoại dùng mẫu A được chọn ngày 15/10/2026: chân dung, câu hỏi và lời thoại cùng nằm trong cảnh hành lang; lời thoại ở đáy cảnh. Hình nhân vật và minh hoạ môi trường là tài nguyên riêng; chữ và nút là phần tử tương tác thật.
- Tên cửa đúng là **Lab A / Hiệu chuẩn / Điều khiển**. Không dùng nhãn Lab B, Lab C xuất hiện trong ảnh minh hoạ menu.

## 3. Các màn và hành vi

| Màn | Nội dung và thao tác |
|---|---|
| Menu | Bắt đầu điều tra, mở buồng hiệu chuẩn, đọc cách chơi. Ghi rõ bản thử nghiệm chưa lưu tiến trình; không có nút tiếp tục giả. |
| Hành lang | Ba cửa tới Lab A, buồng hiệu chuẩn, phòng điều khiển; danh sách Lâm, Thư, Khoa để bắt đầu hội thoại. Chỉ dẫn ngắn: chọn phòng hoặc người muốn gặp. |
| Lab A | Ảnh hiện trường với các điểm khám nghiệm từ kịch bản. Bấm một điểm để khoanh vật/vết và đọc quan sát ở cột phải; Ghi vào hồ sơ không tạo bản ghi trùng. Hiện trường là ảnh đã niêm phong, không kéo hoặc đổ nước lên đó. |
| Hội thoại | Mẫu A của `proto/demo-dialogue.html`: chân dung lớn bên trái trong hành lang, câu hỏi nổi bên phải trong cùng cảnh, tên/vai trò/lời thoại ở đáy. Nhật ký hội thoại và Đưa bằng chứng mở trong cảnh; Kết thúc quay lại hành lang. Màn hẹp xếp chân dung, lời thoại, câu hỏi theo chiều dọc trong cảnh. Giữ điều kiện khóa, ghi lời khai và đối chất theo cây kịch bản, không có nhãn báo người nói thật/dối. |
| Hồ sơ | Ba mục Bằng chứng / Lời khai / Giả thuyết. Mỗi mục ghi nguồn và địa điểm. Giả thuyết Chuyện gì / Khi nào / Ai do người chơi chọn, chưa được chọn thì để trống; không điền lời giải hộ. Có đường tới thí nghiệm liên quan và quay lại điều tra. |
| Phòng điều khiển | Nhật ký đêm qua, tablet bảo trì, ticket và giao diện chẩn đoán. Nhật ký chỉ có Giờ / Phòng / Sự kiện / Nguồn. Quyền xem terminal và nội dung được mở theo kịch bản, không giả lập đăng nhập tài khoản thật. |
| Buồng hiệu chuẩn | Cảnh vật lý hiện có, bảng cục bộ cố định bên phải, hướng dẫn ba bước và các công cụ lớn dưới phòng. Hướng xếp hình chữ thập; hẹn giờ gập; các thẻ không che phòng. Cửa, chốt, intercom, đổ nước và sổ quy tắc dùng chức năng hiện có. |
| Tái hiện | Bốn lựa chọn điều kiện từ kịch bản; kết quả và ảnh hiện trường đặt cạnh nhau. Khi chưa chạy phải hiện trạng thái chưa có kết quả. Kịch bản chọn kết quả soạn sẵn cho 16 tổ hợp; giao diện phải ghi rõ tái hiện minh hoạ và không tuyên bố đây là phép đo mới của engine. |
| Kết luận | Ba lựa chọn: người chịu trách nhiệm, cách phòng khóa, bằng chứng thời điểm. Để trống ban đầu, báo thiếu trường trước khi gửi. Có Tiếp tục điều tra và lựa chọn kết thúc sớm theo kịch bản. Phản hồi dùng văn bản kịch bản, không tự lộ ô sai hoặc đáp án đúng. |

Điểm khám nghiệm dùng nội dung quan sát ban đầu. Lớp diễn giải bổ sung chỉ xuất hiện sau khi người chơi mở quy tắc tương ứng trong buồng hiệu chuẩn. Hội thoại vòng sau và bằng chứng bị khóa dùng điều kiện trong kịch bản; trạng thái khóa nói lý do bằng lời.

## 4. Luồng và trạng thái

Luồng chính: **Menu → Hành lang → Lab A / Hội thoại → Buồng hiệu chuẩn → Đọc lại hiện trường và hồ sơ → Tái hiện → Kết luận**. Người chơi có thể quay lại các địa điểm và hồ sơ trong cùng phiên.

Điều hướng không làm mất bằng chứng đã ghi, lịch sử hội thoại, giả thuyết hoặc quy tắc đã mở. Buồng hiệu chuẩn được giữ cùng một phiên khi mở hồ sơ rồi quay lại. Thẻ và sổ tay không tự dừng vật lý. Việc ra/vào buồng vẫn phải tuân thủ cửa và chốt hiện có; đổi màn không trở thành cách thoát khi đang bị khóa.

Trạng thái điều tra ở bộ nhớ trong một phiên, theo phạm vi concept. Bắt đầu lượt mới hoặc tải lại sẽ xóa tiến trình; thao tác bắt đầu lại phải nói rõ điều này. Không thêm lưu game, đồng bộ tài khoản, nhiều vụ án, âm nhạc hoặc lồng tiếng trong đợt UI này.

## 5. Ghép với code hiện tại

- Thêm điểm vào giao diện toàn game tại `proto/game.html`; `proto/index.html` giữ nguyên cho hồi quy và `proto/sandbox.html` tiếp tục mở độc lập được.
- Dùng HTML/CSS/JavaScript thuần của dự án, không thêm framework hoặc dependency. Dữ liệu kịch bản và trạng thái điều tra thuộc `src/game/`, không đưa vào `rules/`.
- Tái sử dụng `SandboxScene`, `Hud`, `Guide`, `PanelUI`, `Cards`, `Detector` và các hành động của buồng. Không dựng lại mô phỏng hoặc dùng một bản vật lý khác cho UI mới.
- Màu, kích thước, thời lượng, hình học vùng tương tác và các ngưỡng mới lấy từ một nhánh UI trong `PARAMS`. Nội dung bằng chứng và hội thoại là dữ liệu kịch bản riêng.
- `rules/` chỉ import `params.js` thuần; không import Phaser/Matter hoặc `game/`, `view/`, `world/`.
- Không đổi g, khối lượng, ma sát, detent, vị trí hoặc collision filter đã chốt. Không thay tiêu chí các test vật lý để làm UI vượt kiểm tra.
- Nhật ký sự kiện trong buồng và nhật ký được trình bày ở phòng điều khiển đều không ghi hướng. Hướng của lịch hiện tại, nếu được xem, nằm trong bảng lịch riêng theo concept.

## 6. Hiển thị và tiếp cận

Desktop là bố cục chính theo mẫu A: cảnh lớn bên trái, cột nội dung bên phải, thanh công cụ hoặc điều hướng ngay dưới cảnh. Riêng hội thoại theo mẫu A duyệt ngày 15/10 đặt toàn bộ nội dung trong cảnh như bảng trên. Khi chiều rộng không đủ, xếp dọc và giữ cảnh cùng hành động chính dễ tìm; không cuộn ngang. Lời thoại dài và danh sách câu hỏi có vùng cuộn riêng cùng chỉ dẫn khi còn nội dung. Bảng nhật ký thích ứng mà không mất nội dung.

Trên màn hẹp ở riêng màn hội thoại, thanh điều hướng nằm sau cảnh thay vì cố định đè lên các câu hỏi.

Các thao tác ngoài canvas dùng button/input/select thật, có nhãn, focus rõ và dùng bàn phím được. Màu không là dấu hiệu duy nhất: chọn/khóa/đã ghi đều có chữ hoặc trạng thái tương ứng. Vật nhỏ trong buồng có nhãn và vùng bắt chuột lớn hơn hình vẽ; tăng hình vẽ không tăng thân vật lý.

## 7. Kiểm tra khi triển khai

| Kiểm | Điều kiện đạt |
|---|---|
| Điều hướng | Đi qua cả 9 màn và quay lại được; tiến trình trong phiên không bị reset vì đổi màn. |
| Khám nghiệm | Chọn đúng vùng, đọc quan sát, ghi một lần; nội dung bổ sung không lộ trước quy tắc tương ứng. |
| Hội thoại | Chọn câu hỏi, ghi lời khai, đưa bằng chứng và nhánh bị khóa hoạt động đúng dữ liệu kịch bản. |
| Hồ sơ | Nguồn rõ, các lựa chọn chưa được trả lời để trống; quay lại địa điểm/thí nghiệm được. |
| Nhật ký | Các bản ghi chỉ có trường được phép; hướng không lọt vào nội dung nhật ký hoặc dữ liệu bản ghi. |
| Buồng | Kéo ca, xoay, RETURN, dùng công cụ và mở sổ tay vẫn hoạt động; không thoát qua điều hướng khi cửa đang khóa. |
| Tái hiện / kết luận | Thiếu lựa chọn có phản hồi; soạn sẵn được ghi rõ; gửi lựa chọn không tự tiết lộ đáp án. |
| Kích thước / bàn phím | Kiểm tra desktop và màn hẹp, không cuộn ngang, không che cảnh bằng thoại; nút và trường nhập dùng bàn phím được. |
| Hồi quy | Chạy kiểm thử luật hiện có và kiểm tra buồng với cùng cấu hình trước/sau. Chỉ ghi kết quả các test thực sự đã chạy, không dùng báo cáo vật lý cũ làm bằng chứng cho UI mới. |

Cần ảnh chụp các màn để so với mẫu và bằng chứng chuỗi thao tác cho điều hướng/hội thoại/thí nghiệm. Review riêng dưới góc nhìn người mới trước khi gọi UI hoàn thành. Kết quả mới ghi thành báo cáo UI riêng, không ghi đè lịch sử `TEST-REPORT.md` nếu chưa chạy lại đầy đủ bộ test đó.

## 8. Giới hạn của bản dựng

Đợt này dựng UI tương tác toàn game và nối với buồng vật lý đang có. Đây chưa là bản phát hành hoàn chỉnh của vụ án: các nội dung điều tra dùng kịch bản v0.2, tái hiện dùng kết quả soạn sẵn, chưa có lưu phiên hay âm thanh. Mỗi phần minh hoạ được ghi rõ trên màn tương ứng; không báo game hoàn chỉnh hoặc vật lý đã đạt lại toàn bộ test chỉ từ ảnh UI.
