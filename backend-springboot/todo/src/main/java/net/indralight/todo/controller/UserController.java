package net.indralight.todo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import net.indralight.todo.dto.KakaoOAuthDTO;
import net.indralight.todo.dto.ResponseDTO;
import net.indralight.todo.dto.UserDTO;
import net.indralight.todo.model.UserEntity;
import net.indralight.todo.security.TokenProvider;
import net.indralight.todo.service.UserService;

//import io.swagger.annotations.Api;
//import io.swagger.annotations.ApiImplicitParam;
//import io.swagger.annotations.ApiOperation;
//import io.swagger.annotations.ApiResponse;
//import io.swagger.annotations.ApiResponses;

//@Api(tags = { "인증 처리 Controller" })
@RestController
@RequestMapping("/auth")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private TokenProvider tokenProvider;

    // private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @ApiOperation(value = "유저 등록")
    // @ApiImplicitParam(name = "userDTO", dataType = "UserDTO")
    @ApiResponses({ @ApiResponse(code = 200, response = UserDTO.class, message = "성공"),
            @ApiResponse(code = 400, response = ResponseDTO.class, message = "실패") })
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody UserDTO userDTO) {
        try {
            UserEntity user = UserEntity.builder()
                    .email(userDTO.getEmail())
                    .nick(userDTO.getNick())
                    .password(userDTO.getPassword())
                    .provider("local")
                    .build();

            UserEntity registeredUser = userService.create(user);
            UserDTO responseUserDTO = UserDTO.fromEntity(registeredUser);

            return ResponseEntity.ok()
                    .body(responseUserDTO);
        } catch (Exception e) {
            ResponseDTO responseDTO = ResponseDTO.builder()
                    .error(e.getMessage())
                    .build();
            return ResponseEntity.badRequest()
                    .body(responseDTO);
        }
    }

    @ApiOperation(value = "유저 로그인")
    // @ApiImplicitParam(name = "userDTO", dataType = "UserDTO")
    @ApiResponses({ @ApiResponse(code = 200, response = UserDTO.class, message = "성공"),
            @ApiResponse(code = 400, response = ResponseDTO.class, message = "실패") })
    @PostMapping("/signin")
    public ResponseEntity<?> signin(@RequestBody UserDTO userDTO) {
//        UserEntity user = userService.getByCredentials(userDTO.getEmail(), userDTO.getPassword(),
//                passwordEncoder);
        UserEntity user = userService.getByCredentials(userDTO.getEmail(), userDTO.getPassword());

        if (user != null) {
            final String token = tokenProvider.create(user);
            final UserDTO responseUserDTO = UserDTO.fromEntity(user);
            responseUserDTO.setToken(token);

            return ResponseEntity.ok()
                    .body(responseUserDTO);
        } else {
            ResponseDTO responseDTO = ResponseDTO.builder()
                    .error("Login failed.")
                    .build();

            return ResponseEntity.badRequest()
                    .body(responseDTO);
        }

    }

    @ApiOperation(value = "카카오 로그인")
    // @ApiImplicitParam(name = "userDTO", dataType = "UserDTO")
    @ApiResponses({ @ApiResponse(code = 200, response = UserDTO.class, message = "성공"),
            @ApiResponse(code = 400, response = ResponseDTO.class, message = "실패") })
    @PostMapping("/kakao")
    public ResponseEntity<?> kakao(@RequestBody KakaoOAuthDTO kakaoOAuthDTO) {
        UserEntity user = userService.getByKakao(kakaoOAuthDTO);

        if (user != null) {
            final String token = tokenProvider.create(user);
            final UserDTO responseUserDTO = UserDTO.fromEntity(user);
            responseUserDTO.setToken(token);

            return ResponseEntity.ok()
                    .body(responseUserDTO);
        } else {
            ResponseDTO responseDTO = ResponseDTO.builder()
                    .error("Login failed.")
                    .build();

            return ResponseEntity.badRequest()
                    .body(responseDTO);
        }
    }
}
