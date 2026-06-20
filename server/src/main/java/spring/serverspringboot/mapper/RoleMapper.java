package spring.serverspringboot.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import spring.serverspringboot.dto.request.RoleRequest;
import spring.serverspringboot.dto.response.RoleResponse;
import spring.serverspringboot.entity.Role;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    @Mapping(target ="permissions" ,ignore = true)
    Role toRole(RoleRequest request);

    RoleResponse toRoleResponse(Role role);

}
