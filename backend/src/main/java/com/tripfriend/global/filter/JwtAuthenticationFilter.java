package com.tripfriend.global.filter;

import com.tripfriend.global.security.CustomUserDetailsService;
import com.tripfriend.global.util.JwtUtil;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String token = extractToken(request);

        if (token != null) {
            try {
                Claims claims = jwtUtil.getClaims(token);
                String username = claims.getSubject();
                String authority = claims.get("authority", String.class);  // authority 추출
                Boolean isVerified = claims.get("verified", Boolean.class);  // verified 필드 추출

                if (username != null && Boolean.TRUE.equals(isVerified)) {
                    // UserDetails 객체 생성 (DB에서 사용자 정보 조회)
                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                    List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_" + authority));

                    // UserDetails 기반으로 Authentication 객체 생성
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(userDetails, null, authorities);

                    // SecurityContextHolder에 인증 정보 설정
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                } else {
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "이메일 인증이 완료되지 않았습니다.");
                    return;
                }
            } catch (ExpiredJwtException e) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "토큰이 만료되었습니다.");
                return;
            } catch (JwtException e) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "유효하지 않은 토큰입니다.");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    // 요청에서 토큰 추출
    private String extractToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);  // "Bearer " 부분을 제거
        }
        return null;
    }
}
