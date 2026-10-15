# Trạm Thiên Bình — bản thử nghiệm

Đọc `docs/spec-proto-v0.4.md` và `docs/spec-sandbox-v0.3.md` từ thư mục gốc. `index.html` là prototype hồi quy; `sandbox.html` là buồng chơi bước 3. `tests/` chứa kiểm thử, số đo và thí nghiệm đối chứng, không được import vào ứng dụng.

Chạy từ thư mục gốc:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory proto
```

Cần mạng để tải Phaser 3.90.0 và lil-gui 0.20.0 từ CDN. Không cần npm install/framework/bundler.

## Chơi giao diện toàn game

Mở [game.html](http://127.0.0.1:4173/game.html), bấm **Bắt đầu điều tra**. Vào **Lab A** để xem và ghi dấu vết, gặp nhân vật ở **Hành lang**, rồi thử cơ chế trong **Hiệu chuẩn**. **Hồ sơ**, **Sổ quy tắc** và **Tái hiện** nằm ở thanh dưới; **Viết kết luận** mở biểu mẫu, **Gửi kết luận** mới nộp lựa chọn.

Tiến trình chỉ giữ trong phiên hiện tại. Tải lại hoặc xác nhận bắt đầu lượt mới sẽ xóa tiến trình. Tái hiện là minh hoạ theo kịch bản, không phải phép đo mới của engine. Kết quả kiểm tra giao diện: [UI-TEST-REPORT.md](UI-TEST-REPORT.md).

## Chơi buồng độc lập và tự test

Mở [sandbox.html](http://127.0.0.1:4173/sandbox.html). Trang [index.html](http://127.0.0.1:4173/) là prototype vật lý để hồi quy.

1. Làm theo thẻ Thư: kéo nhẹ ca trên bàn rồi thả. Trong **Bảng cục bộ**, chọn **▶ Đông**, **1 phút**, rồi **XOAY NGAY**. Ca đã ở trên bàn. Màn hình hẹp thì cuộn xuống để tìm bảng.
2. Quan sát phòng và dòng sự kiện bên dưới; để buồng trở về Xuống. Dùng **Bỏ qua chờ ▸** sau khi đã xem đoạn muốn quan sát.
3. Làm bốn thí nghiệm trong **Việc có thể thử**. Trả lời câu hỏi từ những gì vừa thấy; xem các ô đã mở trong **Sổ tay**.

Muốn nhìn qua kính: hẹn **▶ Đông / 1 phút** sau mốc **Sớm nhất có thể hẹn tiếp**, bấm **+ Thêm lịch**, rồi **Ra hành lang** trước còi. Bảng nằm cố định bên phải, không cần đóng. Sau chu kỳ, chờ nút **Vào phòng** dùng được rồi thử vào; nếu chốt chặn, bấm **Intercom → Phòng điều khiển**. Lâm chờ hết cooldown rồi xoay Tây để mở chốt.

Khi đang chờ trong buồng: chọn **Kéo/đặt vật** để kéo; **Bình nước** rồi bấm bề mặt để đổ; **Giẻ lau** rồi bấm dấu vết để lau; **Lấy bút mới** rồi bấm đống gel đã dừng để thêm bút. **Đổ đầy lại** đưa bình về kệ, dựng thẳng và nạp 0,5 L. Thả hình nộm gần tay vịn để móc, bấm tay vịn để tháo.

Mở thoại/câu hỏi đưa tốc độ về ×1; đồng hồ vẫn chạy. Nếu còn cooldown, chờ hoặc dùng ×10. Tải lại trang để chơi từ đầu; vật, dấu vết, lịch và quy tắc đã mở sẽ mất vì chưa có lưu game.

Hướng dẫn từng thí nghiệm, cách xử lý khi kẹt và phiếu playtest người mới: [docs/playtest-script.md](../docs/playtest-script.md). Tự test có hướng dẫn và lượt đo khả năng tự khám phá của người mới là hai cách thử riêng.

## Ghi chú kỹ thuật

Phím backtick bật/tắt debug. Hình nộm mặc định là khối cứng (`mannequin.hinge=false`): sandbox `standing` tại (2,5;0,85), proto hồi quy `lying` tại (1,9;0,2). Code hai khúc/khớp vẫn còn sau cờ hinge, không dùng trong sandbox hoặc T21 mặc định. Gel phủ với ≥1 hạt đã dừng trong bán kính 0,25 m.

Panel debug của proto hồi quy: chọn hướng rồi Start; thời lượng là số giây từ T0 tới RETURN (ACTIVE = duration − warnTime − 2×zeroGTime). Hẹn giờ dùng HH:MM:SS; bảng sandbox dùng Giờ/Phút. Đổ/lau: chọn công cụ rồi bấm lên mặt gần nhất. Reset giữ các tham số debug đang chỉnh, xóa vật/dấu vết/lịch/nhật ký. Tải lại trang để về toàn bộ PARAMS gốc.

Luật dùng tọa độ mét Tây–Nam; Matter dùng pixel qua `toScreen/toWorld`. Engine tích phân fixed-step 1/120 s, đủ substeps khi ×60, không cắt thời gian để giữ FPS. Air friction = 0 để hiệu chuẩn g; sleeping chỉ bật ngoài ZERO_G. Chốt hoàn toàn dùng luật 1-DoF, không phải body Matter. Collision categories lấy từ PARAMS: hình nộm ở cả hai tư thế bỏ qua mặt bàn/chân bàn, vẫn va với mọi collider khác và vật rời. Đổ ca xét vận tốc tương đối đóng theo pair.collision.normal, không xét độ lớn tốc độ trượt; luật nghiêng >60° giữ nguyên. Thông số hình học, vật liệu, thời gian, solver và hiển thị nằm trong `src/params.js`.

Kiểm thử luật (Node 22+):

```sh
node proto/tests/rules.test.mjs
```

Kiểm thử scene thật trong trình duyệt (server đang chạy):

Các runner HTML không cần CLI: mở `tests/t16.html` (sandbox cứng standing), bấm **Đo RETURN** sau ảnh ACTIVE; mở `tests/sandbox-tests.html` cho T17 UI/T18/T19/T20, R4 theo trục thân và kiểm tra cờ hinge ở cả hai tư thế. Với T21 (proto cứng lying, tiêu chí v0.4, T2 đồ bàn ≤0,5 m), mở `tests/raf-baseline.html`: trang trắng đo rAF 10 giây, rồi bấm **Chạy T21, rồi đo T14**. Cùng tab chạy toàn bộ hồi quy; bấm **Đo T14** để đo engine 30 giây thực ở ×60. Baseline <55 Hz ghi “môi trường (throttle)”; cần đo lại với cửa sổ focus, màn hình chính và không tiết kiệm pin để xác nhận hiệu năng. T17/T19 thuần chạy bằng lệnh Node ở trên. Dữ liệu và ảnh v0.3 nằm trong `tests/sandbox-v0.3/`; dữ liệu cũ được giữ riêng.

Đối chứng chỉ ở runner: `tests/regression.html?coatRadius=0.20` hoặc `?timeScale=1`; không đổi PARAMS ứng dụng. Khi phát triển, nếu trình duyệt giữ module cũ, dùng server gửi `Cache-Control: no-store` hoặc hard reload. Phiên kiểm thử này dùng cổng 4174 không cache. Bảng cục bộ hiện mốc “Sớm nhất có thể hẹn tiếp”, cập nhật khi thêm/xóa lịch và gồm cả cooldown/còi.

Các runner CLI cũ (cần `playwright-cli` và Chrome):

```sh
playwright-cli -s=gravity open http://127.0.0.1:4173 --browser=chrome --headed
playwright-cli -s=gravity --raw run-code --filename=proto/tests/run-browser.js
playwright-cli -s=gravity --raw run-code --filename=proto/tests/run-performance.js
playwright-cli -s=gravity --raw run-code --filename=proto/tests/run-supplementary.js
playwright-cli -s=gravity --raw run-code --filename=proto/tests/experiment-layout.js
playwright-cli -s=gravity --raw run-code --filename=proto/tests/run-collision-regressions.js
playwright-cli -s=gravity --raw run-code --filename=proto/tests/experiment-candidates.js
playwright-cli -s=gravity --raw run-code --filename=proto/tests/run-candidate.js
playwright-cli -s=gravity --raw run-code --filename=proto/tests/run-self-play.js
```

`run-browser` chạy T1–T13, T15 và T1b (chỉ ghi nhận, không chấm pass/fail) bằng cùng scene/engine/luật của ứng dụng, dùng bước giả lập để không phải đợi hàng giờ. Các runner tải lại trang để đo cấu hình mặc định. `run-performance` chạy 30 giây thời gian thực ở ×60; không dùng phép tính FPS từ thời gian chạy test đồng bộ. T15 tạm bỏ trần/vật khác để đáy ca rơi đúng 3 m, rồi reset. T12 dùng chu kỳ 900 s để chờ tối đa 120 s ACTIVE cho gel dừng thật, thay vì giả định 20 s là đủ; nếu không dừng, báo rõ tiền điều kiện chưa đạt. Thí nghiệm v0.3 luôn khôi phục PARAMS gốc, giữ nguyên tọa độ ca/hình nộm, g, mass, friction, detent (ngoài đối chứng T4). Runner experiment-gel và dữ liệu tương ứng còn lại là đối chứng lịch sử v0.2, không dùng làm kết quả v0.3.

Kết quả và giới hạn: xem `TEST-REPORT.md`. Báo cáo ghi riêng từng tiêu chí chưa đạt với cấu hình gốc; các đối chứng không đổi spec hay PARAMS mặc định.

Kiểm thử trạng thái UI:

```sh
node proto/tests/game-ui.test.mjs
```

Ảnh và bằng chứng chuyển động giao diện nằm trong `tests/game-ui/`. Các kết quả UI không thay thế hồi quy vật lý T1–T21.
