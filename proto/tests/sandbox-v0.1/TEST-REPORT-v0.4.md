# Báo cáo T1–T15 + T1b — 10/10/2026

Đã đọc `docs/spec-proto-v0.4.md`. Chỉ đổi `mannequin.headRadius` **0,12 → 0,10 m** và ngưỡng mép hình nộm trong runner T2/T11 **0,05 → 0,10 m**. Không sửa spec, g, khối lượng, ma sát, detent, vị trí vật, solver, timestep hay các luật khác.

Kết quả trên cấu hình v0.4 mặc định mới: **15/15 PASS; T1b ghi nhận, không chấm pass/fail**. Đã chạy lại toàn bộ test, **kể cả T14** với bán kính đầu 0,10 m; không dùng override của runner đối chứng. Đạt điều kiện dừng được yêu cầu. **Dừng, không đề xuất thay đổi thêm.**

Môi trường: MacBook, macOS 26.6.2, Chrome 154, 10 logical CPU; Phaser 3.90.0 / Matter đi kèm, lil-gui 0.20.0; Canvas 960×540. Test chức năng chạy scene/engine thật bằng fixed-step 1/120 s. T14 đo render 30 giây thực trong Chrome có cửa sổ, trang **visible**, với 60 gel ở ×60. Mỗi runner tải lại trang để lấy mặc định mới.

| Test | Kết quả | Số đo thực tế và nhận xét |
|---|---|---|
| T1 | **PASS** | Lying tâm **(1,900; 0,200) m**, 70 kg, đầu Đông, r=0,10. Ca/bút/sổ chạm Đông **0.883 / 1.017 / 1.033 s** từ ACTIVE, đều <1,5 s. Hình nộm chạm Đông **0.533 s**, tâm y=**0.203 m** ở mẫu **2.283 s**, đạt <0,6; **0** va bàn/chân bàn. **60/60 gel** tới dải Đông. Chốt đóng **0.283 s**, lực **11.772 N**. |
| T1b | **GHI NHẬN** | Standing tâm **(2,500; 0,850) m**. Hình nộm chạm Đông **0.517 s**, tới trước đồ bàn. Tiếp xúc ca/bút/sổ lần đầu **0.808 / 0.925 / 0.942 s**; chắn một phần đồ. Ca chạm trực tiếp Đông **1.358 s**; bút/sổ chưa ghi được chạm trực tiếp trong **3.000 s**. **0** va bàn, **60/60 gel** tới Đông. |
| T2 | **PASS** | Sau RETURN +8 s, ca/bút/sổ cách Đông **0.160 / 0.032 / 0.300 m**, đều ≤0,5 m. **0/60 gel** ngoài dải 1,0 m, xa nhất **0.945 m**. Hình nộm tâm **(2.990; 0.189)**, mép Đông **4.000205 m**, độ lệch mép so với tường **0.000205 m**, đạt dung sai ≤0,1 m. Tốc độ cuối tối đa **0.000 m/s**; chốt giữ **0.200 m**. |
| T3 | **PASS** | Chốt mở **0.283 s**. **60/60 gel** còn trong khay. x ca/bút/sổ **0.0500 / 0.0072 / 0.0236 m** sau 5 s. |
| T4 | **PASS** | F ngang **11.772 N**, detent đối chứng **12 N**; chốt dịch **0.000 m** sau 5 s ACTIVE. Mặc định detent vẫn 6 N. |
| T5 | **PASS** | **POOL EAST y=0.997246 m**, đạt 0,9 ±0,2 m; STREAK xuống **y=0**. Ca tiếp xúc lại TABLE khi EAST với pháp tuyến **0 m/s**, không đổ do trượt. Chu kỳ thủ công 900 s RETURN **t=79810**, **110,161 substeps** kể cả chờ sau RETURN. |
| T6 | **PASS** | STREAK từ **(1,5; 0)** kéo Đông **0.93917 m**, wetness **0.93916**; pool gốc còn, r=**0.08538 m**, từ 0,12075 m; diện tích/thể tích co 50%. |
| T7 | **PASS** | dryTime=30 s, chờ 60 s: wetness **0**, **0 STREAK**. |
| T8 | **PASS** | **SPLASH → STREAK**, **0 POOL**; vệt tường Đông khi DOWN kết thúc tại **y=0 m**. |
| T9 | **PASS** | WARN và ngay RETURN đều từ chối vào phòng; còn khóa trước +3 s, vào được sau mẫu **3.017 s**. Deadline luật mở khóa đúng +3,000 s, chênh lệch do lấy mẫu. |
| T10 | **PASS** | Cửa mở: start **false**, vẫn **IDLE**, log “Từ chối: cửa đang mở”. |
| T11 | **PASS** | Viewport **270×270 px**, zoom **0.675×**; chốt **13.5 px**, đạt ≥10; hành trình **0.200 m**. Hình nộm tâm **(2.990; 0.203)**, mép **4.001082 m**, độ lệch mép **0.001082 m**, đạt ≤0,1 m. **0 vật** ở sàn cũ. Nhật ký **SCHEDULED_START 22:00:00**, **RETURN 22:15:00**, mở khóa **22:15:03**. Schema chỉ **t/event/origin**. |
| T12 | **PASS** | **60/60 gel** dừng liên tục đủ 2 s sau **4.767 s ACTIVE**. Bút cũ coatedAt **78917.558 s**, **2** hạt hợp lệ trong r=**0.20 m**, cần ≥2. Bút mới tạo sau khi gel dừng: **31** hạt gần, **0** hợp lệ theo thời gian; coatedAt **null**. |
| T13 | **PASS** | Lớp **WIPE → POOL → STREAK**; vết lau nằm dưới nước đổ sau. |
| T14 | **PASS** | Đo mới với r đầu **0,10 m**: **120.140 fps**, **3,605 frame / 30.0067 s** thực; median **8.3 ms**, p95 **9.3 ms**, max **12.6 ms**. **60 gel, ×60**, **216,026 substeps**; mô phỏng **1800.217 s**, tốc độ **59.994×**. Đạt ≥55 fps, không bỏ timestep. |
| T15 | **PASS** | Đáy ca rơi **3.000 m**, chạm sàn **0.78333 s**; lý thuyết **0.78206 s**. gravity.scale **0,000981**, bước **0.008333 s**. Đạt 0,75–0,82 s. Tạm bỏ trần/vật khác để đo không bị cản, rồi reset. |

Số đo mới: `tests/results-functional.json`, `tests/results-performance-headed.json`. T2 tiếp tục scene T1; T1b chạy sau T2 rồi sắp thứ tự trong báo cáo. `null` ở thời điểm chạm nghĩa là chưa ghi được va chạm trực tiếp trong cửa sổ đo. T12 giữ runner hiện có: chu kỳ 900 s, chờ tối đa 120 s ACTIVE; lần này gel dừng trong 4,767 s nên không timeout. Các mốc nhật ký đúng tuyệt đối; engine lấy mẫu có sai số tối đa 1/120 s. Độ lệch mép trên dùng số đo bounds Matter; chồng nhẹ với tường do solver vẫn trong dung sai 0,1 m.

Kiểm tra luật thuần hiện có **PASS** bằng `node proto/tests/rules.test.mjs`: g, mass, friction, detent và vị trí giữ nguyên; rules chỉ import params thuần; các mốc chu kỳ, nhật ký không hướng, chốt, SHELF/TRAY và các biên phủ gel vẫn đạt. Node và Chrome đều xác nhận bán kính đầu mặc định **0,10 m**.

## Giới hạn quan sát và điều kiện dừng

Lượt này chạy lại T1–T15 + T1b và dừng ở **15/15 PASS** theo yêu cầu. Không chạy thí nghiệm tham số mới hay đề xuất thêm. Phiên quan sát UI 17,937 phút, ảnh và dữ liệu đối chứng v0.3 còn trong `tests/` là dữ liệu lịch sử; không gán chúng thành quan sát v0.4. Không chạy lại phiên cảm tính 15 phút trong lượt này. Chưa kiểm tra Safari/mobile hoặc playtest người chơi độc lập; kết quả Matter có thể khác giữa máy/phiên bản.

## Phiên thao tác UI bổ sung theo yêu cầu “bạn test dùm mình”

Agent thao tác trực tiếp bằng chuột và panel trong **Codex In-app Browser**, trên v0.4: **964,025 giây thực (16 phút 04 giây)**. Viewport đo bằng DOM **770×760 px**, canvas hiển thị **738×415,125 px**. Đây là phiên quan sát bổ sung sau lượt kiểm thử tự động ở trên; không chạy lại hay thay số đo T1–T15. Không sửa source, spec hoặc tham số mặc định. Chỉ dùng các điều khiển debug trong phiên và đã tải lại trang về mặc định khi xong: lying, DOWN, ×1, 60 gel, dryTime=1200, cửa đóng, chốt 0,000 m.

| Luồng thao tác | Kết quả | Bằng chứng quan sát qua UI |
|---|---|---|
| EAST → RETURN, hình nộm nằm | **PASS** | Đồ rời và gel dồn sang Đông; hình nộm nằm thấp. Chốt **0,000 → 0,200 m**, giữ **0,200 m** sau RETURN. UI coated **2 → 3**; đồ tụ chân tường Đông. Nhật ký **MANUAL_START 21:55:21**, **RETURN 21:56:21**, không ghi hướng. Ảnh `east-active.jpg`, `east-return.jpg`. |
| Lịch 22:00 EAST 900 s, ra hành lang trước chu kỳ | **PASS** | Qua ô kính thấy đồ dồn sang Đông và hình nộm nằm thấp. “Vào phòng” bị vô hiệu khi đang xoay; vào được sau RETURN khi hệ thống đã mở khóa. Nhật ký **SCHEDULED_START 22:00:00**, **RETURN 22:15:00**. Ảnh `hallway-active.jpg`, `hallway-return.jpg`. Không đo lại deadline mở khóa +3 s bằng lượt UI này. |
| Hình nộm đứng → EAST | **GHI NHẬN** | Hình nộm ở Đông trước, bút/sổ bị cản ở bên trái thân; khi về DOWN hình nộm vẫn đứng. Phù hợp mục đích quan sát T1b, không chấm pass/fail hay đo lại thời gian va chạm. Ảnh `standing-contact.jpg`, `standing-active.jpg`, `standing-return.jpg`. |
| Kéo thả hình nộm ở cả hai tư thế | **PASS** | Cả lying và standing đều được nhấc lên và dịch chuyển bằng chuột. Ảnh `lying-drag.jpg`, `standing-drag.jpg`. Reset trước các chu kỳ cần vị trí xuất phát mặc định. |
| Đổ → lau → đổ lại cùng điểm trên sàn | **PASS** | Đổ tạo vũng; lau xóa vũng tại điểm và để lại hình cung; đổ mới vẫn tạo vũng bên trên hình cung. Ảnh `water-pool.jpg`, `water-wipe.jpg`, `water-after-wipe.jpg`, `water-after-wipe-east.jpg`. |
| Nước ướt / đã khô khi chuyển EAST | **GHI NHẬN** | Vũng còn ướt co lại khi xoay. Đối chứng debug dryTime=**30 s**, chờ **71,424 s thực** ở ×1 trước Start: vũng giữ kích thước sau khi xoay. Vệt sát sàn mờ nên không xác nhận chiều dài streak bằng mắt; số đo định lượng T6/T7 ở bảng tự động vẫn là bằng chứng cho luật. Ảnh `water-wet-east.jpg`, `water-dry-east.jpg`. |
| Cửa mở / cooldown | **PASS** | Start bị từ chối với đúng thông báo “Từ chối: cửa đang mở” và “Từ chối: đang cooldown”; trạng thái vẫn IDLE. Sau đóng cửa hoặc hết cooldown, Start chạy được. Ảnh `door-open-refusal.jpg`. |
| WEST đối chiếu | **PASS** | Đồ dồn sang Tây, gel nhìn thấy giữ trong khay, UI gel **60**, chốt giữ mở **0,000 m**. Chu kỳ ghi **MANUAL_START 21:55:10**, **RETURN 21:56:10**. Không đếm lại từng hạt từ ảnh. Ảnh `west-active.jpg`, `west-return.jpg`. |

Nhận xét cảm tính của **agent**: T1→T2 **có**, ở mức cơ chế hiện trường đọc được — chuyển sang Đông rồi về DOWN tạo đống đồ ở chân tường dù chốt vẫn đóng. T11 **có nhưng yếu hơn**: ô kính cho thấy bố cục, nhưng chốt và đồ nhỏ khó đọc trong viewport hẹp; cần nhìn kỹ hoặc nhìn số trên panel. Vệt nước sát sàn cũng khá mờ. Đây là nhận xét quan sát, chưa xác nhận phản ứng “à” của người chơi độc lập; không đề xuất hoặc tự đổi tham số.

Hai lần đọc console ở mức warn/error trả về **0 mục**. Ảnh và thời lượng lưu tại `tests/playtest-v0.4/`, metadata ở `session.json`. Chưa đo lại FPS trong in-app browser, chưa thử Safari hoặc thiết bị cảm ứng. Trang cuối phiên đã được khôi phục mặc định, ảnh `restored-defaults.jpg`.
