package spring.serverspringboot.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import spring.serverspringboot.dto.request.PartnerRequest;
import spring.serverspringboot.dto.response.PartnerResponse;
import spring.serverspringboot.entity.Partner;
import spring.serverspringboot.exception.AppException;
import spring.serverspringboot.exception.ErrorCode;
import spring.serverspringboot.mapper.PartnerMapper;
import spring.serverspringboot.repository.PartnerRepository;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PartnerService {
    PartnerRepository partnerRepository;
    PartnerMapper partnerMapper;

    public PartnerResponse create(PartnerRequest request) {
        if (partnerRepository.existsByPartnerCode(request.getPartnerCode())) {
            throw new AppException(ErrorCode.PARTNER_CODE_EXISTED);
        }

        Partner partner = partnerMapper.toPartner(request);
        partner.setActive(true);

        partner = partnerRepository.save(partner);
        return partnerMapper.toPartnerResponse(partner);
    }

    private Partner findPartnerById(Long partnerId) {
        return partnerRepository.findById(partnerId)
                .orElseThrow(() -> new AppException(ErrorCode.PARTNER_NOT_EXISTED));
    }

    public PartnerResponse getPartner(Long partnerId) {
        return partnerMapper.toPartnerResponse(findPartnerById(partnerId));
    }

    public PartnerResponse update(Long partnerId, PartnerRequest request) {
        Partner partner = findPartnerById(partnerId);

        if (partnerRepository.existsByPartnerCodeAndIdNot(request.getPartnerCode(), partnerId)) {
            throw new AppException(ErrorCode.PARTNER_CODE_EXISTED);
        }

        partnerMapper.updatePartner(partner, request);

        partner = partnerRepository.save(partner);
        return partnerMapper.toPartnerResponse(partner);
    }

    public void delete(Long partnerId) {
        Partner partner = findPartnerById(partnerId);
        partner.setActive(false);
        partnerRepository.save(partner);
    }

    public List<PartnerResponse> getPartners(String partnerType) {
        List<Partner> partners;
        if (partnerType == null || partnerType.isEmpty()) {
            partners = partnerRepository.findAll();
        } else {
            partners = partnerRepository.findByPartnerType(partnerType);
        }
        return partners.stream()
                .map(partnerMapper::toPartnerResponse)
                .toList();
    }

    public Page<PartnerResponse> search(String partnerType, String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return partnerRepository.search(partnerType, keyword, pageable)
                .map(partnerMapper::toPartnerResponse);
    }
}
