package spring.serverspringboot.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import spring.serverspringboot.dto.request.PartnerRequest;
import spring.serverspringboot.dto.response.PartnerResponse;
import spring.serverspringboot.entity.Partner;

@Mapper(componentModel = "spring")
public interface PartnerMapper {
    Partner toPartner(PartnerRequest request);

    PartnerResponse toPartnerResponse(Partner partner);

    void updatePartner(@MappingTarget Partner partner, PartnerRequest request);
}
