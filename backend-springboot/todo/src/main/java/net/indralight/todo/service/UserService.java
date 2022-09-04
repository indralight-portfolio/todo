package net.indralight.todo.service;

import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;
import net.indralight.todo.dto.SnsUserDTO;
import net.indralight.todo.model.UserEntity;
import net.indralight.todo.persistence.UserRepository;

@Slf4j
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OAuthService oauthService;

    public UserEntity create(final UserEntity userEntity) {

        if (userEntity == null || userEntity.getEmail() == null) {
            throw new RuntimeException("Invalid arguments");
        }
        final String email = userEntity.getEmail();
        if (userRepository.existsByEmail(email)) {
            log.warn("Email already exists {}", email);
            throw new RuntimeException("Email already exists");
        }
        return userRepository.save(userEntity);
    }

//    public UserEntity getByCredentials(final String email, final String password, final PasswordEncoder encoder) {
//
//        final UserEntity originalUser = userRepository.findByEmail(email);
//        if (originalUser != null && encoder.matches(password, originalUser.getPassword())) {
//            return originalUser;
//        }
//
//        return null;
//    }

    public UserEntity getByCredentials(final String email, final String password) {

        final UserEntity originalUser = userRepository.findByEmail(email);
        if (originalUser != null && password.equals(originalUser.getPassword())) {
            return originalUser;
        }

        return null;
    }

    public UserEntity getByKakao(String code) {
        final String provider = "kakao";

        String accessToken = oauthService.getKakaoAccessToken(code);
        try {
            SnsUserDTO snsUserDTO = oauthService.createKakaoUser(accessToken);
            UserEntity user = userRepository.findByProviderAndSnsId(provider, snsUserDTO.getId()
                    .toString());

            if (user != null) {
                return user;
            }
            user = snsUserDTO.toEntity(provider);
            return userRepository.save(user);
        } catch (Exception e) {
            return null;
        }
    }
}
