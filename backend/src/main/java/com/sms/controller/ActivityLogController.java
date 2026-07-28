package com.sms.controller;

import com.sms.entity.ActivityLog;
import com.sms.service.ActivityLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/activity-logs")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ActivityLogController {

    @Autowired
    private ActivityLogService activityLogService;

    @GetMapping
    public ResponseEntity<List<ActivityLog>> getRecentLogs() {
        return ResponseEntity.ok(activityLogService.getRecentLogs());
    }
}
