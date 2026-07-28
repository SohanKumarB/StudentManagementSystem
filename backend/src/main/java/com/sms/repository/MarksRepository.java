package com.sms.repository;

import com.sms.entity.Marks;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MarksRepository extends JpaRepository<Marks, Long> {

    List<Marks> findByStudentId(Long studentId);

    Optional<Marks> findByStudentIdAndCourseCode(Long studentId, String courseCode);

    @Query("SELECT AVG(m.gpa) FROM Marks m")
    Double findAverageGpa();

    @Query("SELECT AVG(m.gpa) FROM Marks m WHERE m.studentId = :studentId")
    Double findAverageGpaByStudentId(@Param("studentId") Long studentId);
}
