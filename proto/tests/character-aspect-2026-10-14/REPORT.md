# Sửa tỷ lệ ảnh nhân vật — 14/10/2026

Nguyên nhân: chân dung dùng `background-size: 300% 100%` và cao bằng khung hội thoại. Atlas gốc 2172 × 724 px gồm 3 ô 724 × 724; khung không vuông làm ảnh bị kéo hai chiều độc lập. Hình nộm dùng `setDisplaySize(width,height)` với tỷ lệ khác frame ảnh.

Sửa: portrait dùng tỷ lệ gốc 1:1 từ PARAMS, chiều cao tự động và `background-size: 300% auto`. Khung ảnh độc lập với chiều dài lời thoại; thumbnail cũng vuông. Hình nộm dùng một hệ số scale cho cả hai chiều và đặt tâm ảnh theo thân. PNG gốc, thân vật lý và luật không đổi.

| Kiểm tra | Kết quả / số đo |
|---|---|
| Đối chứng Lâm trước sửa tại 1280 × 800 | 465 × 923 px, ảnh bị kéo dài |
| Lâm / Thư / Khoa tại 1280 × 800 | PASS, mỗi chân dung 465 × 465 px |
| Lâm / Thư / Khoa tại 768 × 900 | PASS, mỗi chân dung 465 × 465 px |
| Lâm / Thư / Khoa tại 375 × 812 | PASS, mỗi chân dung 341 × 341 px |
| Lâm sau mở lời đáp | PASS, vẫn 465 × 465 px |
| Ba thumbnail hành lang | PASS, mỗi ảnh 46 × 46 px |
| Hình nộm trong buồng | Quan sát ảnh đứng giữ tỷ lệ, đầu/chân hiện trong cảnh; không đo lại vật lý |
| Trạng thái UI / luật | 8/8 UI-STATE và hai nhóm rules.test.mjs PASS; PARAMS cũ bằng fixture trước UI |
| Console trang game/buồng | 0 error/warn được ghi nhận |
| Review ảnh riêng | Đạt, không thấy méo, cắt đầu hoặc ảnh nhân vật kế bên lọt vào khung |

Chi tiết: [measurements.json](measurements.json), [review](REVIEW.md), [trước sửa](before-lam-desktop.jpg), [sau sửa desktop](after-lam-desktop.jpg), [mobile](after-thu-375.jpg), [hình nộm](after-mannequin.jpg).

Chưa chạy lại toàn bộ T1–T21/T14 trong lượt sửa hiển thị này; chưa kiểm trình duyệt khác. Các test vật lý lịch sử không được tính là số đo mới.
