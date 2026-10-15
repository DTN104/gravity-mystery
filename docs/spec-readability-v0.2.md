# Spec bước 3b — Lớp trình bày: đọc được, hiểu được, thao tác được

*v0.2 · 12/10/2026 · Sửa sau feedback Hieu 12/10 (`playtest-feedback-template.md`: 0/0/3): thêm B5, A8, sửa D1, đổi thứ tự H. Nội dung còn lại giữ v0.1.*

*v0.1 · 11/10/2026 · Áp lên `proto/sandbox.html` (spec-sandbox v0.3, 21/21 PASS). Không đổi engine, không đổi luật, không art. Lý do: Hieu là người thật đầu tiên chơi và thấy khó ở cả ba mặt — không biết làm gì, không thấy gì xảy ra, thao tác khó. Claude tự chơi xác nhận: phòng 390×290 px trên màn 1400 px, vật 3–10 px, không nhãn, không phản hồi, chờ 73 s/chu kỳ, bảng che phòng.*

**Nguyên tắc:** mọi thứ người chơi cần biết phải **nằm trên hoặc cạnh phòng**, không ở góc màn hình; mọi thay đổi vật lý phải **được gọi tên bằng lời** ngay khi xảy ra; không bao giờ bắt người chơi chờ mà không có gì để nhìn.

---

## A. Bố cục và kích thước (vấn đề 2: không thấy)

| Mục | Yêu cầu |
|---|---|
| A1 Kích thước phòng | Phòng chiếm **≥ 70 % chiều rộng viewport**, tối đa 1100 px; tỉ lệ 4:3 giữ nguyên. Canvas scale theo viewport (`Phaser.Scale.FIT`), `pixelsPerMetre` nội bộ không đổi, chỉ scale render. Ở 1400 px: phòng ≈ 1000×750 px → ca 25 px, bút 35 px, chốt 60×10 px. |
| A2 Bố cục một màn | Trái: phòng. Phải: **cột 300 px** gồm (trên→dưới) trạng thái, bảng cục bộ **dock cố định** (không overlay, không che phòng), sổ tay gập. Dưới phòng: thanh công cụ. Không có gì ở góc trên-trái ngoài tiêu đề. Màn ≥ 1200 px là mục tiêu; < 1000 px xếp dọc. |
| A3 Nhãn vật | Mọi vật tương tác có **nhãn chữ nhỏ khi rê chuột** (hình nộm, ca, bút, sổ, bình, giẻ, khay gel, chốt, bảng, ô kính, tay vịn, thanh giá, cửa). Nhãn hiện cả khi ở hành lang nhìn qua kính. |
| A4 Chốt cửa | Vẽ to hơn: thanh 0,25×0,06 m, có **khoen** hai đầu và rãnh trượt; màu sáng. Trạng thái ghi ngay cạnh: "MỞ" / "ĐÓNG". Khi trượt: nhấp nháy 1 s + âm "cạch" bằng chữ trong dòng sự kiện. |
| A5 Trọng lực | Bỏ đường vàng ở giữa phòng. Thay bằng **mũi tên to ở bốn tường**: tường đang là "sàn" sáng lên + mũi tên hướng vào nó, kèm chữ "SÀN" trên tường đó. Khi DOWN: sàn sáng, chữ "SÀN" dưới sàn. Zero-g: cả bốn mờ, chữ "KHÔNG TRỌNG LỰC" giữa phòng. |
| A6 Dấu vết | Vết mới sinh **nhấp nháy viền 2 s** + nhãn tạm 3 s ngay cạnh ("vũng", "vệt chảy", "vệt kéo", "vết lau"). Màu nước đậm hơn nền ít nhất 3 bậc. Gel phủ: viền sáng rõ, nhãn "phủ gel" khi rê. |
| A8 Vẽ vật to hơn thật | Lớp vẽ được phóng **riêng từng vật** so với thân vật lý: ca ×1,5, bút ×2 (dày hơn, có nắp màu), viên gel ×1,5, giẻ ×1,5. Chỉ sprite/graphics đổi; thân Matter, khối lượng, va chạm **không đổi**. Vật đang kéo vẽ thêm viền sáng 2 px. Feedback: "nhiều item nhỏ quá", "cây bút nhỏ quá, quăng vô đống gel cũng không thấy". |
| A7 Ô kính | Khi ở hành lang, ô kính chiếm **≥ 50 % chiều rộng** (không còn 270 px), kèm inset chốt. Cửa và hành lang vẽ tối giản quanh ô kính. |

## B. Phản hồi nhân quả (vấn đề 2: không hiểu đã xảy ra gì)

| Mục | Yêu cầu |
|---|---|
| B1 Dòng sự kiện | Một **dòng sự kiện bằng lời** ngay dưới phòng, tối đa 3 dòng gần nhất, chữ to: *"Còi — cửa khóa."* → *"Không trọng lực."* → *"Trọng lực: ĐÔNG. Tường Đông giờ là sàn."* → *"Ca rơi lên tường Đông. Nước loang thành vũng trên tường."* → *"Chốt trượt sang ĐÓNG."* → *"Về Xuống. Vũng trên tường chảy xuống thành vệt."* Sinh từ các sự kiện lớp luật (transition, spill, bolt, decal), **không** từ detector sổ tay. |
| B2 Camera | Khi một sự kiện B1 xảy ra, vật/vết liên quan được **khoanh tròn 1,5 s**. Không zoom. |
| B3 Sau chu kỳ | Khi RETURN xong và mọi vật dừng: hiện thẻ nhỏ **"Vừa rồi"** liệt kê 2–4 thay đổi bằng lời (sinh từ so sánh snapshot trước/sau: vật nào đổi tường, vết nào mới, chốt đổi trạng thái). Có nút "Xem lại 10 s" phát lại đoạn ACTIVE→RETURN ở ×2 (ghi lại vị trí vật mỗi frame trong chu kỳ, phát lại kinematic — không mô phỏng lại). |
| B4 Sổ tay | Popup quy tắc **không** hiện giữa chu kỳ; xếp hàng, hiện sau thẻ "Vừa rồi". Khi hiện, vật/vết liên quan vẫn đang được khoanh. |

| B5 Không modal | **Không popup nào che phòng.** Sổ tay, câu hỏi quy tắc, thoại Thư, thẻ "Vừa rồi" đều render trong **cột phải** (thẻ xếp chồng, thẻ mới nhất trên cùng, tối đa 2 thẻ mở). Câu hỏi quy tắc có nút "Để sau" — ô ? trong sổ tay giữ trạng thái chờ trả lời. Game không pause khi thẻ hiện. Feedback: "đoạn nào cũng che, vì nó hết màn hình". |

## C. Hướng dẫn (vấn đề 1: không biết làm gì)

| Mục | Yêu cầu |
|---|---|
| C1 Lần đầu | Thay thoại một cục của Thư bằng **ba bước có trỏ**: (1) *"Thử kéo cái ca lên bàn."* — ca được khoanh, kéo xong mới sang bước 2; (2) *"Giờ mở bảng, bấm Đông, bấm XOAY NGAY."* — bảng được khoanh; (3) *"Nhìn."* — không chữ nữa. Sau chu kỳ đầu, thẻ "Vừa rồi" hiện và Thư nói: *"Còn lại anh tự thử. Danh sách bên phải."* Có nút "Bỏ hướng dẫn". |
| C2 Việc có thể thử | Chuyển sang cột phải, dưới sổ tay; mỗi dòng là **nút**: bấm → vật liên quan khoanh 2 s (không làm hộ). Gạch khi quy tắc tương ứng mở. |
| C3 Thanh trạng thái | Luôn hiện, chữ to, một dòng: `21:56 · SÀN: ĐÔNG · còn 0:42 · ×1`. "còn" đếm ngược tới mốc kế tiếp (ACTIVE / RETURN / mở khóa). |
| C4 Thư luôn có mặt | Góc dưới-phải cột, một dòng gợi ý đổi theo trạng thái, kiểu: khi IDLE lâu > 30 s không làm gì: *"Hẹn giờ rồi ra ngoài xem thử."*; khi bị khóa ngoài: *"Gọi phòng điều khiển đi."*. Tối đa 6 câu, không lặp. |

## D. Điều khiển (vấn đề 3: thao tác khó)

| Mục | Yêu cầu |
|---|---|
| D1 Chờ (sửa v0.2) | (a) Nút **"Bỏ qua chờ ▸"** chuyển xuống **ngay dưới phòng, cùng hàng dòng sự kiện**, cao 44 px, màu nhấn, nhấp nháy viền 2 lần khi vừa hiện. (b) **Sandbox tự tua WARN và WARN_RETURN ở ×5** (chỉ `timeScale`, không đổi luật), về ×1 ở **3 s cuối** trước T0 / RETURN để khoảnh khắc đổi trọng lực luôn ở tốc độ thật; đồng hồ trên thanh trạng thái hiện "×5" khi đang tua. Người chơi bấm vào bất kỳ đâu trong phòng lúc đang tua → về ×1 ngay. ACTIVE vẫn ×1, muốn qua nhanh thì bấm nút. Nút ×1/×10/×60 vẫn có nhưng là phụ. Feedback: "bấm start thì thời gian nó hoạt động hơi lâu". |
| D2 Kéo vật | Vùng bắt chuột = AABB vật **+ 12 px**; con trỏ đổi thành bàn tay khi rê; vật đang kéo sáng viền; thả trên bàn thì **hít** vào mặt bàn (snap y). Không kéo được → tooltip nói lý do ("đang xoay", "đang ở hành lang"). |
| D3 Bảng cục bộ | Dock cố định cột phải (A2). Hướng là **4 nút to có mũi tên** xếp hình chữ thập (Lên trên, Xuống dưới, Tây trái, Đông phải) — không phải hàng ngang. XOAY NGAY là nút lớn nhất, màu nhấn. Hẹn giờ gập mặc định, mở khi bấm "Hẹn giờ ▸". |
| D4 Công cụ | Thanh dưới phòng: 4 nút to có biểu tượng chữ: **[✋ Kéo] [🫗 Đổ] [🧽 Lau] [🖊 Bút mới]** + bình "0,5 L". Chọn công cụ → con trỏ đổi. Phím tắt 1–4. (Biểu tượng là emoji/chữ, chưa cần icon.) |
| D5 Hành lang | Nút "Ra hành lang" / "Vào phòng" là **cánh cửa vẽ trên tường sau** bấm được, cộng nút dự phòng trên thanh. Khi bị chốt chặn, nút intercom hiện **ngay trên cửa**. |

## E. Chữ

Font mono 15–16 px tối thiểu cho mọi chữ trong-game; chữ sự kiện B1 18 px. Tiếng Việt có dấu đầy đủ. Không viết tắt N/S/E/W ở bất kỳ đâu.

## F. Tham số mới
```js
view: { roomWidthRatio: 0.7, roomMaxWidth: 1100, sideColumn: 300, labelFont: 15, eventFont: 18,
        highlightMs: 1500, newDecalBlinkMs: 2000, skipToMarginSec: 3, idleHintSec: 30,
        replayRecord: true, replaySpeed: 2 },
```

## G. Kiểm tra

**Tự động (T22–T26):**
| # | Kiểm | Đạt khi |
|---|---|---|
| T22 | Scale | Ở viewport 1400×900: phòng ≥ 980 px rộng; ở 1000×700: xếp dọc, phòng ≥ 700 px. Không thanh cuộn ngang. |
| T23 | Dòng sự kiện | Chu kỳ EAST 1' với ca trên bàn sinh đúng chuỗi ≥ 5 dòng theo thứ tự B1; mỗi sự kiện lớp luật ↔ 1 dòng, không trùng. |
| T24 | Bỏ qua chờ | Bấm trong WARN → đồng hồ nhảy tới T0−3 s, timeScale về 1; bấm trong ACTIVE → tới RETURN−3 s. Nhật ký không có sự kiện lạ. |
| T25 | Hướng dẫn | Bước 1 không qua được nếu chưa kéo ca; bước 2 chỉ qua khi XOAY NGAY với hướng ≠ Xuống; "Bỏ hướng dẫn" tắt hết. |
| T26 | Hồi quy | T1–T21 vẫn pass (lớp này không chạm engine/luật). |
| T27 | Không modal | Mở sổ tay, câu hỏi, thoại Thư: không phần tử nào có `position:fixed` phủ lên `#canvas`; `document.querySelector("dialog[open]")` luôn null; game không pause. |
| T28 | WARN ×5 | Sau XOAY NGAY: timeScale = 5 trong WARN tới T0−3 s, rồi = 1; nhật ký giống hệt chạy ×1. |

**Người thật — lại là Hieu, 10 phút, không ai giải thích:** chấm 3 câu, mỗi câu 1–5:
1. Tôi biết phải làm gì tiếp theo.
2. Khi có chuyện xảy ra, tôi hiểu chuyện gì vừa xảy ra.
3. Thao tác (kéo, bấm, chờ) không gây bực.
Đạt khi cả ba ≥ 4. Chưa đạt thì chưa gọi người ngoài.

## H. Thứ tự làm (v0.2)
**Đã xong (phase 1, 11/10):** A1–A2, B1, C3, D1(a bản cũ). Hieu chấm 0/0/3 → thứ tự còn lại xếp theo feedback:

1. **C1 + C2** — Thư dẫn 3 bước có khoanh; thẻ việc thành nút. (Q1 = 0: "không biết làm gì")
2. **B5** — bỏ modal. ("popup che hết màn hình")
3. **A5 + B2 + A6** — tường SÀN, khoanh vật khi sự kiện, vết mới nhấp nháy. (Q2 = 0: "không hiểu chuyện gì xảy ra")
→ *Hieu chơi lại, chấm lại 3 câu.*
4. **A3 + D2 + A8** — nhãn, con trỏ, vẽ vật to. (Q3 = 3: "item nhỏ, không biết cái nào kéo được")
5. **D1 sửa** — nút to dưới phòng + WARN ×5.
6. **A7 + D5** — ô kính to, cửa bấm được. ("lúc ở ngoài phòng" là chỗ bực nhất)
7. **B3** — thẻ "Vừa rồi" + xem lại.
8. **C4** — Thư nhắc theo trạng thái.
9. **A4, D3, D4, B4** — còn lại.
→ *T22–T26, rồi 2 người ngoài.*
