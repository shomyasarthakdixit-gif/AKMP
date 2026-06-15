package com.akmp.backendsql;

import com.akmp.backendsql.repository.CategoryRepository;
import com.akmp.backendsql.repository.CourseRepository;
import com.akmp.backendsql.repository.UserRepository;
import com.akmp.backendsql.repository.mongo.MongoCategoryRepository;
import com.akmp.backendsql.repository.mongo.MongoCourseRepository;
import com.akmp.backendsql.repository.mongo.MongoUserRepository;
import com.akmp.backendsql.services.MongoSyncService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class MongoSeeder {

    @Autowired
    private CategoryRepository pgCategoryRepo;
    
    @Autowired
    private CourseRepository pgCourseRepo;
    
    @Autowired
    private UserRepository pgUserRepo;

    @Autowired
    private MongoCategoryRepository mongoCategoryRepo;

    @Autowired
    private MongoCourseRepository mongoCourseRepo;

    @Autowired
    private MongoUserRepository mongoUserRepo;

    @Autowired
    private MongoSyncService mongoSyncService;

    @EventListener(ApplicationReadyEvent.class)
    public void seedDataToMongo() {
        System.out.println("====== Synchronizing PG Data to MongoDB ======");

        pgCategoryRepo.findAll().forEach(cat -> {
            if (!mongoCategoryRepo.existsById(String.valueOf(cat.getId()))) {
                mongoSyncService.syncCategory(cat);
            }
        });

        pgUserRepo.findAll().forEach(user -> {
            if (!mongoUserRepo.existsById(String.valueOf(user.getId()))) {
                mongoSyncService.syncUser(user);
            }
        });

        pgCourseRepo.findAll().forEach(course -> {
            if (!mongoCourseRepo.existsById(String.valueOf(course.getId()))) {
                mongoSyncService.syncCourse(course);
            }
        });

        System.out.println("====== MongoDB Synchronization Complete ======");
    }
}
