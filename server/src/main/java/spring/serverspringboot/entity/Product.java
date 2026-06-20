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
@Table(name = "products")
@SQLRestriction("is_active = true")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    String skuCode;
    String name;
    String unit; // ĐVT
    String properties; // Tính chất

    @Builder.Default
    @Column(name = "is_active", nullable = false, columnDefinition = "TINYINT")
    boolean isActive = true;


}
