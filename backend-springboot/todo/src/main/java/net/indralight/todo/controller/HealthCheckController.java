package net.indralight.todo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthCheckController {
    @Autowired
    private Environment environment;

    @GetMapping("/")
    public String healthCheck() {
        System.out.println("env : " + environment.getProperty("spring.profiles.active"));
        return "This Service is up and running...";
    }
}
