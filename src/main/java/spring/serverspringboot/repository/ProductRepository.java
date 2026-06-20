package spring.serverspringboot.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import spring.serverspringboot.entity.Product;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product,Long> {
    Page<Product> findByNameContainingIgnoreCaseOrSkuCodeContainingIgnoreCase(String name, String skuCode, Pageable pageable);

    // Lấy danh sách ĐVT không trùng
    @Query(value = "SELECT DISTINCT TRIM(unit) FROM products WHERE unit IS NOT NULL AND TRIM(unit) <> '' AND is_active = true", nativeQuery = true)
    List<String> findDistinctUnits();
}

