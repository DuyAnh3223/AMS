package spring.serverspringboot.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import spring.serverspringboot.dto.request.RoleRequest;
import spring.serverspringboot.dto.request.UserCreateRequest;
import spring.serverspringboot.dto.response.PermissionResponse;
import spring.serverspringboot.dto.response.RoleResponse;
import spring.serverspringboot.dto.response.UserResponse;
import spring.serverspringboot.entity.Role;
import spring.serverspringboot.entity.User;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    @Mapping(target ="permissions" ,ignore = true)
    Role toRole(RoleRequest request);

    RoleResponse toRoleResponse(Role role);
}
