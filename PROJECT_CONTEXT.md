# FocusRoot — Project Context (Bộ nhớ dự án)

> File này dùng để Claude Code đọc vào đầu mỗi session làm việc.
> Cập nhật cuối mỗi tuần bởi Member A (Nhóm trưởng).

---

## 🏗️ Tech Stack
- Backend: Spring Boot 3.2.x, Java 17, Maven
- ORM: Spring Data JPA + Hibernate
- Security: Spring Security + JWT (jjwt 0.12.5)
- Database: MySQL 8.0
- Realtime: Spring WebSocket + STOMP
- API Docs: Springdoc OpenAPI (Swagger UI)
- Frontend: React Native + Expo (TypeScript)
- CI/CD: GitHub Actions

## 👥 Thành viên
- Member A: Trần Mạnh Danh — GitHub: kekhongten1 — Lead, DB Architect, Backend Core
- Member B: Lê Viết Bắc — GitHub: bac1234556 — Backend Developer
- Member C: Phạm Quang Hùng — GitHub: PhamHung210 — Backend + Algorithm
- Member D: Lê Thành Chung — GitHub: chung-lol — Backend + Realtime
- Member E: Ngô Hữu Điệp — GitHub: ngohuudiep — Frontend + Tester

## 📁 Repositories
- Backend: https://github.com/forest-focus-team/focusroot-backend
- Mobile: (chưa tạo - Member E phụ trách)
- Docs: (chưa tạo)

## 🌿 Git Workflow
- main: production, chỉ merge từ develop qua PR
- develop: nhánh tích hợp chính
- feature/<member>-<task>: nhánh làm việc
- Commit format: <type>: <mô tả> #<issue_number>
- Chỉ Member A có quyền merge PR vào develop/main

## 📅 Timeline tổng quan
- Phase 1 — Forest 1.0: Tuần 1–4
- Phase 2 — Forest 2.0: Tuần 5–7

## ✅ TUẦN 1 (29/05 – 04/06/2026) — COMPLETED
### Đã hoàn thành (Member A):
- [x] Spring Boot skeleton: 52 files, 2267 dòng
- [x] 8 JPA Entities đầy đủ
- [x] 7 feature packages (auth/user/session/forest/group/prediction/websocket)
- [x] docker-compose.yml (MySQL 8 + phpMyAdmin port 8081)
- [x] GitHub Actions CI (backend-test.yml)
- [x] README.md + ARCHITECTURE.md + CONTRIBUTING.md
- [x] PR #6 merged vào develop
- [x] 5 Issues Tuần 1 tạo và assign
- [x] week-01-report.md

### Đang thực hiện (các member):
- [ ] Member B: Research Forest app (#2)
- [ ] Member C: Viết SRS (#3)
- [ ] Member D: Vẽ Use Case (#4)
- [ ] Member E: Setup Expo + Wireframe (#5)

### Cấu trúc DB hiện tại (8 entities):
User, TreeSpecies, FocusSession, MyForest, 
FocusGroup, GroupMember, GroupSession, UserActivityLog

### Lưu ý kỹ thuật:
- application.yml: ddl-auto=create (đổi thành validate sau khi có schema.sql)
- CI dùng H2 in-memory (application-test.yml)
- Branch protection: cả main lẫn develop cần PR

---

## ⏳ TUẦN 2 (05/06 – 11/06/2026) — UPCOMING
### Mục tiêu:
- Member A: Thiết kế ERD chuẩn 3NF + schema.sql + triggers.sql
- Member B: API Spec đầy đủ + Entity classes
- Member C: Class Diagram + Sequence Diagram
- Member D: Use Case Phase 2 + Activity Diagram
- Member E: Mockup UI Figma chuẩn mobile

---

## 🚫 TUẦN 3–7 — PLANNED
(Xem Master Plan đầy đủ tại docs/weekly-reports/)

---

## 📝 Hướng dẫn dùng file này
Khi bắt đầu session mới với Claude Code, gõ:
"Đọc file PROJECT_CONTEXT.md rồi tiếp tục dự án FocusRoot"
Claude Code sẽ load đủ context và làm việc tiếp mà không cần giải thích lại.
