package com.akmp.backendsql.services;

import com.akmp.backendsql.models.Category;
import com.akmp.backendsql.models.Course;
import com.akmp.backendsql.models.User;
import com.akmp.backendsql.models.mongo.MongoCategory;
import com.akmp.backendsql.models.mongo.MongoCourse;
import com.akmp.backendsql.models.mongo.MongoUser;
import com.akmp.backendsql.repository.mongo.MongoCategoryRepository;
import com.akmp.backendsql.repository.mongo.MongoCourseRepository;
import com.akmp.backendsql.repository.mongo.MongoUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MongoSyncService {

    @Autowired
    private MongoCategoryRepository categoryRepo;

    @Autowired
    private MongoCourseRepository courseRepo;

    @Autowired
    private MongoUserRepository userRepo;

    // --- Category Sync ---
    public void syncCategory(Category category) {
        MongoCategory mc = new MongoCategory(
            String.valueOf(category.getId()),
            category.getName(),
            category.getDescription()
        );
        categoryRepo.save(mc);
    }

    public void deleteCategory(Long id) {
        categoryRepo.deleteById(String.valueOf(id));
    }

    // --- Course Sync ---
    public void syncCourse(Course course) {
        MongoCourse mc = new MongoCourse();
        mc.setId(String.valueOf(course.getId()));
        mc.setTitle(course.getTitle());
        mc.setDescription(course.getDescription());
        mc.setPrice(course.getPrice());
        mc.setDuration(course.getDuration());
        mc.setThumbnailUrl(course.getThumbnailUrl());
        mc.setCreatedAt(course.getCreatedAt());

        if (course.getCategory() != null) {
            mc.setCategoryId(String.valueOf(course.getCategory().getId()));
            mc.setCategoryName(course.getCategory().getName());
        }
        
        if (course.getAuthor() != null) {
            mc.setAuthorId(String.valueOf(course.getAuthor().getId()));
            mc.setAuthorUsername(course.getAuthor().getUser() != null ? course.getAuthor().getUser().getUsername() : "Instructor");
        }

        courseRepo.save(mc);
    }

    public void deleteCourse(Long id) {
        courseRepo.deleteById(String.valueOf(id));
    }

    // --- User Sync ---
    public void syncUser(User user) {
        String roleStr = user.getRole() != null ? user.getRole().name() : "ROLE_USER";

        MongoUser mu = new MongoUser(
            String.valueOf(user.getId()),
            user.getUsername(),
            user.getEmail(),
            roleStr,
            user.getPassword()
        );
        userRepo.save(mu);
    }

    public void deleteUser(Long id) {
        userRepo.deleteById(String.valueOf(id));
    }
}
