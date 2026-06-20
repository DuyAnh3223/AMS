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
import spring.serverspringboot.dto.request.ProductRequest;
import spring.serverspringboot.dto.response.ProductResponse;
import spring.serverspringboot.entity.Product;
import spring.serverspringboot.service.ProductService;

import java.util.List;

@RestController
@RequestMapping("/products")
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductController {
    ProductService productService;

    @PostMapping
    ApiResponse<ProductResponse> create(@RequestBody ProductRequest request)
    {
        return ApiResponse.<ProductResponse>builder()
                .result(productService.create(request))
                .build();
    }

    @GetMapping
    ApiResponse<List<Product>> getProducts(){
        return ApiResponse.<List<Product>>builder()
                .result(productService.getProducts())
                .build();
    }

    @GetMapping("/{productId}")
    ApiResponse<ProductResponse> getProduct(@PathVariable Long productId) {
        return ApiResponse.<ProductResponse>builder()
                .result(productService.getProduct(productId))
                .build();
    }

    @PutMapping("/{productId}")
    ApiResponse<ProductResponse> update(@PathVariable Long productId, @RequestBody ProductRequest request) {
        return ApiResponse.<ProductResponse>builder()
                .result(productService.update(productId, request))
                .build();
    }

    @DeleteMapping("/{productId}")
    ApiResponse<String> delete(@PathVariable Long productId) {
        productService.delete(productId);
        return ApiResponse.<String>builder()
                .result("Product has been deleted")
                .build();
    }

    @GetMapping("/search")
    ApiResponse<Page<ProductResponse>> search(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ApiResponse.<Page<ProductResponse>>builder()
                .result(productService.search(keyword, page, size))
                .build();
    }

    @GetMapping("/units")
    ApiResponse<List<String>> getUnits() {
        return ApiResponse.<List<String>>builder()
                .result(productService.getUnits())
                .build();
    }
}

