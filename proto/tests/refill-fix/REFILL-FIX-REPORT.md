# Sửa nạp lại bình nước — 11/10/2026

**Kết quả: PASS.** Đã tái hiện lỗi trên mã cũ, sửa thao tác nạp chung cho cả nút HUD và điểm nạp trên kệ, rồi kiểm tra lại bằng engine và UI. V2 thực hiện được sau V1: nạp bình, đổ lên sàn, xoay và mở R2.

## Thay đổi

`SandboxScene.refill()` đưa cùng bình về vị trí ban đầu trên kệ, dựng thẳng theo `PARAMS.bottle.angle`, dừng vận tốc tịnh tiến/xoay rồi nạp `PARAMS.bottleVolume`. Giữ body và ID, dấu vết, lịch, nhật ký và các quy tắc đã mở. Reset cũng dùng góc này; mặc định 0 rad như trước.

Không sửa spec hoặc luật đổ khi nghiêng. g, khối lượng, ma sát, detent và tọa độ mặc định giữ nguyên. README và hướng dẫn chơi đã ghi rõ việc nạp đưa bình về kệ.

## Đối chứng trước / sau

Runner chạy một chu kỳ Đông 1 phút thật trong engine, trở về Xuống và chờ thêm 8 giây mô phỏng trước khi nạp.

| Trường hợp | Kết quả | Số đo thực tế |
|---|---|---|
| Mã cũ — nút HUD | **FAIL** | Sau nạp 0,5 L; sau 5 giây mô phỏng còn **0 L**, sinh thêm **1** vũng tự tràn. Góc Matter tích lũy 814,1754° (tương đương nghiêng 94,1754°). |
| Mã mới — nút HUD | **PASS** | 0 → **0,5 L**, sau 5 giây vẫn **0,5 L**; góc ≈ **0°**, **0** lần tự tràn. Đổ lên FLOOR còn **0,4 L**. Cùng body/ID, nhật ký không đổi. |
| Mã mới — điểm nạp trên kệ | **PASS** | 0 → **0,5 L**, sau 5 giây vẫn **0,5 L**; góc ≈ **0°**, **0** lần tự tràn. Đổ lên FLOOR còn **0,4 L**. Cùng body/ID, nhật ký không đổi. |
| UI — V1 rồi V2 | **PASS** | Sau V1 bình **0,0 L**. Nạp lúc **21:56:45**, vẫn **0,5 L** trước khi đổ; bấm sàn lúc **21:56:58** còn **0,4 L**, hiện “Nước loang thành vũng trên sàn.” Lần xoay tiếp xuất hiện câu hỏi R2; trả lời đúng gạch cả V1 và V2. |

Mốc giờ UI là đồng hồ mô phỏng, không dùng để đo thời gian hoàn thành của người chơi. Bình còn lại tự đổ khi nghiêng trong lần xoay tiếp là luật hiện có; bình không tự tràn trong lúc chờ sau nạp.

## Kiểm tra hồi quy liên quan

`tests/sandbox-tests.html`: **8/8 PASS**.

| Test | Kết quả | Số đo / quan sát |
|---|---|---|
| MANNEQUIN-MODES | **PASS** | 4 tổ hợp cứng/khớp × nằm/đứng, tổng khối lượng **70 kg** mỗi tổ hợp; loại va chạm bàn đúng. |
| T17-UI | **PASS** | Mốc hẹn tiếp: **22:01:10 → 22:04:10 → 22:01:10** sau thêm/xóa lịch. |
| T18 | **PASS** | Chốt **0,2 → 0 m** sau intercom; vào phòng được; nhật ký `master / LAM`, không có hướng. |
| T20 | **PASS** | Kéo thử trong WARN và ACTIVE lệch quỹ đạo **0 m**; IDLE vẫn tương tác được. |
| T19-engine | **PASS** | R1/R2/R3/R5 phát hiện đúng **1 lần** mỗi quy tắc; bút mới `coatedAt = null`. |
| TOOLS | **PASS** | Dưới ngưỡng nghiêng giữ **0,5 L**, trên ngưỡng còn **0 L**; đổ SHELF còn **0,4 L**; nạp trong WARN bị từ chối. |
| REFILL-AFTER-CYCLE | **PASS** | Cả hai điểm nạp giữ **0,5 L** sau **5 s**, không tự tràn; đổ FLOOR còn **0,4 L**. |
| T19-R4-view | **PASS** | Cứng standing; phát hiện R4 sau **2,1385 s** quan sát thực. |

`node proto/tests/rules.test.mjs`: **PASS** cả hai nhóm kiểm tra luật/import/validation và lịch/master/detector/quiz. Console runner và tab UI: **0 warning/error**.

## Bằng chứng

- [Dữ liệu trước sửa](before.json), [sau sửa](after.json), [thao tác UI](ui-session.json).
- [Bình sau nạp](refilled.jpg), [đổ nước lên sàn](manual-pour.jpg), [câu hỏi R2](r2-quiz.jpg).
- [Buồng sau chu kỳ thứ hai, bình trên kệ và 0,5 L](ready.jpg).

## Chưa làm / lệch spec

- Chưa chạy lại toàn bộ T1–T21 hoặc đo T14; không ghi đè số đo hồi quy vật lý trước đó.
- Chưa có người mới chơi độc lập; kết quả này xác minh lỗi thao tác, không chấm khả năng tự khám phá.
- Nạp lại giờ đưa bình về kệ ban đầu. Spec không mô tả cách dựng bình khi nạp; đây là hành vi sửa lỗi đã được người dùng yêu cầu, không thay các tham số vật lý được bảo vệ.
