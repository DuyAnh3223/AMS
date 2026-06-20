package spring.serverspringboot.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PartnerResponse {
    Long id;
    String partnerCode;
    String name;
    String partnerType;
    String address;
    String taxCode;
    String phone;
}
