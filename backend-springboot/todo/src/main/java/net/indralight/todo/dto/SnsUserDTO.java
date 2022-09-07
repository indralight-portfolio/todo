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
public class SnsUserDTO {
    private Long id;
    private String email;
    private String nickname;

    public UserEntity toEntity(String provider) {
        return UserEntity.builder()
                .email(email)
                .nick(nickname)
                .provider(provider)
                .snsId(id.toString())
                .build();
    }

}
