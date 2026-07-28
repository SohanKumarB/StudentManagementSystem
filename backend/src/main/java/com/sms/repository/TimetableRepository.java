package com.sms.repository;

import com.sms.entity.Timetable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TimetableRepository extends JpaRepository<Timetable, Long> {
    List<Timetable> findByDepartmentAndSemesterAndSection(String department, Integer semester, String section);
    List<Timetable> findByDayOfWeek(String dayOfWeek);
}
