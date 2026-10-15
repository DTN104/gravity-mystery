# Playthrough Trạm Thiên Bình — 15/10/2026

Kết quả: chơi được từ phần hướng dẫn tới kết thúc giải vụ án, không gặp chặn tiến trình. Đã để nguyên trình duyệt ở màn kết thúc.

## Phạm vi và cách chơi

Chơi trực tiếp bản người dùng đang mở trong Google Chrome, trang game.html trên máy chủ WebStorm localhost:63342. Dùng nút, menu, kéo vật và bấm trong phòng; không dùng bảng debug, không sửa code hay dữ liệu lưu, không chèn trạng thái/quy tắc. Có dùng nút Bỏ qua chờ và tốc độ ×10/×60 do game cung cấp.

Đây là lượt chơi của agent từng tham gia xây game, không phải kiểm nghiệm với người chơi hoàn toàn chưa biết truyện. Không đo FPS, không chạy lại bộ hồi quy T1–T21 và không suy ra rằng mọi nhánh kết thúc đều đã được kiểm tra.

## Các phần đã đi qua

| Phần | Kết quả thực tế |
| --- | --- |
| Cách chơi → hành lang | Mở được hướng dẫn và vào hành lang. |
| Lab A | Ghi vị trí Hạo, cà phê, cụm đồ, khay gel, chốt bị cắt, vệt sàn, góc bàn, bảng cục bộ, đèn soi và sổ tay. Terminal ban đầu khóa. |
| Hỏi nhân vật | Hỏi đủ 6 câu ban đầu mỗi người: Lâm, Thư, Khoa; lời khai được ghi. |
| Điều khiển | Ghi lượt thử của Thư, phiên chẩn đoán và ticket chốt; nhật ký hiển thị 4 cột, 4 dòng, không có hướng. |
| Chẩn đoán | Bật trước khi thử buồng; quay lại thấy Đang đợi xác nhận tay. Chẩn đoán đã dừng. Bấm xác nhận thì hiện tiếp tục, 180 giây. Không đo độc lập thời gian chờ. |
| Hướng dẫn Thư | Kéo ca trên bàn: bước 1/3 → 2/3; xoay Đông: bước 3/3; kết thúc hướng dẫn được. |
| R1 | Chu kỳ Đông tạo vũng tròn trên tường; RETURN để lại vệt chảy xuống. Trả lời đúng và ghi quy tắc. |
| R2 | Bấm sát sàn khi chọn bình: 0,5 L → 0,4 L, hiện Nước loang thành vũng trên sàn. Xoay Đông tạo vệt kéo; quy tắc được ghi. |
| R5 | Sau RETURN đặt bút mới vào gel gần chân tường Đông; xuất hiện câu hỏi R5 và ghi được quy tắc vật mới nằm trên, sạch. |
| R4 | Hẹn Đông 1 phút lúc 22:03:00, đứng ngoài buồng; nhìn qua ô kính trong ACTIVE lúc 22:03:12–22:03:21. Sau RETURN trả lời và ghi quy tắc. |
| R3 / cửa | Vào phòng sau chu kỳ Đông bị chốt cản dù khóa điện đã hết; Intercom khiến Lâm chờ cooldown rồi xoay Tây. Thấy trạng thái chốt Mở, ghi R3 và vào lại được. |
| Sổ quy tắc | Xác nhận đủ 5/5 trong UI. |
| Terminal | Sau xin quyền Lâm, ghi log sao chép và Báo cáo quý mục 4. |
| Đối chất | Đi qua 3 vật chứng với Lâm, 3 với Thư và chuỗi 4 vật chứng với Khoa. Nhánh mới được mở sau từng bước. |
| Tái hiện | Chọn Nằm cạnh bàn / Có vũng ướt / Mở / Đông. UI báo Khớp 6 dấu vết và nhắc kết quả là minh họa soạn sẵn. |
| Kết luận | Chọn Khoa / Chốt tự trượt khi xoay Đông / Vệt kéo ngang trên sàn. Gửi một lần, nhận màn Nguyên nhân: xem phụ lục. cùng lời thú nhận. |

## Những điểm nên sửa trước

1. **Nút đọc báo cáo biến mất sau khi ghi log terminal.** Mở Terminal Hạo có cả Ghi vào hồ sơ và Đọc mục 4 của báo cáo. Bấm Ghi vào hồ sơ xong thì nút đọc mục 4 không còn trong UI. Phải bấm Terminal Hạo lần nữa mới đọc được. Nên giữ lối sang mục 4 ngay sau khi ghi log.
2. **Nhãn nhánh đối chất khóa gây hiểu sai.** Trước khi đưa Lời khai lúc 22:10 cho Khoa, Đèn soi phủ gel ghi chưa có nhánh đối chất. Sau bước đó, chính vật chứng này lại mở được; Bảng cục bộ và Báo cáo quý cũng tương tự. Nên ghi điều kiện còn thiếu, thay vì khẳng định không có nhánh. Dòng mô tả hiện tại hứa ghi rõ điều kiện nhưng chưa làm được điều này.
3. **Chi tiết từ phòng khác còn nằm trong Lab A.** Khi quay lại Lab A sau đối chất Lâm, khung QUAN SÁT vẫn hiển thị Ticket bảo trì chốt từ tablet phòng điều khiển. Bấm dấu vết khác mới đổi. Nên trả về hướng dẫn chọn dấu vết, hoặc hiện rõ đây là tài liệu đang xem trong hồ sơ.
4. **Bảng điều khiển phải cuộn khá nhiều ở buồng.** Trong cửa sổ Chrome đang dùng, thẻ hướng dẫn và dụng cụ chiếm phần đầu thanh bên; XOAY NGAY nằm thấp hơn vùng nhìn đầu tiên. Người mới có thể bỏ sót. Nút chỉ chỗ trong Việc có thể thử giúp được, nhưng cần nhận biết thanh bên có thể cuộn.

## Quan sát cần kiểm tra thêm

Sau RETURN lần đầu, hình nộm và vật rời giữ gần như cùng tư thế trên các ảnh nhìn trực tiếp tại 22:00:26, 22:00:51 và 22:01:04, dù đồng hồ đang chạy ở ×1. Chưa kiểm tra bên trong engine nên chưa kết luận nguyên nhân. R5 và lượt xoay kế tiếp vẫn hoạt động. Nên kiểm tra lại việc vật thể ổn định trong IDLE sau RETURN.

Có một lần thao tác tự động nhắm nhầm lựa chọn R1 lúc giao diện đổi bố cục. Đã đọc lại câu hỏi và chọn đúng. Các lần menu native tự đóng và sai tọa độ Retina ban đầu là hạn chế điều khiển của agent; không tính là lỗi game.

## Chưa làm

Chưa chơi các kết thúc sai/tai nạn, chưa thử tất cả tổ hợp tái hiện, chưa kiểm tra tải lại/tiếp tục sau khi đóng trình duyệt, chưa kiểm tra điện thoại và chưa đo hiệu năng. Không thay đổi mã nguồn, tham số vật lý hoặc spec trong lượt chơi này.

## Ảnh

Ảnh dưới đây được lưu cục bộ cùng báo cáo, không đưa vào Git vì chụp toàn cửa sổ Chrome kèm thanh trình duyệt. Các liên kết ảnh chỉ dùng trong bản trên máy.

- [Hiện trường](01-lab.jpg)
- [Hội thoại Khoa](02-dialogue-khoa.jpg)
- [ACTIVE Đông](03-active-east.jpg)
- [Nhìn qua ô kính](04-window-active.jpg)
- [Đủ năm quy tắc](05-five-rules.jpg)
- [Đối chất cuối](06-final-confrontation.jpg)
- [Tái hiện](07-replay.jpg)
- [Kết thúc](08-ending.jpg)
