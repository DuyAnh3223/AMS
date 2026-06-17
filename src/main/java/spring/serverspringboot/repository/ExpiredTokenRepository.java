package spring.serverspringboot.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import spring.serverspringboot.entity.ExpiredToken;

@Repository
public interface ExpiredTokenRepository extends JpaRepository<ExpiredToken,String> {
}
