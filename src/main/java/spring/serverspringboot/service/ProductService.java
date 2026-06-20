package spring.serverspringboot.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import spring.serverspringboot.dto.request.ProductRequest;
import spring.serverspringboot.dto.response.ProductResponse;
import spring.serverspringboot.entity.Product;
import spring.serverspringboot.exception.AppException;
import spring.serverspringboot.exception.ErrorCode;
import spring.serverspringboot.mapper.ProductMapper;
import spring.serverspringboot.repository.ProductRepository;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductService {
    ProductRepository productRepository;
    ProductMapper productMapper;

    public ProductResponse create(ProductRequest productRequest) {
        Product product = productMapper.toProduct(productRequest);
        product.setActive(true);
        if(product.getUnit() != null)
        {
            product.setUnit(productRequest.getUnit().trim());
        }
        product = productRepository.save(product);
        return productMapper.toProductResponse(product);
    }

    private Product findProductById(Long productId){
        return productRepository.findById(productId).orElseThrow(()-> new AppException(ErrorCode.PRODUCT_NOT_EXISTED));
    }

    public ProductResponse getProduct(Long productId){
        return productMapper.toProductResponse(findProductById(productId));
    }

    public List<Product> getProducts(){
        return productRepository.findAll();
    }

    public ProductResponse update(Long productId, ProductRequest productRequest) {
        Product product = findProductById(productId);

        productMapper.updateProduct(product, productRequest);

        if(product.getUnit() != null)
        {
            product.setUnit(productRequest.getUnit().trim());
        }

        product = productRepository.save(product);
        return productMapper.toProductResponse(product);
    }

    public Page<ProductResponse> search(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.findByNameContainingIgnoreCaseOrSkuCodeContainingIgnoreCase(keyword, keyword, pageable)
                .map(productMapper::toProductResponse);
    }

    public List<String> getUnits() {
        return productRepository.findDistinctUnits();
    }

    public void delete(Long productId){
         Product product = findProductById(productId);
         product.setActive(false);
         productRepository.save(product);
    }
}

