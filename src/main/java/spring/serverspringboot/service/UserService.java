package spring.serverspringboot.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import spring.serverspringboot.constant.PredefinedRole;
import spring.serverspringboot.dto.request.UserCreateRequest;
import spring.serverspringboot.dto.request.UserUpdateRequest;
import spring.serverspringboot.dto.response.UserResponse;
import spring.serverspringboot.entity.Role;
import spring.serverspringboot.entity.User;
import spring.serverspringboot.exception.AppException;
import spring.serverspringboot.exception.ErrorCode;
import spring.serverspringboot.mapper.UserMapper;
import spring.serverspringboot.repository.RoleRepository;
import spring.serverspringboot.repository.UserRepository;

import java.util.HashSet;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserService {
    UserRepository userRepository;
    RoleRepository roleRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;

    public UserResponse create(UserCreateRequest request)
    {
        User user = userMapper.toUser(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        HashSet<Role> roles = new HashSet<>();
        roleRepository.findById(PredefinedRole.USER_ROLE).ifPresent(roles::add);
        user.setRoles(roles);

        try{
            user =  userRepository.save(user);
        }catch (DataIntegrityViolationException ex){
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        return userMapper.toUserResponse(user);
    }

    public UserResponse getMyInfo() {
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();

        User user = userRepository.findByUsername(name).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        return userMapper.toUserResponse(user);
    }

    public List<User> getUsers(){
        return userRepository.findAll();
    }

    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse getUser(String userId){
        return userMapper.toUserResponse(findUserById(userId));
    }

    private User findUserById(String userId){
        return userRepository.findById(userId).orElseThrow(()->new AppException(ErrorCode.USER_NOT_EXISTED));
    }

    public UserResponse updateUser(String userId, UserUpdateRequest request){
        User user = findUserById(userId);
        userMapper.updateUser(user, request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        var roles = roleRepository.findAllById(request.getRoles());
        user.setRoles(new HashSet<>(roles));
        user = userRepository.save(user);
        return userMapper.toUserResponse(user);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(String userId) {
        userRepository.deleteById(userId);
    }





}
