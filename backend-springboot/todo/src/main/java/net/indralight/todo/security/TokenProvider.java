package net.indralight.todo.security;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import net.indralight.todo.model.UserEntity;

@Slf4j
@Service
public class TokenProvider {
    private static final String SECRET_KEY = "9y$B&E)H@McQfTjWdsfdsfdsfsfsdfewr3sdfsd";
    private static final Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));

    public String create(UserEntity userEntity) {
        Date ExpiryDate = Date.from(Instant.now()
                .plus(1, ChronoUnit.DAYS));

        return Jwts.builder()
                .signWith(key)
                .setSubject(userEntity.getId()
                        .toString())
                .setIssuer("demo app")
                .setIssuedAt(new Date())
                .setExpiration(ExpiryDate)
                .compact();
    }

    public Long validateAndGetUserId(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return Long.parseLong(claims.getSubject());
    }
}
