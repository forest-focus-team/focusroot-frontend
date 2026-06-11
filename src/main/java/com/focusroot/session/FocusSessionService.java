package com.focusroot.session;

import com.focusroot.dto.request.session.StartSessionRequest;
import com.focusroot.dto.request.session.EndSessionRequest;
import com.focusroot.dto.response.session.SessionResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.time.Duration;

@Service
@RequiredArgsConstructor
public class FocusSessionService {

    private final FocusSessionRepository sessionRepository;

    @Transactional
    public SessionResponse startSession(Long userId, StartSessionRequest request) {
        if (sessionRepository.existsByUserIdAndStatus(userId, SessionStatus.ACTIVE)) {
            throw new IllegalStateException("Bạn đang có phiên tập trung đang chạy!");
        }

        Session session = new Session();
        session.setUserId(userId);
        session.setTargetDuration(request.getTargetDuration());
        session.setStartTime(LocalDateTime.now());
        session.setStatus(SessionStatus.ACTIVE);
        
        Session saved = sessionRepository.save(session);
        return mapToResponse(saved);
    }

    private SessionResponse mapToResponse(Session s) {
        return new SessionResponse(s.getId(), s.getTargetDuration(), s.getActualDuration(), 
                                   s.getStartTime(), s.getEndTime(), s.getStatus().name());
    }
}
