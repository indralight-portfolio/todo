package net.indralight.todo.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
//import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import net.indralight.todo.dto.ResponseDTO;
import net.indralight.todo.dto.TodoDTO;
import net.indralight.todo.model.TodoEntity;
import net.indralight.todo.service.TodoService;

@RestController
@RequestMapping("todo")
public class TodoController {

    @Autowired
    private TodoService service;

    @PutMapping
    public ResponseEntity<ResponseDTO<List<TodoDTO>>> createTodo(
            @AuthenticationPrincipal Long userId, @RequestBody TodoDTO dto) {
        try {
            TodoEntity entity = TodoDTO.toEntity(dto);
            entity.setId(null);
            entity.setUserId(userId);

            List<TodoEntity> entities = service.create(entity);
            List<TodoDTO> dtos = entities.stream()
                    .map(TodoDTO::new)
                    .collect(Collectors.toList());

            ResponseDTO<List<TodoDTO>> response = ResponseDTO.<List<TodoDTO>>builder()
                    .data(dtos)
                    .build();
            return ResponseEntity.ok()
                    .body(response);
        } catch (Exception e) {
            String error = e.getMessage();
            ResponseDTO<List<TodoDTO>> response = ResponseDTO.<List<TodoDTO>>builder()
                    .error(error)
                    .build();
            return ResponseEntity.badRequest()
                    .body(response);
        }
    }

    @GetMapping
    public ResponseEntity<ResponseDTO<List<TodoDTO>>> retrieveTodoList(
            @AuthenticationPrincipal Long userId) {
        try {
            List<TodoEntity> entities = service.retrieve(userId);
            List<TodoDTO> dtos = entities.stream()
                    .map(TodoDTO::new)
                    .collect(Collectors.toList());

            ResponseDTO<List<TodoDTO>> response = ResponseDTO.<List<TodoDTO>>builder()
                    .data(dtos)
                    .build();
            return ResponseEntity.ok()
                    .body(response);
        } catch (Exception e) {
            String error = e.getMessage();
            ResponseDTO<List<TodoDTO>> response = ResponseDTO.<List<TodoDTO>>builder()
                    .error(error)
                    .build();
            return ResponseEntity.badRequest()
                    .body(response);
        }
    }

    @PatchMapping
    public ResponseEntity<ResponseDTO<List<TodoDTO>>> updateTodo(
            @AuthenticationPrincipal Long userId, @RequestBody TodoDTO dto) {
        try {
            TodoEntity entity = TodoDTO.toEntity(dto);
            entity.setUserId(userId);

            List<TodoEntity> entities = service.update(entity);
            List<TodoDTO> dtos = entities.stream()
                    .map(TodoDTO::new)
                    .collect(Collectors.toList());

            ResponseDTO<List<TodoDTO>> response = ResponseDTO.<List<TodoDTO>>builder()
                    .data(dtos)
                    .build();
            return ResponseEntity.ok()
                    .body(response);
        } catch (Exception e) {
            String error = e.getMessage();
            ResponseDTO<List<TodoDTO>> response = ResponseDTO.<List<TodoDTO>>builder()
                    .error(error)
                    .build();
            return ResponseEntity.badRequest()
                    .body(response);
        }
    }

    @DeleteMapping
    public ResponseEntity<ResponseDTO<List<TodoDTO>>> deleteTodo(
            @AuthenticationPrincipal Long userId, @RequestBody TodoDTO dto) {
        try {
            TodoEntity entity = TodoDTO.toEntity(dto);
            entity.setUserId(userId);

            List<TodoEntity> entities = service.delete(entity);
            List<TodoDTO> dtos = entities.stream()
                    .map(TodoDTO::new)
                    .collect(Collectors.toList());

            ResponseDTO<List<TodoDTO>> response = ResponseDTO.<List<TodoDTO>>builder()
                    .data(dtos)
                    .build();
            return ResponseEntity.ok()
                    .body(response);
        } catch (Exception e) {
            String error = e.getMessage();
            ResponseDTO<List<TodoDTO>> response = ResponseDTO.<List<TodoDTO>>builder()
                    .error(error)
                    .build();
            return ResponseEntity.badRequest()
                    .body(response);
        }
    }
}
