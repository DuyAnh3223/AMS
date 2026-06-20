package spring.serverspringboot.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import spring.serverspringboot.dto.request.PermissionRequest;
import spring.serverspringboot.dto.request.RoleRequest;
import spring.serverspringboot.dto.response.PermissionResponse;
import spring.serverspringboot.dto.response.RoleResponse;
import spring.serverspringboot.entity.Permission;
import spring.serverspringboot.entity.Role;

@Mapper(componentModel = "spring")
public interface PermissionMapper {

    Permission toPermission(PermissionRequest request);

    PermissionResponse toPermissionResponse(Permission permission);
}
