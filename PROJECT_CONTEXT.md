# FocusRoot Frontend — Project Context

> Đọc file này đầu mỗi session làm việc với FE. Bản tổng 2 repo ở `D:\Project\PROJECT_MEMORY.md`.
> **Cập nhật:** 08/07/2026 — hoàn tất nối API thật cho demo Tuần 5 (Member D).

## 🧱 Tech stack
React Native 0.81 · Expo ~54 (expo-router 6, typedRoutes + strict) · TypeScript · axios · `@stomp/stompjs` · `expo-secure-store`.
API base: `http://localhost:8080/api` (`constants/axiosClient.ts`). Mọi response BE bọc `ApiResponse<T>` → **đọc `res.data.data`**.

## 🔖 Release
- `v1.0.0-forest` — **release FE đầu tiên** (demo Tuần 5). Nối API thật với BE `v1.0.1-forest`.

## ✅ Đã xử lý — nối API thật (7 mục §14, Member D, PR #7)
1. **`constants/tokenStorage.ts`** (mới): nguồn lưu token DUY NHẤT — SecureStore (native) + localStorage (web). Trước đây login lưu SecureStore còn interceptor đọc localStorage → mobile không thấy token.
2. **`constants/axiosClient.ts`**: request đính token qua `tokenStorage`; interceptor refresh đọc đúng `res.data.data.accessToken` + lưu cả refresh token mới.
3. **`app/(auth)/login.tsx`**: đọc `response.data.data`, lưu qua `tokenStorage`.
4. **`app/(tabs)/index.tsx` (Home)**: bỏ mock + `global.is_login_success`; guard bằng token; Start/End phiên gọi API thật; hiển thị `/stats/summary` thật.
5. **`app/(tabs)/forest.tsx`**: gọi đúng `/forest` (không phải `/forest/trees`), đọc `res.data.data`, map entity `MyForest` (`treeSpecies.name/imageUrl`, `plantedAt`, `isAlive`), fallback ảnh khi `imageUrl` không phải http(s), empty-state.
6. **Routing**: xoá bản trùng route ở root (`app/login.tsx`, `app/register.tsx`, `app/detail.tsx`) đè route với `(auth)`/`(tabs)`; ẩn màn thừa `detail/notifications/profile` khỏi thanh tab; root `_layout` auto-discover.
7. **`docs/DEMO_WEEK5.md`**: bước demo + cách chạy BE/FE + minh chứng 2xx.

## 🔬 Kết quả verify thật (08/07/2026, không qua CI vì FE chưa có CI)
- `npx tsc --noEmit` (strict + typedRoutes) → **exit 0**.
- `npx expo export --platform web` → **exit 0** (20 route, 829 modules) — không lỗi trùng route.
- Luồng API thật với BE local (`v1.0.1-forest`, đã fix LazyInit):

  | Endpoint | HTTP |
  |---|---|
  | `POST /api/auth/register` | 201 |
  | `POST /api/auth/login` | 200 |
  | `GET /api/forest/species` | 200 (6 loài) |
  | `POST /api/sessions/start` | 200 |
  | `POST /api/sessions/{id}/end` | 200 |
  | `GET /api/forest` | 200 |
  | `GET /api/stats/summary` | 200 |
  | `POST /api/auth/refresh` | 200 (token mới ở `data.data`) |

  `passwordHash` không lộ ở bất kỳ response nào; shape `data.data` khớp code FE.

## 🧩 Nợ kỹ thuật để lại cho Phase 2
- **`app/(tabs)/group.tsx` còn MOCK**: gọi `/group/members` (endpoint **không tồn tại** trên BE) → luôn fallback dữ liệu giả. Tính năng Nhóm/WebSocket thật (BE có `/api/groups`, `/api/groups/{id}/join`, `/api/groups/mine`, STOMP `/ws`) chưa nối — làm ở Phase 2 (Member D).
- **`package.json` name vẫn là `"myapp"`** — nên đổi thành `focusroot`.
- Chưa tách màn Thống kê riêng (đang gộp ở Home).
- FE lưu ảnh loài cây theo `imageUrl` seed BE dạng tên file tương đối (`sapling.png`) → hiện fallback ảnh mặc định; Phase 2 dùng URL/asset thật.

## 🏃 Chạy nhanh
```bash
npm install
npx expo start --web        # http://localhost:8081
```
BE phải chạy ở `http://localhost:8080/api` (xem `docs/DEMO_WEEK5.md`).
