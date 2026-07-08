# Check Chăm Chỉ — Kiến trúc Codebase & Đánh giá Tích hợp AI Companion

## Tổng quan Dự án

**Check Chăm Chỉ** là một ứng dụng web học tập cá nhân (single-user) giúp người dùng xây dựng kỷ luật mỗi ngày thông qua gamification. Người dùng điểm danh hàng ngày, hoàn thành nhiệm vụ học tập/thể chất, tích lũy coin, mua pet/danh hiệu, quay gacha, tập trung trong phòng focus, và theo dõi streak.

Ứng dụng chạy hoàn toàn ở phía client (static export), không có server runtime. Toàn bộ dữ liệu lưu trong localStorage thông qua Zustand persist middleware.

---

## Kiến trúc Hiện tại

### Công nghệ

| Công nghệ | Phiên bản | Vai trò |
|-----------|-----------|---------|
| Next.js | 16.2.9 | Framework React (App Router) |
| React | 19.2.4 | UI Library |
| Zustand | 5.0.14 | State management (với persist middleware) |
| Tailwind CSS | 4.x | Styling |
| Framer Motion | 12.42.2 | Animation |
| TypeScript | 5.x | Type safety |

**Đặc điểm kiến trúc quan trọng nhất:** `next.config.ts` có `output: 'export'` — toàn bộ ứng dụng là static HTML/JS. **Không có server-side code, không có API routes, không có database.** Đây là single-page application thuần client.

### Cấu trúc Thư mục

```
check-cham-chi/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout (Navbar + PetCompanion global)
│   ├── page.tsx                  # Dashboard (trang chủ)
│   ├── calendar/page.tsx         # Lịch điểm danh
│   ├── focus-room/page.tsx       # Phòng tập trung
│   ├── journal/page.tsx          # TODOS + Ghi chú
│   ├── rewards/page.tsx          # Quản lý phần thưởng + Vòng quay
│   ├── settings/page.tsx         # Cài đặt
│   ├── shop/page.tsx             # Cửa hàng
│   └── statistics/page.tsx       # Thống kê
├── components/                   # 37 React components (tất cả đều 'use client')
│   ├── Dashboard.tsx             # Trang chủ chính
│   ├── FocusRoom.tsx             # Timer tập trung + cây
│   ├── MissionGroup.tsx          # Nhóm nhiệm vụ (Learning/Physical)
│   ├── PetCompanion.tsx          # Pet companion (global floating)
│   ├── Navbar.tsx                # Thanh điều hướng chính
│   ├── AlmanacPopup.tsx          # Bộ sưu tập
│   ├── GachaModal.tsx            # Gacha popup
│   ├── ShopPopup.tsx / ShopView.tsx
│   └── ... (các component còn lại)
├── config/                       # Dữ liệu cấu hình tĩnh
│   ├── types.ts                  # Kiểu chung (ShopPet, ShopTitle, Rarity)
│   ├── shopItems.ts              # Danh sách pet & title trong shop
│   ├── gachaItems.ts             # Danh sách gacha + tỉ lệ
│   ├── titles.ts                 # Danh hiệu + điều kiện mở khóa
│   ├── treeTitles.ts             # Danh hiệu cây theo cấp độ
│   ├── achievements.ts           # Thành tựu (không dùng trong UI chính)
│   ├── rarity.ts                 # Style theo độ hiếm (Common → UR)
│   └── petPhrases.ts             # Câu nói của pet
├── store/
│   └── useAppStore.ts            # Zustand store DUY NHẤT (~800 dòng)
├── utils/
│   └── backup.ts                 # Backup/export dữ liệu
└── public/                       # Static assets
```

### Luồng Dữ liệu

```
User Interaction
    ↓
React Component (gọi action từ useAppStore)
    ↓
Zustand Action (ví dụ: checkinToday, toggleMission, gachaPull)
    ↓
State Update (set() trong zustand)
    ↓
localStorage persist (tự động qua zustand persist)
    ↓
UI Re-render (React reactivity)
```

**Đặc điểm:** Tất cả business logic đều nằm trong store. Không có service layer, không có API layer, không có backend.

---

## Đánh giá Tích hợp AI Companion

### 1. Kiến trúc hiện tại có phù hợp để tích hợp AI không?

**Trả lời: Có, nhưng với một ràng buộc quan trọng.**

Phù hợp ở chỗ:
- Zustand store cung cấp một nguồn dữ liệu duy nhất, có cấu trúc rõ ràng — AI có thể dễ dàng đọc toàn bộ trạng thái của ứng dụng (streak, mission, todo, focus time, pet, v.v.)
- Kiến trúc component đơn giản, dễ thêm một component chat mới
- TypeScript giúp định nghĩa rõ kiểu dữ liệu cho AI context

**Ràng buộc quan trọng:**
- `output: 'export'` (static) không cho phép tạo API routes — nếu muốn AI gọi qua server proxy, cần thay đổi
- Nếu chấp nhận gọi AI trực tiếp từ client (có API key do người dùng tự cung cấp), **không cần thay đổi kiến trúc gì cả**

### 2. Công nghệ hiện tại có đủ không?

| Công nghệ | Đủ? | Ghi chú |
|-----------|-----|---------|
| Next.js | ✅ Đủ | Có thể thêm API routes nếu chuyển sang hybrid |
| React | ✅ Đủ | JSX/component model phù hợp cho chat UI |
| Zustand | ✅ Đủ | Dễ dàng thêm state cho AI (conversation history, loading state, v.v.) |
| Tailwind | ✅ Đủ | Styling chat UI dễ dàng |
| TypeScript | ✅ Đủ | Type safety cho AI response/request |
| localStorage | ⚠️ Tạm đủ | Dung lượng giới hạn (~5-10MB) — nếu lưu nhiều lịch sử chat sẽ đầy |

**Thiếu:**
- ✅ Không thiếu thư viện thiết yếu — có thể dùng `fetch()` có sẵn để gọi API AI
- ⚠️ Không có cơ chế quản lý API key an toàn (nếu không muốn user tự nhập key)

### 3. Có cần thay đổi framework/thư viện/tổ chức không?

**Không cần thay đổi framework.** Next.js + React + Zustand là một stack hoàn toàn phù hợp.

**Có thể cân nhắc bổ sung (không bắt buộc):**
- `openai` hoặc `@anthropic-ai/sdk` npm package nếu muốn dùng SDK thay vì fetch raw
- `react-markdown` nếu AI trả lời dạng markdown (phổ biến)

**Về tổ chức project:**
- Hiện tại business logic nằm hết trong store — nếu AI cần thực hiện các hành động (thêm mission, cập nhật goal, v.v.) thì việc gọi action trực tiếp từ store là OK
- Không cần thêm service layer ngay — nhưng nếu AI logic phức tạp, nên tách ra file riêng

### 4. Có phần nào nên refactor trước không?

**Không bắt buộc — nhưng nên cân nhắc (ưu tiên Thấp → Trung bình):**

1. **Tách business logic khỏi store** (ưu tiên: Thấp)
   - Hiện tại file `useAppStore.ts` dài ~800 dòng với logic pha trộn
   - Nếu AI Companion cần gọi lại logic (ví dụ: "thêm nhiệm vụ học từ vựng mới"), việc có các service function riêng sẽ sạch hơn
   - **Không cần làm ngay** — có thể làm sau khi AI đã hoạt động

2. **Tách store thành nhiều slice** (ưu tiên: Thấp)
   - Zustand hỗ trợ `slices` pattern
   - Hiện tại một store quản lý: profile, streaks, missions, rewards, focus, tree, todos, shop, gacha
   - **Không cần thiết cho single-user app** — một store vẫn ổn

3. **Thêm error boundary + loading state pattern** (ưu tiên: Trung bình)
   - AI calls có latency, cần pattern xử lý loading/error
   - Hiện tại app không có pattern này rõ ràng

### 5. Nếu giữ nguyên kiến trúc, mở rộng sau có khó không?

**Không khó.** Kiến trúc hiện tại đơn giản và dễ mở rộng:

- Thêm component chat mới: `components/AICompanion.tsx` — đặt trong layout như `PetCompanion`
- Thêm state AI: thêm vào store hiện tại hoặc tạo store riêng (`useAIStore.ts`)
- Thêm API call: dùng `fetch()` từ client

**Lưu ý duy nhất:** Nếu muốn chuyển từ client-side AI call sang server-side proxy sau này, bạn sẽ cần:
- Chuyển `output: 'export'` → `output: 'standalone'` (hoặc xóa dòng đó)
- Thêm file `app/api/chat/route.ts`
- Cập nhật deployment (Vercel, Docker, hoặc Node server)

Việc này có thể làm sau mà không ảnh hưởng gì đến code frontend.

### 6. Nguy cơ về hiệu năng, bảo trì, mở rộng?

| Nguy cơ | Mức độ | Giải thích |
|---------|--------|------------|
| localStorage đầy | ⚠️ Thấp | Lịch sử chat AI có thể lớn. Giới hạn: lưu 50-100 message gần nhất, dùng cơ chế xoay vòng |
| API key lộ | ⚠️ Trung bình | Nếu dùng client-side call, key trong localStorage có thể bị đánh cắp. **Giải pháp:** dùng user-provided key, chấp nhận rủi ro cho personal project |
| Store monolith khó bảo trì | ⚠️ Thấp | 800 dòng cho single-user app là chấp nhận được. Chỉ refactor khi thực sự cần |
| Không có server-side validation | ✅ Không vấn đề | Single-user, không có concurrent access |

### 7. Có nên thêm Service/API layer cho AI ngay không?

**Không cần ngay.** Với single-user, bạn có thể implement AI Companion trong 2 phase:

**Phase 1 (có thể làm ngay — không cần thay đổi kiến trúc):**
- AI chat thuần client-side
- User tự cung cấp API key (lưu trong localStorage)
- Gọi AI provider trực tiếp từ browser
- **Chi phí: 0 thay đổi kiến trúc**

**Phase 2 (sau này khi cần):**
- Thêm backend proxy nếu muốn
- Hoặc khi cần AI thực hiện hành động phức tạp (tác động vào hệ thống file, gửi email, v.v.)

### 8. AI có thể đọc dữ liệu website dễ dàng không?

**Cực kỳ dễ dàng.** Zustand store hiện tại có tất cả dữ liệu AI cần:

```typescript
// AI có thể đọc (qua useAppStore.getState()):
- streaks.currentStreak      // ⭐ Streak hiện tại
- streaks.longestStreak      // 🏆 Streak dài nhất
- checkinHistory             // 📅 Lịch sử điểm danh (mood, mission completed...)
- checkinHistory[today].mood // 😊 Tâm trạng hôm nay
- missions                   // 📋 Danh sách nhiệm vụ
- todos.goals                // 🎯 Mục tiêu
- todos.quickNote            // 📝 Ghi chú nhanh
- todos.dailyPlans           // 📆 Kế hoạch hàng ngày
- tree.level                 // 🌳 Cấp độ cây
- tree.totalFocusMinutes     // ⏱️ Tổng thời gian focus
- profile.coins              // 🪙 Số coin
- focusMode                  // 🧘 Trạng thái focus hiện tại
- userPets, userTitles       // 🐾 Bộ sưu tập
```

**AI cũng có thể gọi actions** (qua `useAppStore.getState().toggleMission(id)` v.v.) — nhưng cần thiết kế cẩn thận để tránh AI tự ý thay đổi dữ liệu.

---

## Đề xuất Cụ thể cho AI Companion

### Kiến trúc Đề xuất (tối giản, không cần thay đổi gì)

```
[User] → [AICompanion.tsx] → fetch() → [OpenAI/Anthropic API]
                ↑                        ↓
        [useAppStore]          [AI Response streaming]
        (đọc context)               ↓
                              [UI hiển thị reply]
```

### Các bước Implement (không ảnh hưởng code hiện tại)

1. **Tạo `components/AIChatPopup.tsx`** — component chat popup (giống shop/gacha popup)
2. **Tạo `store/useAIStore.ts`** — store riêng cho AI state (messages, loading, API key)
3. **Thêm vào layout** — đặt AI chat icon floating như PetCompanion
4. **Viết hàm build context** — đọc dữ liệu từ `useAppStore.getState()` và tạo system prompt
5. **Gọi AI API** — dùng fetch với user-provided key từ localStorage

### Ví dụ System Prompt (sẽ build từ state thực tế)

```
Bạn là AI Companion của Check Chăm Chỉ. 
Dưới đây là dữ liệu hôm nay của người dùng:

📅 Hôm nay: đã điểm danh ✅
🔥 Streak hiện tại: 7 ngày
📚 Nhiệm vụ Learning: Đã hoàn thành 4/6 (67%)
💪 Nhiệm vụ Physical: Đã hoàn thành 3/5 (60%)
🎯 Mục tiêu hôm nay: "Học 50 từ vựng mới"
😊 Tâm trạng: happy
🪙 Coin: 1250
🌳 Cây: Lv.5 (45/100 XP)

Hãy động viên và đưa lời khuyên phù hợp.
```

### Lưu ý Quan Trọng

- **KHÔNG cần thay đổi** `next.config.ts` nếu dùng client-side call
- **KHÔNG cần thêm** backend server
- **KHÔNG cần refactor** store hay component hiện tại
- **CÓ THỂ thêm** AI Companion ngay mà không ảnh hưởng gì đến code đang chạy

---

## Tóm tắt Mức độ Ưu tiên

| Hạng mục | Mức độ | Cần làm ngay? |
|----------|--------|---------------|
| Thêm AI Companion component | Trung bình | ✅ Có thể làm ngay |
| Chuyển static → hybrid (API routes) | Thấp | ❌ Chỉ làm khi cần server-side proxy |
| Refactor store thành slices | Thấp | ❌ Không cần |
| Tách business logic khỏi store | Thấp | ❌ Có thể làm sau |
| Thêm pattern xử lý loading/error | Trung bình | ✅ Nên làm khi thêm AI |
| API key management strategy | Cao | ⚠️ Cần quyết định trước (user tự cung cấp key?) |
| Xoay vòng lịch sử chat (tránh đầy localStorage) | Trung bình | ✅ Nên có ngay khi implement chat |

---

## Kết luận

**Kiến trúc hiện tại của Check Chăm Chỉ hoàn toàn phù hợp để tích hợp AI Companion.** 

Điểm mạnh nhất:
- Zustand store là nguồn dữ liệu duy nhất — AI có context đầy đủ về người dùng
- Kiến trúc đơn giản, dễ thêm tính năng mới không ảnh hưởng code cũ
- Single-user nên không có vấn đề về bảo mật hay scale

Điểm cần lưu ý duy nhất:
- Quyết định cách quản lý API key (user tự cung cấp hay app cung cấp) — ảnh hưởng đến có cần backend hay không
- Nếu user tự cung cấp key: implement client-side, không cần thay đổi gì
- Nếu app cung cấp key: cần thêm backend proxy

**Khuyến nghị:** Giữ nguyên mọi thứ, thêm AI Companion như một component độc lập. Đây là cách an toàn nhất, nhanh nhất, và không rủi ro cho dự án hiện tại.
