package com.tripfriend.global.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    @Value("${custom.jwt.secret-key}")
    private String secretKey;

    @Value("${custom.jwt.access-token-expiration}")
    private long accessTokenExpiration;

    @Value("${custom.jwt.refresh-token-expiration}")
    private long refreshTokenExpiration;

    // 액세스 토큰 생성
    public String generateAccessToken(String username, String authority, boolean verified) {
        return generateToken(username, authority, verified, accessTokenExpiration);
    }

    // 삭제된 계정용 액세스 토큰 생성 메서드 추가
    public String generateAccessToken(String username, String authority, boolean verified, boolean deleted) {
        return generateToken(username, authority, verified, deleted, accessTokenExpiration);
    }

    // 리프레시 토큰 생성
    public String generateRefreshToken(String username, String authority, boolean verified) {
        return generateToken(username, authority, verified, refreshTokenExpiration);
    }

    // 삭제된 계정용 리프레시 토큰 생성 메서드 추가
    public String generateRefreshToken(String username, String authority, boolean verified, boolean deleted) {
        return generateToken(username, authority, verified, deleted, refreshTokenExpiration);
    }

    // 공통 토큰 생성 메서드
    private String generateToken(String username, String authority, boolean verified, long expirationTime) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationTime);

        Map<String, Object> claims = new HashMap<>();
        claims.put("authority", authority);
        claims.put("verified", verified);

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .addClaims(claims)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    // 소프트딜리트 정보가 포함된 토큰 생성 메서드 추가
    private String generateToken(String username, String authority, boolean verified, boolean deleted, long expirationTime) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationTime);

        Map<String, Object> claims = new HashMap<>();
        claims.put("authority", authority);
        claims.put("verified", verified);
        claims.put("deleted", deleted); // 삭제 여부 추가

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .addClaims(claims)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    // 토큰에서 사용자 이름 추출
    public String extractUsername(String token) {
        return getClaims(token).getSubject();
    }

    // 토큰에서 권한(authority) 추출
    public String extractAuthority(String token) {
        return getClaims(token).get("authority", String.class);
    }

    // 토큰에서 verified 값 추출
    public boolean extractVerified(String token) {
        return getClaims(token).get("verified", Boolean.class);
    }

    // 토큰 만료 여부 확인
    public boolean isTokenExpired(String token) {
        return getClaims(token).getExpiration().before(new Date());
    }

    // 토큰 유효성 검증
    public boolean validateToken(String token, String username) {
        return (username.equals(extractUsername(token)) && !isTokenExpired(token));
    }

    // 토큰에서 클레임(Claims) 추출
    public Claims getClaims(String token) {
        return Jwts.parser()
                .setSigningKey(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // SecretKey 가져오기
    private SecretKey getSigningKey() {
        return new SecretKeySpec(secretKey.getBytes(), SignatureAlgorithm.HS512.getJcaName());
    }

    // 토큰에서 삭제 상태 확인
    public boolean isDeletedAccount(String token) {
        try {
            Claims claims = getClaims(token);
            Object deletedClaim = claims.get("deleted");
            return deletedClaim != null && Boolean.TRUE.equals(deletedClaim);
        } catch (Exception e) {
            return false;
        }
    }
}
