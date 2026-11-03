package com.lifeshield.state;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;
public interface UserStateRepository extends JpaRepository<UserState,Long> {
 List<UserState> findAllByUserId(Long userId);
 Optional<UserState> findByUserIdAndKey(Long userId,String key);
 void deleteByUserIdAndKey(Long userId,String key);
}
