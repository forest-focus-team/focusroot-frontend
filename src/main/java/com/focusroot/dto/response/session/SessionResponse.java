package com.focusroot.dto.response.session;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SessionResponse {
    private Long id;
    private Integer targetDuration;
    private Long actualDuration;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String status;
}
