package com.focusroot.session;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface FocusSessionRepository extends JpaRepository<Session, Long> {
    // Kiểm tra xem user có đang chạy phiên ACTIVE nào không
    boolean existsByUserIdAndStatus(Long userId, SessionStatus status);

    // Tìm phiên ACTIVE hiện tại của user để kết thúc
    Optional<Session> findByUserIdAndStatus(Long userId, SessionStatus status);

    // Lấy lịch sử phiên tập trung của user
    Page<Session> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
}
