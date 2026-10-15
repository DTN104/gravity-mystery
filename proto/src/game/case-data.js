// Văn bản và nhánh truyện từ script-characters-v0.2; không phải nhật ký mô phỏng.
export const EVIDENCE = {
  E1: { title: 'Vị trí ông Hạo', place: 'Lab A', text: 'Ông Hạo nằm sát chân tường Đông, đầu gần thanh giá thép thấp. Cách bàn làm việc hơn hai mét.', rule: 'R4', after: 'Chân tường Đông. Đúng chỗ một người sẽ nằm nếu tường Đông từng là sàn rồi trả về.' },
  E2: { title: 'Vết cà phê', place: 'Lab A', text: 'Trên tường Đông, ngang tầm mặt bàn, một vết nâu loang tròn to bằng cái đĩa. Từ đó mấy vệt dài chảy xuống. Mảnh ca sứt dưới chân tường.', rule: 'R1', after: 'Vũng tròn trên mặt đứng: cái ca đã rơi lên tường này khi tường là sàn.' },
  E3: { title: 'Cụm đồ rời', place: 'Lab A', text: 'Bút, sổ tay, mảnh ca, viên gel — tất cả dồn thành một dải dọc chân tường Đông. Không có gì ở giữa phòng.', rule: 'R4', after: 'Mọi vật rời đều đi cùng một hướng rồi rơi xuống. Không phải vương vãi — là xếp hàng.' },
  E4: { title: 'Khay gel trống', place: 'Lab A', text: 'Ba khay gắn tường Tây, trống. Gel bắn khắp tường Đông và phủ lên đống đồ chân tường.', rule: 'R5', after: 'Có thể đối chiếu gel phủ đồ với vật được thả sau khi gel đã đứng yên. Cần hỏi Thư về giao thức của khay.' },
  E5: { title: 'Chốt cửa bị cắt', place: 'Lab A', text: 'Chốt trượt ngang đã bị cắt, nằm dưới sàn. Khi còn nguyên, chốt đóng bằng cách đẩy sang phải, về Đông.', rule: 'R3', after: 'Chốt nằm trên trục Đông–Tây. Trọng lực Đông có thể đẩy nó vào vị trí đóng.' },
  E6: { title: 'Vệt trên sàn', place: 'Lab A', text: 'Một vùng sàn cạnh chân bàn sạch hơn chỗ khác, hình cung. Trên vùng đó một vệt sẫm rất mỏng kéo ngang về Đông, dài chừng một mét rồi nhạt dần.', rule: 'R2', after: 'Chất lỏng đã ở trên sàn trước khi phòng xoay, rồi bị kéo ngang. Vùng lau nằm dưới vệt mới.' },
  E7: { title: 'Góc bàn', place: 'Lab A', text: 'Góc bàn thép bóng hơn phần còn lại.', rule: 'R2', after: 'Có dấu lau. Cần đọc cùng vùng lau và vệt trên sàn, không đủ kết luận riêng.' },
  E8: { title: 'Bảng cục bộ', place: 'Lab A', text: 'Lịch hiện tại: 22:00 — Đông — 15 phút. Có một lần sửa lịch lúc 21:47:10, nguồn local. Nhật ký không lưu hướng cũ hay tên người dùng bảng cục bộ.' },
  E9: { title: 'Lượt thử của Thư', place: 'Phòng điều khiển', text: 'Buồng hiệu chuẩn ghi xoay thủ công lúc 21:46:30, nguồn local, chu kỳ 10 phút. Ticket sự cố đổ mẫu được Lâm mở lúc 21:59.', rule: 'R3', after: 'Ai bấm xoay thủ công thì bị khóa trong buồng suốt chu kỳ. Đối chiếu với mốc sửa lịch Lab A.' },
  E10: { title: 'Phiên chẩn đoán', place: 'Phòng điều khiển', text: 'Phiên của Lâm trên bảng tổng: xác nhận chẩn đoán 21:30, 21:33 và tiếp tục mỗi ba phút đến 22:09. Có thể chạy thử để xem hệ thống có đợi xác nhận tay không.' },
  E11: { title: 'Log terminal', place: 'Terminal Hạo', text: 'Có lần sao chép dữ liệu 21:05–21:12 trong phiên của Hạo. Log không cho biết ai ngồi trước máy.', terminal: true },
  E12: { title: 'Đèn soi phủ gel', place: 'Lab A', text: 'Trong đống đồ chân tường: một ống kim loại cỡ ngón tay, phủ gel như mọi thứ xung quanh. Đèn soi y tế.', rule: 'R5', after: 'Nó ở trong phòng trước khi gel rơi. Vật được thả sau khi gel đứng yên sẽ sạch.' },
  E13: { title: 'Lời khai lúc 22:10', place: 'Khoa', kind: 'Lời khai', text: 'Khoa nói lúc 22:10 nhìn qua ô kính, thấy Hạo ngồi dưới sàn, tựa chân bàn, tay ôm đầu.', rule: 'R4', after: 'Hãy đối chiếu vị trí người trong buồng lúc tường Đông là sàn. Đây vẫn là lời khai của Khoa, không phải quan sát của bạn.' },
  E14: { title: 'Báo cáo quý · mục 4', place: 'Terminal Hạo', text: 'Bản nháp đề nghị đình chỉ Khoa vì làm sai lệch hồ sơ khám định kỳ. Đây là động cơ cần đối chiếu với vật chứng, không tự chứng minh thủ phạm.', terminal: true },
  BOOK: { title: 'Sổ tay của Hạo', place: 'Lab A', text: 'Trang cuối: “Đêm 112 — T, 22:00, 15 phút. Mẫu 3 bắt đầu có hướng.” Chữ đều, không vội. Các đêm trước đều ghi Tây.' },
  TICKET: { title: 'Ticket bảo trì chốt', place: 'Tablet Lâm', text: 'Ba tuần trước: “Chốt Lab A lỏng, tự trượt khi xoay. Sửa trước khi có người kẹt trong.” Ticket chưa được xử lý.' },
};

export const JOURNAL = [
  { time: '21:46:30', room: 'Hiệu chuẩn', event: 'Xoay thủ công · 10 phút', origin: 'local' },
  { time: '21:47:10', room: 'Lab A', event: 'Sửa lịch', origin: 'local' },
  { time: '22:00:00', room: 'Lab A', event: 'Xoay theo lịch', origin: 'local' },
  { time: '22:15:00', room: 'Lab A', event: 'Trở về', origin: 'local' },
];

export const PEOPLE = {
  lam: { name: 'Phạm Đức Lâm', short: 'Lâm', role: 'Kỹ sư vận hành', opening: 'Anh cứ xem. Tôi là Lâm, vận hành. Trưởng trạm Hạo mất đêm qua, trong Lab A. Tôi đã niêm phong, chụp ảnh, không ai chạm vào.', questions: [
    { id: 'shift', text: 'Tối qua anh ở đâu?', reply: 'Phòng điều khiển, 21:00 đến gần nửa đêm. Chạy chẩn đoán hệ thống làm mát, cái đó phải ngồi canh.' },
    { id: 'panel', text: 'Anh thấy gì trên bảng tổng lúc 22:00?', reply: 'Lab A xoay đúng lịch. Bình thường. Tôi không nhìn hướng — bảng tổng không hiện hướng, chỉ hiện phòng nào đang xoay.' },
    { id: 'schedule', text: 'Sao ông Hạo lại đổi hướng?', reply: 'Tôi không biết. Ông ấy sửa từ bảng trong phòng, không qua tôi. Nhà nghiên cứu mà, họ thử đủ thứ.' },
    { id: 'bolt', text: 'Chốt cửa Lab A có vấn đề gì không?', reply: 'Không. Chốt trạm này chắc. Ông ấy cài từ trong, tôi phải cắt.' },
    { id: 'thu', text: 'Thư tối qua thế nào?', reply: 'Gần 22:00 nó chạy sang chỗ tôi, mẫu đổ, bực lắm. Tôi mở ticket cho nó rồi nó về phòng.' },
    { id: 'khoa', text: 'Anh có gặp bác sĩ Khoa?', reply: 'Tôi không gặp. Ông ấy hay ở phòng y tế buổi tối.' },
    { id: 'permission', text: 'Xin quyền xem terminal của ông Hạo', reply: 'Quyền xem terminal được mở. Bạn có thể trở lại Lab A để đọc log và bản nháp báo cáo.', system: true, permission: true, secondRound: true },
  ] },
  thu: { name: 'Lê Minh Thư', short: 'Thư', role: 'Nghiên cứu viên', opening: 'Anh muốn hỏi gì?', questions: [
    { id: 'shift', text: 'Tối qua em ở đâu?', reply: 'Buồng thử nghiệm. Em chạy lại mẫu hiệu chuẩn vì… vì em không ngủ được. Bị khóa trong mười phút, mẫu đổ vì em quên kẹp nắp. Rồi em sang báo anh Lâm.' },
    { id: 'lab', text: 'Em có vào Lab A không?', reply: 'Không.' },
    { id: 'gel', text: 'Khay gel trên tường Tây là gì?', reply: 'Thí nghiệm 180 đêm của thầy. Khay gắn tường Tây, mỗi đêm xoay Tây để gel bị ép vào khay. Luôn luôn Tây. Xoay Đông thì đổ hết — thầy không bao giờ làm thế, đêm 112 rồi.' },
    { id: 'direction', text: 'Vậy ai đổi sang Đông?', reply: 'Em không biết. Em cũng không hiểu.' },
    { id: 'hallway', text: 'Em thấy gì trên hành lang?', reply: 'Lúc em đi sang phòng điều khiển, khoảng 21:55, có bóng ai ở cuối hành lang, phía Lab A. Em không rõ là ai, em đang bực.' },
    { id: 'bolt', text: 'Chốt cửa có bao giờ tự trượt không?', reply: 'Trượt? Em không biết. Em chưa bao giờ ở trong đó lúc xoay — thầy đuổi hết ra trước 21:50.' },
  ] },
  khoa: { name: 'Đỗ Văn Khoa', short: 'Khoa', role: 'Bác sĩ trạm', opening: 'Anh cứ xem. Chúng tôi không giấu gì. Ông ấy… là bạn tôi.', questions: [
    { id: 'shift', text: 'Tối qua ông ở đâu?', reply: 'Phòng y tế, từ sau bữa tối. Soạn thuốc cho đợt khám tháng sau.' },
    { id: 'hao', text: 'Ông và ông Hạo quen nhau lâu chưa?', reply: 'Hai mươi lăm năm. Chương trình này là của hai chúng tôi. Giờ là của một mình tôi.' },
    { id: 'meeting', text: 'Tối qua ông có gặp ông Hạo?', reply: 'Không. Bữa tối xong ai về phòng nấy. Giá mà tôi qua.' },
    { id: 'witness', text: 'Ông có thấy ông Hạo tối qua không?', reply: 'Có. Đây là điều tôi ân hận. Khoảng 22:10 tôi đi lấy nước, ngang Lab A, nhìn qua ô kính. Ông ấy ngồi dưới sàn, tựa vào chân bàn, tay ôm đầu. Tôi gõ cửa — cửa đang khóa, đang xoay mà. Ông ấy xua tay. Tôi nghĩ ông ấy ngã nhẹ lúc xoay, chút nữa ông ấy tự dậy. Tôi về ngủ.', evidence: 'E13' },
    { id: 'injury', text: 'Vết thương của ông ấy?', reply: 'Thái dương phải, va vào thanh giá. Một cú rơi ba mét lên thép. Chết gần như ngay.' },
    { id: 'bolt', text: 'Ông biết gì về chốt cửa?', reply: 'Tôi không rành máy móc. Anh hỏi Lâm.' },
  ] },
};

export const PRESENT = {
  lam: { TICKET: 'Tôi định sửa tuần này. Ông ấy nói “kẹt trong”, tôi tưởng ông ấy nói quá. Tây thì mở, Đông thì đóng. Ai ở trong Lab A lúc xoay đều biết. Tức là Hạo. Và… bác sĩ hay ngồi trong đó chờ ông ấy.', E10: 'Tôi trực phòng điều khiển cả tối, chạy chẩn đoán. Cứ ba phút nó lại đợi tôi bấm xác nhận.', E8: 'Ông ấy sửa từ bảng trong phòng, không qua tôi. Bảng tổng không ghi hướng.' },
  thu: { E11: '…Không phải em. Là em. Dữ liệu đó là của em, hai bài báo đó là của em. Em chỉ lấy lại. Thầy đang ở phòng ăn, em vào mười phút rồi ra. Em không đụng gì khác.', E9: 'Em đang bị khóa trong buồng thử nghiệm. Anh vừa tự thử rồi mà — còi kêu là không ra được.', BOOK: 'Thầy ghi “T” cho đêm 112. T là Tây. Thầy không đổi.' },
  khoa: { E13: '…Có lẽ tôi nhớ nhầm giờ. Có lẽ là trước khi xoay. 21:55. Tôi… không muốn làm phiền ông ấy.', E12: 'Tôi làm rơi sáng nay, lúc khám cho ông ấy.', E8: 'Anh có muốn biết vì sao không?', E14: 'Ba năm. Ba năm tôi sửa hồ sơ để trạm này còn tồn tại. Ai cũng khỏe, chỉ là ngưỡng của công ty quá thấp. Hạo biết. Hạo nói ông ấy sẽ “làm đúng”.' },
};

export const CONFESSION = 'Tôi đẩy ông ấy. Một cái thôi. Ông ấy ngã, đầu đập góc bàn. Tôi quỳ xuống bắt mạch. Còn. Yếu, nhưng còn. Tôi là bác sĩ. Tôi biết nên làm gì với một người chấn thương đầu. Tôi đã không làm bất cứ việc gì trong số đó. Tôi biết chốt trượt mở mỗi đêm. Xoay ngược lại thì nó đóng. Tôi lau bàn. Tôi lau sàn. Tôi đổi lịch. Rồi tôi đi. Tôi cứ nghĩ sàn là sàn. Tôi dàn dựng cả căn phòng, mà chưa một lần hình dung nó trông thế nào lúc xoay.';
export const REPLAY_OPTIONS = {
  pose: { standing: 'Đứng cạnh bàn', lying: 'Nằm cạnh bàn' }, floor: { dry: 'Sạch', wet: 'Có vũng ướt' },
  bolt: { open: 'Mở', closed: 'Đóng' }, direction: { WEST: 'Tây', EAST: 'Đông' },
};
export const VERDICT_OPTIONS = {
  person: { lam: 'Lâm', thu: 'Thư', khoa: 'Khoa', accident: 'Không ai — tai nạn' },
  lock: { hao: 'Hạo tự cài', gravity: 'Chốt tự trượt khi xoay Đông', master: 'Lâm khóa từ bảng tổng', unknown: 'Chưa rõ' },
  timing: { coffee: 'Vết cà phê trên tường', streak: 'Vệt kéo ngang trên sàn', testimony: 'Lời khai 22:10', journal: 'Nhật ký 21:47' },
};
