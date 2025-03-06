package com.tripfriend.domain.member.member.controller;

import com.tripfriend.domain.member.member.dto.*;
import com.tripfriend.domain.member.member.dto.JoinRequestDto;
import com.tripfriend.domain.member.member.dto.LoginRequestDto;
import com.tripfriend.domain.member.member.dto.MemberResponseDto;
import com.tripfriend.domain.member.member.dto.MemberUpdateRequestDto;
import com.tripfriend.domain.member.member.service.MailService;
import com.tripfriend.domain.member.member.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Member API", description = "회원관련 기능을 제공합니다.")
@RestController
@RequestMapping("/member")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;
    private final MailService mailService;

    @Operation(summary = "회원가입")
    @PostMapping("/join")
    public ResponseEntity<MemberResponseDto> join(@Valid @RequestBody JoinRequestDto joinRequestDto) throws MessagingException {

        MemberResponseDto savedMember = memberService.join(joinRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedMember);
    }

    @Operation(summary = "로그인")
    @PostMapping("/login")
    public ResponseEntity<MemberResponseDto> login(@Valid @RequestBody LoginRequestDto loginRequestDto) {

        MemberResponseDto loginMember = memberService.login(loginRequestDto);
        return ResponseEntity.ok(loginMember);
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
}
