# Trạm Thiên Bình

Game điều tra trong một trạm nghiên cứu có thể thay đổi trọng lực. Khám hiện trường, hỏi nhân vật, tự thử quy tắc vật lý và đối chiếu chứng cứ để kết luận vụ án.

## Chạy game

Từ thư mục gốc của repo:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory proto
```

Mở [game.html](http://127.0.0.1:4173/game.html) để chơi. Cần kết nối mạng để tải thư viện từ CDN; không cần cài npm.

- `proto/game.html`: giao diện toàn game.
- `proto/sandbox.html`: buồng thử cơ chế độc lập.
- `proto/index.html`: chuyển thẳng sang `game.html` (bản chơi).
- `proto/physics-lab.html`: prototype vật lý để hồi quy (trước đây là `index.html`).
- `docs/`: concept, kịch bản, đặc tả và hướng dẫn playtest.
- `proto/tests/`: runner, dữ liệu và bằng chứng kiểm thử.

Tiến trình chỉ giữ trong phiên hiện tại; tải lại trang sẽ bắt đầu lại. Tái hiện là minh họa theo kịch bản, không phải phép đo mới của engine.

## Kiểm tra

Với Node.js 22 trở lên:

```sh
node proto/tests/rules.test.mjs
node proto/tests/game-ui.test.mjs
```

Xem [hướng dẫn đầy đủ](proto/README.md), [báo cáo vật lý](proto/TEST-REPORT.md), [báo cáo UI](proto/UI-TEST-REPORT.md) và [lượt chơi ngày 15/10/2026](proto/tests/playthrough-2026-10-15/PLAYTEST-REPORT.md).
