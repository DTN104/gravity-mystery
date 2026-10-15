# Concept: "Án mạng ở trạm nghiên cứu không có hướng xuống"

*Bản concept v0.1 — chưa phải cốt truyện chốt. Tên nhân vật, tên trạm là placeholder.*

---

## 1. Pitch ngắn

**Vai người chơi:** Điều tra viên an toàn của công ty vận hành, đến Trạm Thiên Bình bằng chuyến tàu sáng, 12 giờ sau khi trưởng trạm được phát hiện chết trong phòng thí nghiệm khóa trong. Nhiệm vụ trên giấy: ký xác nhận "tai nạn vận hành" để trạm tiếp tục hoạt động. Người chơi là người ngoài duy nhất — chưa từng sống trong trạm, chưa hiểu hệ thống trọng lực. Đây là lý do tự nhiên để game dạy cơ chế từ đầu.

**Mục tiêu:** Kết luận đúng ba câu hỏi — *tai nạn hay không? chuyện gì đã xảy ra theo thứ tự nào? ai nói dối?* — và chứng minh bằng bằng chứng người chơi tự kiểm chứng được.

**Không khí:** Trạm nhỏ, bốn người, cô lập (dưới biển, trong núi hay trên quỹ đạo đều được — không ảnh hưởng cơ chế). Yên tĩnh, tiếng máy ù đều, đèn trắng lạnh. Ba người còn lại đều muốn người chơi ký "tai nạn" và rời đi. Không có cảnh sát, không có pháp y — ý kiến y khoa duy nhất đến từ bác sĩ trạm, và ông ta là một nghi phạm.

**Điểm hấp dẫn riêng:**
- Công cụ phá án không phải kính lúp mà là *thí nghiệm*. Người chơi không "tìm vật phẩm", mà đặt câu hỏi "nếu trọng lực lúc đó hướng sang phải thì vết này phải trông thế nào?" rồi tự thử trong buồng thử nghiệm.
- Hiện trường được dàn dựng để người chơi **hiểu sai một lần** theo bản năng "sàn ở dưới" (ca cà phê "ném" vào tường, đồ đạc "vương vãi sau ẩu đả"), rồi vật lý lật ngược cách đọc đó — và lật thêm lần nữa khi hung thủ cũng mắc đúng sai lầm ấy trong lời khai.
- Phòng khóa kín được giải thích bằng chính cơ chế người chơi đã sờ tận tay, không có thiết bị bí mật.

---

## 2. Quy luật trọng lực

Nguyên tắc thiết kế: **một cơ chế, bốn hướng, không ngoại lệ.** Mọi thứ ở mục 4–5 đều suy ra từ các quy tắc dưới đây; không có quy tắc nào xuất hiện lần đầu ở đoạn giải thích cuối.

### 2.1 Phạm vi
- Mỗi **phòng** có trường trọng lực riêng, một trong bốn hướng theo mặt phẳng 2D side-view: **Xuống (sàn), Lên (trần), Tây (tường trái), Đông (tường phải)**. Mặc định: Xuống.
- **Hành lang** luôn là Xuống, không điều khiển được.
- Trường trọng lực của phòng này không ảnh hưởng phòng khác hay hành lang.

### 2.2 Điều khiển
- **Bảng cục bộ** (local panel): gắn trong mỗi phòng. Ai cũng dùng được, **không cần đăng nhập**. Cho phép: xoay ngay, hoặc sửa *lịch* của phòng đó (giờ bắt đầu, hướng, thời lượng).
- **Bảng tổng** (master panel): chỉ ở phòng điều khiển, **cần đăng nhập**. Điều khiển được mọi phòng, xem được toàn bộ nhật ký.
- **Nhật ký** ghi: thời điểm, phòng, loại sự kiện (sửa lịch / xoay thủ công / xoay theo lịch / trở về), nguồn lệnh (*local* hoặc *master + user ID*). **Không ghi hướng**; hướng chỉ nằm trong lịch hiện tại, bị ghi đè khi sửa. Đây là chốt chặn để nhật ký không tự giải vụ án.

### 2.3 Trình tự một chu kỳ xoay
1. **T−10 s:** còi + đèn báo. **Cửa phòng khóa ngay từ lúc này** (không mở được từ cả hai phía) và giữ khóa suốt chu kỳ, mở lại 3 s sau khi về Xuống.
2. **T0:** 3 giây **không trọng lực** — mọi vật rời lơ lửng nhẹ.
3. **T0+3 s:** trọng lực 1 g theo hướng mới. Mọi vật rời và người không bám **rơi thật** về "sàn" mới, quãng rơi tối đa bằng chiều rộng phòng (~4 m).
4. Hết thời lượng: lặp lại bước 1–3 để về Xuống.
- Lịch/lệnh xoay **bị từ chối nếu cửa đang mở**.
- Thời lượng 1–30 phút; nghỉ tối thiểu 1 phút giữa hai chu kỳ.

### 2.4 Ảnh hưởng lên người và vật
| Đối tượng | Hành vi khi đổi hướng | Dấu vết còn lại sau khi về Xuống |
|---|---|---|
| Đồ cố định (bàn bắt vít, khay gắn tường, tay vịn, bảng điều khiển) | Không đổi | Không |
| Đồ rời (ca, bút, sổ, mảnh vỡ, viên gel) | Rơi về sàn mới; khi về Xuống rơi tiếp | **Tụ thành cụm dọc chân bức tường từng là sàn**, không rải đều |
| Chất lỏng trong vật chứa | Đổ ra, **loang thành vũng trên bề mặt đang là sàn** | **Vệt loang tròn trên tường** + các vệt chảy xuống khi về Xuống |
| Chất lỏng đã nằm trên sàn (còn ướt) | **Chảy ngang sàn** về phía tường mới | **Vệt kéo ngang trên sàn**, bắt đầu từ chỗ đổ ban đầu |
| Chất lỏng đã khô | Không đổi | Vết ở nguyên chỗ cũ |
| Chốt cửa trượt ngang (loại dùng trong trạm) | Trượt theo hướng trọng lực nếu hướng đó trùng trục chốt (lẫy giữ yếu hơn trọng lượng chốt) | Chốt nằm ở vị trí cuối cùng; không tự trượt khi trọng lực Xuống |
| Người | Rơi như vật rời nếu không bám tay vịn / móc dây; rơi 3–4 m lên tường thép là chấn thương nặng | Vị trí cuối cùng = chân bức tường từng là sàn |

Quy tắc đọc dấu vết người chơi sẽ tự rút ra: **"Vết loang tròn trên tường = tường đó từng là sàn. Vệt kéo ngang trên sàn = chất lỏng đã ở trên sàn *trước* khi trọng lực đổi."**

### 2.5 Giới hạn và văn hóa an toàn (nêu rõ trong tutorial)
- **Không có cảm biến người.** Trạm không chặn xoay khi có người trong phòng; an toàn là trách nhiệm cá nhân: nghe còi → bám tay vịn hoặc móc dây an toàn treo cạnh cửa. Đây là quyết định thiết kế có chủ ý để không cần "cảm biến bị tắt" làm ngoại lệ.
- Người sống trong trạm quen đến mức xoay phòng là chuyện thường ngày; họ **không** quen việc đọc hiện trường theo trọng lực — vì chưa bao giờ cần.
- Cửa ra hành lang có ô kính nhỏ; nhìn từ hành lang thấy gần hết phòng.

---
## 3. Ba căn phòng và ba nghi phạm

### 3.1 Bố cục
Side-view 2D, mỗi phòng là một hộp ~4 m × 3 m có tường sau (back wall) nhìn thẳng. **Cửa nằm trên tường sau**, phía Tây, có ô kính; chốt cửa là thanh trượt ngang trên mặt cửa — vì vậy thấy rõ chốt trượt Đông/Tây khi trọng lực đổi. Ba phòng nối với nhau bằng **hành lang trung tâm** (hub, trọng lực cố định, nơi gặp nhân vật và xem bảng giả thuyết).

| Phòng | Chức năng trong trạm | Vai trò trong game |
|---|---|---|
| **Lab A** (phòng của nạn nhân) | Thí nghiệm "sinh trưởng dưới trọng lực ngang": các **khay gel** gắn trên **tường Tây**; lịch cố định mỗi đêm **22:00, hướng Tây, 15 phút** (đêm 112/180 của chuỗi). Bàn thép bắt vít gần giữa-Tây, kệ thấp có **thanh giá thép** trên tường Đông. | Hiện trường. Khám nghiệm, đọc bảng cục bộ, chạy **tái hiện** giả thuyết. Niêm phong sau khi chụp ảnh — người chơi có ảnh hiện trường buổi sáng. |
| **Buồng thử nghiệm** (test chamber) | Buồng hiệu chuẩn, cùng kiểu cửa/chốt với Lab A. Có hình nộm nặng như người, ca nước, khay viên gel rời, bút, dây an toàn, bảng cục bộ. | **Sandbox an toàn.** Người chơi tự xoay bốn hướng, đặt vật, hẹn lịch rồi ra hành lang nhìn qua ô kính. Mọi quy luật ở mục 2 đều quan sát được ở đây. |
| **Phòng điều khiển** | Bảng tổng, nhật ký toàn trạm, trạm trực của kỹ sư vận hành. | Đọc nhật ký (thời điểm + nguồn, không có hướng), kiểm tra phiên làm việc, chạy thử chẩn đoán. |

### 3.2 Nạn nhân — **Hạo**, 54, trưởng trạm, nghiên cứu viên chính
Kỹ tính, bảo thủ, làm việc một mình buổi tối, luôn **cài chốt cửa** Lab A khi chạy chu kỳ đêm. Chuẩn bị nộp **báo cáo quý** sáng hôm sau. Hạo biết chốt cửa phòng mình "tự bật mở mỗi đêm" khi xoay Tây và đã gửi ticket bảo trì — đây là chi tiết chỉ một số người biết.

### 3.3 Ba nghi phạm

| | **Lâm**, 38 — kỹ sư vận hành | **Thư**, 27 — nghiên cứu viên trẻ | **Khoa**, 52 — bác sĩ trạm kiêm hậu cần |
|---|---|---|---|
| **Quan hệ với nạn nhân** | Cấp dưới, hay bị Hạo chê về an toàn vận hành | Trợ lý; Hạo đứng tên kết quả của cô trong hai bài báo | Bạn 25 năm, đồng sáng lập chương trình trọng lực |
| **Động cơ (có thật)** | Sợ bị quy trách nhiệm: chốt Lab A hỏng chưa sửa, không có cảm biến người — một "tai nạn" có thể kết thúc sự nghiệp anh ta | Uất ức vì bị cướp công; định bỏ trạm | Hạo phát hiện Khoa **làm sai lệch hồ sơ khám định kỳ** của phi hành đoàn để trạm không bị đóng; báo cáo quý sẽ đề nghị đình chỉ Khoa |
| **Điều che giấu** | **Ticket bảo trì chốt Lab A** do Hạo gửi — Lâm giấu vì nó chứng minh anh ta biết chốt lỏng mà không sửa. Vì thế Lâm đẩy mạnh thuyết "tai nạn do Hạo tự sửa lịch" | **Vào Lab A lúc 21:05–21:12** sao chép dữ liệu từ terminal của Hạo (log terminal ghi phiên của Hạo). Cô nói dối "không vào Lab A tối qua" | **Đến Lab A lúc 21:20**; chuyện xảy ra sau đó; đèn soi y tế rơi khỏi túi áo; hồ sơ y tế giả |
| **Lời khai then chốt** | "Tôi phải cắt chốt mới mở được cửa. Hạo tự đổi hướng lúc 21:47 — việc của ông ấy, tôi không hỏi." | "Khay gel *luôn* xoay Tây. Xoay Đông thì đổ hết, thầy không bao giờ làm thế." (thông tin đúng, quan trọng) | "Khoảng 22:10 tôi đi lấy nước, ngang Lab A nhìn qua ô kính thấy Hạo **ngồi tựa vào chân bàn, tay ôm đầu**. Tôi gõ cửa, ông ấy xua tay. Tôi tưởng chỉ ngã nhẹ lúc xoay." |
| **Chứng cứ ngoại phạm** | Phiên làm việc trên bảng tổng 21:30–22:10: chẩn đoán yêu cầu **bấm xác nhận mỗi 3 phút**, chỉ làm được tại phòng điều khiển | Bảng cục bộ buồng thử nghiệm ghi **xoay thủ công 21:46:30, 10 phút** từ *local* → ai bấm thì **bị khóa trong buồng** đến 21:56:30. Mẫu của Thư đổ trong buồng; cô báo sự cố cho Lâm, ticket 21:59 | Không có. "Tôi ở phòng y tế một mình." |

Thư còn khai: "Khoảng 21:55 lúc em đi tới phòng điều khiển, thấy bóng ai ở cuối hành lang gần Lab A." Chính câu này khiến Khoa chủ động "nhận" là mình — nhưng dời giờ sang 22:10 và thêm chi tiết nhìn thấy Hạo còn sống.

---

## 4. Sự thật vụ án (dành cho người thiết kế)

### 4.1 Hung thủ và động cơ
**Khoa.** Không chủ mưu giết người từ đầu; đến để thuyết phục Hạo bỏ mục 4 trong báo cáo quý. Cãi vã; Khoa xô mạnh, Hạo ngã ngửa, đầu đập vào góc bàn thép, bất tỉnh, chảy máu phía sau đầu. Khoa kiểm tra mạch: rất yếu. Ông ta chọn dàn dựng thay vì gọi cứu hộ.

### 4.2 Thủ pháp — chỉ dùng đúng cơ chế mục 2
Khoa biết ba điều: (a) lịch 22:00 của Lab A; (b) chốt cửa Lab A lỏng, mỗi đêm trượt **mở** khi xoay Tây — nghĩa là xoay **Đông** sẽ trượt **đóng**; (c) tường Đông có thanh giá thép đủ cứng để một cú rơi 3 m lên đó trông như nguyên nhân tử vong.

Kế hoạch: để Hạo nằm nguyên chỗ ngã; **đổi hướng lịch 22:00 từ Tây sang Đông** trên bảng cục bộ; lau vết máu ở góc bàn và trên sàn; rời đi, **đóng cửa nhưng không cài chốt**. Lúc 22:00, chính hệ thống sẽ: khóa cửa, ném cơ thể Hạo và mọi đồ rời lên tường Đông, trượt chốt sang vị trí đóng; 22:15 trả tất cả xuống sàn dọc chân tường Đông. Kết quả trông như: *Hạo tự đổi lịch, lúc xoay không kịp bám, rơi lên tường Đông đập vào thanh giá, chết; cửa cài chốt từ trong vì ông ấy luôn làm thế.*

Ba sai lầm của Khoa (đều là hệ quả vật lý, không phải may rủi):
1. Vết thương vẫn rỉ máu sau khi ông ta lau → vũng mới trên sàn lúc 21:50–22:00, còn ướt khi xoay Đông → **vệt kéo ngang sàn**.
2. Xoay Đông đổ sạch khay gel trên tường Tây → một nhà nghiên cứu ở đêm 112/180 không bao giờ tự chọn Đông.
3. Đèn soi y tế rơi khỏi túi áo khi cúi kiểm tra mạch, lăn dưới gầm bàn; 22:00 nó rơi sang Đông cùng mọi thứ và **bị gel phủ** như các vật khác.

### 4.3 Dòng thời gian thật
| Giờ | Sự kiện | Trọng lực Lab A |
|---|---|---|
| 21:05–21:12 | Thư vào Lab A sao dữ liệu, Hạo đang ở phòng ăn; cô rời đi | Xuống |
| 21:20 | Khoa vào Lab A; Hạo đang ở bàn, ca cà phê trên bàn | Xuống |
| 21:30 | Cãi vã → xô → Hạo ngã đập đầu góc bàn, nằm cạnh bàn; đèn soi rơi dưới gầm bàn | Xuống |
| 21:32–21:45 | Khoa kiểm tra mạch, quyết định dàn dựng; lau góc bàn và sàn bằng gạc y tế mang theo | Xuống |
| 21:46:30 | *(Buồng thử nghiệm)* Thư bấm xoay thủ công, bị khóa trong đến 21:56:30 | — |
| 21:47:10 | Khoa sửa lịch Lab A: 22:00, **Đông**, 15 phút (nhật ký: "sửa lịch — local") | Xuống |
| 21:50 | Khoa rời Lab A, đóng cửa, không cài chốt; về phòng y tế qua hành lang | Xuống |
| ~21:55 | Thư rời buồng thử nghiệm (sau 21:56:30) đi tới phòng điều khiển, thấy bóng người xa (thực ra là Khoa đã đi trước đó vài phút — thời gian ước lượng của cô lệch) | Xuống |
| 21:50–21:59 | Vết thương rỉ, vũng máu mới hình thành trên sàn cạnh bàn, ngay trên vùng vừa lau | Xuống |
| 21:59:50 | Còi; cửa khóa | Xuống |
| 22:00:03 | **Đông.** Thi thể rơi ~3 m lên tường Đông, đầu đập thanh giá; ca rơi từ bàn vỡ trên tường Đông, cà phê loang thành vũng trên tường; bút, sổ, đèn soi rơi lên tường; gel từ khay tường Tây rơi 4 m văng khắp tường Đông phủ lên các vật; vũng máu ướt trên sàn chảy ngang về Đông; **chốt trượt sang vị trí đóng** | Đông |
| 22:15:03 | **Xuống.** Mọi thứ trên tường Đông rơi xuống chân tường; vũng cà phê trên tường chảy thành vệt xuống; chốt giữ nguyên (đóng) | Xuống |
| 07:05 | Thư gõ cửa Lab A, không ai trả lời, cửa chốt | Xuống |
| 07:15 | Lâm cắt chốt, Khoa có mặt, xác nhận tử vong; cả ba chụp ảnh, không ai chạm thi thể | Xuống |
| 09:30 | Người chơi đến | Xuống |

### 4.4 Vì sao phòng "khóa kín" — và vì sao không phải phép màu
- Chốt đóng do trọng lực Đông, không do tay người. Người chơi tái hiện được 100% trong buồng thử nghiệm với cùng loại chốt.
- Cửa bị hệ thống khóa từ 21:59:50 đến 22:15:06 → **không ai vào/ra trong chu kỳ**. Sau 22:15 chốt đã đóng → không ai vào đến sáng. Vậy mọi hành động của con người trong Lab A đều xảy ra **trước 21:59:50**.
- Ticket bảo trì của Hạo (Lâm giấu) xác nhận chốt Lab A lỏng; nhưng người chơi không cần ticket để chứng minh — sandbox là đủ. Ticket chỉ giải thích vì sao hung thủ *biết*.

---
## 5. Bằng chứng

Mỗi bằng chứng ghi: **suy ra gì / dễ hiểu sai thế nào / kiểm chứng bằng cách nào.** Ký hiệu ★ = lõi, bắt buộc có trong bản chơi thử; ☆ = bổ trợ, có thể cắt.

### Nhóm A — Hiện trường Lab A (vật lý)

**E1 ★ Vị trí thi thể: chân tường Đông, đầu gần thanh giá thép.**
- Suy ra: cơ thể đã "rơi" lên tường Đông rồi rơi xuống chân tường — tường Đông từng là sàn.
- Hiểu sai: "bị đẩy/đập vào tường trong lúc ẩu đả" (đây là cách đọc game cố ý mời gọi ở phút đầu).
- Kiểm chứng: thả hình nộm trong buồng thử nghiệm, xoay Đông rồi về Xuống → hình nộm nằm đúng kiểu đó.

**E2 ★ Vết cà phê trên tường Đông: vết loang tròn ở độ cao ~0,9 m (ngang mặt bàn) + các vệt chảy xuống; mảnh ca ở chân tường.**
- Suy ra: ca rơi từ mặt bàn *lên* tường Đông khi tường là sàn; cà phê đọng thành vũng trên tường; khi về Xuống vũng chảy xuống.
- Hiểu sai: "ca bị ném vào tường". Đây là **khoảnh khắc "à" đầu tiên**: ném thì chỉ có vệt bắn + chảy xuống, **không có vũng tròn** trên mặt đứng.
- Kiểm chứng: đặt ca nước lên bàn trong buồng thử nghiệm, xoay Đông 1 phút rồi về → cùng hình dạng vết. Đổ nước lên tường bằng tay (ném) khi đang Xuống → chỉ có vệt chảy.

**E3 ★ Cụm đồ rời dọc chân tường Đông: bút, sổ, mảnh ca, viên gel, và một vật nhỏ phủ gel (E10).**
- Suy ra: mọi vật rời trong phòng tại 22:00 đều đi Đông rồi xuống; đồ không "vương vãi", mà **xếp hàng theo một bức tường**.
- Hiểu sai: dấu vết vật lộn.
- Kiểm chứng: sandbox.

**E4 ★ Khay gel trên tường Tây trống; gel văng khắp tường Đông và phủ lên cụm E3.**
- Suy ra: chu kỳ 22:00 chạy hướng **Đông**. Khay thiết kế cho hướng Tây (gel bị ép *vào* khay); hướng Đông đổ sạch. Một người ở đêm 112/180 của chuỗi thí nghiệm không tự chọn Đông → **không phải Hạo sửa lịch**.
- Hiểu sai: "Hạo thử hướng mới, lúng túng nên ngã" (thuyết của Lâm).
- Kiểm chứng: lời khai Thư về giao thức + sổ tay Hạo (lịch "Tây, 22:00, 15 phút" ghi tay 111 đêm liên tiếp, trang cuối ghi đêm 112 cũng Tây) + bảng cục bộ hiện đang ghi Đông.

**E5 ★ Chốt cửa đã bị cắt, nằm dưới sàn cạnh cửa; chốt loại trượt ngang, đóng khi trượt sang Đông.**
- Suy ra: dưới trọng lực Đông chốt tự trượt đóng. Phòng "khóa kín" là hệ quả của chu kỳ, không cần người ở trong.
- Hiểu sai: "Hạo luôn cài chốt khi làm việc" — lời khai đúng về thói quen nhưng không chứng minh được ông ấy cài đêm đó.
- Kiểm chứng: trong buồng thử nghiệm, để chốt mở, hẹn lịch xoay Đông, ra ngoài nhìn qua ô kính → chốt trượt đóng. Xoay Tây → trượt mở.

**E6 ★ Trên sàn cạnh bàn: một vùng lau hình cung (còn ánh hồng nhạt) và đè lên nó là một vệt máu mỏng kéo ngang về phía Đông, bắt đầu từ chỗ cách tường Đông ~2,5 m.**
- Suy ra: (i) có máu trên sàn cạnh bàn **trước 22:00** (chỉ chất lỏng đã ở trên sàn mới có thể kéo ngang khi đổi hướng); (ii) **ai đó đã lau** trước khi vũng mới hình thành — Hạo bất tỉnh không tự lau; (iii) thứ tự lớp: lau → rỉ → kéo ngang → người lau có mặt khi Hạo đã chảy máu.
- Hiểu sai: vết cũ từ hôm khác; hoặc bỏ qua vì quá nhỏ.
- Kiểm chứng: đổ một ít nước màu lên sàn buồng thử nghiệm, chờ, xoay Đông → vệt kéo ngang bắt đầu đúng từ chỗ đổ. Đây là bằng chứng **thời điểm**, mạnh nhất của vụ án.

**E7 ☆ Góc bàn thép có vết lau mờ.**
- Suy ra: cú va đầu tiên ở đây, dưới trọng lực Xuống, bị xóa.
- Hiểu sai: bàn sạch bình thường.
- Kiểm chứng: không tự kiểm chứng được; chỉ hợp lý khi ghép với E6.

### Nhóm B — Nhật ký và hệ thống

**E8 ★ Bảng cục bộ Lab A: "21:47:10 sửa lịch — local"; "22:00:00 xoay theo lịch"; "22:15:00 trở về". Bảng tổng: không có lệnh nào tới Lab A từ master cả đêm.**
- Suy ra: **có người bên trong Lab A lúc 21:47** sửa lịch. Không ghi hướng, không ghi ai.
- Hiểu sai: "Hạo sửa" — đây là cách đọc mặc định của cả trạm. Nhật ký *một mình* không lật được cách đọc này; cần E4 (hướng vô lý) + E6 (Hạo đã nằm trên sàn trước đó).
- Kiểm chứng: tự sửa lịch ở buồng thử nghiệm và xem dòng nhật ký sinh ra giống hệt.

**E9 ★ Bảng cục bộ buồng thử nghiệm: "21:46:30 xoay thủ công — local, 10 phút". Trong buồng: khay mẫu của Thư đổ theo đúng hướng đó. Ticket "sự cố đổ mẫu" do Lâm mở lúc 21:59.**
- Suy ra: ai bấm nút lúc 21:46:30 thì ở trong buồng khóa đến 21:56:30 → người đó **không thể** ở Lab A lúc 21:47:10. Thư là người đó.
- Hiểu sai: "Thư có thể bấm rồi chạy ra".
- Kiểm chứng: thử bấm xoay thủ công trong buồng → cửa khóa ngay khi còi kêu, không kịp ra.

**E10 ★ Phiên của Lâm trên bảng tổng: xác nhận chẩn đoán 21:30, 21:33, … 22:09 (mỗi 3 phút).**
- Suy ra: Lâm ở phòng điều khiển liên tục; không thể ở Lab A 20 phút để dàn dựng.
- Hiểu sai: "máy tự xác nhận".
- Kiểm chứng: chạy lại chẩn đoán đó ở phòng điều khiển → đến phút thứ 3 nó dừng chờ bấm tay.

**E11 ☆ Log terminal Hạo: sao chép dữ liệu 21:05–21:12 trong phiên của Hạo.**
- Suy ra: có người dùng máy Hạo lúc ông ấy không ở đó. Thư thừa nhận khi bị đối chất.
- Hiểu sai: Thư là hung thủ (red herring chính).
- Kiểm chứng: E9 loại cô khỏi khung 21:47; mốc 21:05 quá sớm so với E6 (máu còn ướt lúc 22:00 không thể từ 21:05).

### Nhóm C — Người

**E12 ★ Đèn soi y tế trong cụm E3, phủ gel như mọi vật xung quanh.**
- Suy ra: đèn ở trong Lab A lúc 22:00 → chủ của nó ở trong Lab A trước 21:59:50. Chỉ bác sĩ trạm mang đèn soi.
- Hiểu sai: "Tôi làm rơi sáng nay khi khám" (Khoa sẽ nói thế).
- Kiểm chứng: vật rơi vào đống *sau* khi gel đã văng thì nằm **trên** và **sạch**; vật này nằm **dưới/phủ** gel. Sandbox: đổ khay gel rồi thả bút vào → bút sạch trên mặt.

**E13 ★ Lời khai Khoa: "22:10, qua ô kính, thấy Hạo ngồi tựa chân bàn trên sàn, tay ôm đầu, xua tay."**
- Suy ra: lúc 22:10 Lab A đang ở trọng lực Đông; **không ai ngồi tựa chân bàn trên sàn được** — người ở đó nằm trên tường Đông, bàn thì "chìa ra khỏi tường". Người nói câu này **không hề nhìn vào phòng lúc xoay**; ông ta mô tả cảnh cuối cùng mình thấy — Hạo trên sàn — rồi dời giờ.
- Hiểu sai: người chơi (và cả trạm) nghe ở phút thứ 8 sẽ tin ngay, vì chính họ cũng đang mặc định sàn ở dưới. Đây là **khoảnh khắc "à" thứ hai**, mạnh hơn, khi quay lại đọc lời khai sau sandbox.
- Kiểm chứng: hẹn lịch xoay Đông ở buồng thử nghiệm, ra hành lang nhìn qua ô kính trong lúc xoay → hình nộm nằm trên tường phải, không có gì "trên sàn".

**E14 ☆ Bản nháp báo cáo quý trên terminal Hạo — mục 4: "Sai lệch hồ sơ khám định kỳ — đề nghị đình chỉ BS Khoa."**
- Suy ra: động cơ.
- Hiểu sai: không có; nhưng động cơ không phải bằng chứng.
- Kiểm chứng: không cần; dùng để mở khóa nhánh đối chất cuối.

### Cách các bằng chứng khóa lại các lời giải khác

| Lời giải thay thế | Bị loại bởi |
|---|---|
| Tai nạn thuần túy: Hạo tự đổi lịch, không kịp bám | E4 (không ai tự đổ khay của mình) + E6 (đã chảy máu trên sàn trước 22:00) |
| Tai nạn hai lớp: Hạo tự trượt ngã đập bàn, nằm choáng, rồi chu kỳ 22:00 kết liễu — không có người thứ hai | E6 lớp lau (ai đó lau khi ông ấy đang chảy máu) + E12 (đèn soi) + E8 (sửa lịch 21:47 khi Hạo đã nằm) |
| Thư làm (cô có vào Lab A) | E9 (khóa trong buồng thử nghiệm 21:46–21:56) + mốc 21:05 quá sớm so với E6 |
| Lâm làm (anh ta giấu ticket, biết chốt) | E10 (bấm xác nhận mỗi 3 phút) ; bảng tổng không có lệnh tới Lab A |
| Ai đó vào Lab A trong lúc xoay | Cửa khóa toàn chu kỳ (mục 2.3, tự kiểm chứng) |
| Dàn dựng buổi sáng khi mở cửa | E12 phủ gel; ảnh hiện trường chụp trước khi ai chạm vào |
| Khoa nói dối E13 vì lý do khác (chỉ giấu việc đi lại) | E12 đặt ông ta trong Lab A trước 22:00 + E8 có người sửa lịch lúc đó + không ngoại phạm + E14 |

---
## 6. Hành trình giải án mẫu (~25 phút)

Cấu trúc cốt lõi: **hiểu sai → thí nghiệm → đọc lại → tái hiện → đối chất.** Game không chấm điểm theo thứ tự; dưới đây là đường đi điển hình.

**Phút 0–3 — Tới trạm.** Lâm đón ở hành lang, đưa ảnh hiện trường và bản tóm tắt "tai nạn": Hạo tự sửa lịch 21:47, không kịp bám lúc 22:00, cửa cài chốt từ trong như mọi đêm. Người chơi nhận **bảng giả thuyết** (hypothesis board) với ba ô trống: *Chuyện gì? Khi nào? Ai?*

**Phút 3–8 — Lab A lần 1 (chưa hiểu quy luật).** Người chơi thấy E1–E6 nhưng chỉ đọc được theo bản năng: thi thể sát tường, cà phê "ném" lên tường, đồ "vương vãi", gel "văng tung tóe", chốt bị cắt, một vệt nhỏ cạnh bàn. Bảng giả thuyết mời chọn: *Tai nạn* / *Ẩu đả* / *Chưa rõ*. Phần lớn người chơi chọn *Ẩu đả* — game ghi nhận, không phán xét. Bảng cục bộ: lịch hiện tại 22:00 Đông 15 phút; nhật ký E8.

**Phút 8–12 — Hỏi lần 1.** Lâm (thuyết tai nạn, né câu hỏi về chốt), Thư (khai sai về việc vào Lab A; nhưng nói rõ "khay *luôn* Tây"; kể bóng người 21:55), Khoa (E13 — người chơi nghe và có xu hướng ghi vào bảng: *Hạo còn sống lúc 22:10*). Người chơi có thể hỏi cả ba "chốt cửa có bao giờ tự trượt không?" — Lâm nói dối "không", Thư thật thà "em không biết", Khoa "tôi không rành kỹ thuật".

**Phút 12–17 — Buồng thử nghiệm.** Thư hướng dẫn cách dùng bảng cục bộ rồi để người chơi tự do. Chuỗi thí nghiệm tự nhiên:
1. Xoay Đông với hình nộm + ca nước trên bàn → hình nộm lên tường phải, ca vỡ, vũng tròn trên tường; về Xuống → vệt chảy xuống, cụm đồ chân tường. *(Lật E1–E3: không phải ẩu đả.)*
2. Đổ nước lên **sàn** trước, rồi xoay Đông → vệt kéo ngang. *(Chìa khóa để đọc E6.)*
3. Hẹn lịch 1 phút, ra hành lang, nhìn qua ô kính: **chốt trượt đóng** khi Đông, trượt mở khi Tây; cửa không mở được suốt chu kỳ; hình nộm nằm trên tường chứ không "trên sàn". *(Lật E5 và E13.)*
4. Đổ khay gel rồi thả bút vào → bút sạch trên mặt. *(Chìa khóa cho E12.)*
Game không bắt buộc làm đủ bốn; mỗi thí nghiệm mở khóa một "quy tắc" ghi vào sổ tay người chơi bằng lời của họ.

**Phút 17–21 — Lab A lần 2 (đọc lại).** Mỗi vật ở hiện trường giờ có thêm lựa chọn diễn giải. Người chơi tự đi đến: cà phê *rơi* chứ không bị ném; chốt *tự* đóng; khay Tây đổ vì xoay Đông → Hạo không chọn Đông → người khác sửa lịch 21:47; vệt kéo ngang trên sàn → đã có máu trên sàn trước 22:00; lớp lau dưới vệt → có người lau khi ông ấy chảy máu; đèn soi dưới gel. Khoảnh khắc **"mình hiểu sai vì cứ mặc định sàn ở dưới"** xảy ra ở đây, và lần hai khi mở lại lời khai Khoa trong bảng giả thuyết: *"ngồi tựa chân bàn trên sàn lúc 22:10"* — không thể.

**Phút 21–24 — Tái hiện.** Chế độ *replay* trong Lab A: người chơi chọn trạng thái ban đầu lúc 21:59 từ vài công tắc (Hạo: *đứng cạnh bàn / nằm trên sàn cạnh bàn*; sàn: *sạch / có vũng ướt*; chốt: *mở / đóng*; hướng: *Tây / Đông*), bấm chạy, game mô phỏng chu kỳ và **so khớp** kết quả với ảnh hiện trường. Chỉ tổ hợp *nằm trên sàn + vũng ướt + chốt mở + Đông* khớp mọi dấu vết. Đây là "nhìn thấy kết quả giả thuyết" theo đúng yêu cầu, và là bước xác nhận chứ không phải bước đoán.

**Phút 24–27 — Hỏi lần 2 và kết luận.** Đối chất Thư với E11 → cô thừa nhận, giữ nguyên E9. Đối chất Lâm với ticket → anh ta thừa nhận giấu, giữ nguyên E10. Đối chất Khoa theo chuỗi: E13 (không thể) → E12 (đèn dưới gel) → E8 (ai sửa lịch) → E14 (động cơ). Màn kết luận yêu cầu chọn: *hung thủ*, *cách phòng bị khóa*, *bằng chứng thời điểm* — sai bất kỳ ô nào, game chỉ ra lời giải thay thế chưa bị loại, không tiết lộ đáp án.

**Kết.** Khoa nhìn ảnh hiện trường một lúc rồi nói: "Tôi cứ nghĩ sàn là sàn." Người chơi ký báo cáo — ô "tai nạn" để trống.

---

## 7. Phạm vi bản chơi thử nhỏ nhất

Mục tiêu: chứng minh **vòng lặp "hiểu sai → thí nghiệm → đọc lại" đủ thú vị** với người chưa biết gì về game. Mọi thứ không phục vụ vòng lặp đó đều cắt.

**Có:**
- 3 phòng + 1 hành lang hub, side-view, một tông màu, không cutscene.
- Mô phỏng vật lý 4 hướng cho vật rời (rigid body đơn giản — Phaser 3 + Matter.js hoặc Canvas thuần; đổi hướng = đổi vector gravity), hình nộm, chốt cửa trượt, cửa khóa theo chu kỳ.
- **Chất lỏng không mô phỏng**: dùng *decal theo luật* — vũng tròn trên bề mặt đang là sàn; khi đổi hướng sinh vệt kéo/chảy; khô sau N giây. Đủ cho mọi bằng chứng ở mục 5.
- Lab A: ảnh hiện trường + 9 điểm khám nghiệm (E1–E8, E12) + bảng cục bộ + replay với 4 công tắc và so khớp.
- Buồng thử nghiệm: hình nộm, ca, khay gel, bút, bảng cục bộ (xoay ngay / hẹn 1 phút), ô kính nhìn từ hành lang.
- Phòng điều khiển: nhật ký (E8, E9, E10) và nút chạy thử chẩn đoán.
- 3 NPC, hội thoại viết sẵn dạng cây, ~40–50 node; mỗi NPC hai vòng (trước/sau khi có bằng chứng).
- Bảng giả thuyết + sổ quy tắc do người chơi tự viết (nhập text tự do, không chấm) + màn kết luận 3 ô.
- Thời lượng 20–30 phút; không lưu game (một phiên).

**Chưa có:** nhạc, lồng tiếng, nhiều vụ án, trọng lực chéo, chất lỏng thật, kho đồ, hệ thống gợi ý (ngoài việc replay báo "chưa khớp").

**Tiêu chí bản thử đạt:** (1) ≥ 70% người thử chọn *Ẩu đả* hoặc *Tai nạn* trước khi vào sandbox rồi tự đổi sau; (2) người thử phát biểu được quy tắc "vũng tròn trên tường = tường từng là sàn" bằng lời của họ; (3) ≥ 50% nhận ra lời khai 22:10 của Khoa là bất khả thi **trước** khi game gợi; (4) không ai cần đọc ticket/nhật ký để kết luận.

---

## 8. Tự kiểm tra

### 8.1 Vật lý
| Điểm kiểm | Kết quả |
|---|---|
| Chốt trượt dưới trọng lực ngang | Hợp lệ với giả định *lẫy giữ yếu hơn trọng lượng chốt* — phải được **nêu trong sandbox** (chốt buồng thử nghiệm cùng kiểu) trước khi dùng ở lời giải. Không được đưa ra lần đầu ở đoạn kết. |
| Vũng cà phê trên tường rồi chảy xuống | Hợp lệ; cần thời lượng Đông đủ dài (15 phút) để vũng định hình trước khi về Xuống. |
| Vệt máu kéo ngang (E6) | Yêu cầu vũng còn ướt lúc 22:00. Vết thương rỉ liên tục 21:50–22:00 → vũng mới, hợp lý. *Nếu muốn giảm yếu tố máu*, thay bằng ca cà phê của Hạo rơi xuống sàn lúc xô xát (cà phê ướt lâu hơn) — logic không đổi, chỉ mất lớp "lau" (E6-ii); khi đó cần giữ E12 làm bằng chứng người thứ hai. |
| Quỹ đạo thi thể | Nằm trên sàn cạnh bàn (x≈1,5 m) → rơi ngang ~2,5 m lên tường Đông ở độ cao thấp (thanh giá đặt thấp, ~0,4 m) → rơi xuống ~0,4 m về chân tường. Khớp E1. |
| Thứ tự lớp gel/đèn soi (E12) | Đèn rơi 2,5 m (từ gầm bàn), gel rơi 4 m (từ tường Tây) → đèn chạm tường trước, gel phủ sau. Hợp lệ. Vật rơi buổi sáng nằm trên gel: hợp lệ. |
| Dấu vết nào *không* còn | Vị trí đồ vật trên tường Đông trong lúc xoay bị xóa khi về Xuống — chỉ còn vết chất lỏng, vết sứt do va, và cụm chân tường. Đã nêu ở 2.4. |

### 8.2 Dòng thời gian
- Thư: 21:05–21:12 Lab A → 21:46:30 bấm xoay buồng thử nghiệm → khóa đến 21:56:30 → phòng điều khiển ~21:58 (ticket 21:59). Không chồng lấn 21:47:10. ✔
- Lâm: xác nhận 3 phút/lần 21:30–22:10. Từ phòng điều khiển tới Lab A ~30 s mỗi chiều; 3 phút không đủ cho lau + sửa lịch + xử lý. ✔ (Nếu muốn chặt hơn: giảm chu kỳ xác nhận còn 2 phút.)
- Khoa: 21:20–21:50 trong Lab A; 21:50 về phòng y tế; 21:55 Thư thấy bóng người → lệch ~5 phút so với 21:50, chấp nhận được với "ước lượng" của Thư; không mâu thuẫn. ✔
- Khoảng trống 21:50–21:59:50 cửa đóng, không chốt: về lý thuyết ai đó có thể vào. Không có bằng chứng ai vào, và mọi dấu vết đã được giải thích đủ bằng hành động trước 21:50. Ghi nhận là **điểm chưa khóa chặt** nhưng không đổi kết luận.

### 8.3 Chỗ suy luận còn mỏng — và đề xuất
1. **E13 chỉ chứng minh Khoa nói dối, không chứng minh giết người.** Fair chỉ khi bắt buộc ghép E12 + E8. Màn kết luận phải yêu cầu *ba* ô (ai / phòng khóa thế nào / bằng chứng thời điểm) thay vì chỉ "ai".
2. **E12 là mô-típ "đánh rơi đồ".** Giá trị của nó nằm ở lớp gel, không ở bản thân cái đèn; sandbox phải có thí nghiệm "đổ gel rồi thả vật" để lớp gel là quy tắc người chơi tự rút ra. Nếu vẫn thấy yếu, thay bằng: Khoa khai "sáng nay tôi đứng ở cửa, không bước vào vì sợ xáo hiện trường" — Lâm và Thư xác nhận — thì ông ta không thể làm rơi đèn ở chân tường Đông, cách cửa 4 m.
3. **Ngoại phạm của Lâm và Thư dựa trên nhật ký + lời nhau.** Chấp nhận được cho bản thử; bản đầy đủ nên cho mỗi người một dấu vết vật lý riêng (ví dụ mẫu đổ của Thư phải khớp hướng xoay 21:46 mà người chơi xem được).
4. **Vì sao Hạo bất tỉnh suốt 30 phút không ai biết?** Chỉ Khoa có mặt. Có thể thêm: nút liên lạc nội bộ cạnh bàn — nhật ký không có cuộc gọi nào từ Lab A sau 21:20 — để chặn lời giải "Hạo tỉnh lại rồi tự cài chốt".
5. **Cơ chế có đủ tạo vụ án công bằng không?** Có, với điều kiện ba quy tắc *vũng/vệt*, *chốt trượt*, *cửa khóa theo chu kỳ* được trải nghiệm trong sandbox **trước** khi cần tới. Không cần thêm cảm biến, thiết bị hay ngoại lệ. Điểm cần cảnh giác khi viết hội thoại: không để Lâm hay Thư nói thẳng "chốt tự trượt" trước khi người chơi tự thấy.

### 8.4 Câu hỏi để bạn chốt trước khi sang bước viết chi tiết
- Giữ máu ở mức tối thiểu (E6) hay đổi sang cà phê (xem 8.1)?
- Hạo chết ngay lúc 21:30 hay chết do cú rơi 22:00? Hiện concept để mở; nếu chết lúc 22:00, trách nhiệm của Khoa là *bỏ mặc + dàn dựng*, tông truyện nặng hơn về đạo đức nhưng hợp với nhân vật "bạn 25 năm".
- Có cho người chơi nhập quy tắc bằng text tự do (không chấm) hay chọn từ danh sách?
- Replay là mô phỏng thật hay kết quả soạn sẵn theo tổ hợp công tắc (16 tổ hợp)? Soạn sẵn ổn định hơn cho bản thử.
