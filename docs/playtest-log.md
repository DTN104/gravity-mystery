# Playtest log — prototype vật lý trần

## 2026-10-10 — v0.4 (spec-proto-v0.4, 15/15 PASS)

**Người chơi:** Claude (Playwright trên máy Hieu, `proto-single.html` qua `localhost:8765`) và Codex (UI playtest, 25 ảnh tại `proto/tests/playtest-v0.4/`). Chưa có người chơi độc lập. Hieu: *(chưa ghi)*.

| Bài | Claude | Codex |
|---|---|---|
| T1→T2: Start EAST ×1 rồi về Xuống — đống đồ chân tường có "à" không? | **Có, mức vừa.** Cái đọng lại là **vũng cà phê tròn trên tường đứng + vệt chảy xuống**. Đống đồ xếp hàng chân tường đọc được nhưng không bất ngờ, vì hình nộm choán hết chân tường và gel đổ lên thân. | **Có**, ở mức cơ chế hiện trường đọc được; chốt vẫn đóng sau khi về. |
| T11: hẹn 22:00, ra hành lang, nhìn qua ô kính — có "à" không? | **Chưa đủ.** Lịch/nhật ký/khóa/chốt đúng. Nhưng hình nộm *nằm* khi xoay Đông chỉ **trượt ngang rồi chống đầu vào tường**, vẫn nằm ngang trên màn hình → qua ô kính thấy "người trên sàn bị đẩy sang phải", **không thấy "người nằm trên tường"** — hình ảnh cốt lõi để lật lời khai E13. | **Có nhưng yếu hơn**: ô kính cho thấy bố cục, chốt và đồ nhỏ khó đọc; vệt nước sát sàn mờ. |

**Phát hiện thiết kế:** hình nộm là khối cứng một mảnh. Tư thế *đứng* (T1b, ảnh `standing-active.jpg`) khi xoay Đông ngả vào tường gần thẳng đứng — đúng hình ảnh "nằm trên tường". Tư thế *nằm* (đúng hiện trường) thì không, vì khối cứng chống đầu vào tường là trạng thái cân bằng mà Matter không phá. Người thật bất tỉnh sẽ gập và đổ dọc tường.

**Quyết định:** không quay lại concept (cả hai bài không đồng thời "không"). Sang bước 3 với yêu cầu mới: **hình nộm hai khúc (thân + chân) nối khớp bản lề giới hạn góc** để nó gập và đổ dọc tường Đông khi xoay. Thêm: vệt nước trên sàn cần đậm/dày hơn để nhìn được qua ô kính.

**Việc còn treo:** Hieu tự chơi 2 bài và ghi cảm nhận vào bảng trên.

## 2026-10-11 — Codex chơi theo hướng dẫn v0.2

**Loại lượt thử:** Codex thao tác qua UI theo phần A của `playtest-script.md`, không dùng debug, không sửa game. Chưa phải lượt chơi của người mới độc lập.

| Bài | Kết quả | Quan sát |
|---|---|---|
| V1 — ca nước | PASS | Vũng trên tường rồi vệt chảy khi trở về; mở R1. Chọn sai một lần vẫn trả lời lại được. |
| V2 — đổ nước sau V1 | FAIL | Bình nằm nghiêng sau xoay; nạp lại thì tự đổ hết, UI vẫn 0.0 L. Bấm sàn báo bình hết nước. |
| V3 — ô kính / intercom | PASS | Hẹn giờ, ra ngoài, mở R4; bị chốt chặn, gọi Lâm, mở R3 và vào lại. Nhật ký có master/LAM, không hướng. |
| V4 — bút mới / gel | PASS | Đặt bút vào gel đã dừng, mở R5 và thấy lời kết. |
| Đối chứng V2 ở lượt mới | PASS | Bình 0.5 → 0.4 L sau một lần đổ lên sàn; xoay tiếp mở R2. |

Đã mở đủ R1–R5, nhưng R2 trong lượt chính đến từ vũng do bình tự đổ khi nạp; không dùng kết quả đó để chấm V2 pass. Cần xử lý việc nạp bình nghiêng trước khi coi hướng dẫn đủ dùng từ đầu tới cuối. Chưa sửa game hoặc đổi tham số.

Chi tiết, ảnh và dữ liệu: [báo cáo playtest](../proto/tests/playtest-guide-v0.2/PLAYTEST-REPORT.md). Không chấm điểm dễ hiểu hoặc thời gian hoàn thành thay cho người thật.

## 2026-10-11 — Sửa lỗi nạp lại bình sau xoay

**Kết quả: PASS.** Nạp lại đưa bình về kệ ban đầu, dựng thẳng và dừng chuyển động trước khi nạp; không đổi g, khối lượng, ma sát, detent hay tọa độ mặc định. Không sửa luật đổ khi nghiêng hoặc spec.

Đối chứng mã cũ: nạp 0,5 L rồi tự tràn thành 0 L. Mã mới: cả nút HUD và điểm nạp trên kệ giữ **0,5 L sau 5 giây mô phỏng**, không sinh vũng tự tràn; đổ lên sàn còn **0,4 L**. Lượt UI làm V1 rồi V2 đã nạp/đổ được và mở R2. Runner sandbox **8/8 PASS**, kiểm tra Node pass, console **0 warning/error**.

[Báo cáo sửa lỗi, dữ liệu và ảnh](../proto/tests/refill-fix/REFILL-FIX-REPORT.md). Giữ nguyên FAIL của lượt trước như bằng chứng lịch sử. Chưa chạy lại toàn bộ T1–T21/T14 hoặc playtest người mới độc lập trong lượt sửa này.
