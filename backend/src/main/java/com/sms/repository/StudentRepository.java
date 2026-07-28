package com.sms.repository;

import com.sms.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByUsnRollNumber(String usnRollNumber);

    Optional<Student> findByEmail(String email);

    Optional<Student> findByUserId(Long userId);

    @Query("SELECT s FROM Student s WHERE " +
           "(:query IS NULL OR :query = '' OR LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(s.usnRollNumber) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(s.email) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:dept IS NULL OR :dept = '' OR s.department = :dept) AND " +
           "(:sem IS NULL OR s.semester = :sem) AND " +
           "(:sec IS NULL OR :sec = '' OR s.section = :sec)")
    List<Student> searchStudents(@Param("query") String query,
                                 @Param("dept") String department,
                                 @Param("sem") Integer semester,
                                 @Param("sec") String section);

    long countByGender(String gender);

    long countByDepartment(String department);

    long countBySemester(Integer semester);

    @Query("SELECT s.department, COUNT(s) FROM Student s GROUP BY s.department")
    List<Object[]> countStudentsByDepartment();

    @Query("SELECT s.semester, COUNT(s) FROM Student s GROUP BY s.semester")
    List<Object[]> countStudentsBySemester();
}
