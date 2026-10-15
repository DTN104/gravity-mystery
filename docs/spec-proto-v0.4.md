# Spec kỹ thuật — Prototype vật lý trần (bước 1–2)

*v0.4 · Tham chiếu: `concept-v0.2.md` mục 2, `script-characters-v0.2.md` Màn 3. Mục tiêu: một trang HTML, một phòng hộp, không art, chứng minh 5 hành vi vật lý và 3 luật decal. Mọi số dưới đây là giá trị khởi điểm — chỉnh được qua panel debug, không hard-code rải rác.*

**Thay đổi v0.3 → v0.4 (sau review vòng 3, 10/10/2026):** đầu hình nộm r 0,12 → **0,10 m** (compound r=0,12 xoay dựng khi chạm thanh giá và đẩy gel vô hạn; agent đối chứng 14/14 pass với 0,10, đã loại 0,08 / dời thanh giá / solver / timestep); dung sai "sát tường Đông" cho hình nộm = mép cách tường ≤ 0,1 m (T2, T11). Không đổi g, khối lượng, ma sát, detent, vị trí vật.

**Thay đổi v0.2 → v0.3 (sau review vòng 2, 10/10/2026):** hình nộm không va chạm với bàn — collision filter mô phỏng chiều sâu (mục 4); luật đổ chất lỏng dùng **vận tốc pháp tuyến** va chạm, trượt dọc bề mặt không đổ (mục 7); `coatRadius` 0,20 (mục 7, 9); T1 bút/sổ < 1,5 s; T2 dải ≤ 1,0 m và ≤ 6/60 gel ngoài dải (mục 10). Không đổi g, khối lượng, ma sát, detent, vị trí vật.

**Thay đổi v0.1 → v0.2 (sau review vòng 1, 10/10/2026):** `duration` = tổng chu kỳ tới RETURN (mục 5); tách `createPanel` khỏi `params.js` (mục 2, 11); surface riêng cho thanh giá/khay (mục 4); khay sâu 0,6 m, `zeroGNoise` 0,01 (mục 4, 9); luật phủ gel theo bán kính (mục 7); `windowZoom` 9 (mục 8); T1 hình nộm nằm, thêm T1b, T2 loại hình nộm, T5 dung sai ±0,2 m (mục 10). Không đổi g, khối lượng, ma sát, detent.

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
- `params.js` **chỉ chứa dữ liệu thuần** (`PARAMS`, `DIRECTIONS`, helper không phụ thuộc DOM). Panel debug nằm ở `view/panel.js`. Lớp `rules/` được phép import `params.js`, không được import bất cứ gì trong `view/` hay `world/`.

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
| **Thanh giá** | static, `surface: SHELF` | gắn tường Đông, (3,8→4,0 ; 0,4) dày 0,04 | điểm va chạm cứng. Với luật chất lỏng, SHELF được coi là "sàn" khi trọng lực DOWN (mặt trên) **hoặc** EAST (nằm sát tường Đông) |
| **Khay gel ×1** | static container, `surface: TRAY` | gắn tường Tây, (0→**0,6** ; 1,8→2,1), mở về phía Đông | chứa hạt gel, xếp ở nửa Tây (x ≤ 0,3). Sâu 0,6 m để nhiễu zero-g không đẩy hạt ra miệng |
| **Tay vịn** | static, không collider | tường Tây (0,05; 1,2), tường Đông (3,95; 1,2) | chỉ để neo hình nộm |
| **Ca** | dynamic | hộp 0,1×0,1, tâm (1,3; 0,95) trên bàn | khối lượng 0,3 kg, bounce 0,1, ma sát 0,4; chứa chất lỏng 0,2 L |
| **Bút** | dynamic | hộp 0,14×0,015, (1,7; 0,92) | 0,02 kg |
| **Sổ** | dynamic | hộp 0,2×0,03, (1,5; 0,92) | 0,3 kg, ma sát 0,7 |
| **Hạt gel ×60** | dynamic, circle r=0,015 | trong khay | 0,005 kg, ma sát 0,3, bounce 0; giới hạn 60 để giữ 60 fps |
| **Hình nộm** | dynamic compound | thân hộp 0,4×1,7 + đầu circle r=**0,10** (v0.4; 0,12 gây xoay dựng khi chạm thanh giá). Hai tư thế qua `PARAMS.mannequin.pose`: **`lying`** (mặc định) — nằm ngang trên sàn, tâm (1,9; 0,2), đầu hướng Đông, như hiện trường; `standing` — đứng tại (2,5; 0,85) | 70 kg (tổng), ma sát 0,8; không khớp nối. **Collision filter (v0.3):** hình nộm **không va chạm với mặt bàn và chân bàn** — coi như nằm *phía sau* bàn theo chiều sâu, đúng hiện trường "nằm cạnh bàn". Vẫn va chạm sàn, trần, tường, thanh giá, khay, mọi vật rời. Áp dụng cho cả hai tư thế. |
| **Bình nước** (dụng cụ) | không physics | — | công cụ đổ chất lỏng lên bề mặt bất kỳ (mục 7) |

Debug: có thể kéo-thả mọi vật dynamic bằng chuột (Matter `MouseConstraint`), có nút "neo/thả neo hình nộm" vào tay vịn gần nhất (constraint cứng).

## 5. Chu kỳ xoay — state machine (lớp luật)

```
IDLE(DOWN) --start(dir, duration)--> WARN(10s) --> ZERO_G(3s) --> ACTIVE(dir) --> WARN_RETURN(10s) --> ZERO_G(3s) --> IDLE(DOWN)
```

**Định nghĩa `duration` (chốt v0.2):** là khoảng từ mốc bắt đầu `T0` đến **RETURN** (về DOWN). Với lịch, `T0` = giờ hẹn; với xoay thủ công, `T0` = lúc bấm + `warnTime`. Suy ra:

| Mốc | Thời điểm |
|---|---|
| WARN | T0 − warnTime |
| ZERO_G | T0 → T0 + zeroGTime |
| ACTIVE | T0 + zeroGTime → T0 + duration − warnTime − zeroGTime |
| WARN_RETURN | T0 + duration − warnTime − zeroGTime → T0 + duration − zeroGTime |
| ZERO_G (về) | T0 + duration − zeroGTime → T0 + duration |
| RETURN, nhật ký `RETURN` | **T0 + duration** |
| Mở khóa hệ thống | T0 + duration + doorUnlockDelay |

Ví dụ lịch 22:00 / 15': WARN 21:59:50, ACTIVE 22:00:03 → 22:14:47, RETURN **22:15:00**, mở khóa 22:15:03 — khớp nhật ký trong concept. ACTIVE thực = duration − 16 s; với `durationMin` 60 s thì ACTIVE 44 s. Nhật ký `SCHEDULED_START`/`MANUAL_START` ghi tại T0.

| Trạng thái | Trọng lực engine | Cửa | Hành vi khác |
|---|---|---|---|
| IDLE | DOWN | mở được | — |
| WARN | DOWN | **khóa ngay khi vào WARN** | còi (log text), đèn nhấp nháy |
| ZERO_G | (0,0) | khóa | vận tốc vật rời giữ nguyên, thêm nhiễu nhỏ ±0,05 m/s để "lơ lửng" |
| ACTIVE | theo `dir` | khóa | chạy tới mốc tính từ `duration` ở bảng trên |
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
| **Đổ ra** | Ca (hoặc bình nước debug) **va** bề mặt với **thành phần vận tốc theo pháp tuyến va chạm** > 0,5 m/s (v0.3 — trượt dọc bề mặt hay tiếp xúc lại khi đang lăn/trượt **không** tính), hoặc ca nghiêng > 60° | `POOL` trên bề mặt **đang là sàn** theo trọng lực hiện tại, tâm tại điểm chạm, bán kính ∝ √volume (0,2 L → r = 0,12 m). Nếu bề mặt chạm không phải sàn hiện tại (ví dụ ném vào tường khi DOWN): `SPLASH` nhỏ + `STREAK` xuống ngay. |
| **Đổi hướng khi còn ướt** | Trạng thái ACTIVE/IDLE đổi và decal có `wetness > 0` | `POOL` trên sàn cũ → thêm `STREAK` từ tâm pool về phía sàn mới, dài = `PARAMS.streakLength × wetness` (khởi điểm 1,0 m × wetness); pool co lại 50 %. `POOL` trên tường (tường từng là sàn) khi về DOWN → `STREAK` thẳng xuống đến chân tường. |
| **Khô** | mỗi giây | `wetness -= 1/PARAMS.dryTime` (khởi điểm dryTime = 20 phút giả lập; debug có thể đặt 30 s). `wetness = 0` → decal cố định vĩnh viễn, không sinh streak nữa. |
| **Lau** | nút debug "lau" tại điểm | xóa decal trong bán kính 0,3 m, để lại decal `WIPE` (hình cung, mờ) — không ảnh hưởng chất lỏng đổ sau. |

Hạt gel **là** vật rắn Matter (không phải decal). Luật "phủ gel" (v0.2, thay luật AABB-đè-lên vì quá ngặt với vật mỏng): vật rời `o` được gắn cờ `coatedAt = t` khi có ≥ `gelCoatMin` (= 2) hạt gel thỏa đồng thời: (i) đã **dừng** (vận tốc < 0,01 m/s liên tục 2 s), (ii) tâm hạt cách tâm `o` ≤ `coatRadius` (= **0,20 m**, v0.3; 0,12 không đủ với 60 hạt), (iii) hạt dừng lần đầu **sau** khi `o` được tạo (`firstSettledAt > o.bornAt`). Vật thả vào đống sau khi gel đã dừng → không bao giờ có cờ. Hiển thị cờ bằng viền màu.

Render decal: một `Graphics` layer riêng vẽ lại khi có thay đổi, không mỗi frame.

## 8. Góc nhìn hành lang

Nút "Ra hành lang": camera dịch sang trái, phòng bị che bởi tường sau, chỉ còn **ô kính** 0,3×0,3 m (phóng ×`windowZoom` = **9** → viewport 270 px, hành trình chốt ≈ 13,5 px) nhìn vào. Qua ô kính thấy được toàn bộ phòng (dùng mask hình chữ nhật, không thu hẹp góc nhìn). Cửa khóa → nút "Vào phòng" bị vô hiệu kèm log. *Prototype chỉ kiểm tra khóa hệ thống; từ bước 3, "Vào phòng" từ hành lang cần thêm điều kiện chốt mở (`bolt.s == 0`).*

## 9. PARAMS (mặc định) & panel debug

```js
export const PARAMS = {
  g: 9.81, warnTime: 10, zeroGTime: 3, doorUnlockDelay: 3, cooldown: 60,
  timeScale: 1,                 // 1 | 10 | 60
  boltMass: 1.2, boltTravel: 0.20, boltDetent: 6,
  dryTime: 1200, streakLength: 1.0, poolRadiusPerLitre: 0.27,
  gelCount: 60, gelCoatMin: 2, coatRadius: 0.20,
  zeroGNoise: 0.01,
  mannequinMass: 70, mannequinAnchored: false, mannequinPose: 'lying',
  doorIsOpen: false,
  windowZoom: 9,
  tray: { left: 0, right: 0.6, bottom: 1.8, top: 2.1 },
};
```
Các tham số khác agent đã thêm ở v0.1 (solver, màu, kích thước UI…) giữ nguyên trong `PARAMS`.
Panel: nhóm *Trọng lực* (4 nút hướng, start/stop, hẹn giờ, duration), *Thời gian* (đồng hồ giả lập, timeScale), *Chốt* (detent, mass, kéo tay), *Chất lỏng* (dryTime, đổ nước tại chuột, lau tại chuột), *Vật* (reset, thêm ca/bút/sổ, neo hình nộm), *Nhật ký* (bảng), *Hiển thị* (bật/tắt decal, cờ phủ gel, vector trọng lực).

## 10. Kịch bản kiểm tra — tiêu chí dừng bước 1–2

| # | Thao tác | Kết quả phải thấy |
|---|---|---|
| T1 | Reset (hình nộm **nằm** tại (1,9; 0,2)). Start EAST 1'. | Ca, bút, sổ rời bàn chạm tường Đông trong **< 1,5 s** (đo từ lúc ACTIVE; sổ ma sát 0,7 trượt chậm trên bàn trước khi rời mép); hình nộm trượt qua bàn (không va chân bàn) lên tường Đông ở thấp (tâm y < 0,6 m), không chắn đồ trên bàn; ≥ 58/60 gel rời khay, văng tường Đông. Chốt trượt đóng ~0,3 s sau ACTIVE. |
| T1b | Như T1 nhưng `mannequinPose = standing`. | Hình nộm ngã lên tường Đông trước (~0,5 s) và **chắn** một phần đồ từ bàn — ghi nhận, không có tiêu chí pass/fail; dùng để quan sát "người nằm trên tường cản vật". |
| T2 | Sau T1, hết chu kỳ, về DOWN. | Ca, bút, sổ, gel rơi xuống, **tụ dọc chân tường Đông**: tâm ca/bút/sổ cách tường Đông ≤ 0,5 m; tâm gel cách tường Đông ≤ **1,0 m**, ≤ **6/60** hạt ngoài dải (gel trên tường cao hơn thanh giá sẽ rơi lên thanh giá rồi lăn ra — chấp nhận). Hình nộm nằm sát chân tường Đông (mép cách tường ≤ 0,1 m). Chốt vẫn đóng. |
| T3 | Reset. Start WEST 1'. | Chốt trượt **mở**; ≥ 58/60 gel còn trong khay; ca/bút/sổ rơi về tường Tây. |
| T4 | Reset. Đặt detent = 12. Start EAST. | Chốt **không** trượt. |
| T5 | Reset. Ca trên bàn, start EAST 15' (tua ×60), về DOWN. | Tường Đông: `POOL` tròn tại cao độ 0,9 ± 0,2 m + `STREAK` xuống chân tường. |
| T6 | Reset. Đổ 0,2 L lên sàn tại (1,5; 0). Chờ 1' (dryTime 20'). Start EAST. | `STREAK` từ (1,5; 0) kéo về Đông ≈ 1 m. Pool gốc vẫn còn (co lại). |
| T7 | Như T6 nhưng đặt dryTime = 30 s, chờ 1' rồi start EAST. | **Không** có streak (đã khô). |
| T8 | Đổ nước lên **tường Đông** bằng bình khi DOWN. | Chỉ `SPLASH` + `STREAK` xuống, **không** có `POOL` tròn. |
| T9 | Start EAST; trong WARN bấm "Vào phòng". | Bị từ chối. Sau về DOWN + 3 s → vào được. |
| T10 | Mở cửa (toggle), start EAST. | Bị từ chối, log. |
| T11 | Hẹn 22:00 EAST 15'; ra hành lang; tua ×60. | Qua ô kính thấy hình nộm nằm trên tường Đông (mép cách tường ≤ 0,1 m); không vật nào (trừ ≤ 2 hạt gel) còn trên sàn cũ; chốt nhìn thấy trượt (≥ 10 px). Nhật ký: `SCHEDULED_START 22:00:00`, `RETURN 22:15:00`. |
| T12 | Reset. Start EAST, đợi gel dừng, thả bút vào đống. | Bút cũ (từ bàn) có cờ `coated` theo luật bán kính mục 7; bút mới thả **không** có cờ. |
| T13 | Lau tại (1,5; 0) rồi đổ nước lên đó, start EAST. | Decal `WIPE` nằm **dưới** pool + streak mới. |
| T14 | Hiệu năng | ≥ 55 fps trên MacBook với 60 hạt gel, timeScale 60. |
| T15 | Rơi tự do | Thả ca từ 3 m khi DOWN: chạm sàn sau 0,75–0,82 s. |

Tiêu chí cảm tính (bắt buộc ghi lại sau khi tự chơi 15 phút): T1→T2 có gây "à" không khi nhìn đống đồ xếp hàng chân tường? T11 có gây "à" không? Nếu cả hai "không" → quay lại concept trước khi làm bước 3.

## 11. Cấu trúc file đề xuất

```
proto/
  index.html
  src/main.js          // Phaser config, scene
  src/params.js        // PARAMS, DIRECTIONS — dữ liệu thuần, không DOM
  src/view/panel.js    // lil-gui panel debug
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
