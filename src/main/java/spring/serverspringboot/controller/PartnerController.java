package spring.serverspringboot.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import spring.serverspringboot.dto.ApiResponse;
import spring.serverspringboot.dto.request.PartnerRequest;
import spring.serverspringboot.dto.response.PartnerResponse;
import spring.serverspringboot.service.PartnerService;

import java.util.List;

@RestController
@RequestMapping("/partners")
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PartnerController {
    PartnerService partnerService;

    @PostMapping
    ApiResponse<PartnerResponse> create(@RequestBody PartnerRequest request) {
        return ApiResponse.<PartnerResponse>builder()
                .result(partnerService.create(request))
                .build();
    }

    @GetMapping("/{partnerId}")
    ApiResponse<PartnerResponse> getPartner(@PathVariable Long partnerId) {
        return ApiResponse.<PartnerResponse>builder()
                .result(partnerService.getPartner(partnerId))
                .build();
    }

    @PutMapping("/{partnerId}")
    ApiResponse<PartnerResponse> update(@PathVariable Long partnerId, @RequestBody PartnerRequest request) {
        return ApiResponse.<PartnerResponse>builder()
                .result(partnerService.update(partnerId, request))
                .build();
    }

    @DeleteMapping("/{partnerId}")
    ApiResponse<String> delete(@PathVariable Long partnerId) {
        partnerService.delete(partnerId);
        return ApiResponse.<String>builder()
                .result("Partner has been deleted")
                .build();
    }

    @GetMapping
    ApiResponse<Page<PartnerResponse>> search(
            @RequestParam String partnerType,
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ApiResponse.<Page<PartnerResponse>>builder()
                .result(partnerService.search(partnerType, keyword, page, size))
                .build();
    }

    @GetMapping("/all")
    ApiResponse<List<PartnerResponse>> getPartners(@RequestParam(required = false) String partnerType) {
        return ApiResponse.<List<PartnerResponse>>builder()
                .result(partnerService.getPartners(partnerType))
                .build();
    }
}
