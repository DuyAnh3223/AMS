package spring.serverspringboot.controller;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import spring.serverspringboot.dto.ApiResponse;
import spring.serverspringboot.dto.request.UserCreateRequest;
import spring.serverspringboot.dto.response.UserResponse;
import spring.serverspringboot.service.UserService;

@RestController
@RequestMapping("/users")
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {

    private final UserService userService;

    @PostMapping
    ApiResponse<UserResponse> createUser(@RequestBody @Valid UserCreateRequest request){
        return ApiResponse.<UserResponse>builder()
                .result(userService.create(request))
                .build();
    }
}
