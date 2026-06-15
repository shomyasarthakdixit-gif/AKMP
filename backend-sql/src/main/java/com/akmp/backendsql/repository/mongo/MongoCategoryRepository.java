package com.akmp.backendsql.repository.mongo;

import com.akmp.backendsql.models.mongo.MongoCategory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MongoCategoryRepository extends MongoRepository<MongoCategory, String> {
}
