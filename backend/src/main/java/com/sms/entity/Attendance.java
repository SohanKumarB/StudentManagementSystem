package com.sms.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "attendance")
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long studentId;

    private String courseCode;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false, length = 15)
    private String status; // PRESENT, ABSENT, LATE

    private String remarks;

    public Attendance() {}

    public Attendance(Long studentId, String courseCode, LocalDate date, String status, String remarks) {
        this.studentId = studentId;
        this.courseCode = courseCode;
        this.date = date;
        this.status = status;
        this.remarks = remarks;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getCourseCode() { return courseCode; }
    public void setCourseCode(String courseCode) { this.courseCode = courseCode; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
