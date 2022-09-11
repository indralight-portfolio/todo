package net.indralight.todo.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import net.indralight.todo.model.UserEntity;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    UserEntity findByEmailAndProvider(String email, String provider);

    Boolean existsByEmailAndProvider(String email, String provider);

    UserEntity findByProviderAndSnsId(String provider, String snsId);
}
