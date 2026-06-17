package spring.serverspringboot.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import spring.serverspringboot.dto.request.UserCreateRequest;
import spring.serverspringboot.dto.response.UserResponse;
import spring.serverspringboot.entity.User;
import spring.serverspringboot.mapper.UserMapper;
import spring.serverspringboot.repository.UserRepository;

@Service
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserService {
    UserRepository userRepository;
    UserMapper userMapper;

    public UserResponse create(UserCreateRequest request)
    {
        User user = userMapper.toUser(request);

        user =  userRepository.save(user);

        return userMapper.toUserResponse(user);

    }
}
