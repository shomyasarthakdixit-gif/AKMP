package com.akmp.backendsql.controllers;

import com.akmp.backendsql.models.Course;
import com.akmp.backendsql.models.Author;
import com.akmp.backendsql.models.User;
import com.akmp.backendsql.repository.CourseRepository;
import com.akmp.backendsql.repository.AuthorRepository;
import com.akmp.backendsql.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @Autowired
    CourseRepository courseRepository;

    @Autowired
    AuthorRepository authorRepository;

    @Autowired
    UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MEMBER') or hasRole('USER')")
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    @GetMapping("/category/{categoryId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MEMBER') or hasRole('USER')")
    public List<Course> getCoursesByCategory(@PathVariable Long categoryId) {
        return courseRepository.findByCategoryId(categoryId);
    }

    private Author resolveAuthor(Long userId) {
        if (userId == null) return null;
        return authorRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
            Author newAuthor = new Author();
            newAuthor.setUser(user);
            newAuthor.setBio("Instructor");
            return authorRepository.save(newAuthor);
        });
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Course createCourse(@RequestBody Course course) {
        if (course.getAuthor() != null && course.getAuthor().getId() != null) {
            course.setAuthor(resolveAuthor(course.getAuthor().getId()));
        }
        return courseRepository.save(course);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Course> updateCourse(@PathVariable Long id, @RequestBody Course courseDetails) {
        return courseRepository.findById(id).map(course -> {
            course.setTitle(courseDetails.getTitle());
            course.setDescription(courseDetails.getDescription());
            course.setPrice(courseDetails.getPrice());
            course.setDuration(courseDetails.getDuration());
            course.setThumbnailUrl(courseDetails.getThumbnailUrl());
            course.setCategory(courseDetails.getCategory());
            if (courseDetails.getAuthor() != null && courseDetails.getAuthor().getId() != null) {
                course.setAuthor(resolveAuthor(courseDetails.getAuthor().getId()));
            }
            return ResponseEntity.ok(courseRepository.save(course));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
        return courseRepository.findById(id).map(course -> {
            courseRepository.delete(course);
            return ResponseEntity.ok().build();
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
