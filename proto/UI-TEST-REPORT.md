# Báo cáo kiểm tra UI — Trạm Thiên Bình

Ngày: 13/10/2026. Bản dựng: `game.html`, theo hai bảng mẫu A đã duyệt. Nội dung: concept/script v0.2; buồng dùng sandbox v0.3 hiện có.

## Cấu hình và cách chạy

Server localhost cổng 4173; trình duyệt Codex In-app Browser. Thao tác bằng nút, bàn phím và chuột thật qua UI; không nạp giả quy tắc/bằng chứng vào phiên kiểm tra. Có kiểm thử trạng thái riêng bằng Node.

`index.html` giữ nguyên. Chỉ thêm nhánh `PARAMS.fullGame`; fixture trước UI được lưu ở `tests/game-ui/params-before-ui.json`. So sánh toàn bộ PARAMS cũ đạt: g, khối lượng, ma sát, detent, vị trí, hình học/collision và các ngưỡng vật lý đều giữ nguyên. Thay đổi chung ở buồng độc lập chỉ là nhãn thời lượng/chép hướng dẫn; skin, vùng bắt chuột và cầu nối chỉ bật với `?ui=game`.

## Kiểm thử tự động

| Test | Kết quả | Đối chứng / số đo |
|---|---|---|
| UI-STATE-1 | PASS | Bằng chứng ghi một lần; terminal khóa; chưa có diễn giải trước quy tắc. |
| UI-STATE-2 | PASS | Lời khai không trùng, có nguồn; xin quyền cần 4 quy tắc. |
| UI-STATE-3 | PASS | Các bước đối chất Khoa bị chặn nếu thiếu vật chứng/quy tắc, mở theo thứ tự. |
| UI-STATE-4 | PASS | Bản ghi nhật ký đúng 4 trường: time, room, event, origin; không có hướng. |
| UI-STATE-5 | PASS | Kiểm đủ 16 tổ hợp tái hiện; hướng/nước đổi đối chiếu, không kết luận chắc chốt ban đầu. |
| UI-STATE-6 | PASS | Chặn kết luận thiếu trường/chứng cứ, xử lý lựa chọn sai và kết luận đủ. |
| UI-STATE-7 | PASS | Cầu nối từ chối dữ liệu sai kiểu và ID quy tắc không biết. |
| UI-STATE-8 | PASS | Deep comparison toàn bộ PARAMS trước/sau, bỏ duy nhất nhánh fullGame: bằng nhau. |
| Luật hiện có | PASS | Hai nhóm của `rules.test.mjs`: cấu hình/import/chu kỳ/chốt/chất lỏng/coat; T17 lịch/bảng tổng và T19 detector/negative controls/retry. Đây là kiểm luật thuần, không phải chạy lại đầy đủ scene T1–T21. |
| Cú pháp JS thay đổi | PASS | Node kiểm app, bridge, theme và scene. |

Lệnh tái chạy: `node proto/tests/game-ui.test.mjs` và `node proto/tests/rules.test.mjs`. Kết quả máy: [state-results.json](tests/game-ui/state-results.json).

## Kiểm tra trực tiếp trong trình duyệt

| Test | Kết quả | Quan sát thực tế |
|---|---|---|
| UI-1 · Điều hướng | PASS | Đã vào đủ 9 màn: menu, hành lang, Lab A, hội thoại, hồ sơ, điều khiển, hiệu chuẩn, tái hiện, kết luận; có đường quay lại. |
| UI-2 · Khám nghiệm | PASS | Vết cà phê ghi vào hồ sơ; nút thành “Đã ghi vào hồ sơ” và disabled. R1 mở từ buồng thật rồi phần “Đọc lại sau thí nghiệm” xuất hiện. |
| UI-3 · Hội thoại | PASS | Hỏi Thư về khay gel; lời đáp đúng câu, câu đang hỏi có viền/chữ vàng; lời khai lưu với nguồn Lê Minh Thư. Bằng chứng không có nhánh đối chất được disabled. |
| UI-4 · Terminal | PASS | Terminal khóa dẫn tới đúng Lâm dù trước đó gặp Thư; xin quyền disabled khi chưa đủ 4 quy tắc. Nhánh mở quyền/đối chất đầy đủ được kiểm ở UI-STATE-2/3, chưa chơi hết vụ án qua browser. |
| UI-5 · Nhật ký | PASS | Bảng đêm qua có đúng 4 cột, 4 bản ghi; mốc RETURN 22:15:00; không có cột/nội dung hướng. |
| UI-6 · Kéo / xoay / cửa | PASS | Kéo và thả ca chuyển Thư từ 1/3 sang 2/3. Chạy Đông, 1 phút; cửa khóa, dụng cụ disabled; nút về hành lang báo chờ mở khóa. Có ACTIVE Đông, ZERO_G và trở về Xuống; không thoát qua điều hướng khi khóa. |
| UI-7 · Quy tắc / giữ phiên | PASS | Trả lời đúng R1 và R2 sau RETURN; cả hai sang Sổ quy tắc chung. Rời và trở lại buồng vẫn cùng phiên: giờ đã chạy tiếp từ 21:55 tới 21:57, không khởi tạo lại. Vào phòng qua chốt mở được. |
| UI-8 · Đổ / lau / nạp | PASS | Đổ trên sàn: bình 0,5 → 0,4 L, hiện vũng; chọn Lau và bấm vũng: hình vũng mất; Nạp bình: 0,4 → 0,5 L. Cảnh giữ 477 × 357 px khi đổi công cụ và hiện nhãn (chênh kích thước 0 px). |
| UI-9 · Tái hiện | PASS | Thiếu lựa chọn báo đủ 4 điều kiện. Nằm/ướt/mở/Đông cho 6 dòng Khớp; đổi sang Tây xóa kết quả cũ, chạy lại cho 6 dòng Lệch. Nhãn “soạn sẵn… không phải phép đo mới” hiện rõ. |
| UI-10 · Kết luận / lượt mới | PASS | Ba ô để trống; gửi báo chọn đủ 3 mục. Kết thúc sớm hiện đoạn kết; Chơi lại đưa tới thông báo xóa phiên, xác nhận xóa lời khai/bằng chứng/buồng. Kết luận đúng toàn vụ được kiểm ở unit; chưa chạy một lượt giải đúng hoàn chỉnh trong browser. |
| UI-11 · Chẩn đoán | PASS | Chạy rồi trở lại sau 255,43 s thực (>180 s): thấy “đợi xác nhận tay”, có nút xác nhận. Bấm xác nhận tiếp tục và có thông báo. Không đo chính xác thời điểm chuyển trạng thái ở giây 180 vì đang kiểm màn khác. |
| UI-12 · Kích thước / bàn phím | PASS | Kết luận ở viewport yêu cầu 320/375/768/1400 px: scrollWidth = clientWidth, không có nút/ô chọn ra ngoài ngang. Menu, hành lang, hội thoại, hiện trường, hồ sơ, điều khiển và buồng kiểm ở 375/1400 px. Buồng 375 px cuối: một cột 281 px, canvas 279 × 209 px, tài liệu con clientWidth = scrollWidth = 313 px. Tab tới Hồ sơ có outline solid 3 px. Chưa kiểm điều khiển canvas bằng touch/keyboard hoặc trình duyệt khác. |

Các lỗi thấy trong khi dựng đã sửa: đường về hành lang, hover giống trạng thái câu hỏi chọn, mô tả giả thuyết, tên nút nộp/mở kết luận, chân dung mobile bị cắt, nút phòng mobile bị cắt, CSS buồng mobile đè thứ tự, và cảnh đổi cỡ khi hiện hướng dẫn/nhãn. Review ảnh cuối không còn lỗi cụ thể trong ba ảnh được giao: [NEW-USER-REVIEW.md](tests/game-ui/NEW-USER-REVIEW.md). Đây là review ảnh của agent, chưa thay thế playtest người thật.

## Bằng chứng

- [Menu](tests/game-ui/menu.jpg), [hành lang](tests/game-ui/hallway.jpg), [Lab A](tests/game-ui/lab-observation.jpg).
- [Hội thoại](tests/game-ui/dialogue-reply.jpg), [hồ sơ](tests/game-ui/file-evidence.jpg), [lời khai](tests/game-ui/file-statements.jpg), [điều khiển](tests/game-ui/control.jpg).
- [Buồng](tests/game-ui/calibration-idle.jpg), [khóa cửa](tests/game-ui/calibration-locked.jpg), [ACTIVE](tests/game-ui/calibration-active.jpg), [RETURN](tests/game-ui/calibration-return.jpg), [sổ quy tắc](tests/game-ui/rule-book.jpg).
- [Tái hiện](tests/game-ui/replay-east-wet.jpg), [kết luận thiếu trường](tests/game-ui/conclusion-required.jpg), [kết thúc sớm](tests/game-ui/ending-early.jpg).
- [Chuyển động tái hiện GIF](tests/game-ui/replay-motion.gif): 32 ảnh chụp browser thật trong 2.583 ms; giữ thời gian từng frame từ `replay-frames.json`, không phải video/motion do AI sinh.
- Ảnh mobile và đo ngang trong `tests/game-ui/responsive-*.jpg` và `browser-results.json`. Một số ảnh chu kỳ/hồ sơ được chụp trước các sửa bố cục cuối; các kiểm thử tương ứng được ghi đúng phạm vi trên bảng.
- Tài nguyên hình UI do imagegen sinh thành từng asset riêng; toàn bộ prompt/provenance: [game-assets-prompts.md](../docs/ui/2026-10-13-game-assets-prompts.md). Chữ và nút vẫn là HTML tương tác.

## Chưa làm / lệch spec

- Chưa chạy lại toàn bộ scene T1–T21 và T14/FPS trong lượt UI này. Không ghi đè hoặc dùng các PASS lịch sử của `TEST-REPORT.md` làm số đo mới.
- Chưa có lượt chơi người thật từ đầu tới kết luận đúng; chưa kiểm đủ R3–R5/intercom qua skin mới trong browser. Luật/detector/nhánh trạng thái đã kiểm riêng, R1/R2 đã kiểm qua cầu nối thật.
- Tái hiện là minh hoạ soạn sẵn, không áp dụng engine để đo lại 16 điều kiện. Tư thế đổi vị trí minh hoạ và dòng mô tả; đối chiếu hiện dựa hướng, nước và chốt theo phần kịch bản đã xác định. Không tự suy ra bảng vật lý chưa được đặc tả.
- Một số lời thoại/đoạn kết rút gọn để dựng UI; chưa phải bản nội dung phát hành hoàn chỉnh. Chưa lưu game, âm thanh/lồng tiếng, đồng bộ tài khoản.
- Desktop là bố cục chính. Màn hẹp xếp dọc, buồng có cuộn trong frame và bảng; chưa xác nhận trải nghiệm touch. Chưa chấm lại tiêu chí diện tích cảnh của sandbox cũ vì game shell thêm header/điều hướng.

Mẫu ghi feedback: [playtest-ui-template.md](../docs/ui/playtest-ui-template.md).

Bước tiếp theo: playtest một lượt điều tra không được chỉ đường; ghi nơi kẹt, nhãn không hiểu, bằng chứng không biết dùng, và điều gì khiến người chơi chọn kết luận. Sửa từ feedback đó trước khi thêm tính năng.

## Sửa sau review 14/10/2026 (Claude)

Bản gốc trước khi sửa: `_backup-ui-2026-10-13/`. Không chạm `rules/`, `world/`, tham số vật lý.

| # | Lỗi | Sửa | Kiểm |
|---|---|---|---|
| 1 | Phòng co theo chữ (IDLE 470×350 → ACTIVE 265×190 trong ảnh report) và nhỏ | `sandbox-bridge.js`: `#game-hud` (công cụ, thoại, nhắc) chuyển sang cột phải; `fit()` chỉ trừ `#status-bar` + `#events` với `min-height` 3 dòng cố định (`interface.css`) | Headless 1440×900: IDLE 724×543 = ACTIVE 724×543; 1265×711: 472×354 ở cả hai trạng thái |
| 2 | Chốt cửa và viền còi không vẽ khi `?ui=game` (`objectGraphics` bị ẩn) | `sync()` vẽ chốt + viền WARN lên lớp overlay của bridge, cùng công thức `ProtoScene.draw` | Ảnh ACTIVE có chốt ở vị trí ĐÓNG được khoanh khi narrator báo |
| 3 | `update()` bước thời gian không giới hạn — iframe ẩn rồi hiện lại dồn hàng phút vào một frame | `main.js`: `delta = min(delta, view.maxFrameDelta = 0,25 s)`; fixture `params-before-ui.json` cập nhật thêm đúng khóa này | Giả lập vắng 300 s → `cycle.now` tăng 0,25 s |
| 4 | Vùng bắt chuột +12 px chỉ có ở `?ui=game` | `scene.js`: bỏ điều kiện `uiMode`, áp mọi chế độ | sandbox-tests.html 8/8 PASS |
| 5 | Thẻ Thư/câu hỏi prepend đầu cột phải, ngoài tầm nhìn khi đã cuộn | `#guide`, `#cards` sticky top (cả `sandbox.html` và `interface.css`) | Nhìn ảnh |
| 6 | Nhãn SÀN trên tường Đông/Tây và nhãn vết trên tường bị cắt ở mép khung | `marks.js`: nhãn tường lùi vào trong `0,8×markFont`; nhãn vết kẹp trong phòng | Nhìn ảnh |

Chạy lại: `node tests/game-ui.test.mjs` 8/8, `node tests/rules.test.mjs` PASS, `tests/sandbox-tests.html` 8/8 (headless Chromium, Phaser từ npm). Chưa chạy lại T1–T21 scene và chưa có test tự động cho `?ui=game`.

## Cập nhật 14/10/2026 — sửa ảnh nhân vật bị méo

Đã sửa tỷ lệ chân dung/thumbnail và uniform scale hình nộm. 9/9 trường hợp chân dung (3 nhân vật × 3 kích thước khung nhìn) giữ tỷ lệ gốc; lời thoại dài không đổi kích thước ảnh. 8/8 UI-STATE và hai nhóm luật PASS, PARAMS vật lý cũ giữ nguyên. [Số đo và ảnh đối chứng](tests/character-aspect-2026-10-14/REPORT.md). Chưa chạy lại toàn bộ hồi quy vật lý/T14 trong lượt này.
