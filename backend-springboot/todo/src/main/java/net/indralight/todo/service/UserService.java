package net.indralight.todo.service;

import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;
import net.indralight.todo.dto.KakaoOAuthDTO;
import net.indralight.todo.dto.SnsUserDTO;
import net.indralight.todo.model.UserEntity;
import net.indralight.todo.persistence.UserRepository;

@Slf4j
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private KakaoOAuthService oauthService;

    public UserEntity createByLocal(final UserEntity userEntity) {

        if (userEntity == null || userEntity.getEmail() == null) {
            throw new RuntimeException("Invalid arguments");
        }
        final String email = userEntity.getEmail();
        final String provider = userEntity.getProvider();
        if (userRepository.existsByEmailAndProvider(email, provider)) {
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

    public UserEntity getByLocal(final String email, final String password) {
        final String provider = "local";

        final UserEntity originalUser = userRepository.findByEmailAndProvider(email, provider);
        if (originalUser != null && password.equals(originalUser.getPassword())) {
            return originalUser;
        }

        return null;
    }

    public UserEntity getByKakao(KakaoOAuthDTO kakaoOAuthDTO) {
        final String provider = "kakao";

        String accessToken = oauthService.getAccessToken(kakaoOAuthDTO);
        try {
            SnsUserDTO snsUserDTO = oauthService.getKakaoUser(accessToken);
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
