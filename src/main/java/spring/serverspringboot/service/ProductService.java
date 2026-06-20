package spring.serverspringboot.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import spring.serverspringboot.dto.request.ProductRequest;
import spring.serverspringboot.dto.response.ProductResponse;
import spring.serverspringboot.entity.Product;
import spring.serverspringboot.mapper.ProductMapper;
import spring.serverspringboot.repository.ProductRepository;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductService {
    ProductRepository productRepository;
    ProductMapper productMapper;

    public ProductResponse create(ProductRequest productRequest) {
        Product product = productMapper.toProduct(productRequest);
        product = productRepository.save(product);
        return productMapper.toProductResponse(product);
    }

    public ProductResponse update(ProductRequest productRequest) {
        Product product = productMapper.toProduct(productRequest);
        product = productRepository.save(product);
        return productMapper.toProductResponse(product);
    }
}
