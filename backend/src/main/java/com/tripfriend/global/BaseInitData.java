package com.tripfriend.global;

import com.tripfriend.domain.member.member.entity.AgeRange;
import com.tripfriend.domain.member.member.entity.Gender;
import com.tripfriend.domain.member.member.entity.Member;
import com.tripfriend.domain.member.member.entity.TravelStyle;
import com.tripfriend.domain.member.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BaseInitData implements CommandLineRunner {

    private final MemberRepository memberRepository;

    @Override
    public void run(String... args) throws Exception {

        // 이미 데이터가 존재하는지 확인
        if (memberRepository.count() == 0) {

            // 회원 추가
            Member user = Member.builder()
                    .username("user")
                    .email("user@example.com")
                    .password("12341234")
                    .nickname("user")
                    .gender(Gender.MALE)
                    .ageRange(AgeRange.TWENTIES)
                    .travelStyle(TravelStyle.TOURISM)
                    .aboutMe("hello")
                    .rating(0.0)
                    .authority("USER")
                    .verified(true)
                    .build();
            memberRepository.save(user);

            // 관리자 추가
            Member admin = Member.builder()
                    .username("admin")
                    .email("admin@example.com")
                    .password("12341234")
                    .nickname("admin")
                    .gender(Gender.FEMALE)
                    .ageRange(AgeRange.THIRTIES)
                    .travelStyle(TravelStyle.SHOPPING)
                    .aboutMe("hello")
                    .rating(0.0)
                    .authority("ADMIN")
                    .verified(true)
                    .build();
            memberRepository.save(admin);

            System.out.println("테스트 데이터가 등록되었습니다.");
        } else {
            System.out.println("이미 테스트 데이터가 있습니다.");
        }
    }
}
