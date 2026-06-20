package spring.serverspringboot.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import spring.serverspringboot.dto.request.ProductRequest;
import spring.serverspringboot.dto.response.ProductResponse;
import spring.serverspringboot.entity.Product;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    Product toProduct(ProductRequest request);

    ProductResponse toProductResponse(Product product);

    void updateProduct(@MappingTarget Product product, ProductRequest request);
}
