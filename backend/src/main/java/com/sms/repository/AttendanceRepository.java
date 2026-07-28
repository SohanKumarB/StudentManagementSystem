package com.sms.repository;

import com.sms.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    List<Attendance> findByStudentId(Long studentId);

    List<Attendance> findByStudentIdAndCourseCode(Long studentId, String courseCode);

    List<Attendance> findByDate(LocalDate date);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.studentId = :studentId")
    long countTotalByStudentId(@Param("studentId") Long studentId);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.studentId = :studentId AND a.status = 'PRESENT'")
    long countPresentByStudentId(@Param("studentId") Long studentId);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.status = 'PRESENT'")
    long countTotalPresent();

    @Query("SELECT COUNT(a) FROM Attendance a")
    long countTotalRecords();
}
