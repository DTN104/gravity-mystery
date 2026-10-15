# Hướng dẫn chơi thử buồng hiệu chuẩn

*v0.2 · 11/10/2026 · Dùng cho sandbox v0.3 và giao diện hiện có. Tiêu chí người thật lấy từ spec-sandbox v0.3 §8 và spec-readability v0.1 §G.*

Tài liệu có hai cách dùng:

- **Bạn tự kiểm tra game:** làm theo phần A để biết bấm gì và quan sát gì.
- **Cho người mới chơi để đánh giá hướng dẫn:** dùng phần B. Người điều phối đọc tài liệu; người chơi chỉ đọc hướng dẫn trong game.

Mẫu feedback ngắn sau lượt bạn tự chơi: [Phiếu feedback buồng hiệu chuẩn](playtest-feedback-template.md). Phiếu ghi quan sát cho người điều phối nằm ở phần B.

## Mở đúng bản chơi

Nếu server ở cổng 4173 đang chạy, mở [buồng hiệu chuẩn](http://127.0.0.1:4173/sandbox.html). Trang `/` là prototype vật lý dùng để hồi quy; bản chơi nằm ở `/sandbox.html`.

Nếu chưa có server, chạy lệnh này từ thư mục gốc `gravity-mystery/`:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory proto
```

Trước mỗi lượt người chơi mới, tải lại trang bằng **Cmd+Shift+R**. Dùng cửa sổ rộng ít nhất 1200 px, giữ tab ở phía trước; cần mạng để tải Phaser. Chuẩn bị đồng hồ bấm giờ. Giữ bảng debug ẩn. Nếu chơi trong cửa sổ hẹp, bảng và danh sách thí nghiệm nằm dưới phòng; cuộn xuống để tìm.

## A. Bạn tự test theo hướng dẫn

### Các nút cần biết

| Việc muốn làm | Cách làm |
|---|---|
| Đổi trọng lực ngay | Ở **Bảng cục bộ** bên phải: chọn hướng, chọn **1'**, bấm **XOAY NGAY**. |
| Hẹn giờ | Chọn hướng và thời lượng, nhập **Giờ / Phút**, rồi bấm **+ Thêm lịch**. Giờ phải sau mốc **Sớm nhất có thể hẹn tiếp**; nếu mốc là 22:01:10, chọn 22:02 hoặc muộn hơn. |
| Kéo vật | Chọn **Kéo/đặt vật**, giữ chuột trên vật rồi kéo và thả. Chỉ làm được khi đang chờ trong buồng. |
| Đổ nước | Chọn **Bình nước**, rồi bấm sát bề mặt muốn đổ. Khi bình hết, bấm **Đổ đầy lại** để đưa bình về kệ, dựng thẳng và nạp 0,5 L. |
| Lau | Chọn **Giẻ lau**, rồi bấm vào dấu vết. |
| Thêm bút | Chọn **Lấy bút mới**, rồi bấm trong phòng để đặt bút. |
| Rút ngắn lúc chờ | Bấm **Bỏ qua chờ ▸** khi nút xuất hiện. Game tua nhanh tới gần mốc tiếp theo rồi tự về ×1; có thể cần bấm lại ở chặng sau. |
| Xem quy tắc | Bấm **Sổ tay**. Ô **?** chưa mở; nếu đã có quan sát, bấm ô đó để trả lời lại. |

**1' là thời lượng từ lúc bắt đầu xoay tới lúc trở về Xuống; trước đó còn có còi cảnh báo.** Hết chu kỳ chưa chắc xoay tiếp được ngay: buồng có thời gian nghỉ (cooldown). Nếu bị từ chối vì cooldown, chờ hoặc chọn ×10 để đồng hồ chạy nhanh hơn. Khi mở thoại hoặc câu hỏi, tốc độ về ×1; đồng hồ vẫn chạy.

### Thử 1 — Ca nước và dấu vết trên tường

1. Bấm **Đã hiểu** để đóng lời Thư. Ca đã nằm trên bàn; lượt đầu chưa cần kéo vật.
2. Chọn **▶ Đông**, **1'**, rồi **XOAY NGAY**.
3. Quan sát ca và nước trong lúc xoay. Dòng sự kiện dưới phòng gọi tên những việc vừa xảy ra.
4. Để buồng tự trở về Xuống. Có thể dùng **Bỏ qua chờ ▸** sau khi đã nhìn thấy nước trên tường.
5. Khi câu hỏi xuất hiện, chọn câu phù hợp với điều vừa quan sát. Chọn sai vẫn được thử lại; **Để thử thêm** đóng câu hỏi.

**Cần kiểm tra:** có nước loang trên tường khi xoay; khi trở về Xuống, nước chảy thành vệt. Trả lời đúng thì ô **R1** trong Sổ tay mở và dòng thí nghiệm được gạch.

### Thử 2 — Nước đã có trên sàn

1. Khi buồng đang chờ, chọn **Bình nước**. Nếu bình hết, bấm **Đổ đầy lại**.
2. Bấm sát sàn, ở một chỗ dễ nhìn và chưa có dấu vết. Xác nhận đã thấy vũng nước.
3. Chờ vài giây, rồi chọn **▶ Đông**, **1'**, **XOAY NGAY**. Nếu còn cooldown, đợi hết rồi bấm lại.
4. Nhìn vũng nước vừa đổ ngay lúc trọng lực đổi. Đừng tua qua đoạn này.

**Cần kiểm tra:** vũng trên sàn bị kéo thành vệt ngang. Câu hỏi **R2** xuất hiện; trả lời đúng thì ô R2 mở.

### Thử 3 — Ra ngoài nhìn qua kính và thử cửa

1. Chọn **▶ Đông**, **1'**. Nhìn giờ hiện tại và dòng **Sớm nhất có thể hẹn tiếp**.
2. Nhập một giờ sau mốc đó, bấm **+ Thêm lịch**, rồi kiểm tra lịch đã xuất hiện trong bảng. Để đủ thời gian ra ngoài, chọn giờ cách hiện tại ít nhất hai phút.
3. Bấm **Ra hành lang** trước khi còi kêu. Nếu cửa đã khóa, chờ hết chu kỳ rồi hẹn lại.
4. Đợi lịch chạy. Quan sát hình nộm qua ô kính và chốt trong khung phóng to. Đóng thoại/câu hỏi nếu đang che; nhìn hình nộm vài giây ở ×1 trước khi tua tiếp.
5. Đợi buồng trở về Xuống và nút **Vào phòng** hết bị vô hiệu hóa, rồi bấm nút đó.
6. Nếu thông báo nói chốt bên trong đã cài, bấm **Intercom → Phòng điều khiển**. Đóng lời Lâm; Lâm sẽ chờ hết cooldown rồi chạy một chu kỳ Tây.
7. Quan sát chốt, đợi chu kỳ Tây kết thúc và cửa hết khóa, rồi bấm **Vào phòng**. Có thể chọn ×10 khi đang chờ Lâm và dùng **Bỏ qua chờ ▸** khi chu kỳ đã chạy.

**Cần kiểm tra:** thấy hình nộm và chốt thay đổi lúc đang ở ngoài; cửa vẫn không vào được khi chốt đã cài; intercom giúp vào lại. **R3/R4** mở sau khi trả lời đúng. Mở **Nhật ký** sẽ thấy nguồn `master / LAM`; nhật ký không ghi hướng.

### Thử 4 — Bút mới trong đống gel

1. Nếu gel còn trong khay, xoay **▶ Đông**, **1'** để gel văng khỏi khay.
2. Chờ buồng trở về Xuống, rồi chờ thêm vài giây cho gel đứng yên.
3. Chọn **Lấy bút mới**, bấm vào phần đông hạt gel để đặt bút. Không bấm xa đống gel.
4. Chờ bút dừng, rồi so sánh với những vật đã có trong phòng trước lúc xoay.

**Cần kiểm tra:** bút mới không có viền phủ gel, trong khi có vật cũ đã được phủ. Câu hỏi **R5** xuất hiện; trả lời đúng thì ô R5 mở. Nếu chưa có câu hỏi, kiểm tra bút có nằm sát gel đã dừng và có vật cũ được phủ hay chưa.

**Một lượt đủ nội dung:** Sổ tay có đủ R1–R5, bốn dòng thí nghiệm được gạch và Thư hiện lời kết. Nếu thiếu một ô, ghi rõ thí nghiệm, thao tác và điều đã thấy; đừng chỉ ghi “không chạy”.

### Khi bị kẹt

| Hiện tượng | Kiểm tra trước |
|---|---|
| Không kéo/đổ/lau được | Có đang trong buồng, ở trạng thái chờ và đã đóng thoại/câu hỏi không? Kiểm tra công cụ đang chọn. |
| XOAY NGAY bị từ chối | Đọc chữ đỏ dưới nút: chu kỳ chưa hết hay còn cooldown? |
| Thêm lịch bị từ chối | Giờ có sau mốc “Sớm nhất” không? Lịch có chồng mục khác hoặc đã đủ ba mục không? |
| Không thấy nút intercom | Chờ cửa hết khóa, rồi thử **Vào phòng**. Nút intercom hiện khi việc vào bị chốt chặn. |
| Chưa mở được quy tắc | Xem đã có câu hỏi cho quy tắc đó chưa. Có câu hỏi chưa đồng nghĩa đã mở ô; phải trả lời đúng. |
| Muốn làm lại từ đầu | Tải lại trang. Vật, dấu vết, lịch và Sổ tay của lượt hiện tại sẽ mất; bản này chưa lưu game. |

## B. Playtest với người mới

Mục đích là xem người chơi có tự hiểu hướng dẫn và sự kiện hay không. Không đưa phần A hoặc bảng đáp án quan sát bên dưới cho họ trước lượt chơi.

### Cách tổ chức

1. **Vòng A:** Hieu tự chơi 10 phút, không ai giải thích thêm. Chấm ba câu ở cuối tài liệu; chỉ sang vòng B khi cả ba đạt ít nhất 4/5.
2. **Vòng B:** hai người chưa đọc concept, mỗi người 10–15 phút. Tải lại trang trước mỗi lượt. Người điều phối chỉ nói câu mở đầu:

> “Đây là buồng thử nghiệm trong một trạm có thể đổi hướng trọng lực từng phòng. Thử gì cũng được. Nói to điều bạn nghĩ.”

Sau đó quan sát. Chỉ hỗ trợ lỗi kỹ thuật, chẳng hạn chuột không nhận, và ghi lại việc hỗ trợ. Khi người chơi hỏi “tôi nên làm gì?”, ghi nguyên văn cùng thời điểm; không chỉ họ phải bấm nút nào.

Nếu sau 10 phút họ chưa tự tới thí nghiệm qua ô kính, ghi **“không tới V3”** và kết thúc lượt. Không dùng các bước phần A để cứu lượt đo khả năng tự khám phá.

### Những gì người điều phối cần ghi

| Thí nghiệm | Dấu hiệu cần quan sát |
|---|---|
| V1 — ca nước | Câu họ tự nói khi thấy nước trên tường; ghi rõ câu đó có trước khi popup R1 hiện không. |
| V2 — vũng trên sàn | Họ có đổ nước trước khi xoay, và có nhận thấy vệt kéo ngang không? |
| V3 — ô kính/cửa | Họ có tự hẹn rồi ra ngoài, nói gì khi thấy hình nộm, có bị khóa ngoài và tìm intercom không? |
| V4 — gel/bút | Họ có chờ gel dừng rồi thêm vật mới, và có so sánh vật mới với vật cũ không? |

Ghi riêng **lúc câu hỏi xuất hiện** và **lúc trả lời đúng mở ô**. Thời gian trong phiếu là phút thực tính từ lúc bắt đầu chơi; đừng dùng đồng hồ mô phỏng của buồng thay cho đồng hồ bấm giờ.

### Phiếu cho từng người

**Người thử:** ______ · **Ngày:** ______ · **Bản/phase:** ______ · **Đã đọc concept:** không / có

| Phút thực | Họ làm gì | Họ nói gì — nguyên văn | Lỗi / hỗ trợ đã dùng |
|---|---|---|---|
| 0:00 | | | |
| | | | |

| Mốc | Phút thực / ghi chú |
|---|---|
| Hành động đầu tiên | |
| Hỏi “tôi phải làm gì?” — số lần | |
| Lần xoay đầu — hướng đã chọn | |
| Câu nói về nước trên tường — trước popup R1? | |
| Ra hành lang lần đầu | |
| Câu nói về hình nộm qua kính | |
| Bị khóa ngoài — phản ứng nguyên văn | |
| Bấm intercom — bao lâu sau khi bị chặn | |
| Bỏ qua chờ — số lần / có tự tìm thấy nút không | |
| Kết thúc — tổng thời gian | |

| Quy tắc | Câu hỏi xuất hiện lúc | Mở ô lúc | Số lần chọn sai |
|---|---|---|---|
| R1 | | | |
| R2 | | | |
| R3 | | | |
| R4 | | | |
| R5 | | | |

### Hỏi sau khi chơi

Chấm từ **1 = hoàn toàn không đồng ý** đến **5 = hoàn toàn đồng ý**:

1. Tôi biết phải làm gì tiếp theo. ___ / 5
2. Khi có chuyện xảy ra, tôi hiểu chuyện gì vừa xảy ra. ___ / 5
3. Thao tác kéo, bấm và chờ không gây bực. ___ / 5

Hỏi thêm: **“Nếu giải thích luật của buồng này cho người khác bằng một câu, bạn sẽ nói gì?”** Ghi nguyên văn câu trả lời.

### Chấm kết quả và ghi log

Vòng B đạt khi:

- Ít nhất **1/2 người** tự phát biểu ý R1 bằng lời của họ **trước khi popup R1 hiện**.
- **2/2 người** mở được R3.
- Ít nhất **1/2 người** tự nói một câu nhận ra hình nộm đang ở trên bức tường qua ô kính.
- Điểm trung bình của **từng câu** trong ba câu hỏi sau chơi đều **≥ 4/5**.

Chép một phiếu riêng cho mỗi người vào `docs/playtest-log.md`, giữ nguyên văn câu nói. Nếu chưa đạt, ghi tiêu chí nào hụt cùng hành động/lời nói làm bằng chứng; tách đề xuất sửa khỏi quan sát. Chỉ điền kết quả sau khi có lượt chơi thật.
