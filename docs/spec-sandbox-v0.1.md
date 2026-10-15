# Spec bước 3 — Buồng thử nghiệm hoàn chỉnh (sandbox)

*v0.1 · 10/10/2026 · Tham chiếu: `concept-v0.2.md` mục 2–3, `script-characters-v0.2.md` Màn 3, `spec-proto-v0.4.md` (engine), `playtest-log.md`. Xây trên `proto/` hiện có — không viết lại engine.*

## 1. Mục tiêu và phạm vi

Biến prototype trần thành **màn chơi đầu tiên người lạ chơi được**: buồng thử nghiệm với bảng điều khiển trong-game, 4 thí nghiệm gợi ý, sổ quy tắc, góc nhìn hành lang. Tiêu chí dừng (từ plan bước 3): cho 1–2 người chưa biết gì chơi **chỉ buồng này** 10 phút; họ phải tự phát biểu được "vũng tròn trên tường = tường đó từng là sàn" và tự nhận ra chốt cửa tự trượt.

**Có:** buồng thử nghiệm + hành lang (ô kính, intercom); bảng cục bộ kiểu game; hình nộm khớp nối; tương tác kéo/đặt/đổ/lau/neo; sổ quy tắc 5 mục; HUD tối thiểu; panel debug ẩn.
**Không:** Lab A, phòng điều khiển, hội thoại cây (chỉ 3 câu thoại cố định của Thư), nhân vật di chuyển, art, âm thanh, lưu game.

## 2. Kiến trúc

- Giữ nguyên `src/rules/`, `src/world/`, `src/view/` của proto. Thêm `src/game/` chứa scene buồng, UI trong-game, sổ quy tắc, bộ phát hiện sự kiện. `rules/` vẫn không import gì từ `game/`.
- `index.html` mới cho bản game (`sandbox.html`), proto cũ giữ nguyên để hồi quy T1–T15.
- Panel debug lil-gui vẫn tồn tại, **ẩn mặc định**, bật bằng phím `` ` ``. Mọi tham số mới thêm vào `PARAMS`.

## 3. Thay đổi engine (bắt buộc, có test)

### 3.1 Hình nộm khớp nối (từ playtest-log)
- Hai khúc: **thân** (hộp 0,4×0,9 + đầu r=0,10 gắn cứng) và **chân** (hộp 0,35×0,8). Khớp **bản lề tại hông**: Matter `Constraint` điểm–điểm, `length 0`, `stiffness 1`, `damping 0.1`. Không giới hạn góc (Matter không hỗ trợ native); chấp nhận gập quá đà, không chấp nhận hai khúc xuyên nhau — đặt `collisionFilter` để thân và chân **không va nhau**.
- Tổng khối lượng 70 kg (thân 45, chân 25), ma sát 0,8, không va chạm bàn (giữ v0.3).
- Tư thế `lying`: cả hai khúc nằm ngang trên sàn, hông tại (1,9; 0,2), đầu hướng Đông. `standing`: chồng dọc tại x=2,5.
- **Tiêu chí (T16):** lying, xoay EAST 1': sau 3 s ACTIVE, trục dài của **ít nhất một khúc** lệch < 30° so với phương thẳng đứng (tức nằm dọc tường Đông), mép gần tường ≤ 0,1 m, đầu ở y < 0,8 m. Về DOWN: hình nộm nằm sát chân tường Đông, không khúc nào "đứng". Chụp ảnh ACTIVE và so với `tests/playtest-v0.4/standing-active.jpg` — phải cho cùng cảm giác "người trên tường".
- Nếu khớp 2 khúc không đạt T16 sau 3 lần chỉnh damping/khối lượng, agent **báo lại**, không tự thêm khúc thứ ba.

### 3.2 Lịch nhiều mục
- `schedule()` nhận tối đa **3 mục**, sắp theo giờ; mục sau không được chồng lên chu kỳ của mục trước (kể cả 10 s còi). Nhật ký: mỗi lần sửa danh sách = một `SCHEDULE_EDIT`. Bảng cục bộ hiển thị danh sách.
- Lý do: người chơi hẹn EAST rồi WEST để tự mở chốt sau khi ra ngoài (mục 5.3).

### 3.3 Lệnh từ bảng tổng (master)
- `cycle.start(dir, duration, { origin: 'master', user: 'LAM' })` → nhật ký ghi `origin: 'master', user: 'LAM'`. Chỉ dùng qua intercom (mục 5.3). Đây là lần đầu người chơi thấy nhật ký có tên người — chuẩn bị cho bước 5.

### 3.4 Hiển thị dấu vết
- `streakWidth` 3 → **6 px**, `poolAlpha` 0,45 → **0,7**, streak alpha giảm dần theo wetness nhưng không dưới 0,5 khi khô. Vết lau: viền rõ hơn.
- Khi ở hành lang: HUD vẽ thêm **inset chốt cửa** phóng ×4 ở góc trên-phải màn hình (phương án B, spec-proto mục 12), cập nhật realtime.

### 3.5 Vào phòng
- `hallway.enter()` yêu cầu `!door.locked && bolt.s === 0`. Nếu chốt đóng: thông báo *"Chốt bên trong đã cài. Không mở được từ hành lang."* và **mở nút intercom** (5.3).

## 4. Bố cục và tương tác trong buồng

Hình học giữ y proto (phòng 4×3, cửa tường sau, khay Tây 0,6 m, thanh giá Đông). Thêm **bình nước** đặt trên kệ nhỏ cạnh cửa (vật rời, 0,5 L, không vỡ, đổ khi nghiêng > 60° hoặc khi người chơi dùng).

| Tương tác | Cách làm | Ràng buộc |
|---|---|---|
| Kéo/đặt vật | Click giữ + kéo (MouseConstraint như proto) | Chỉ khi ở trong phòng và trạng thái IDLE; trong chu kỳ xoay chuột bị khóa (người đang bám tay vịn) |
| Đổ nước | Chọn bình (click) → con trỏ thành bình → click lên bề mặt bất kỳ → `spill(surface, point, 0,1 L)` tại bề mặt gần nhất; mỗi lần trừ 0,1 L, bình 0,5 L, nút "Đổ đầy lại" trên kệ | Chỉ IDLE |
| Lau | Chọn giẻ (vật trên kệ) → click lên decal → `wipe` | Chỉ IDLE |
| Neo hình nộm | Kéo hình nộm tới cách tay vịn ≤ 0,5 m rồi thả → tự móc (constraint). Click tay vịn → tháo | — |
| Bảng cục bộ | Click vào bảng trên tường sau → mở overlay (mục 5.1) | Luôn mở được; lệnh bị từ chối theo luật cycle |
| Ra hành lang | Nút HUD; chỉ khi `!locked` | — |

Không có nhân vật người chơi trên màn hình. Góc nhìn = người đứng cạnh cửa. Trong lúc xoay, một dòng HUD: *"Bạn đang bám tay vịn."*

## 5. UI trong-game

### 5.1 Bảng cục bộ (overlay, thay lil-gui)
```
┌ BUỒNG HIỆU CHUẨN · Bảng cục bộ ──────────────┐
│ Hiện tại: 21:57:40 · XUỐNG · cửa: đóng       │
│ Hướng:   [▼ Xuống] [▲ Lên] [◀ Tây] [▶ Đông]  │
│ Thời lượng: [1'] [5'] [15']                  │
│ [ XOAY NGAY ]   hoặc   Hẹn lúc [21]:[59] [+] │
│ Lịch:  21:59 · ▶ Đông · 1'        [x]        │
│        22:01 · ◀ Tây  · 1'        [x]        │
│ Tua nhanh: [×1] [×10] [×60]                  │
│ Nhật ký ▸  21:55:00 SCHEDULE_EDIT (local)    │
│            …                                 │
└──────────────────────────────────────────────┘
```
- Hướng hiện bằng mũi tên + chữ, **không** bằng N/S/E/W.
- Nhật ký trong-game hiển thị đúng schema `{t, event, origin[, user]}` — không hướng.
- "Tua nhanh" là tính năng của buồng hiệu chuẩn (lý do trong-game: buồng có đồng hồ mô phỏng để chạy lịch thử). Chỉ áp dụng khi người chơi ở trong buồng hoặc hành lang; reset về ×1 khi mở overlay bất kỳ.
- Thông báo từ chối (cửa mở, cooldown, lịch chồng) hiện ngay dưới nút, chữ đỏ, 3 s.

### 5.2 Sổ quy tắc
- Nút HUD "Sổ tay" (góc dưới-trái). Có 5 ô, mỗi ô là một quy tắc **chưa mở khóa** (hiện "?").
- Bộ phát hiện (trong `game/detector.js`, chỉ đọc snapshot của rules) mở khóa ô khi sự kiện xảy ra **lần đầu**:

| # | Sự kiện phát hiện | Popup 3 lựa chọn (đúng in đậm; thứ tự ngẫu nhiên) |
|---|---|---|
| R1 | Có POOL trên WEST/EAST/CEIL, rồi RETURN sinh STREAK từ pool đó | **"Vũng tròn trên tường = tường đó từng là sàn."** / "Ca bị ném mạnh mới loang tròn." / "Vết chảy xuống nghĩa là đổ từ trần." |
| R2 | POOL trên FLOOR có wetness > 0 khi đổi hướng → STREAK ngang | **"Vệt kéo ngang trên sàn = chất lỏng đã nằm trên sàn *trước* khi xoay."** / "Vệt kéo ngang = có người lôi vật nặng qua." / "Nước luôn chảy về phía cửa." |
| R3 | Chốt chạm vị trí đóng dưới EAST **hoặc** mở dưới WEST, trong lúc người chơi ở hành lang hoặc có inset chốt đang hiện | **"Trọng lực ngang trùng trục chốt thì chốt tự trượt. Phòng khóa kín không cần ai ở trong."** / "Chốt chỉ trượt khi có người đẩy." / "Cửa khóa là do chốt." |
| R4 | Người chơi ở hành lang, trạng thái ACTIVE với hướng ≠ DOWN, hình nộm có khúc nằm dọc tường (T16) trong khung nhìn ô kính ≥ 2 s | **"Trong lúc xoay, không ai 'ở trên sàn' — họ ở trên bức tường đang là sàn."** / "Người bám tay vịn thì vẫn đứng trên sàn." / "Qua ô kính không thấy được tường bên." |
| R5 | Sau khi gel dừng, người chơi thả một vật vào đống và vật đó không có cờ coated trong khi ≥ 1 vật khác có | **"Vật rơi *sau* khi gel văng thì nằm trên, sạch."** / "Gel luôn phủ mọi thứ trong phòng." / "Bút nặng nên chìm xuống dưới gel." |

- Chọn đúng: ô sáng, ghi câu vào sổ. Chọn sai: *"Chưa chắc. Thử lại rồi xem."*, ô vẫn "?", popup có thể mở lại từ sổ. Không giới hạn số lần. Không chấm điểm.
- R4 và R3 là hai quy tắc then chốt cho vụ án; R1 là quy tắc "mồi". Log thời điểm mở khóa từng ô (cho playtest).

### 5.3 Hành lang
- Nền hành lang (tường sau che buồng), ô kính 270 px như proto + inset chốt (3.4).
- Nút **"Vào phòng"** (luật 3.5) và **"Intercom → Phòng điều khiển"**: chỉ mở khi bị khóa ngoài vì chốt. Bấm → thoại cố định của Lâm: *"Lại tự khóa à? Chờ tí, tôi xoay Tây một phút cho chốt bật ra."* → `start('WEST', 60, {origin:'master', user:'LAM'})` → sau RETURN chốt mở → vào được. Nhật ký buồng hiện dòng `master / LAM`.
- Mục đích thiết kế: người chơi **bị khóa ngoài bởi chính thí nghiệm của mình** là khoảnh khắc dạy R3 mạnh nhất; intercom vừa cứu vừa giới thiệu bảng tổng và nhật ký có tên.

### 5.4 Thoại cố định của Thư (3 câu, hiện dạng hộp thoại, không cây)
1. Khi vào buồng lần đầu: *"Bảng ở kia. Xoay ngay, hoặc hẹn giờ. Hẹn thì anh kịp ra ngoài nhìn qua kính. Nhớ: còi kêu là cửa khóa. Trong đó có hình nộm, ca nước, khay gel, bút. Anh làm gì cũng được, buồng này chịu được."*
2. Khi người chơi ra hành lang xem ô kính lần đầu lúc ACTIVE: *"Lần đầu em thấy thế này em cũng đứng im một lúc. Giờ thì quen rồi. Quen đến mức không nghĩ về nó nữa."*
3. Khi mở khóa đủ 5 quy tắc: *"Anh nhanh hơn em hồi đó."* (kết màn, nút "Xong").

### 5.5 Thẻ "Việc có thể thử" (HUD, góc trên-trái, gập được)
Bốn dòng, không hướng dẫn từng bước: *Đặt ca lên bàn rồi xoay. · Đổ nước lên sàn, chờ, rồi xoay. · Hẹn giờ rồi ra hành lang nhìn qua kính. · Đổ khay gel rồi thả gì đó vào đống.* Dòng gạch đi khi quy tắc tương ứng mở khóa.

## 6. Hình ảnh (vẫn là "trần", nhưng đọc được)
- Giữ bảng màu proto; thêm: viền sáng cho vật rời khi hover, bóng mờ dưới vật, tường sau hơi sáng hơn tường bao để cửa/bảng/kệ nổi.
- Bảng cục bộ trên tường sau: hình chữ nhật có đèn nhấp nháy khi WARN.
- Chữ HUD: một font mono, 14–16 px. Không icon.

## 7. PARAMS mới (mặc định)
```js
mannequin: { ...cũ, segments: { torso: {w:0.4,h:0.9,mass:45}, legs: {w:0.35,h:0.8,mass:25} }, hipDamping: 0.1 },
scheduleMax: 3, bottleVolume: 0.5, pourVolume: 0.1,
streakWidth: 6, poolAlpha: 0.7, boltInsetZoom: 4,
ruleAutoOpen: true, thuDialogue: true,
```

## 8. Test

**Tự động (mở rộng rules.test.mjs + scenarios):**
| # | Kiểm | Đạt khi |
|---|---|---|
| T16 | Hình nộm khớp nối, lying, EAST | Như 3.1 |
| T17 | Lịch 3 mục, mục chồng bị từ chối | 2 mục hợp lệ chạy đúng thứ tự; mục thứ 4 bị từ chối; mục chồng còi bị từ chối |
| T18 | Intercom | Chốt đóng → enter bị từ chối → intercom → nhật ký có `master/LAM` → sau RETURN chốt 0 → enter OK |
| T19 | R1–R5 | Mỗi detector bắn đúng một lần theo kịch bản tối thiểu; không bắn sai khi làm kịch bản khác |
| T20 | Chuột bị khóa khi không IDLE | Kéo vật trong WARN/ACTIVE không có hiệu lực |
| T21 | Hồi quy | T1–T15 của proto vẫn pass với engine mới (hình nộm khớp nối thay cho khối cứng — T1/T2/T11 đo theo khúc gần tường nhất) |

**Playtest người thật (2 người, mỗi người 10–15 phút, ghi vào `docs/playtest-log.md`):**
- Người thử chưa đọc concept. Người điều phối chỉ nói: *"Đây là buồng thử nghiệm trong một trạm có thể đổi hướng trọng lực từng phòng. Thử gì cũng được. Nói to điều bạn nghĩ."* Không gợi ý thêm.
- Ghi: thứ tự thí nghiệm họ làm; thời điểm mở khóa từng R; họ có bị khóa ngoài không và phản ứng; **câu họ tự nói** khi thấy vũng trên tường và khi nhìn ô kính; chọn sai bao nhiêu lần.
- Đạt: ≥ 1/2 người tự phát biểu R1 bằng lời của họ *trước* khi popup hiện; 2/2 mở được R3; ≥ 1/2 nói ra một câu kiểu "ủa người ta ở trên tường" khi nhìn ô kính.

## 9. Cấu trúc file thêm
```
proto/sandbox.html
src/game/scene.js        // SandboxScene extends scene proto, tắt lil-gui, bật HUD
src/game/panel-ui.js     // overlay bảng cục bộ
src/game/hud.js          // sổ tay, thẻ việc, inset chốt, thoại Thư
src/game/detector.js     // R1–R5, chỉ đọc snapshot
src/game/hallway-ui.js   // intercom, vào phòng
src/world/mannequin.js   // tách khỏi objects.js, 2 khúc + khớp
```

## 10. Chưa chốt / để sau
- Góc nhìn "người đứng cạnh cửa" chưa có hình người; nếu playtest thấy thiếu hiện diện, bước 4 thêm bàn tay/bóng.
- Cooldown 60 s giữ nguyên nhưng với tua nhanh nó gần như vô hình; xem lại nếu người chơi thấy khó hiểu "đang cooldown".
- R4 dựa vào T16 đạt; nếu khớp nối không ổn, R4 tạm dùng tư thế standing cho sandbox và ghi chú lệch hiện trường.
