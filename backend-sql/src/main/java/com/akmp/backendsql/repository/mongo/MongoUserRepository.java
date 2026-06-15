package com.akmp.backendsql.repository.mongo;

import com.akmp.backendsql.models.mongo.MongoUser;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MongoUserRepository extends MongoRepository<MongoUser, String> {
}
