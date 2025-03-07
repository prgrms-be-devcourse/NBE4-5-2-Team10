package com.tripfriend.global.security;

import com.tripfriend.domain.member.member.entity.Member;
import com.tripfriend.domain.member.member.repository.MemberRepository;
import com.tripfriend.global.filter.JwtAuthenticationFilter;
import com.tripfriend.global.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtUtil jwtUtil;
    private final MemberRepository memberRepository;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // AuthenticationManagerBuilder 설정
        AuthenticationManagerBuilder authManagerBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);
        authManagerBuilder.userDetailsService(userDetailsService())
                .passwordEncoder(passwordEncoder());

        // AuthenticationManager 인스턴스 생성
        AuthenticationManager authenticationManager = authManagerBuilder.build();

        // HttpSecurity에 AuthenticationManager 설정
        http.authenticationManager(authenticationManager);

        http
                .authorizeRequests(auth -> auth
                        .anyRequest().permitAll())  // 인증이 필요한 요청은 모든 요청에 대해 허용
                .csrf(csrf -> csrf.disable())  // CSRF 보호 비활성화
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))  // 세션 관리 설정
                .headers(headers -> headers.frameOptions(frame -> frame.disable()))  // 프레임 옵션 비활성화
                .addFilterBefore(new JwtAuthenticationFilter(jwtUtil, authenticationManager),
                        UsernamePasswordAuthenticationFilter.class);  // 필터 인스턴스 직접 생성하여 추가

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService() {

        return username -> {
            Member member = memberRepository.findByUsername(username)
                    .orElseThrow(() -> new UsernameNotFoundException("회원을 찾을 수 없습니다."));

            return new org.springframework.security.core.userdetails.User(
                    member.getUsername(),
                    member.getPassword(),
                    List.of(new SimpleGrantedAuthority("ROLE_" + member.getAuthority()))
            );
        };
    }
}
