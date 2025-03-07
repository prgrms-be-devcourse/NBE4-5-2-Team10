package com.tripfriend.domain.member.member.service;

import com.tripfriend.domain.member.member.dto.JoinRequestDto;
import com.tripfriend.domain.member.member.dto.MemberResponseDto;
import com.tripfriend.domain.member.member.dto.MemberUpdateRequestDto;
import com.tripfriend.domain.member.member.entity.Member;
import com.tripfriend.domain.member.member.repository.MemberRepository;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;

    private final MailService mailService;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public MemberResponseDto join(JoinRequestDto joinRequestDto) throws MessagingException {

        String email = joinRequestDto.getEmail();

        // 중복 검사
        if (memberRepository.existsByUsername(joinRequestDto.getUsername())) {
            throw new RuntimeException("이미 사용 중인 아이디입니다.");
        }
        if (memberRepository.existsByEmail(joinRequestDto.getEmail())) {
            throw new RuntimeException("이미 사용 중인 이메일입니다.");
        }
        if (memberRepository.existsByNickname(joinRequestDto.getNickname())) {
            throw new RuntimeException("이미 사용 중인 닉네임입니다.");
        }

        // 이메일 인증 코드 발송
        mailService.sendAuthCode(email);

        // 비밀번호 암호화
        String encryptedPassword = passwordEncoder.encode(joinRequestDto.getPassword());

        // DTO를 엔티티로 변환하고 암호화된 비밀번호를 설정
        Member member = joinRequestDto.toEntity();
        member.setPassword(encryptedPassword);
        Member savedMember = memberRepository.save(member);

        return MemberResponseDto.fromEntity(savedMember);
    }

    @Transactional
    public MemberResponseDto updateMember(Long id, MemberUpdateRequestDto memberUpdateRequestDto) {

        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 회원입니다."));

        // 이메일 중복 검사 (변경된 경우에만)
        if (memberUpdateRequestDto.getEmail() != null && !memberUpdateRequestDto.getEmail().equals(member.getEmail())) {
            if (memberRepository.existsByEmail(memberUpdateRequestDto.getEmail())) {
                throw new RuntimeException("이미 사용 중인 이메일입니다.");
            }
            member.setEmail(memberUpdateRequestDto.getEmail());
        }

        // 닉네임 중복 검사 (변경된 경우에만)
        if (memberUpdateRequestDto.getNickname() != null && !memberUpdateRequestDto.getNickname().equals(member.getNickname())) {
            if (memberRepository.existsByNickname(memberUpdateRequestDto.getNickname())) {
                throw new RuntimeException("이미 사용 중인 닉네임입니다.");
            }
            member.setNickname(memberUpdateRequestDto.getNickname());
        }

        // 비밀번호 변경 (값이 있는 경우만)
        if (memberUpdateRequestDto.getPassword() != null && !memberUpdateRequestDto.getPassword().isEmpty()) {
            member.setPassword(memberUpdateRequestDto.getPassword());
        }

        // 나머지 필드 업데이트 (null이 아닌 경우만)
        if (memberUpdateRequestDto.getProfileImage() != null) {
            member.setProfileImage(memberUpdateRequestDto.getProfileImage());
        }
        if (memberUpdateRequestDto.getGender() != null) {
            member.setGender(memberUpdateRequestDto.getGender());
        }
        if (memberUpdateRequestDto.getAgeRange() != null) {
            member.setAgeRange(memberUpdateRequestDto.getAgeRange());
        }
        if (memberUpdateRequestDto.getTravelStyle() != null) {
            member.setTravelStyle(memberUpdateRequestDto.getTravelStyle());
        }
        if (memberUpdateRequestDto.getAboutMe() != null) {
            member.setAboutMe(memberUpdateRequestDto.getAboutMe());
        }

        Member updatedMember = memberRepository.save(member);

        return MemberResponseDto.fromEntity(updatedMember);
    }

    @Transactional
    public void deleteMember(Long id) {

        if (!memberRepository.existsById(id)) {
            throw new RuntimeException("존재하지 않는 회원입니다.");
        }

        memberRepository.deleteById(id);
    }
}
