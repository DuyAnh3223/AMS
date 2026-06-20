package spring.serverspringboot.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import spring.serverspringboot.entity.Product;

public interface ProductRepository extends JpaRepository<Product,Long> {
}
