package spring.serverspringboot.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import spring.serverspringboot.entity.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, String> {
}
