package com.tripfriend.domain.member.member.service;

import com.tripfriend.domain.member.member.dto.AuthResponseDto;
import com.tripfriend.domain.member.member.dto.LoginRequestDto;
import com.tripfriend.domain.member.member.dto.TokenInfoDto;
import com.tripfriend.domain.member.member.entity.Member;
import com.tripfriend.domain.member.member.repository.MemberRepository;
import com.tripfriend.global.util.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final JwtUtil jwtUtil;
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    // 로그인 처리
    public AuthResponseDto login(LoginRequestDto loginRequestDto, HttpServletResponse response) {

        // 회원 인증 처리
        Member member = memberRepository.findByUsername(loginRequestDto.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("존재하지 않는 회원입니다."));

        if (!passwordEncoder.matches(loginRequestDto.getPassword(), member.getPassword())) {
            throw new RuntimeException("비밀번호를 확인하세요.");
        }

        // 계정이 삭제된 상태인 경우
        if (member.isDeleted()) {
            // 복구 가능한 경우
            if (member.canBeRestored()) {
                // 복구 가능한 경우에만 특별한 토큰 발급
                String accessToken = jwtUtil.generateAccessToken(member.getUsername(), member.getAuthority(), member.isVerified(), true);
                String refreshToken = jwtUtil.generateRefreshToken(member.getUsername(), member.getAuthority(), member.isVerified(), true);

                // 복구용 토큰은 짧은 시간만 유효하게 설정
                addCookie(response, "accessToken", accessToken, 10 * 60); // 10분
                addCookie(response, "refreshToken", refreshToken, 10 * 60); // 10분

                return new AuthResponseDto(accessToken, refreshToken, true);
            } else {
                throw new RuntimeException("영구 삭제된 계정입니다. 새로운 계정으로 가입해주세요.");
            }
        }

        // 토큰 생성
        String accessToken = jwtUtil.generateAccessToken(member.getUsername(), member.getAuthority(), member.isVerified());
        String refreshToken = jwtUtil.generateRefreshToken(member.getUsername(), member.getAuthority(), member.isVerified());

        // 쿠키에 토큰 저장
        addCookie(response, "accessToken", accessToken, 30 * 60); // 30분
        addCookie(response, "refreshToken", refreshToken, 60 * 60 * 24 * 7); // 7일

        return new AuthResponseDto(accessToken, refreshToken);
    }

    // 로그아웃 처리
    public void logout(HttpServletResponse response) {
        // 쿠키에서 토큰 삭제
        addCookie(response, "accessToken", null, 0); // 만료 시간을 0으로 설정하여 삭제
        addCookie(response, "refreshToken", null, 0);
    }

    // 리프레시 토큰으로 새로운 액세스 토큰 발급
    public String refreshToken(String refreshToken, HttpServletResponse response) {
        if (!jwtUtil.validateToken(refreshToken, jwtUtil.extractUsername(refreshToken))) {
            throw new RuntimeException("Invalid refresh token");
        }

        String username = jwtUtil.extractUsername(refreshToken);
        String authority = jwtUtil.extractAuthority(refreshToken);
        boolean isVerified = jwtUtil.extractVerified(refreshToken);

        // 새로운 액세스 토큰 생성
        String newAccessToken = jwtUtil.generateAccessToken(username, authority, isVerified);

        // 새로운 액세스 토큰을 쿠키에 저장
        addCookie(response, "accessToken", newAccessToken, 30 * 60); // 30분

        // 새로운 리프레시 토큰 생성
        String newRefreshToken = jwtUtil.generateRefreshToken(username, authority, isVerified);

        // 리프레시 토큰을 쿠키에 저장
        addCookie(response, "refreshToken", newRefreshToken, 60 * 60 * 24 * 7); // 7일

        return newAccessToken;
    }

    // 로그인된 사용자의 정보를 반환하는 메서드
    public Member getLoggedInMember(String token) {

        // 토큰에서 "Bearer "를 제거
        String extractedToken = token.replace("Bearer ", "");

        // 토큰에서 사용자 정보 추출
        TokenInfoDto tokenInfo = extractTokenInfo(extractedToken);
        return memberRepository.findByUsername(tokenInfo.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    // 토큰에서 사용자 정보를 추출하는 메서드
    public TokenInfoDto extractTokenInfo(String token) {

        if (jwtUtil.isTokenExpired(token)) {
            throw new RuntimeException("만료된 토큰입니다.");
        }

        String username = jwtUtil.extractUsername(token);
        String authority = jwtUtil.extractAuthority(token);
        boolean isVerified = jwtUtil.extractVerified(token);

        return new TokenInfoDto(username, authority, isVerified);
    }

    // 쿠키 생성 메서드 (만료 시간 설정)
    private void addCookie(HttpServletResponse response, String name, String value, int maxAge) {

        Cookie cookie = new Cookie(name, value);
        cookie.setPath("/");
        cookie.setMaxAge(maxAge); // 만료 시간 설정
        cookie.setHttpOnly(true); // 자바스크립트에서 접근 불가
        cookie.setSecure(true); // HTTPS 환경에서만 사용 가능
        response.addCookie(cookie);
    }
}
