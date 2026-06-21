package spring.serverspringboot.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import spring.serverspringboot.entity.Partner;

import java.util.List;
import java.util.Optional;

public interface PartnerRepository extends JpaRepository<Partner, Long> {
    Optional<Partner> findPartnerByIdAndIsSupplier(Long id, boolean isSupplier);
    Optional<Partner> findPartnerByIdAndIsCustomer(Long id, boolean isCustomer);

    Optional<Partner> findPartnerByPartnerCode(String partnerCode);
   List<Partner> findAllByIsCustomerTrue();
   List<Partner> findAllByIsSupplierTrue();
   
}
