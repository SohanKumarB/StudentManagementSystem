package com.sms.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "marks")
public class Marks {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long studentId;

    @Column(nullable = false, length = 30)
    private String courseCode;

    private String courseTitle;

    private Double internalMarks = 0.0;     // Out of 20
    private Double assignmentMarks = 0.0;   // Out of 10
    private Double labMarks = 0.0;          // Out of 20
    private Double finalExamMarks = 0.0;     // Out of 50

    private Double totalMarks = 0.0;        // Out of 100
    private String grade;
    private Double gpa;

    public Marks() {}

    public void calculateTotalAndGrade() {
        this.totalMarks = (internalMarks != null ? internalMarks : 0) +
                          (assignmentMarks != null ? assignmentMarks : 0) +
                          (labMarks != null ? labMarks : 0) +
                          (finalExamMarks != null ? finalExamMarks : 0);

        if (totalMarks >= 90) {
            this.grade = "A+";
            this.gpa = 4.0;
        } else if (totalMarks >= 80) {
            this.grade = "A";
            this.gpa = 3.7;
        } else if (totalMarks >= 70) {
            this.grade = "B";
            this.gpa = 3.0;
        } else if (totalMarks >= 60) {
            this.grade = "C";
            this.gpa = 2.5;
        } else if (totalMarks >= 50) {
            this.grade = "D";
            this.gpa = 2.0;
        } else {
            this.grade = "F";
            this.gpa = 0.0;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getCourseCode() { return courseCode; }
    public void setCourseCode(String courseCode) { this.courseCode = courseCode; }

    public String getCourseTitle() { return courseTitle; }
    public void setCourseTitle(String courseTitle) { this.courseTitle = courseTitle; }

    public Double getInternalMarks() { return internalMarks; }
    public void setInternalMarks(Double internalMarks) { this.internalMarks = internalMarks; }

    public Double getAssignmentMarks() { return assignmentMarks; }
    public void setAssignmentMarks(Double assignmentMarks) { this.assignmentMarks = assignmentMarks; }

    public Double getLabMarks() { return labMarks; }
    public void setLabMarks(Double labMarks) { this.labMarks = labMarks; }

    public Double getFinalExamMarks() { return finalExamMarks; }
    public void setFinalExamMarks(Double finalExamMarks) { this.finalExamMarks = finalExamMarks; }

    public Double getTotalMarks() { return totalMarks; }
    public void setTotalMarks(Double totalMarks) { this.totalMarks = totalMarks; }

    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }

    public Double getGpa() { return gpa; }
    public void setGpa(Double gpa) { this.gpa = gpa; }
}
