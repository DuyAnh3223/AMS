package spring.serverspringboot.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PartnerRequest {
    String partnerCode;
    String name;
    boolean isCustomer;
    boolean isSupplier;
    String address;
    String taxCode;
    String phone;
}
