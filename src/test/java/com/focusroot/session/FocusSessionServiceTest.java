package com.focusroot.session;

import com.focusroot.dto.request.session.StartSessionRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FocusSessionServiceTest {

    @Mock
    private FocusSessionRepository sessionRepository;

    @InjectMocks
    private FocusSessionService sessionService;

    @Test
    @DisplayName("Ném lỗi IllegalStateException khi User bắt đầu phiên mới nhưng đã có phiên ACTIVE")
    void startSession_ShouldThrowException_WhenActiveSessionExists() {
        // 1. Arrange: Chuẩn bị dữ liệu giả lập
        Long userId = 1L;
        StartSessionRequest request = new StartSessionRequest();
        request.setTargetDuration(25); // Giả lập mục tiêu 25 phút

        // Giả lập Repository: Khi kiểm tra trạng thái ACTIVE của userId này, kết quả trả về là TRUE
        when(sessionRepository.existsByUserIdAndStatus(userId, SessionStatus.ACTIVE)).thenReturn(true);

        // 2. Act & Assert: Thực thi hàm và kiểm tra xem có ném đúng lỗi ra không
        IllegalStateException exception = assertThrows(IllegalStateException.class, () -> {
            sessionService.startSession(userId, request);
        });

        // Kiểm tra thông điệp báo lỗi có khớp 100% với trong Service không
        assertEquals("Bạn đang có một phiên tập trung đang chạy. Vui lòng hoàn thành hoặc hủy nó trước.", exception.getMessage());
        
        // Đảm bảo hệ thống chặn lại ngay và KHÔNG bao giờ gọi xuống hàm save dữ liệu vào DB
        verify(sessionRepository, never()).save(any(Session.class));
    }
}
