# Playtest theo hướng dẫn v0.2 — 11/10/2026

**Kết quả: 3/4 thí nghiệm PASS theo thứ tự hướng dẫn; V2 FAIL vì bình tự đổ hết ngay sau khi nạp lại.** Đã mở đủ R1–R5 và tới lời kết, nhưng R2 trong lượt chính đến từ nước bình tự đổ; việc hoàn thành Sổ tay không xóa lỗi thao tác V2.

Codex thao tác qua giao diện sandbox mặc định tại `http://127.0.0.1:4173/sandbox.html`, theo phần A của `docs/playtest-script.md`. Không dùng debug, không gọi API scene để làm hộ thao tác, không sửa tham số hay mã game. Đây là kiểm tra giao diện có hướng dẫn, chưa phải playtest người mới độc lập.

**Cập nhật sau lượt này:** lỗi nạp bình đã được sửa và V2 kiểm tra lại PASS. Xem [báo cáo sửa lỗi](../refill-fix/REFILL-FIX-REPORT.md); kết quả FAIL dưới đây giữ nguyên cho lượt trước sửa.

## Kết quả từng thí nghiệm

| Test | Kết quả | Số đo / quan sát thực tế |
|---|---|---|
| V1 — Ca nước | **PASS** | Chọn Đông / 1 phút; nhật ký START **21:55:40**, RETURN **21:56:40**. Thấy vũng trên tường Đông, sau RETURN thấy vệt chảy. Chọn sai một lần có phản hồi “Chưa chắc. Thử lại rồi xem.”; trả lời lại mở R1 và gạch dòng thí nghiệm. |
| V2 — Đổ nước sau V1 | **FAIL** | Sau xoay, bình nằm nghiêng. Bấm **Đổ đầy lại**, chọn **Bình nước**: vẫn hiện **0.0 L**, đồng thời sinh vũng trên sàn. Bấm sàn lúc **22:03:18** báo “Bình đã hết nước. Đổ đầy lại trên kệ.” Không thực hiện được bước đổ nước có chủ đích như tài liệu. |
| V3 — Ô kính / intercom | **PASS** | Thêm lịch Đông **22:07 / 1 phút**, ra ngoài trước còi; mở R4 qua kính. RETURN **22:08:00**; thử vào lúc **22:08:07** bị chốt chặn và hiện intercom. Lâm xoay Tây: START **22:09:10**, RETURN **22:10:10**; chốt mở, R3 xuất hiện. Vào lại được lúc **22:10:17**. Nhật ký ghi `master / LAM`, không ghi hướng. |
| V4 — Bút mới và gel | **PASS** | Khi gel đã dừng, chọn **Lấy bút mới**, đặt vào vùng gel ở chân đống đồ lúc **22:10:50**. R5 xuất hiện; trả lời đúng, Thư hiện lời kết. Sổ tay đủ **5/5** quy tắc, danh sách có **4/4** dòng được gạch. |
| Đối chứng V2 — Lượt mới | **PASS** | Trước khi xoay lần đầu, chọn bình rồi bấm sàn: **0.5 → 0.4 L**, sinh “Nước loang thành vũng trên sàn.” tại **21:55:14**. Xoay Đông sau đó làm xuất hiện câu hỏi R2. Lỗi V2 phụ thuộc trạng thái bình sau chu kỳ trước, không phải thao tác đổ nước luôn hỏng. |
| Kiểm thử luật hiện có | **PASS** | `node proto/tests/rules.test.mjs`: tham số mặc định, import thuần, validation, mốc chu kỳ, nhật ký, chốt, SHELF/TRAY, phủ gel; T17 lịch nhiều mục và T19 detector/quiz đều pass. |
| Console trình duyệt | **PASS** | **0** warning/error trong tab chính và tab đối chứng. |

R2 vẫn mở trong lượt chính vì nước tự tràn lúc nạp bình tạo vũng trên sàn; lần xoay theo lịch làm vũng đó thành vệt. Đây là cách đi tiếp khi gặp lỗi, không tính V2 theo hướng dẫn là pass.

## Lỗi cần xử lý

Nút **Đổ đầy lại** chỉ nạp thể tích, giữ nguyên tư thế bình. Luật đổ khi nghiêng vẫn áp dụng nên bình nghiêng hơn ngưỡng tự xả toàn bộ nước vừa nạp. Người chơi bị yêu cầu nạp lại nhưng thao tác đó không giúp họ đi tiếp.

Đề xuất: thao tác nạp bình cần đưa bình về tư thế dùng được, hoặc hướng dẫn và cung cấp thao tác dựng bình rõ ràng. Không cần đổi ngưỡng đổ, trọng lực, khối lượng, ma sát hay detent. Phiên này chỉ kiểm tra và ghi nhận, chưa sửa game.

## Bằng chứng

- [V1 — vũng trên tường](v1-active.jpg)
- [V2 — bình hết nước sau khi nạp](v2-refill-empty.jpg)
- [V2 đối chứng — đổ nước ở lượt mới](v2-fresh-pool.jpg)
- [V2 đối chứng — câu hỏi R2](v2-fresh-r2.jpg)
- [V3 — ô kính](v3-window-active.jpg)
- [V3 — bị chốt chặn](v3-bolt-blocked.jpg)
- [V3 — mở R3](v3-r3-quiz.jpg)
- [V4 — mở R5](v4-r5-quiz.jpg)
- [Sổ tay đủ năm quy tắc](all-five-rules.jpg)
- [Dữ liệu phiên](session.json)

## Chưa làm / giới hạn

- Chưa chạy lại toàn bộ T1–T21 hoặc đo T14 trong phiên này; không ghi đè báo cáo hồi quy trước.
- Chưa có hai người mới chơi độc lập; không chấm ba câu về mức dễ hiểu, không ghi lời nói của người thật.
- Mốc giờ trong bảng là đồng hồ mô phỏng được đọc từ UI/nhật ký. `elapsedSeconds` trong dữ liệu gồm thời gian điều khiển và gián đoạn phiên; không dùng để chấm thời gian hoàn thành 10–15 phút của người chơi.
