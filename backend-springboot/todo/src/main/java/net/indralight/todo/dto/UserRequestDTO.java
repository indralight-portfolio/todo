package net.indralight.todo.dto;

//import io.swagger.annotations.ApiModel;
//import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

//@ApiModel(description = "유저 정보")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class UserRequestDTO {
    private String email;
    private String nick;
    private String password;
}
