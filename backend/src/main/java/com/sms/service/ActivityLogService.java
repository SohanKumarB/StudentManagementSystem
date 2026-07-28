package com.sms.service;

import com.sms.entity.ActivityLog;
import com.sms.repository.ActivityLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ActivityLogService {

    @Autowired
    private ActivityLogRepository activityLogRepository;

    public void logActivity(String username, String action, String details) {
        ActivityLog log = new ActivityLog(username, action, details);
        activityLogRepository.save(log);
    }

    public List<ActivityLog> getRecentLogs() {
        return activityLogRepository.findTop20ByOrderByTimestampDesc();
    }
}
