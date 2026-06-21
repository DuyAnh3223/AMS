package spring.serverspringboot.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "partners")
@SQLRestriction("is_active = true")
public class Partner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(nullable = false, unique = true, length = 50)
    String partnerCode;

    @Column(nullable = false, length = 200)
    String name;

    @Column(name = "is_customer", nullable = false)
    boolean isCustomer;

    @Column(name = "is_supplier", nullable = false)
    boolean isSupplier;

    String address;
    String taxCode;
    String phone;

    @Builder.Default
    @Column(name = "is_active", nullable = false, columnDefinition = "TINYINT")
    boolean isActive = true;


}
