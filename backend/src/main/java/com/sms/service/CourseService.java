package com.sms.service;

import com.sms.entity.Course;
import com.sms.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Course createCourse(Course course) {
        return courseRepository.save(course);
    }

    public Course updateCourse(Long id, Course courseDetails) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
        course.setCode(courseDetails.getCode());
        course.setTitle(courseDetails.getTitle());
        course.setCredits(courseDetails.getCredits());
        course.setDepartmentCode(courseDetails.getDepartmentCode());
        course.setSemester(courseDetails.getSemester());
        return courseRepository.save(course);
    }

    public void deleteCourse(Long id) {
        courseRepository.deleteById(id);
    }
}
