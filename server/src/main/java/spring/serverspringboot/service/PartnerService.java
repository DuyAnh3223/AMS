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


// Customer

    public PartnerResponse createCustomer(PartnerRequest request) {
        Partner partner = partnerRepository.findPartnerByPartnerCode(request.getPartnerCode()).orElse(null);
        if (partner != null) {
            if (partner.isCustomer()) {
                throw new AppException(ErrorCode.PARTNER_EXISTED);
            } else {
                partner.setCustomer(true);
                partner.setActive(true);
                partnerRepository.save(partner);
            }
        } else {
            partner = partnerMapper.toPartner(request);
            partner.setCustomer(true);
            partner.setActive(true);
            partnerRepository.save(partner);
        }
        return partnerMapper.toPartnerResponse(partner);
    }
    public PartnerResponse getCustomer(Long partnerId){
        Partner partner = partnerRepository.findPartnerByIdAndIsCustomer(partnerId, true)
                .orElseThrow(() -> new AppException(ErrorCode.PARTNER_NOT_EXISTED));
        return partnerMapper.toPartnerResponse(partner);
    }
    public List<Partner> getCustomers(){
        return partnerRepository.findAllByIsCustomerTrue();
    }

    public PartnerResponse updateCustomer(Long partnerId, PartnerRequest request) {
        Partner partner = partnerRepository.findPartnerByIdAndIsCustomer(partnerId, true)
                .orElseThrow(() -> new AppException(ErrorCode.PARTNER_NOT_EXISTED));
        partnerMapper.updatePartner(partner, request);
        partner.setCustomer(true);
        partner = partnerRepository.save(partner);
        return partnerMapper.toPartnerResponse(partner);
    }

    public void deleteCustomer(Long partnerId) {
        Partner partner = partnerRepository.findPartnerByIdAndIsCustomer(partnerId, true)
                .orElseThrow(() -> new AppException(ErrorCode.PARTNER_NOT_EXISTED));
        partner.setCustomer(false);

        if (!partner.isSupplier()) {
            partner.setActive(false);
        }

        partnerRepository.save(partner);
    }

// Supplier

    public PartnerResponse createSupplier(PartnerRequest request) {
        Partner partner = partnerRepository.findPartnerByPartnerCode(request.getPartnerCode()).orElse(null);
        if (partner != null) {
            if (partner.isSupplier()) {
                throw new AppException(ErrorCode.PARTNER_EXISTED);
            } else {
                partner.setSupplier(true);
                partner.setActive(true);
                partnerRepository.save(partner);
            }
        } else {
            partner = partnerMapper.toPartner(request);
            partner.setSupplier(true);
            partner.setActive(true);
            partnerRepository.save(partner);
        }
        return partnerMapper.toPartnerResponse(partner);
    }
    public PartnerResponse getSupplier(Long partnerId){
        Partner partner = partnerRepository.findPartnerByIdAndIsSupplier(partnerId, true)
                .orElseThrow(() -> new AppException(ErrorCode.PARTNER_NOT_EXISTED));
        return partnerMapper.toPartnerResponse(partner);
    }
    public List<Partner> getSuppliers(){
        return partnerRepository.findAllByIsSupplierTrue();
    }

    public PartnerResponse updateSupplier(Long partnerId, PartnerRequest request) {
        Partner partner = partnerRepository.findPartnerByIdAndIsSupplier(partnerId, true)
                .orElseThrow(() -> new AppException(ErrorCode.PARTNER_NOT_EXISTED));
        partnerMapper.updatePartner(partner, request);
        partner.setSupplier(true);
        partner = partnerRepository.save(partner);
        return partnerMapper.toPartnerResponse(partner);
    }

    public void deleteSupplier(Long partnerId) {
        Partner partner = partnerRepository.findPartnerByIdAndIsSupplier(partnerId, true)
                .orElseThrow(() -> new AppException(ErrorCode.PARTNER_NOT_EXISTED));
         partner.setSupplier(false);

        if (!partner.isCustomer()) {
            partner.setActive(false);
        }
        partnerRepository.save(partner);
    }
}
