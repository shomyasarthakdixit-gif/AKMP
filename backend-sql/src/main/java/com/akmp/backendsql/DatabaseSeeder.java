package com.akmp.backendsql;

import com.akmp.backendsql.models.*;
import com.akmp.backendsql.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

// @Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private AuthorRepository authorRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // 0. Drop old documents table and fix users role constraint
        try {
            jdbcTemplate.execute("DROP TABLE IF EXISTS documents CASCADE");
            jdbcTemplate.execute("ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check");
            System.out.println("Dropped old documents table and fixed users role constraint.");
        } catch (Exception e) {
            System.out.println("Error dropping table or constraint: " + e.getMessage());
        }

        // 1. Wipe out existing courses to keep DB clean
        courseRepository.deleteAll();

        // 1.5 Wipe out all existing categories to remove the old 10
        categoryRepository.deleteAll();

        // Ensure we have at least one author
        List<Author> authors = authorRepository.findAll();
        Author defaultAuthor = null;
        if (authors.isEmpty()) {
            List<User> users = userRepository.findAll();
            if (!users.isEmpty()) {
                defaultAuthor = new Author();
                defaultAuthor.setUser(users.get(0));
                defaultAuthor.setBio("Instructor");
                defaultAuthor = authorRepository.save(defaultAuthor);
            }
        } else {
            defaultAuthor = authors.get(0);
        }

        // If no author can be found or created, we can't seed courses safely
        if (defaultAuthor == null) {
            System.out.println("No users found in database to assign as author. Seeding skipped.");
            return;
        }

        // 2. Ensure exactly 10 base Categories exist
        String[] categoryNames = {
            "Web Development", "Data Science", "Machine Learning", 
            "Mobile App Development", "Cloud Computing", "Cybersecurity", 
            "UI/UX Design", "Digital Marketing", "Business Analytics", "Personal Development"
        };

        List<Category> savedCategories = new ArrayList<>();
        
        for (String catName : categoryNames) {
            Category cat = categoryRepository.findByName(catName);
            if (cat == null) {
                cat = new Category();
                cat.setName(catName);
                cat.setDescription("Learn the best practices and skills in " + catName);
                cat = categoryRepository.save(cat);
            }
            savedCategories.add(cat);
        }

        // 3. Seed 30 specific Courses (3 per Category)
        if (courseRepository.count() == 0) {
            int courseIndex = 1;
            for (Category category : savedCategories) {
                for (int i = 1; i <= 3; i++) {
                    Course course = new Course();
                    course.setTitle("Complete " + category.getName() + " Bootcamp - Level " + i);
                    course.setDescription("Master " + category.getName() + " with this comprehensive bootcamp. Includes hands-on projects and assignments.");
                    course.setPrice(19.99 + (i * 10)); // e.g. 29.99, 39.99, 49.99
                    course.setDuration((10 + (i * 5)) + " Hours"); // e.g. 15 Hours, 20 Hours
                    course.setThumbnailUrl("https://placehold.co/600x400/2563eb/ffffff?text=" + category.getName().replace(" ", "+"));
                    course.setAuthor(defaultAuthor);
                    course.setCategory(category);
                    courseRepository.save(course);
                    courseIndex++;
                }
            }
            System.out.println("Database successfully seeded with 10 categories and 30 courses!");
        }
    }
}
