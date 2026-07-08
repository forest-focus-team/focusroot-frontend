# Demo Week 5 — FocusRoot (FE ↔ BE end-to-end)

Luồng demo: **Đăng ký → Đăng nhập → Bắt đầu phiên → Kết thúc → Trồng cây → Xem Rừng → Thống kê**.
FE (Expo web) nối API thật tới BE Spring Boot.

> Nhánh FE: `feature/D-fe-demo-week5`. BE: bug serialize LAZY (500 ở `/sessions/{id}/end` và `/forest`) **đã fix** trên `develop` (PR #63).

---

## 1. Chạy Backend

`baseURL` FE trỏ tới `http://localhost:8080/api` (sửa trong `constants/axiosClient.ts` nếu chạy thiết bị thật → dùng IP LAN).

**Cách A — MySQL thật (đúng Quickstart):**
```bash
cd focusroot-backend
docker-compose up -d mysql        # MySQL 8 (root/focusroot123)
mvn spring-boot:run               # http://localhost:8080/api
```

**Cách B — H2 in-memory, không cần Docker** (khi 3306 bận / Docker tắt):
```bash
cd focusroot-backend
export JAVA_HOME=".../jdk"         # JDK 17+
./mvnw -q dependency:build-classpath -Dmdep.outputFile=/tmp/cp.txt
java -cp "target/classes;$(cat /tmp/cp.txt)" com.focusroot.FocusRootApplication --spring.profiles.active=test
```
Profile `test` seed sẵn 6 loài cây. Swagger: `http://localhost:8080/api/swagger-ui.html`.

## 2. Chạy Frontend
```bash
cd focusroot-frontend
npm install
npx expo start --web              # mở http://localhost:8081
```
> Máy dev cần Node.js 18+ (LTS). Repo này **chưa được typecheck/chạy trên máy backend** (không có Node) — Member E chạy `npx tsc --noEmit` + `expo start` để xác nhận trước khi merge.

---

## 3. Kịch bản demo & minh chứng 2xx

| Bước | Thao tác | API gọi | Kỳ vọng |
|---|---|---|---|
| 1 | Mở app → tự về màn Đăng nhập (chưa có token) | — | Hiện `/login` |
| 2 | Bấm "Đăng ký", nhập username/email/password (≥6) | `POST /auth/register` | 201, quay lại Login |
| 3 | Đăng nhập bằng email + password | `POST /auth/login` | 200, lưu token, vào Trang chủ |
| 4 | Trang chủ hiển thị thống kê | `GET /stats/summary` + `GET /forest/species` | 200, số liệu = 0 ban đầu |
| 5 | Nhập số phút (≥5), bấm "Bắt đầu tập trung" | `POST /sessions/start` | 200, chuyển sang trạng thái đang chạy |
| 6a | Bấm "Bỏ cuộc" (demo nhanh) | `POST /sessions/{id}/end?giveUp=true` | 200, status FAILED → cây héo, vẫn vào Rừng |
| 6b | (hoặc) chờ đủ số phút rồi "Hoàn thành" | `POST /sessions/{id}/end?giveUp=false` | 200, SUCCESS → cây sống + coin |
| 7 | Mở tab "Rừng" | `GET /forest` | 200, thấy cây vừa trồng (sống/héo) |
| 8 | Về Trang chủ | `GET /stats/summary` | Số liệu cập nhật (tổng cây, coin, tỉ lệ) |

**Lưu ý luật nghiệp vụ:** phiên **SUCCESS** (cây sống + coin) yêu cầu `actualMinutes ≥ plannedDuration` → phải chờ đủ số phút thật. Kết thúc sớm/bỏ cuộc → **FAILED** + cây **héo** nhưng **vẫn** tạo bản ghi trong Rừng (đủ để demo vòng lặp).

---

## 4. Thay đổi FE trong nhánh này
- **`constants/tokenStorage.ts`** (mới): nguồn lưu token duy nhất — SecureStore (native) + localStorage (web).
- **`constants/axiosClient.ts`**: interceptor đọc token qua `tokenStorage`; refresh đọc đúng `res.data.data.accessToken` + lưu cả refresh token mới.
- **`app/(auth)/login.tsx`**: đọc `response.data.data`, lưu qua `tokenStorage` (bỏ SecureStore rời).
- **`app/(tabs)/index.tsx`**: bỏ mock + `global.is_login_success`; guard bằng token; Start/End phiên gọi API thật; hiển thị `/stats/summary` thật.
- **`app/(tabs)/forest.tsx`**: gọi đúng `/forest`, đọc `res.data.data`, map `treeSpecies.name/imageUrl`, `plantedAt`, `isAlive`; có empty-state.
- **Routing**: xoá bản trùng ở root (`app/login.tsx`, `app/register.tsx`, `app/detail.tsx`) trùng route với `(auth)/*` và `(tabs)/detail`; ẩn màn thừa (`detail/notifications/profile`) khỏi thanh tab.

## 5. Hạn chế đã biết (ngoài phạm vi demo này)
- **Tab "Nhóm"** (`group.tsx`) vẫn dùng dữ liệu mock (gọi `/group/members` không tồn tại → fallback). Nhóm/WebSocket là tính năng riêng, làm ở bước sau.
- Chưa có màn Thống kê riêng — số liệu hiển thị gộp ở Trang chủ.
- `package.json` name vẫn là `myapp` (nên đổi thành `focusroot`).
