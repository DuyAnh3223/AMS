package spring.serverspringboot.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import spring.serverspringboot.entity.Partner;

public interface PartnerRepository extends JpaRepository<Partner, Long> {
    boolean existsByPartnerCode(String partnerCode);
    boolean existsByPartnerCodeAndIdNot(String partnerCode, Long id);
    java.util.List<Partner> findByPartnerType(String partnerType);

    @Query(value = "SELECT * FROM partners p WHERE p.partner_type = :partnerType AND p.is_active = 1 " +
                   "AND (:keyword = '' OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(p.partner_code) LIKE LOWER(CONCAT('%', :keyword, '%')))",
           countQuery = "SELECT COUNT(*) FROM partners p WHERE p.partner_type = :partnerType AND p.is_active = 1 " +
                        "AND (:keyword = '' OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(p.partner_code) LIKE LOWER(CONCAT('%', :keyword, '%')))",
           nativeQuery = true)
    Page<Partner> search(@Param("partnerType") String partnerType, @Param("keyword") String keyword, Pageable pageable);
}
