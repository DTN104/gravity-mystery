# Spec kỹ thuật — Prototype vật lý trần (bước 1–2)

*v0.1 · Tham chiếu: `concept-v0.1.md` mục 2, `script-characters-v0.2.md` Màn 3. Mục tiêu: một trang HTML, một phòng hộp, không art, chứng minh 5 hành vi vật lý và 3 luật decal. Mọi số dưới đây là giá trị khởi điểm — chỉnh được qua panel debug, không hard-code rải rác.*

---

## 1. Phạm vi

**Có:** 1 phòng; trọng lực 4 hướng; chu kỳ xoay có còi/zero-g/khóa cửa; vật rời & vật cố định; hình nộm; chốt cửa trượt; cửa + ô kính (góc nhìn hành lang); decal chất lỏng theo luật; panel debug; chế độ hẹn giờ.
**Không:** nhân vật người chơi di chuyển, hội thoại, UI game, art, âm thanh, nhiều phòng, lưu game, replay.

## 2. Stack & nguyên tắc

- **Phaser 3 (3.80+) + Matter.js** (plugin sẵn trong Phaser). Một file `index.html` + `src/` ES module, chạy bằng `npx serve` hoặc Vite. Không framework UI; panel debug dùng `lil-gui` (CDN).
- **Hai lớp tách biệt, không trộn:**
  - *Lớp vật lý* (Matter): chỉ cho vật rắn rời + hình nộm + chốt. Phi tất định — chấp nhận, vì chỉ dùng cho sandbox.
  - *Lớp luật* (JS thuần): chu kỳ xoay, khóa cửa, decal chất lỏng, trạng thái chốt. **Tất định** — sau này Lab A/replay chỉ dùng lớp này + kết quả soạn sẵn.
- Mọi tham số gom trong một object `PARAMS` (mục 9), bind vào panel debug.

## 3. Đơn vị & hệ tọa độ

- **1 m = 100 px.** Phòng trong **4,0 m × 3,0 m** → 400 × 300 px, tường dày 20 px (0,2 m). Canvas 960 × 540, phòng đặt giữa, còn chỗ cho hành lang bên trái và panel.
- Gốc tọa độ: góc **Tây–Nam** (trái–dưới) bên trong phòng. x → Đông, y → Lên. (Phaser y hướng xuống — đổi dấu ở một chỗ duy nhất trong helper `toScreen()`.)
- Hướng trọng lực: enum `DOWN | UP | WEST | EAST` ↔ vector `(0,-1) (0,1) (-1,0) (1,0)` × g. **g = 9,81 m/s² = 981 px/s².** Matter dùng `engine.gravity.scale`; đặt `gravity.x/y` = vector đơn vị và `scale` tương ứng — hoặc set `gravity.y = ±1` với scale chuẩn, kiểm tra bằng thí nghiệm rơi tự do 3 m ≈ 0,78 s.

## 4. Bố cục phòng (tọa độ mét, tính từ góc Tây–Nam)

| Vật | Loại | Vị trí (x, y) & kích thước | Ghi chú |
|---|---|---|---|
| Sàn, trần, tường Tây, tường Đông | static | hộp 4×3 | ma sát 0,6 |
| **Cửa** | static, trên *tường sau* | tâm (0,6; 1,0), rộng 0,9 cao 2,0 | Vẽ như hình chữ nhật mờ trên nền; không có collider (tường sau là mặt phẳng nhìn vào). Có **ô kính** (0,6; 1,5) 0,3×0,3. |
| **Chốt cửa** | dynamic, 1 bậc tự do | thanh 0,25×0,04 m, tâm nghỉ (0,85; 1,1); trượt theo x trong khoảng [0,85 ; 1,05] | Chi tiết mục 6 |
| **Bàn** | static | mặt bàn (1,0→2,0 ; 0,9) dày 0,05; hai chân | bắt vít, không di chuyển |
| **Thanh giá** | static | gắn tường Đông, (3,8→4,0 ; 0,4) dày 0,04 | điểm va chạm cứng |
| **Khay gel ×1** | static container | gắn tường Tây, (0→0,3 ; 1,8→2,1), mở về phía Đông | chứa hạt gel |
| **Tay vịn** | static, không collider | tường Tây (0,05; 1,2), tường Đông (3,95; 1,2) | chỉ để neo hình nộm |
| **Ca** | dynamic | hộp 0,1×0,1, tâm (1,3; 0,95) trên bàn | khối lượng 0,3 kg, bounce 0,1, ma sát 0,4; chứa chất lỏng 0,2 L |
| **Bút** | dynamic | hộp 0,14×0,015, (1,7; 0,92) | 0,02 kg |
| **Sổ** | dynamic | hộp 0,2×0,03, (1,5; 0,92) | 0,3 kg, ma sát 0,7 |
| **Hạt gel ×60** | dynamic, circle r=0,015 | trong khay | 0,005 kg, ma sát 0,3, bounce 0; giới hạn 60 để giữ 60 fps |
| **Hình nộm** | dynamic compound | thân hộp 0,4×1,7 + đầu circle r=0,12; đứng tại (2,5; 0,85) | 70 kg (tổng), ma sát 0,8; không khớp nối |
| **Bình nước** (dụng cụ) | không physics | — | công cụ đổ chất lỏng lên bề mặt bất kỳ (mục 7) |

Debug: có thể kéo-thả mọi vật dynamic bằng chuột (Matter `MouseConstraint`), có nút "neo/thả neo hình nộm" vào tay vịn gần nhất (constraint cứng).

## 5. Chu kỳ xoay — state machine (lớp luật)

```
IDLE(DOWN) --start(dir, duration)--> WARN(10s) --> ZERO_G(3s) --> ACTIVE(dir, duration) --> WARN_RETURN(10s) --> ZERO_G(3s) --> IDLE(DOWN)
```

| Trạng thái | Trọng lực engine | Cửa | Hành vi khác |
|---|---|---|---|
| IDLE | DOWN | mở được | — |
| WARN | DOWN | **khóa ngay khi vào WARN** | còi (log text), đèn nhấp nháy |
| ZERO_G | (0,0) | khóa | vận tốc vật rời giữ nguyên, thêm nhiễu nhỏ ±0,05 m/s để "lơ lửng" |
| ACTIVE | theo `dir` | khóa | chạy đủ `duration` |
| WARN_RETURN / ZERO_G | như trên | khóa | — |
| IDLE (sau về) | DOWN | **mở lại sau 3 s** (`PARAMS.doorUnlockDelay`) | — |

Luật:
- `start()` bị từ chối nếu `door.isOpen` (debug toggle) → log "Từ chối: cửa đang mở".
- `duration` ∈ [1 phút, 30 phút]; prototype cho phép **tua nhanh ×10/×60** (chỉ tua lớp luật và engine timestep, không bỏ qua va chạm — dùng substeps).
- Cooldown 60 s sau IDLE trước khi `start()` tiếp (có thể tắt trong debug).
- **Hẹn giờ:** `schedule(atSeconds, dir, duration)`; lịch hiển thị trên panel như bảng cục bộ: `22:00 — ĐÔNG — 15'`. Đồng hồ giả lập bắt đầu 21:55:00, chạy theo tốc độ tua.
- **Nhật ký** (mảng, hiện trên panel): `{t, event: 'SCHEDULE_EDIT'|'MANUAL_START'|'SCHEDULED_START'|'RETURN', origin: 'local'}`. **Không ghi `dir`** — đúng như concept.

## 6. Chốt cửa

Mô hình 1 bậc tự do, **không dùng Matter** (tránh hành vi lạ) — tính trong lớp luật mỗi frame:

```
s ∈ [0, L]        // L = 0,20 m hành trình; s = 0 mở, s = L đóng (đẩy sang Đông)
F_grav = m_bolt * g * dot(gravityUnit, +x)      // chỉ thành phần dọc trục chốt
F_detent = PARAMS.boltDetent                    // lực lẫy giữ, N, cản chuyển động
if |F_grav| > F_detent: a = (F_grav - sign(F_grav)*F_detent) / m_bolt; tích phân s, kẹp [0, L]
else: s giữ nguyên
```

Tham số khởi điểm: `m_bolt = 1,2 kg` → F_grav khi ngang = 11,8 N; `boltDetent = 6 N`. Khi DOWN/UP: dot = 0 → không trượt. Khi EAST: trượt đóng trong ~0,3 s; WEST: trượt mở.
Hiển thị: thanh trượt vẽ trên cửa ở tường sau, có "kêu" (log) khi chạm s = L hoặc s = 0. Debug: kéo chốt bằng tay khi IDLE.
**Kiểm tra bắt buộc:** với `boltDetent ≥ 12 N` chốt không trượt ở mọi hướng — đây là "chốt tốt" để đối chiếu; phải thể hiện được cả hai loại.

## 7. Decal chất lỏng (lớp luật, không mô phỏng)

Mỗi "nguồn" chất lỏng là một sự kiện: `{surface, point, volume, color, t0}` → sinh decal theo luật. Bề mặt: `FLOOR | CEIL | WEST | EAST` + mặt bàn (coi là FLOOR cục bộ).

| Sự kiện | Khi nào | Decal sinh ra |
|---|---|---|
| **Đổ ra** | Ca (hoặc bình nước debug) chạm bề mặt với tốc độ > 0,5 m/s, hoặc ca nghiêng > 60° | `POOL` trên bề mặt **đang là sàn** theo trọng lực hiện tại, tâm tại điểm chạm, bán kính ∝ √volume (0,2 L → r = 0,12 m). Nếu bề mặt chạm không phải sàn hiện tại (ví dụ ném vào tường khi DOWN): `SPLASH` nhỏ + `STREAK` xuống ngay. |
| **Đổi hướng khi còn ướt** | Trạng thái ACTIVE/IDLE đổi và decal có `wetness > 0` | `POOL` trên sàn cũ → thêm `STREAK` từ tâm pool về phía sàn mới, dài = `PARAMS.streakLength × wetness` (khởi điểm 1,0 m × wetness); pool co lại 50 %. `POOL` trên tường (tường từng là sàn) khi về DOWN → `STREAK` thẳng xuống đến chân tường. |
| **Khô** | mỗi giây | `wetness -= 1/PARAMS.dryTime` (khởi điểm dryTime = 20 phút giả lập; debug có thể đặt 30 s). `wetness = 0` → decal cố định vĩnh viễn, không sinh streak nữa. |
| **Lau** | nút debug "lau" tại điểm | xóa decal trong bán kính 0,3 m, để lại decal `WIPE` (hình cung, mờ) — không ảnh hưởng chất lỏng đổ sau. |

Hạt gel **là** vật rắn Matter (không phải decal); "phủ gel" được xác định bằng luật: vật rời nào có ≥ 3 hạt gel nằm đè lên (kiểm tra AABB chồng + hạt ở phía trên theo trọng lực hiện tại) khi gel dừng (vận tốc < 0,01 m/s trong 2 s) → gắn cờ `coatedAt = t`. Vật thả vào sau khi gel đã dừng → không có cờ. Hiển thị cờ bằng viền màu.

Render decal: một `Graphics` layer riêng vẽ lại khi có thay đổi, không mỗi frame.

## 8. Góc nhìn hành lang

Nút "Ra hành lang": camera dịch sang trái, phòng bị che bởi tường sau, chỉ còn **ô kính** 0,3×0,3 m (phóng ×3 thành viewport nhỏ) nhìn vào. Qua ô kính thấy được toàn bộ phòng (dùng mask hình chữ nhật, không thu hẹp góc nhìn). Cửa khóa → nút "Vào phòng" bị vô hiệu kèm log.

## 9. PARAMS (mặc định) & panel debug

```js
export const PARAMS = {
  g: 9.81, warnTime: 10, zeroGTime: 3, doorUnlockDelay: 3, cooldown: 60,
  timeScale: 1,                 // 1 | 10 | 60
  boltMass: 1.2, boltTravel: 0.20, boltDetent: 6,
  dryTime: 1200, streakLength: 1.0, poolRadiusPerLitre: 0.27,
  gelCount: 60, gelCoatMin: 3,
  mannequinMass: 70, mannequinAnchored: false,
  doorIsOpen: false,
};
```
Panel: nhóm *Trọng lực* (4 nút hướng, start/stop, hẹn giờ, duration), *Thời gian* (đồng hồ giả lập, timeScale), *Chốt* (detent, mass, kéo tay), *Chất lỏng* (dryTime, đổ nước tại chuột, lau tại chuột), *Vật* (reset, thêm ca/bút/sổ, neo hình nộm), *Nhật ký* (bảng), *Hiển thị* (bật/tắt decal, cờ phủ gel, vector trọng lực).

## 10. Kịch bản kiểm tra — tiêu chí dừng bước 1–2

| # | Thao tác | Kết quả phải thấy |
|---|---|---|
| T1 | Reset. Start EAST 1'. | Ca, bút, sổ rời bàn rơi lên tường Đông trong < 1 s; hình nộm (không neo) ngã lên tường Đông; gel đổ khỏi khay, văng tường Đông. Chốt trượt đóng ~0,3 s sau khi ACTIVE. |
| T2 | Hết chu kỳ, về DOWN. | Mọi vật rơi xuống, **tụ dọc chân tường Đông** trong dải ≤ 0,5 m; không vật nào ở giữa phòng. Chốt vẫn đóng. |
| T3 | Reset. Start WEST 1'. | Chốt trượt **mở**; gel ép vào khay (không đổ); ca/bút/sổ rơi về tường Tây. |
| T4 | Reset. Đặt detent = 12. Start EAST. | Chốt **không** trượt. |
| T5 | Reset. Ca trên bàn, start EAST 15' (tua ×60), về DOWN. | Tường Đông: `POOL` tròn tại cao độ ≈ 0,9 m + `STREAK` xuống chân tường. |
| T6 | Reset. Đổ 0,2 L lên sàn tại (1,5; 0). Chờ 1' (dryTime 20'). Start EAST. | `STREAK` từ (1,5; 0) kéo về Đông ≈ 1 m. Pool gốc vẫn còn (co lại). |
| T7 | Như T6 nhưng đặt dryTime = 30 s, chờ 1' rồi start EAST. | **Không** có streak (đã khô). |
| T8 | Đổ nước lên **tường Đông** bằng bình khi DOWN. | Chỉ `SPLASH` + `STREAK` xuống, **không** có `POOL` tròn. |
| T9 | Start EAST; trong WARN bấm "Vào phòng". | Bị từ chối. Sau về DOWN + 3 s → vào được. |
| T10 | Mở cửa (toggle), start EAST. | Bị từ chối, log. |
| T11 | Hẹn 22:00 EAST 15'; ra hành lang; tua ×60. | Qua ô kính thấy hình nộm nằm trên tường Đông, không có gì "trên sàn"; chốt thấy trượt. |
| T12 | Reset. Start EAST, đợi gel dừng, thả bút vào đống. | Bút cũ (từ bàn) có cờ `coated`; bút mới thả **không** có cờ. |
| T13 | Lau tại (1,5; 0) rồi đổ nước lên đó, start EAST. | Decal `WIPE` nằm **dưới** pool + streak mới. |
| T14 | Hiệu năng | ≥ 55 fps trên MacBook với 60 hạt gel, timeScale 60. |
| T15 | Rơi tự do | Thả ca từ 3 m khi DOWN: chạm sàn sau 0,75–0,82 s. |

Tiêu chí cảm tính (bắt buộc ghi lại sau khi tự chơi 15 phút): T1→T2 có gây "à" không khi nhìn đống đồ xếp hàng chân tường? T11 có gây "à" không? Nếu cả hai "không" → quay lại concept trước khi làm bước 3.

## 11. Cấu trúc file đề xuất

```
proto/
  index.html
  src/main.js          // Phaser config, scene
  src/params.js        // PARAMS + panel
  src/rules/cycle.js   // state machine, clock, schedule, log
  src/rules/bolt.js    // chốt 1-DoF
  src/rules/liquid.js  // decal
  src/rules/coat.js    // cờ phủ gel
  src/world/room.js    // tạo tường, bàn, giá, khay, cửa
  src/world/objects.js // ca, bút, sổ, gel, hình nộm
  src/view/hallway.js  // camera + mask ô kính
  src/view/decals.js   // Graphics layer
```
Lớp `rules/` **không import Phaser/Matter** — chỉ nhận snapshot trạng thái và trả về lệnh; đây là phần tái dùng cho Lab A và replay sau này.

## 12. Điểm chưa chốt (ghi nhận, không chặn bước 1)

- Góc nhìn: side-view với cửa trên tường sau đã chốt ở concept; nếu khi dựng thấy chốt cửa khó nhìn, phương án B là phóng to chốt thành widget riêng ở góc màn hình.
- `streakLength` tỉ lệ với wetness là tuyến tính — có thể cần phi tuyến cho đẹp; quyết sau T6.
- Hình nộm không khớp nối nên tư thế ngã cứng; chấp nhận ở prototype.
