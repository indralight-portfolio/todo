package net.indralight.todo.dto;

//import io.swagger.annotations.ApiModel;
//import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import net.indralight.todo.model.UserEntity;

//@ApiModel(description = "유저 정보")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class UserDTO {
    private String token;
    // @ApiModelProperty(value = "이메일", example = "a@a.com", required = true)
    private Long id;
    private String nick;
    private String email;
    private String password;
    private String provider;
    private String snsId;

    public static UserDTO fromEntity(UserEntity userEntity) {
        return UserDTO.builder()
                .id(userEntity.getId())
                .nick(userEntity.getNick())
                .email(userEntity.getEmail())
                .provider(userEntity.getProvider())
                .snsId(userEntity.getSnsId())
                .build();
    }
}
