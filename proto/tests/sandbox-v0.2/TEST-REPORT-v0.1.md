# Báo cáo T16–T21 và hồi quy T1–T15 + T1b — 10/10/2026

Đã đọc `docs/spec-sandbox-v0.1.md` và `docs/playtest-log.md`. Xây trên engine hiện có: thêm `sandbox.html`, 5 file `src/game/`, tách `src/world/mannequin.js`. **Không sửa `proto/index.html` hoặc spec.** Giữ g=9,81, tổng khối lượng hình nộm=70 kg (45/25), mọi khối lượng/ma sát cũ và detent mặc định=6 N. Tham số mới đặt trong `PARAMS`; `rules/` chỉ import `params.js`, không Phaser/Matter/game/view/world. Nhật ký chỉ có `{t,event,origin[,user]}`.

**Kết quả:** T17–T20 PASS; **T16 và T21 FAIL**. Hồi quy **12/15 PASS**, T2/T12/T14 FAIL; T1b chỉ ghi nhận. Sandbox tạm dùng standing theo mục 10; proto hồi quy vẫn lying. Đã báo T16 kèm ảnh ACTIVE trước khi xây tiếp 3.2–3.5 và UI. Không thêm khúc thứ ba, không áp dụng các đề xuất vào mặc định.

Môi trường: MacBook/macOS; Phaser 3.90.0, Matter đi kèm, lil-gui 0.20.0; canvas 960×540, fixed-step 1/120 s. Test scene dùng engine thật, tăng bước mô phỏng để chờ lịch; T14 đo 30 giây thực, 60 gel, ×60, trang visible. Đo riêng Chrome 154 và in-app browser Chrome 155. Server phiên này: `127.0.0.1:4174`, `Cache-Control: no-store`, tránh module cũ từ cổng 4173. Test mặc định và đối chứng nằm ở các lượt tải riêng.

| Test | Kết quả | Số đo thực tế và nhận xét |
|---|---|---|
| T16 | **FAIL** | Lying, hông (1,9;0,2), EAST 60 s, lấy mẫu ACTIVE **3,000 s**. Damping=0,1: thân/chân lệch phương đứng **86,812° / 87,628°**, không khúc nào <30°. Mép thân cách Đông **0,001202 m**, đầu y=**0,263585 m**; khớp hở **0,000236 m**, **0** va bàn. RETURN+8 s: **84,005° / 89,984°**, mép gần nhất **0,065725 m**, phần RETURN đạt. Hình ACTIVE vẫn gập ngang, chưa cùng cảm giác với `playtest-v0.4/standing-active.jpg`. |
| T17 | **PASS** | Danh sách tối đa **3**. Nhập không theo thứ tự rồi chạy đúng **22:00 / 22:03 / 22:06**; chuỗi lệnh vật lý EAST→DOWN→WEST→DOWN→UP→DOWN. Mục thứ 4 và mục chồng còi bị từ chối, giữ nguyên danh sách cũ. Một lần thay danh sách, một lần thêm, một lần xóa: **3 SCHEDULE_EDIT**, mỗi lần đúng 1 dòng. Đầu vào `[null]` bị từ chối. |
| T18 | **PASS** | Trước cứu: chốt **0,200 m**, enter=false, đúng câu “Chốt bên trong đã cài. Không mở được từ hành lang.” Intercom=true. Đợi cooldown còn **57,000 s**, rồi WARN và `MANUAL_START` **t=79040,008333**, `origin=master,user=LAM`. RETURN **t=79100,008333**; sau +3 s chốt **0**, enter=true. Nhật ký 4 dòng không có hướng. |
| T19 | **PASS** | Thuần: R1–R5 mỗi quy tắc **1** sự kiện, **9** đối chứng âm không bắn; chọn sai 1 lần rồi đúng, mỗi quy tắc ghi đúng **1** unlock record. Tích hợp: nước trên sàn → R2, chốt ngoài phòng → R3, wall pool RETURN → R1, bút mới vào gel đã dừng → R5; vật mới `coatedAt=null`, bút cũ có cờ. R4 dùng standing, quan sát **2,050500 s thực**, trục thân/chân **0,453° / 20,585°**. Sai lệch timestamp RETURN/streak tối đa 1/120 s được xử lý trong detector, không đổi luật chất lỏng. |
| T20 | **PASS** | So quỹ đạo ca giữa không kéo và cố kéo trong WARN/ACTIVE: **Δ=0,000000 m** ở cả hai trạng thái. Mouse constraint stiffness=0, bodyB=null. IDLE trong phòng cho tương tác. UI cũng khóa các dụng cụ khi xoay. |
| T21 | **FAIL** | Chạy toàn bộ T1–T15 + T1b bằng engine khớp nối. **T2, T12, T14 fail**; bảng số đo từng bài bên dưới. T1/T2/T11 dùng khúc gần tường nhất theo spec bước 3. |

## T16 — ba lần chỉnh có đối chứng

Tổng 70 kg, chia 45/25, g, ma sát, detent và vị trí giữ nguyên ở cả bốn lượt. Mặc định cuối vẫn hipDamping=0,1.

| Damping | Góc thân / chân ở ACTIVE 3 s | Đầu y (m) | Mép gần nhất ACTIVE (m) | RETURN+8 s: mép gần nhất (m) | Kết quả |
|---|---|---|---|---|---|
| 0,1 mặc định | 86,812° / 87,628° | 0,263585 | 0,001202 | 0,065725 | FAIL góc ACTIVE; RETURN PASS |
| 0, lần chỉnh 1 | 3,252° / 1,412° | 1,270097 | 0,006150 | 0,779065 | FAIL đầu <0,8 m và mép RETURN |
| 0,01, lần chỉnh 2 | 82,031° / 73,038° | 0,261751 | 0,018125 | 0,154555 | FAIL góc ACTIVE và mép RETURN |
| 0,005, lần chỉnh 3 | 81,996° / 72,990° | 0,261740 | 0,018212 | 0,158685 | FAIL góc ACTIVE và mép RETURN |

Ảnh ACTIVE mặc định đã báo trước khi làm tiếp:

![T16 ACTIVE 3 s, damping 0,1 — chưa đạt](tests/sandbox-v0.1/t16-damping-0.1-active.jpg)

Đối chiếu: [hình nộm rigid standing v0.4](tests/playtest-v0.4/standing-active.jpg). Đủ 3 lượt chỉnh; dừng tuning T16 theo mục 3.1. Không có giá trị damping nào được kiểm chứng đạt toàn bộ T16 để đề xuất thay mặc định.

## T21 — từng test hồi quy

Cấu hình gốc lying, headRadius=0,10, coatRadius=0,20. T4 và T7 giữ các đối chứng được định nghĩa trong chính test. T15 tạm bỏ trần/vật khác để đo rơi 3 m rồi reset. Những lượt override ở mục đối chứng không được tính là PASS mặc định.

| Test | Kết quả | Số đo thực tế và nhận xét |
|---|---|---|
| T1 | **PASS** | Ca/bút/sổ tới Đông **0,883 / 1,017 / 1,033 s**, đều <1,5. Hình nộm **0,450 s**, khúc gần nhất y=**0,230792 m** ở 2,283 s; **0** va bàn. **60/60 gel** tới Đông. Chốt **0,283333 s**, lực **11,772 N**. Hông xuất phát (1,9;0,2); tâm thân gồm đầu là (2,391512;0,2), không nhầm tâm thân với hông. |
| T1b | **GHI NHẬN** | Standing x=2,5; tâm thân y=**1,291512 m**. Hình nộm chạm Đông **0,508333 s**, chạm ca/bút/sổ lần đầu **0,833 / 0,950 / 0,967 s**. Không ghi được ca/bút/sổ chạm trực tiếp tường trong 3 s. **0** va bàn, **60/60 gel** tới Đông. |
| T2 | **FAIL** | RETURN+8 s: ca/bút/sổ cách Đông **0,549584 / 0,353425 / 0,113857 m**. **Ca vượt 0,5 m**. **5/60 gel** ngoài dải 1 m, đạt ≤6; xa nhất **1,823622 m**. Mép khúc gần tường **3,934275 m**, lệch **0,065725 m**, đạt ≤0,1; tâm y=0,226081. Tốc độ cuối gần 0; chốt **0,200 m**. |
| T3 | **PASS** | Chốt mở **0,283333 s**, **60/60 gel** trong khay. x ca/bút/sổ **0,050072 / 0,010509 / 0,012273 m** sau 5 s. |
| T4 | **PASS** | F ngang **11,772 N**, detent đối chứng **12 N**: dịch **0 m** sau 5 s. Mặc định vẫn 6 N. |
| T5 | **PASS** | Pool Đông y=**0,997246 m**, đạt 0,9±0,2; streak xuống y=**0**. Ca tiếp xúc TABLE khi trượt ngang: pháp tuyến **0 m/s**, không đổ vì trượt. RETURN **t=79810**, **110.161** substeps. |
| T6 | **PASS** | Streak ngang từ (1,5;0), dài **0,939167 m**, wetness **0,939160**; pool còn, r=**0,085381 m**, co 50% diện tích/thể tích. |
| T7 | **PASS** | dryTime đối chứng=30 s, chờ 60: wetness **0**, **0 STREAK**. |
| T8 | **PASS** | SPLASH→STREAK, **0 POOL**; vệt tường khi DOWN kết thúc y=**0 m**. |
| T9 | **PASS** | WARN và ngay RETURN enter=false; trước +3 s còn khóa, vào được ở mẫu **3,016667 s**. Bài này đo khóa hệ thống của proto; sandbox kiểm thêm chốt ở T18. |
| T10 | **PASS** | Cửa mở: start=false, IDLE, đúng thông báo từ chối. |
| T11 | **PASS** | Ô kính **270×270 px**, zoom **0,675×**; chốt chuyển động **13,5 px**. Mép khúc gần tường **4,001259 m**, lệch **0,001259 m**; **0 vật** ở sàn cũ theo runner mới. SCHEDULED_START **22:00:00**, RETURN **22:15:00**, unlock **22:15:03**, đúng khóa trước/sau. Schema chỉ t/event/origin. |
| T12 | **FAIL** | **60/60 gel** dừng đủ 2 s sau **3,900 s ACTIVE**. Bút cũ chỉ **1** hạt hợp lệ trong r=**0,20 m**, cần ≥2 nên `coatedAt=null`. Bút mới gần **29** hạt, **0** hợp lệ theo thời gian, vẫn sạch. Fail tiền đề bút cũ đã phủ; không nới runner. |
| T13 | **PASS** | Thứ tự lớp **WIPE→POOL→STREAK**; nước đổ sau ở trên dấu lau. |
| T14 | **FAIL** | Chrome visible, 60 gel ×60: **903 frame / 30,0014 s = 30,098595 FPS**, yêu cầu ≥55. Median **33,3 ms**, p95 **34,8 ms**, max **42,3 ms**. **215.943 substeps**, mô phỏng **1799,525 s**, tốc độ **59,981368×**. Không cắt timestep để lấy FPS. |
| T15 | **PASS** | Rơi **3 m** trong **0,783333 s**, lý thuyết **0,782062 s**; đạt 0,75–0,82. gravity.scale=**0,000981**, dt=**0,008333 s**. |

## Đề xuất có đối chứng — chưa áp dụng

- **T12:** đề xuất `coatRadius=0,25 m` nếu chấp nhận vùng phủ rộng hơn. Chạy riêng cùng toàn bộ fixture: bút cũ từ **1→2** hạt hợp lệ, coatedAt=**78916,366667**; bút mới từ 29→**35** hạt gần nhưng vẫn **0** hợp lệ, coatedAt=null. T12 đối chứng PASS; quỹ đạo và lỗi T2 không đổi. Mặc định vẫn 0,20.
- **T2:** nếu chấp nhận dải đồ bàn rộng hơn do hình nộm hai khúc, đề xuất ngưỡng kiểm **0,55 m** thay 0,50. Chấm lại cùng số đo: ca 0,549584≤0,55; các tiêu chí khác đã đạt. Đây là thay tiêu chí, **không phải sửa vật lý**, chưa đổi spec/runner. Không có tham số vật lý đã kiểm chứng sửa T2 trong giới hạn tuning T16.
- **T14:** in-app browser ×60 đo hai lượt **30,164656 / 29,997400 FPS**. Chrome ×1 đối chứng **902 frame / 30,0028 s = 30,063861 FPS**, tốc độ mô phỏng **0,999629×**, gần như ×60 về cadence render. Giảm tua nhanh không đạt 55 FPS trên phiên này. Chưa xác định nguyên nhân cadence ~30; không đề xuất đổi g/timestep/gelCount hay tự hạ tiêu chí FPS. Cần đo lại trên môi trường render đạt ≥55 trước khi công nhận T14; kết quả 120 FPS v0.4 lịch sử không thay thế lượt đo mới.

## UI và tương tác — agent tự chơi

| Kiểm | Kết quả | Bằng chứng |
|---|---|---|
| Bình, lau, nạp | **PASS** | Hai lần đổ **0,5→0,3 L**, lau để lại viền. Lượt mới 5 lần **0,5→0**, lần 6 từ chối, nạp lại **0,5 L**. Engine: dưới ngưỡng nghiêng còn 0,5; trên ngưỡng đổ hết nhưng body còn; pour trên kệ mới nhận SHELF; refill trong WARN=false. Click nút trực tiếp trên kệ nạp **0,4→0,5 L**; con trỏ bình là ảnh riêng, debug bật/tắt bằng backtick. Ảnh `refill-shelf.jpg`. |
| Neo/tháo | **PASS** | Kéo thân sát tay vịn rồi thả, HUD xác nhận “Hình nộm đã móc…”. Click tay vịn tháo; phản hồi trở về kéo/đặt. Ảnh `auto-anchor.jpg`, `anchor-release.jpg`. |
| Bảng, lịch, tốc độ | **PASS** | Thêm EAST 21:57 và WEST 22:00, danh sách đúng; xóa mục Tây, ra hành lang trước còi. Mở bảng từ ×60 thấy ×1. Mũi tên + chữ Việt, thời lượng rõ là phút tới RETURN. Ảnh `sandbox-panel.jpg`. |
| Sổ và thoại | **PASS** | Chọn sai R2 thấy đúng phản hồi rồi chọn đúng. Qua kính phát hiện R3/R4; RETURN phát hiện R1; thả bút mới vào gel phát hiện R5. Đủ 5 ô sáng, 4 việc gạch đi, Thư nói “Anh nhanh hơn em hồi đó.” và nút Xong hoạt động. Có cả lời Thư đầu vào và lần đầu xem ACTIVE. |
| Hành lang/intercom | **PASS** | Bị chốt chặn, intercom chỉ xuất hiện sau lần vào thất bại; nghe đúng câu Lâm; chốt về Mở, vào được. UI journal có `MANUAL_START/RETURN (master / LAM)`, không hướng. Ảnh `door-bolt-blocked.jpg`, `intercom-lam.jpg`, `master-journal.jpg`. |
| Console/cú pháp/ranh giới | **PASS** | Sandbox và harness cuối mỗi lần đọc warn/error đều **0 mục**; cú pháp **30 module JS** hợp lệ. Node kiểm PARAMS thuần, import rules chỉ params.js, mọi giá trị vật lý bị khóa giữ nguyên. |

Ảnh sổ cuối lượt chơi:

![Cả năm quy tắc được mở khóa trong lượt UI của agent](tests/sandbox-v0.1/rules-unlocked.jpg)

## Chưa làm / lệch spec

- **T16 chưa đạt.** Sandbox dùng standing tạm theo mục 10; lying của hiện trường chưa tạo hình “người trên tường”. Cấu hình hai khúc có thể gập/chồng nhau vì cùng group không va chạm, đúng yêu cầu collisionFilter nhưng chưa đạt câu “không chấp nhận xuyên nhau” trong 3.1. Chưa tự thêm giới hạn góc/self-collision hoặc khúc thứ ba.
- **T21 chưa đạt toàn bộ:** giữ T2/T12/T14 FAIL theo cấu hình gốc. Các đề xuất/đối chứng không được tính thành PASS mặc định.
- Để giữ cooldown 60 s, lịch chặn cả khoảng cooldown sau RETURN; intercom xếp lệnh chờ cooldown rồi mới WARN. Do đó cặp lịch mẫu cách nhau 2 phút cho hai chu kỳ 1 phút sẽ bị từ chối vì còi bắt đầu trước khi hết cooldown. Không thay cooldown hoặc thời lượng chu kỳ.
- Guard chốt áp dụng cho sandbox qua `hallway.enter(cycle, bolt)`; lối vào proto cũ vẫn kiểm khóa hệ thống để giữ T9 và UI hồi quy cũ.
- **Chưa playtest 2 người thật** chưa đọc concept, mỗi người 10–15 phút; chưa xác nhận tiêu chí ≥1/2 tự nói R1 trước popup, 2/2 tự mở R3, ≥1/2 thốt lên “người trên tường”. Lượt UI và review của agent không thay thế người độc lập. Giữ `docs/playtest-log.md` nguyên trạng, không ghi người chơi giả.
- Chưa thử Safari, thiết bị cảm ứng hoặc môi trường render >30 FPS. Không làm Lab A, phòng điều khiển, nhân vật di chuyển, art, âm thanh, lưu game theo phạm vi spec.

## Tái chạy và dữ liệu

`node proto/tests/rules.test.mjs`; server từ thư mục gốc: `python3 -m http.server 4173 --bind 127.0.0.1 --directory proto`. Mở `sandbox.html` để chơi; `tests/t16.html` để lấy mẫu ACTIVE rồi nút RETURN; `tests/sandbox-tests.html` cho T18/T19/T20 và dụng cụ; `tests/regression.html` cho T1–T13/T15/T1b, bấm “Đo T14” khi trang visible để lấy 30 s thực. Lưu ý cache module khi sửa code.

Dữ liệu JSON: `results-t16.json`, `results-pure.json`, `results-engine.json`, `results-regression.json` (IAB), `results-regression-chrome.json`, `results-coat-control.json`, `results-t2-threshold-control.json`, `results-fps-control.json` trong `tests/sandbox-v0.1/`. Nhật ký lượt UI ở `journal-ui.txt`; đầy đủ ảnh ACTIVE/RETURN của bốn lượt T16, thao tác và kết màn cùng thư mục. Báo cáo v0.4 trước khi ghi đè được giữ tại `tests/sandbox-v0.1/TEST-REPORT-v0.4.md`.

SHA-256 của `proto/index.html` giữ nguyên trong lượt xây này: `4175dace903a5c6e052eab468a68c4a7f034ed907b6c962e39934270544d7a5c`.
