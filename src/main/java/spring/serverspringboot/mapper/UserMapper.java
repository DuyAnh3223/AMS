package spring.serverspringboot.mapper;

import org.mapstruct.Mapper;
import spring.serverspringboot.dto.request.UserCreateRequest;
import spring.serverspringboot.dto.response.UserResponse;
import spring.serverspringboot.entity.User;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(UserCreateRequest request);

    UserResponse toUserResponse(User user);
}
