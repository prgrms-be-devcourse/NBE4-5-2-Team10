package com.tripfriend.domain.member.member.controller;

import com.tripfriend.domain.member.member.dto.*;
import com.tripfriend.domain.member.member.entity.Member;
import com.tripfriend.domain.member.member.service.AuthService;
import com.tripfriend.domain.member.member.service.MailService;
import com.tripfriend.domain.member.member.service.MemberService;
import com.tripfriend.global.annotation.CheckPermission;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<MemberResponseDto> join(@Valid @RequestBody JoinRequestDto joinRequestDto) throws MessagingException {

        MemberResponseDto savedMember = memberService.join(joinRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedMember);
    }

    @Operation(summary = "로그인")
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto loginRequestDto, HttpServletResponse response) {
        AuthResponseDto authResponse = authService.login(loginRequestDto, response);
        return ResponseEntity.ok(authResponse);
    }

    @Operation(summary = "로그아웃")
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        authService.logout(response);
        return ResponseEntity.ok("로그아웃이 실행되었습니다.");
    }

    @Operation(summary = "액세스 토큰 재발급")
    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@CookieValue(name = "refreshToken") String refreshToken, HttpServletResponse response) {
        String newAccessToken = authService.refreshToken(refreshToken, response);
        return ResponseEntity.ok(new AuthResponseDto(newAccessToken));
    }

    @Operation(summary = "회원정보 수정")
    @PutMapping("/{id}")
    public ResponseEntity<MemberResponseDto> updateMember(@PathVariable Long id, @RequestBody MemberUpdateRequestDto memberUpdateRequestDto) {

        MemberResponseDto response = memberService.updateMember(id, memberUpdateRequestDto);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "회원 삭제")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMember(@PathVariable Long id) {

        memberService.deleteMember(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "이메일 인증 코드 전송")
    @GetMapping("/auth/verify-email")
    public ResponseEntity<String> requestAuthCode(String email) throws MessagingException {

        boolean isSend = mailService.sendAuthCode(email);
        return isSend ? ResponseEntity.status(HttpStatus.OK).body("인증 코드가 전송되었습니다.") :
                ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("인증 코드 전송이 실패하였습니다.");
    }

    @Operation(summary = "이메일 인증")
    @PostMapping("/auth/email")
    public ResponseEntity<String> validateAuthCode(@RequestBody @Valid EmailVerificationRequestDto emailVerificationRequestDto) {

        boolean isSuccess = mailService.validationAuthCode(emailVerificationRequestDto);
        return isSuccess ? ResponseEntity.status(HttpStatus.OK).body("이메일 인증에 성공하였습니다.") :
                ResponseEntity.status(HttpStatus.BAD_REQUEST).body("이메일 인증에 실패하였습니다.");
    }

    @Operation(summary = "마이페이지")
    @GetMapping("/mypage")
    public ResponseEntity<MemberResponseDto> getMyPage(@RequestHeader(value = "Authorization", required = false) String token) {

        // 토큰에서 현재 로그인한 회원 정보 추출
        Member loggedInMember = authService.getLoggedInMember(token);

        // 사용자 페이지 정보 가져오기
        MemberResponseDto response = memberService.getMyPage(loggedInMember.getId(), loggedInMember.getUsername());
        return ResponseEntity.ok(response);
    }

    //관리자 회원 조회
    @Operation(summary = "전체 회원 목록 조회 (관리자 전용)")
    @GetMapping("/all")
    @CheckPermission("ADMIN") //관리자
    public ResponseEntity<List<MemberResponseDto>> getAllMembers() {
        List<MemberResponseDto> members = memberService.getAllMembers();
        return ResponseEntity.ok(members);
    }

}
