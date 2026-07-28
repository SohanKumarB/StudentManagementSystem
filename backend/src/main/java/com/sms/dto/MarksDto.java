package com.sms.dto;

public class MarksDto {
    private Long id;
    private Long studentId;
    private String studentName;
    private String usnRollNumber;
    private String courseCode;
    private String courseTitle;
    private Double internalMarks;
    private Double assignmentMarks;
    private Double labMarks;
    private Double finalExamMarks;
    private Double totalMarks;
    private String grade;
    private Double gpa;

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
