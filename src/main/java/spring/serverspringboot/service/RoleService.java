package spring.serverspringboot.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import spring.serverspringboot.dto.request.RoleRequest;
import spring.serverspringboot.dto.response.RoleResponse;
import spring.serverspringboot.entity.Role;
import spring.serverspringboot.mapper.PermissionMapper;
import spring.serverspringboot.mapper.RoleMapper;
import spring.serverspringboot.repository.PermissionRepository;
import spring.serverspringboot.repository.RoleRepository;

import java.util.HashSet;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleService {
    RoleRepository roleRepository;
    RoleMapper roleMapper;

    PermissionRepository permissionRepository;

    public RoleResponse create(RoleRequest request){
        Role role = roleMapper.toRole(request);

        var permissions = permissionRepository.findAllById(request.getPermissions());
        role.setPermissions(new HashSet<>(permissions));

        roleRepository.save(role);

        return roleMapper.toRoleResponse(role);
    }

    public List<RoleResponse> getAll() {
        return roleRepository.findAll().stream().map(roleMapper::toRoleResponse).toList();
    }

    public void delete(String role) {
        roleRepository.deleteById(role);
    }
}
