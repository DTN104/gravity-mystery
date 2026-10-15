# Tài nguyên UI A

Ngày 13/10/2026. Tạo bằng imagegen tích hợp; ảnh tách khỏi chữ và nút tương tác.

## victim

Tệp: `proto/assets/ui/victim.png`. Minh hoạ vị trí trong ảnh hiện trường và tái hiện; không dùng làm body vật lý.

```text
Create ONE transparent-background 2D painted GAME ASSET: a fictional Vietnamese male research-station director, 54 years old, lean build, greying hair, thin glasses, grey-white laboratory coat, lying motionless on his back in a completely HORIZONTAL pose. FEET on LEFT, HEAD on RIGHT. Entire figure visible, arms close to body, no bent upright torso, no dramatic expression. Seen as an orthographic SIDE VIEW, suitable for compositing at the bottom right floor of a dark charcoal/slate steel room. Serious restrained semi-realistic illustration matching industrial research-station art. Cool dim light, subdued greys. No blood, no wound, no gore, no text, no items, no floor, no wall, no shadows extending beyond figure, no UI. Transparent background REQUIRED, no background glow. Subject is a fictional game illustration, not a photograph. Generous transparent margins, broad horizontal canvas.
```

Sprite `objects.png` được sửa một lần bằng imagegen để mọi vật nằm trọn trong ô atlas. Prompt sửa cuối:

```text
Edit this game sprite atlas. Preserve the six objects, their painted style, colors and poses exactly. Change ONLY their sizes and placement so each is fully isolated inside an EXACT regular THREE-COLUMN TWO-ROW grid. Cell bounds are x=0-33.33%,33.33-66.67%,66.67-100%, y=0-50%,50-100%. TOP row: mug, pen, book. BOTTOM row: bottle, rag, mannequin. Every object including its head, cap and handle MUST be fully within its own cell with generous transparent margins; no object crosses y=50% or a column boundary. Top objects entirely between y=5% and y=45%; bottom objects entirely between y=55% and y=95%. In particular MOVE mannequin head fully DOWN into bottom-right cell and move bottle cap fully DOWN into bottom-left cell. Transparent background with zero alpha everywhere outside objects. Remove background color glows and halos. No border, text, labels, shadows, UI, or new items. This will be cut into equally-sized sprite frames by the game, so the grid containment is critical.
```

## corridor

Tệp: `proto/assets/ui/corridor.png`.

```text
Generate a single clean GAME BACKGROUND ASSET, wide landscape 16:9, for the approved dark industrial Vietnamese research-station mystery UI. Quiet steel research corridor drawn as polished 2D environmental concept art. Cold charcoal/slate steel walls, dim overhead white strips, subtle muted amber edge lighting, realistic restrained industrial illustration. Three closed steel doors on the back wall, evenly spaced in the RIGHT TWO THIRDS of the image. Each door has a tiny glass window, plain blank metal nameplate and handle; DO NOT write any labels. Leave LEFT THIRD relatively empty, dark wall and ambient shadows for a separate HTML menu overlay. Calm, isolated, serious atmosphere. No people, no body, no gore, no furniture obstructing doors, no sci-fi machinery proliferation, no extra rooms, no signage, no logos, no browser/UI frames, no buttons, no letters, no game HUD. Whole scene is a background only, not an interface. Match the approved style: fine steel panel texture, restrained contrast, charcoal palette, warm amber accents at floor. Do not put readable text in the asset.
```

## lab

Tệp: `proto/assets/ui/lab.png`.

```text
Generate ONE standalone 4:3 landscape GAME BACKGROUND ASSET for Lab A in a dark research-station detective game. A strictly straight-on 2D SIDE VIEW of a 4-metre-wide 3-metre-high steel room, no first-person perspective, floor as a horizontal edge at image bottom. Back wall dark slate steel plates with restrained texture, cool white overhead lighting, near-orthographic illustration. Elements in normalized image coordinates: closed back-wall door on left at x18%, bottom82%; three EMPTY small glass gel trays fixed upper-left wall around x14%, y24%; steel table middle-left x43%, tabletop y61%, legs end at84%; top empty except clean corner and a terminal atx40%; blank local control plate atx54%,y28%; a small round brown coffee POOL STAIN on right wall atx89%,y48% with a few thin brown vertical drips down from it; a LOW short fixed steel rail on right wall x91%,y75%; small blue notebook, yellow pen, white cup shards and loose green gel CLUSTER only at bottom-right floor x84%,y87%; slight pale arc wiped area with a thin reddish horizontal streak on floor beside table x49%,y85%. Tiny metal penlight among gel bottom-right. No standing mannequin, no human body or gore, no extra loose cups on table, no bottles or laboratory clutter. Floor and walls readable, physically plausible sparse setup. No text, no labels, no interface, no hotspot circles, no arrows, no buttons, no decorative orange screens. Keep approved style charcoal/slate, pale metal table, subtle amber floor-edge lighting. Leave margins near walls so HTML hotspot markers can be placed over the image.
```

## control

Tệp: `proto/assets/ui/control.png`.

```text
Generate ONE standalone wide landscape 16:9 background illustration for a dark industrial research station CONTROL ROOM in a Vietnamese gravity mystery game. Quiet compact grey steel room, a simple operator desk in the lower left half, one chair, three blank dim blue-grey monitor screens and a maintenance tablet, cool overhead white strip. RIGHT HALF relatively empty dark wall for separate HTML journal panel. Cold charcoal/slate palette, restrained muted amber seams near floor, polished 2D environmental art matching a serious research-station interface, minimal perspective, no dramatic volumetric neon or cyberpunk. No people, no text on screens, no readable labels, no numeric graphs, no buttons, no UI chrome, no logos, no body, no gore, no extra rooms. Background only.
```

## characters

Tệp: `proto/assets/ui/characters.png`.

```text
Generate ONE transparent-background GAME CHARACTER SPRITE SHEET for a serious Vietnamese research-station mystery. THREE separate fictional Vietnamese characters, waist-up, placed in three equal-width columns with ample transparent margins, no overlap, each centered in their own column. Use consistent refined semi-realistic 2D painted character illustration, cool desaturated light, matching charcoal/slate industrial environment, expressive but restrained, no anime/cartoon exaggeration. LEFT: Lâm, male38, broad build, tired eyes, grey-blue technician jacket with sleeves rolled, headset hanging at one ear, carrying maintenance tablet. CENTRE: Thư, female27, dark hair hastily tied, worn white laboratory coat with small dried green gel smear on sleeve, notebook held against chest, tired alert face, gaze slightly sideways. RIGHT: Khoa, male52, tall relaxed shoulders, old white doctor's coat with breast pocket, calm warm face, mature greying hair, no villain styling, no accusatory expression; chest pocket empty. Full head and shoulders visible, waist bottom aligned consistently. Fictional people, no celebrity likeness. Transparent background is REQUIRED. No text, no labels, no frames, no environment, no UI, no watermarks. Leave generous side gutters so each portrait can be displayed using CSS sprite positioning without showing its neighbors.
```

## calibration

Tệp: `proto/assets/ui/calibration.png`.

```text
Create one 4:3 landscape 2D GAME BACKGROUND TEXTURE for a calibration room at a dark industrial research station. STRICT straight-on orthographic BACK WALL only: charcoal and slate steel wall panels, one cool white ceiling strip along the top, subtle amber edge light at bottom floor line, restrained detailed metal texture, calm serious research atmosphere. Empty background, NO doors, NO tables, NO shelves, NO rails, NO objects, NO stains, NO humans, NO text, NO interface, NO labels, NO arrows. Room objects will be separate sprites added by existing physics. Frame should be flat frontal rectangular wall with a narrow horizontal metal floor edge at very bottom, no deep floor or perspective. Match polished semi-realistic illustration used by dark amber lab UI.
```

## objects

Tệp: `proto/assets/ui/objects.png`.

```text
Create ONE transparent-background GAME OBJECT SPRITE ATLAS with EXACTLY SIX standalone objects centered in SIX equally sized cells of a 3-column 2-row grid. No cell borders, no captions, no background, no cast shadow reaching other cells. All consistent semi-realistic 2D SIDE VIEW painted illustration with crisp edges, for a charcoal/slate dark research station. TOP ROW left: small off-white ceramic mug seen sideways with a handle on its right, upright. TOP ROW middle: horizontal yellow pen with dark cap. TOP ROW right: horizontal thin blue notebook, closed, side/top modest view. BOTTOM ROW left: upright transparent blue water bottle with blue cap, side view. BOTTOM ROW middle: folded small grey cleaning rag, horizontal. BOTTOM ROW right: full-body rigid upright grey crash-test mannequin, head round with black/gold crash-test marking, simple straight torso and legs, arms close to sides, adult proportions. Objects tightly centered within their individual cells but ample transparent gutters. Mug/bottle/notebook/rag larger in their cells for legibility, pen horizontal, mannequin occupies most cell height. No people besides inanimate mannequin, no text, no logos, no grid lines, no UI, no stains. Transparent background REQUIRED. No neighbors overlapping. Artwork for sprites only, physical geometry will stay unchanged.
```
