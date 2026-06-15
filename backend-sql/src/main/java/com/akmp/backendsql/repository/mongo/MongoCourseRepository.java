package com.akmp.backendsql.repository.mongo;

import com.akmp.backendsql.models.mongo.MongoCourse;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MongoCourseRepository extends MongoRepository<MongoCourse, String> {
}
