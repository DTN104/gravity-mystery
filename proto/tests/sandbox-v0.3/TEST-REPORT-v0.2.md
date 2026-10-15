# Báo cáo T16–T21 và hồi quy T1–T15 + T1b — 10/10/2026 · sandbox v0.2

Đã đọc `docs/spec-sandbox-v0.2.md`, thay v0.1. Áp dụng changelog vào `proto/`: **hipDamping=0**, sandbox **mannequin.pose=lying**, **gelCoatMin=1**, **coatRadius=0,25 m**; bảng cục bộ thêm “Sớm nhất có thể hẹn tiếp”, gồm thời lượng tới RETURN, cooldown và còi. Runner T16 bỏ giới hạn đầu, RETURN mép ≤1,0 m; T2 ca/bút/sổ ≤0,6 m; T14 đo rAF trang trắng 10 s trước engine. Không sửa spec hoặc `proto/index.html`.

Giữ **g=9,81 m/s²**, tổng hình nộm **70 kg (45/25)**, mọi khối lượng/ma sát, detent mặc định **6 N**, tọa độ ca **(1,3;0,95)** và hông nằm **(1,9;0,2)**. `rules/` chỉ import `params.js`, không Phaser/Matter/game/view/world. Nhật ký không ghi hướng; schema `{t,event,origin[,user]}`. Sandbox đọc `mannequin.pose`; tên `mannequinPose` cũ vẫn phục vụ debug proto và fixture T1b.

**Kết quả: T16–T20 PASS; T21 FAIL. Hồi quy 12/15 PASS, T1/T2/T12 FAIL; T1b ghi nhận riêng. R4 lying PASS. T14 PASS: baseline 119,988 Hz, engine 119,131 FPS.** Các kết quả là lượt chạy mới với cấu hình v0.2; đối chứng không được tính vào PASS mặc định.

Môi trường: MacBook/macOS, in-app browser Chrome 155, Phaser 3.90.0/Matter đi kèm; canvas 960×540, fixed-step 1/120 s. Server `127.0.0.1:4174` gửi `Cache-Control: no-store`. Test chức năng bước engine thật để chờ lịch; FPS lấy 30 s thực, 60 gel, ×60. Baseline trang trắng không tải Phaser, đo 10 s trước khi điều hướng cùng tab sang engine; visible, focus=true, không bị ẩn trong mẫu.

| Test | Kết quả | Số đo thực tế và nhận xét |
|---|---|---|
| T16 | **PASS** | Lying, EAST 60 s, đúng **3,000 s ACTIVE**. Thân/chân lệch phương đứng **3,251536° / 1,411625°**; mép cách Đông **0,006150 / 0,013286 m**, đạt <30° và ≤0,1. **0** va bàn; khớp hở **0,000244 m**. RETURN+8 s: góc **89,774580° / 88,276712°**, mép gần nhất **0,779065 m**, đạt cả hai >60° và ≤1,0. Đầu y=1,270097 m được ghi nhận, không dùng chấm điểm theo v0.2. |
| T17 | **PASS** | Thuần: tối đa **3** lịch; chạy đúng **22:00 / 22:03 / 22:06** dù nhập không theo thứ tự. Mục thứ 4, mục chồng còi và `[null]` bị từ chối, giữ danh sách cũ. **3 SCHEDULE_EDIT** cho 3 lần sửa; mỗi sửa 1 dòng. UI: EAST 21:59/60 s → “Sớm nhất” **22:01:10**; thêm WEST 22:02/60 s → **22:04:10**; xóa mục sau → **22:01:10**. Đã kiểm cả harness và thao tác nút giao diện thật. |
| T18 | **PASS** | Trước intercom: chốt **0,200 m**, enter=false, đúng câu “Chốt bên trong đã cài. Không mở được từ hành lang.” Intercom=true; đợi cooldown còn **57,000 s** rồi WARN. `MANUAL_START t=79040,008333, origin=master, user=LAM`; RETURN **79100,008333**. Sau +3 s chốt **0**, enter=true. **4** dòng nhật ký không hướng. |
| T19 | **PASS** | Thuần: R1–R5 mỗi quy tắc **1** sự kiện; **9** đối chứng âm không bắn; mỗi quy tắc chọn sai 1 lần rồi đúng, chỉ **1** unlock record. Engine sandbox: R2 **78913,008333**, R3 **78917,008333**, R1 **78978,008333**, R5 **78983,008333**, mỗi quy tắc 1 lần; bút cũ phủ, bút mới `coatedAt=null`. R4 lying chạy riêng ở dòng dưới. |
| T20 | **PASS** | Quỹ đạo ca khi cố kéo so với không kéo: **Δ=0,000000 m** cả WARN/ACTIVE; constraint stiffness=0, bodyB=null. IDLE cho tương tác. |
| T21 | **FAIL** | Chạy đủ **T1–T15 + T1b**, kể cả T14 trên headRadius=0,10 và hipDamping=0. **T1, T2, T12 fail**; 12 test PASS, T1b OBSERVATION. T1/T2/T11 chọn khúc gần Đông nhất theo mép, không chọn tùy tiện khúc khác để lấy PASS. |
| R4 lying | **PASS** | Rời phòng, EAST 300 s, mẫu từ ACTIVE+3 s, nhìn qua kính **2,107100 s thực**; R4 bắn đúng **1** lần tại **78918,008333**. Góc thân/chân **2,197863° / 2,129556°**, mép cách Đông **0,008086 / 0,004481 m**. Không dùng standing tạm. |

## T16 — ACTIVE và đối chiếu

Ảnh ACTIVE đã báo trước khi tiếp tục các kiểm thử còn lại:

![T16 lying, damping 0, ACTIVE 3 s](tests/sandbox-v0.2/t16-active.jpg)

So với [standing rigid v0.4](tests/playtest-v0.4/standing-active.jpg), cả hai có hình nộm dựng dọc tường. Hai khúc hiện tại chồng nhau và đầu hướng xuống trong mẫu ACTIVE; v0.2 cho phép chồng khúc và không ràng vị trí đầu. Sau RETURN cả hai nằm ngang, đúng T16 mới. [Ảnh RETURN+8 s](tests/sandbox-v0.2/t16-return.jpg) và [R4 qua kính với lying](tests/sandbox-v0.2/r4-lying-window.jpg) được lưu cùng số đo.

## T21 — từng test hồi quy

Mặc định: lying, headRadius=0,10, hipDamping=0, gelCoatMin=1, coatRadius=0,25. T4 dùng detent đối chứng=12 N và T7 dùng dryTime=30 s theo chính fixture; đều reset sau bài. T15 tạm bỏ trần/vật khác để đo đáy ca rơi 3 m rồi reset. Các ngưỡng cũ ngoài changelog được giữ nguyên, kể cả T1 tâm thấp và T2 mép hình nộm ≤0,1 m.

| Test | Kết quả | Số đo thực tế và nhận xét |
|---|---|---|
| T1 | **FAIL** | Ca/bút/sổ tới Đông **0,883333 / 1,016667 / 1,033333 s**, đạt <1,5. Hình nộm chạm Đông **1,350000 s**, **0** va bàn; **60/60 gel** tới Đông. Chốt đóng **0,283333 s**, lực **11,772 N**. Khúc gần tường nhất ở ACTIVE+**2,283333 s** có tâm y=**1,453960 m**, vượt yêu cầu y<0,6. T16 mới cho phép thân dựng lên cao; T1 cũ vẫn yêu cầu thấp nên giữ FAIL. |
| T1b | **GHI NHẬN** | Standing x=2,5; tâm thân ban đầu y=**1,291512 m**. Hình nộm tới Đông **0,508333 s**; chạm ca/bút/sổ lần đầu **0,833333 / 0,950000 / 0,966667 s**. Không ghi được ca/bút/sổ chạm trực tiếp tường trong 3 s. **0** va bàn, **60/60 gel** tới Đông. Không áp tiêu chí pass/fail cho bài quan sát này. |
| T2 | **FAIL** | RETURN+8 s: ca/bút/sổ cách Đông **0,083711 / 0,008376 / 0,056623 m**, tất cả đạt ≤0,6. **29/60 gel** ngoài dải 1 m, vượt ≤6; xa nhất **2,839064 m**. Mép hình nộm gần nhất x=**3,220935 m**, cách Đông **0,779065 m**, vượt tiêu chí T2 ≤0,1 dù đạt T16 mới ≤1,0. Tâm y=0,220973; chốt vẫn **0,200 m**. Tốc độ lớn nhất **2,857558 m/s** ở mẫu, chưa phải trạng thái nghỉ. |
| T3 | **PASS** | Chốt mở **0,283333 s**; **60/60 gel** trong khay. x ca/bút/sổ sau 5 s **0,055552 / 0,033797 / 0,019602 m**. |
| T4 | **PASS** | Lực ngang **11,772 N**, detent đối chứng **12 N**: dịch **0 m** sau 5 s. Mặc định vẫn 6 N. |
| T5 | **PASS** | Pool Đông y=**0,997246 m**, đạt 0,9±0,2; streak xuống y=**0**. Ca trượt TABLE theo Đông có vận tốc pháp tuyến **0 m/s**, không đổ do trượt. RETURN **t=79810**; **110.161** substeps. |
| T6 | **PASS** | Streak từ (1,5;0), dài **0,939167 m**; wetness **0,939160**. Pool còn, r=**0,085381 m** sau co 50%. |
| T7 | **PASS** | dryTime=30 s, chờ 60 s: wetness **0**, **0 STREAK**. |
| T8 | **PASS** | **SPLASH→STREAK**, **0 POOL**; vệt khi DOWN kết thúc tại **(4;0)**. |
| T9 | **PASS** | WARN và ngay RETURN enter=false; trước +3 s còn khóa. Vào được ở mẫu **3,016667 s**. Đây là khóa hệ thống proto; chốt sandbox kiểm riêng ở T18. |
| T10 | **PASS** | Cửa mở: start=false, IDLE, thông báo “Từ chối: cửa đang mở”. |
| T11 | **PASS** | Ô kính **270×270 px**, zoom **0,675×**; chốt đi **13,5 px**. Mép khúc gần nhất x=**3,996841 m**, cách Đông **0,003159 m**≤0,1; **0** vật trên sàn cũ. SCHEDULED_START **22:00:00**, RETURN **22:15:00**, unlock **22:15:03**; khóa đúng trước/sau; schema chỉ t/event/origin. |
| T12 | **FAIL** | **60/60 gel** dừng đủ 2 s sau **34,666667 s ACTIVE**. Bút cũ gần **0** gel hợp lệ trong r=**0,25**, `coatedAt=null`; gel hợp lệ gần nhất cách **0,473082 m** ngay trước thả bút mới. Bút mới gần **55** gel, **0** hợp lệ theo thời gian, vẫn sạch. Đạt tiền điều kiện gel đã dừng và vật mới sạch, fail bút cũ phải phủ. |
| T13 | **PASS** | Lớp **WIPE→POOL→STREAK**; nước đổ sau trên dấu lau. |
| T14 | **PASS** | Baseline **1.200 frame / 10,001 s = 119,988001 Hz** trước engine. Engine: **3.574 frame / 30,0007 s = 119,130554 FPS**, đạt ≥55; median **8,3 ms**, p95 **8,8 ms**, max **73,2 ms**. **215.976 substeps**, mô phỏng **1799,800 s**, tốc độ **59,991934×**, 60 gel, ×60, trang visible. Không cắt timestep. |
| T15 | **PASS** | Rơi **3 m** trong **0,783333 s**, lý thuyết **0,782062 s**, đạt 0,75–0,82. gravity.scale=**0,000981**, dt=**0,008333 s**. |

## Đề xuất có đối chứng — chưa áp dụng

- **T12:** nếu chấp nhận vùng phủ rộng hơn, giá trị đã đo đạt là **coatRadius=0,50 m** với gelCoatMin=1. Chạy riêng runner, giữ nguyên mọi thông số/vị trí khác: gel hợp lệ cạnh bút cũ **0→1**, `coatedAt=78932,508333`; bút mới gần **56** gel nhưng **0** hợp lệ theo thời gian, vẫn `null`; T12 PASS. Khoảng cách nhỏ nhất đã đo là 0,473082 m; chưa chạy giá trị trung gian. Bán kính 0,50 gấp đôi mặc định, diện tích vùng phủ gấp 4: cần cân nhắc ý nghĩa “phủ gel” trước khi đổi spec. **Ứng dụng vẫn 0,25**, đối chứng không sửa quỹ đạo hoặc lỗi T1/T2.
- **T1/T2:** dữ liệu v0.1 (damping=0,1) cho tâm T1 **0,230792 m**, gel T2 ngoài dải **5/60**, mép RETURN **0,065725 m**; nhưng T16 ACTIVE có góc **86,812° / 87,628°**, FAIL. V0.2 damping=0 đạt T16 nhưng T1 lên cao, T2 có 29 gel ngoài dải. Đây là đối chiếu lịch sử, không tính thành một lượt PASS v0.2. Không có giá trị damping khác đã kiểm chứng đạt đồng thời toàn bộ test; không đề xuất quay về 0,1 vì sẽ phá T16 mới.
- Có thể xem xét thống nhất **tiêu chí** T1 với T16 (bỏ tâm y<0,6) và T2 với T16 RETURN (mép ≤1,0): số đo hiện tại đáp ứng các phần thay thế này. Tuy nhiên **T2 vẫn fail gel 29>6**. Không tự nới các tiêu chí đó, không nới dải gel để che lỗi, không chỉnh g/khối lượng/ma sát/detent/vị trí hoặc thêm khúc thứ ba.

## UI và kiểm tra ranh giới

| Kiểm | Kết quả | Bằng chứng |
|---|---|---|
| Lịch và dòng “Sớm nhất…” | **PASS** | Thêm EAST 21:59/1 phút rồi WEST 22:02/1 phút; số hiển thị 22:01:10→22:04:10; xóa WEST về 22:01:10. Sau kiểm tra đã xóa lịch còn lại, để sandbox sẵn sàng chơi. |
| Mặc định sandbox | **PASS** | Khởi tạo bằng `PARAMS.mannequin.pose='lying'`; R4 integration xác nhận pose=lying. Debug ẩn mặc định. [Ảnh buồng ban đầu](tests/sandbox-v0.2/sandbox-lying.jpg). |
| Dụng cụ | **PASS** | Bình dưới ngưỡng nghiêng còn **0,5 L**, trên ngưỡng còn **0** nhưng body vẫn tồn tại. Đổ lên kệ nhận **SHELF**, **0,5→0,4 L**; nạp lại **0,5 L**; refill trong WARN=false. |
| Luật phủ gel | **PASS** | Node kiểm một hạt dừng đủ 2 s tại biên bán kính 0,25 phủ được; 0 hạt, ngoài bán kính, bằng ngưỡng tốc độ, chưa đủ thời gian hoặc firstSettledAt≤bornAt không phủ. R5 đối chứng âm đổi theo min=1. T12 fail do vị trí thật của gel, không do runner còn đòi hai hạt. |
| Console/cú pháp/tham số | **PASS** | Warn/error **0 mục** trên sandbox, engine harness và regression; **22 module** src/harness kiểm cú pháp; Node guards kiểm các giá trị bị khóa, PARAMS thuần, rules chỉ import params.js, nhật ký không hướng. |

![Bảng cục bộ: hai lịch và mốc hẹn tiếp 22:04:10](tests/sandbox-v0.2/panel-earliest-two.jpg)

## Chưa làm / lệch spec

- **T21 chưa đạt toàn bộ:** giữ T1/T2/T12 FAIL. T1 yêu cầu tâm thấp trái với kết quả dựng cao được chấp nhận ở T16 mới; T2 giữ mép ≤0,1 m ngoài phần RETURN ≤1,0 mới của T16. Changelog không yêu cầu đổi các tiêu chí T1/T2 đó; báo rõ thay vì tự đổi runner/spec.
- Gel của T2 còn chuyển động ở RETURN+8 s; runner giữ thời điểm lấy mẫu cũ. Chưa chứng minh đợi thêm sẽ đưa số hạt ngoài dải xuống ≤6, không ghi PASS dựa trên giả định.
- Sandbox có bình/kệ dụng cụ, fixture proto T12 không có chúng. Vì vậy bút cũ phủ trong T19 sandbox không thay thế kết quả T12 hồi quy fail.
- **Chưa playtest 2 người thật**, mỗi người 10–15 phút; không ghi người thử/câu nói giả vào `docs/playtest-log.md`. Không chạy lại toàn bộ lượt UI mở 5 quy tắc của v0.1; lượt mới kiểm engine R1–R5, R4 lying, bảng thêm/xóa lịch và các dụng cụ.
- Nhánh T14 “môi trường (throttle)” đã cập nhật ở cả runner HTML và CLI, nhưng lượt baseline mới đạt 119,99 Hz nên không tái tạo môi trường <55 Hz. Nếu baseline <55, runner ghi đúng nhãn này và yêu cầu đo lại với cửa sổ focus, màn hình chính, không tiết kiệm pin. Chưa thử Safari/cảm ứng hoặc đổi cấu hình màn hình/nguồn điện của người dùng.
- Không làm thêm Lab A, phòng điều khiển, nhân vật di chuyển, art, âm thanh, lưu game; không thêm khúc thứ ba. Hai khúc chồng nhau được chấp nhận theo v0.2.

## Tái chạy và dữ liệu

`node proto/tests/rules.test.mjs`. Chạy server tại gốc: `python3 -m http.server 4173 --bind 127.0.0.1 --directory proto`; mở `sandbox.html` để chơi. Khi phát triển cần no-store/hard reload; phiên này dùng cổng 4174.

Runner: `tests/t16.html` (ACTIVE rồi nút RETURN); `tests/sandbox-tests.html` (T17 UI/T18/T19/T20, R4 lying và dụng cụ); **`tests/raf-baseline.html` trước T14**, đợi 10 s rồi theo liên kết cùng tab tới `tests/regression.html`, chờ hồi quy, bấm Đo T14 để lấy 30 s thực. Mở trực tiếp regression vẫn chạy hồi quy; nút hiệu năng sẽ đưa về baseline nếu chưa đo. Baseline được chuyển qua sessionStorage và tiêu thụ một lần khi mở engine. Đối chứng T12: `tests/regression.html?coatRadius=0.5`, không đổi PARAMS.

JSON trong `tests/sandbox-v0.2/`: `results-t16.json`, `results-pure.json`, `results-engine.json`, `results-baseline.json`, `results-regression-functional.json`, `results-regression.json`, `results-coat-control.json`. Kết quả functional được chạy thêm một lượt để bổ sung khoảng cách gel gần nhất, số đo/quỹ đạo cũ khớp; T14 từ lượt baseline→engine đầu tiên, cùng ứng dụng/cấu hình, không lấy từ đối chứng. Ảnh ACTIVE/RETURN/R4/default lying và ba trạng thái bảng được lưu cùng thư mục.

Báo cáo trước khi ghi đè giữ tại `tests/sandbox-v0.2/TEST-REPORT-v0.1.md`; số đo lịch sử v0.1 giữ nguyên trong `tests/sandbox-v0.1/`.

SHA-256 `proto/index.html` không đổi: `4175dace903a5c6e052eab468a68c4a7f034ed907b6c962e39934270544d7a5c`.
