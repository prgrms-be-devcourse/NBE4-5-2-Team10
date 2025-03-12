package com.tripfriend.domain.member.member.controller;

import com.tripfriend.domain.member.member.dto.*;
import com.tripfriend.domain.member.member.entity.Member;
import com.tripfriend.domain.member.member.service.AuthService;
import com.tripfriend.domain.member.member.service.MailService;
import com.tripfriend.domain.member.member.service.MemberService;
import com.tripfriend.global.dto.RsData;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Member API", description = "회원관련 기능을 제공합니다.")
@RestController
@RequestMapping("/member")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;
    private final AuthService authService;
    private final MailService mailService;

    @Operation(summary = "회원가입")
    @PostMapping("/join")
    public RsData<MemberResponseDto> join(@Valid @RequestBody JoinRequestDto joinRequestDto) throws MessagingException {

        MemberResponseDto savedMember = memberService.join(joinRequestDto);
        return new RsData<>("201-1", "회원가입이 완료되었습니다.", savedMember);
    }

    @Operation(summary = "로그인")
    @PostMapping("/login")
    public RsData<AuthResponseDto> login(@RequestBody LoginRequestDto loginRequestDto, HttpServletResponse response) {

        AuthResponseDto authResponse = authService.login(loginRequestDto, response);
        return new RsData<>("200-1", "로그인 성공", authResponse);
    }

    @Operation(summary = "로그아웃")
    @PostMapping("/logout")
    public RsData<Void> logout(HttpServletResponse response) {

        authService.logout(response);
        return new RsData<>("200-1", "로그아웃이 완료되었습니다.", null);
    }

    @Operation(summary = "액세스 토큰 재발급")
    @PostMapping("/refresh")
    public RsData<AuthResponseDto> refresh(@CookieValue(name = "refreshToken") String refreshToken, HttpServletResponse response) {

        String newAccessToken = authService.refreshToken(refreshToken, response);
        return new RsData<>("200-1", "토큰이 재발급되었습니다.", new AuthResponseDto(newAccessToken));
    }

    @Operation(summary = "회원정보 수정")
    @PutMapping("/{id}")
    public RsData<MemberResponseDto> updateMember(@PathVariable Long id, @RequestBody MemberUpdateRequestDto memberUpdateRequestDto) {

        MemberResponseDto response = memberService.updateMember(id, memberUpdateRequestDto);
        return new RsData<>("200-1", "회원 정보가 수정되었습니다.", response);
    }

    @Operation(summary = "회원 삭제")
    @DeleteMapping("/{id}")
    public RsData<Void> deleteMember(@PathVariable Long id) {

        memberService.deleteMember(id);
        return new RsData<>("204-1", "회원이 삭제되었습니다.", null);
    }

    @Operation(summary = "이메일 인증 코드 전송")
    @GetMapping("/auth/verify-email")
    public RsData<Void> requestAuthCode(String email) throws MessagingException {

        boolean isSend = mailService.sendAuthCode(email);
        return isSend
                ? new RsData<>("200-1", "인증 코드가 전송되었습니다.", null)
                : new RsData<>("500-1", "인증 코드 전송이 실패하였습니다.", null);
    }

    @Operation(summary = "이메일 인증")
    @PostMapping("/auth/email")
    public RsData<Void> validateAuthCode(@RequestBody @Valid EmailVerificationRequestDto emailVerificationRequestDto) {

        boolean isSuccess = mailService.validationAuthCode(emailVerificationRequestDto);
        return isSuccess
                ? new RsData<>("200-1", "이메일 인증에 성공하였습니다.", null)
                : new RsData<>("400-1", "이메일 인증에 실패하였습니다.", null);
    }

    @Operation(summary = "마이페이지")
    @GetMapping("/mypage")
    public RsData<MemberResponseDto> getMyPage(@RequestHeader(value = "Authorization", required = false) String token) {

        Member loggedInMember = authService.getLoggedInMember(token);

        MemberResponseDto response = memberService.getMyPage(loggedInMember.getId(), loggedInMember.getUsername());
        return new RsData<>("200-1", "마이페이지 정보 조회 성공", response);
    }
}
