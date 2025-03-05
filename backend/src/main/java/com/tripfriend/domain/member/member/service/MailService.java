package com.tripfriend.domain.member.member.service;

import com.tripfriend.domain.member.member.entity.EmailAuth;
import com.tripfriend.domain.member.member.entity.Member;
import com.tripfriend.domain.member.member.repository.EmailAuthRepository;
import com.tripfriend.domain.member.member.repository.MemberRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class MailService {

    private final JavaMailSender javaMailSender;
    private final EmailAuthRepository emailAuthRepository;
    private final MemberRepository memberRepository;

    @Value("{spring.mail.username}")
    private static String senderEmail;

    @Value("${spring.mail.properties.auth-code-expiration-millis}")
    private long authCodeExpirationMillis;

    public String createCode() {

        Random random = new Random();
        StringBuilder key = new StringBuilder();

        for (int i = 0; i < 6; i++) { // 인증 코드 6자리
            int index = random.nextInt(2); // 0~1까지 랜덤, 랜덤값으로 switch문 실행

            switch (index) {
                case 0 -> key.append((char) (random.nextInt(26) + 65)); // 대문자
                case 1 -> key.append(random.nextInt(10)); // 숫자
            }
        }
        return key.toString();
    }

    public MimeMessage createMail(String mail, String authCode) throws MessagingException {

        MimeMessage message = javaMailSender.createMimeMessage();

        message.setFrom(senderEmail);
        message.setRecipients(MimeMessage.RecipientType.TO, mail);
        message.setSubject("이메일 인증");
        String body = "";
        body += "<h3>요청하신 인증 번호입니다.</h3>";
        body += "<h1>" + authCode + "</h1>";
        body += "<h3>감사합니다.</h3>";
        message.setText(body, "UTF-8", "html");

        return message;
    }

    // 메일 발송
    public String sendSimpleMessage(String sendEmail) throws MessagingException {

        String authCode = createCode(); // 랜덤 인증번호 생성

        MimeMessage message = createMail(sendEmail, authCode); // 메일 생성
        try {
            javaMailSender.send(message); // 메일 발송
            return authCode;
        } catch (MailException e) {
            return null;
        }
    }

    @Transactional
    public boolean sendAuthCode(String email) throws MessagingException {

        String authCode = sendSimpleMessage(email); // 이메일 인증 코드 발송
        if (authCode != null) {
            EmailAuth emailAuth = emailAuthRepository.findByEmail(email).orElse(null);

            // 인증 코드와 만료 시간 설정
            LocalDateTime expireAt = LocalDateTime.now().plus(authCodeExpirationMillis, ChronoUnit.MILLIS);

            if (emailAuth == null) {
                emailAuthRepository.save(new EmailAuth(email, authCode, expireAt));
            } else {
                emailAuth.updateCode(authCode, expireAt);
            }
            return true;
        }
        return false;
    }

    public boolean validationAuthCode(String email, String authCode) {
        // 이메일로 인증 정보를 조회
        EmailAuth emailAuth = emailAuthRepository.findByEmail(email).orElse(null);

        if (emailAuth != null && emailAuth.getAuthCode().equals(authCode) && emailAuth.getExpireAt().isAfter(LocalDateTime.now())) {
            // 인증 코드가 유효하면 Member 엔티티의 verified 필드를 true로 설정
            Member member = memberRepository.findByEmail(email).orElse(null);

            if (member != null) {
                member.setVerified(true);  // verified를 true로 설정
                memberRepository.save(member);  // 변경된 Member 저장
            }

            // 인증 성공 후 이메일 인증 정보를 삭제
            emailAuthRepository.delete(emailAuth);

            return true;
        }
        return false;
    }

    @Scheduled(fixedRate = 3600000) // 1시간마다 실행
    @Transactional
    public void removeExpiredAuthCodes() {
        emailAuthRepository.deleteExpiredCodes(); // 만료된 인증 코드 삭제
    }
}
