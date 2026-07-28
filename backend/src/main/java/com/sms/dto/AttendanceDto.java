package com.sms.dto;

import java.time.LocalDate;

public class AttendanceDto {
    private Long id;
    private Long studentId;
    private String studentName;
    private String usnRollNumber;
    private String courseCode;
    private LocalDate date;
    private String status;
    private String remarks;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getUsnRollNumber() { return usnRollNumber; }
    public void setUsnRollNumber(String usnRollNumber) { this.usnRollNumber = usnRollNumber; }

    public String getCourseCode() { return courseCode; }
    public void setCourseCode(String courseCode) { this.courseCode = courseCode; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
