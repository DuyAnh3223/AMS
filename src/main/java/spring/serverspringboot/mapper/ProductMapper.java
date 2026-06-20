package spring.serverspringboot.mapper;

import org.mapstruct.Mapper;
import spring.serverspringboot.dto.request.ProductRequest;
import spring.serverspringboot.dto.response.ProductResponse;
import spring.serverspringboot.entity.Product;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    Product toProduct(ProductRequest request);

    ProductResponse toProductResponse(Product product);

}
