package com.sms.dto;

import java.util.Map;

public class DashboardStatsDto {
    private long totalStudents;
    private long totalMale;
    private long totalFemale;
    private Map<String, Long> departmentDistribution;
    private Map<Integer, Long> semesterDistribution;
    private double overallAttendancePercentage;
    private double averageGpa;

    public long getTotalStudents() { return totalStudents; }
    public void setTotalStudents(long totalStudents) { this.totalStudents = totalStudents; }

    public long getTotalMale() { return totalMale; }
    public void setTotalMale(long totalMale) { this.totalMale = totalMale; }

    public long getTotalFemale() { return totalFemale; }
    public void setTotalFemale(long totalFemale) { this.totalFemale = totalFemale; }

    public Map<String, Long> getDepartmentDistribution() { return departmentDistribution; }
    public void setDepartmentDistribution(Map<String, Long> departmentDistribution) { this.departmentDistribution = departmentDistribution; }

    public Map<Integer, Long> getSemesterDistribution() { return semesterDistribution; }
    public void setSemesterDistribution(Map<Integer, Long> semesterDistribution) { this.semesterDistribution = semesterDistribution; }

    public double getOverallAttendancePercentage() { return overallAttendancePercentage; }
    public void setOverallAttendancePercentage(double overallAttendancePercentage) { this.overallAttendancePercentage = overallAttendancePercentage; }

    public double getAverageGpa() { return averageGpa; }
    public void setAverageGpa(double averageGpa) { this.averageGpa = averageGpa; }
}
