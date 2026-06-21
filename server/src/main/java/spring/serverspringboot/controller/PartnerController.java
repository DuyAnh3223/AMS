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
import spring.serverspringboot.entity.Partner;
import spring.serverspringboot.service.PartnerService;

import java.util.List;

@RestController
@RequestMapping("/partners")
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PartnerController {
    PartnerService partnerService;

// Customer 
    @PostMapping("/customers")
    ApiResponse<PartnerResponse> createCustomer(@RequestBody PartnerRequest request) {
        return ApiResponse.<PartnerResponse>builder()
                .result(partnerService.createCustomer(request))
                .build();
    }

    @GetMapping("/customers/{partnerId}")
    ApiResponse<PartnerResponse> getCustomer(@PathVariable Long partnerId) {
        return ApiResponse.<PartnerResponse>builder()
                .result(partnerService.getCustomer(partnerId))
                .build();
    }

    @GetMapping("/customers")
    ApiResponse<List<Partner>> getCustomers(){
        return ApiResponse.<List<Partner>>builder().result(partnerService.getCustomers()).build();
    }

    @PutMapping("/customers/{partnerId}")
    ApiResponse<PartnerResponse> updateCustomer(@PathVariable Long partnerId, @RequestBody PartnerRequest request) {
        return ApiResponse.<PartnerResponse>builder()
                .result(partnerService.updateCustomer(partnerId, request))
                .build();
    }

    @DeleteMapping("/customers/{partnerId}")
    ApiResponse<String> deleteCustomer(@PathVariable Long partnerId) {
        partnerService.deleteCustomer(partnerId);
        return ApiResponse.<String>builder()
                .result("Customer has been deleted")
                .build();
    }

    // Supplier
    @PostMapping("/suppliers")
    ApiResponse<PartnerResponse> createSupplier(@RequestBody PartnerRequest request) {
        return ApiResponse.<PartnerResponse>builder()
                .result(partnerService.createSupplier(request))
                .build();
    }

    @GetMapping("/suppliers/{partnerId}")
    ApiResponse<PartnerResponse> getSupplier(@PathVariable Long partnerId) {
        return ApiResponse.<PartnerResponse>builder()
                .result(partnerService.getSupplier(partnerId))
                .build();
    }

    @GetMapping("/suppliers")
    ApiResponse<List<Partner>> getSupplier(){
        return ApiResponse.<List<Partner>>builder().result(partnerService.getSuppliers()).build();
    }

    @PutMapping("/suppliers/{partnerId}")
    ApiResponse<PartnerResponse> updateSupplier(@PathVariable Long partnerId, @RequestBody PartnerRequest request) {
        return ApiResponse.<PartnerResponse>builder()
                .result(partnerService.updateSupplier(partnerId, request))
                .build();
    }

    @DeleteMapping("/suppliers/{partnerId}")
    ApiResponse<String> deleteSupplier(@PathVariable Long partnerId) {
        partnerService.deleteSupplier(partnerId);
        return ApiResponse.<String>builder()
                .result("Supplier has been deleted")
                .build();
    }

    
}
