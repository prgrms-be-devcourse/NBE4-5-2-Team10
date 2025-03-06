package com.tripfriend.global.init;

import com.tripfriend.domain.member.member.entity.*;
import com.tripfriend.domain.member.member.repository.MemberRepository;
import com.tripfriend.domain.recruit.apply.entity.Apply;
import com.tripfriend.domain.recruit.apply.repository.ApplyRepository;
import com.tripfriend.domain.recruit.recruit.entity.Recruit;
import com.tripfriend.domain.recruit.recruit.repository.RecruitRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
@Transactional
public class BaseInitData implements CommandLineRunner {

    private final MemberRepository memberRepository;
    private final RecruitRepository recruitRepository;
    private final ApplyRepository applyRepository;

    @Override
    public void run(String... args) throws Exception {
        initMembers(); // 회원 등록
        initRecruits(); // 동행글 등록
        initApplies(); // 동행댓글 등록
    }

    // 회원 등록
    private void initMembers() {
        if (memberRepository.count() == 0) {
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

            System.out.println("회원 테스트 데이터가 등록되었습니다.");
        }else {
            System.out.println("이미 회원 데이터가 존재합니다.");
        }
    }

    // 동행글 등록
    private void initRecruits() {
        if (recruitRepository.count() == 0) {
            Recruit recruit1 = Recruit.builder()
                    .title("동행 구해요")
                    .content("재밌게 노실 분들 모여주세요")
                    .isClosed(false)
                    .startDate(LocalDate.now())
                    .endDate(LocalDate.now().plusDays(7))
                    .travelStyle(com.tripfriend.domain.recruit.recruit.entity.TravelStyle.ADVENTURE)
                    .sameAge(false)
                    .sameGender(false)
                    .budget(20000)
                    .groupSize(5)
                    .build();
            recruitRepository.save(recruit1);

            Recruit recruit2 = Recruit.builder()
                    .title("동행 구해요")
                    .content("힐링스파 하러 가실 분??")
                    .isClosed(false)
                    .startDate(LocalDate.now())
                    .endDate(LocalDate.now().plusDays(2))
                    .travelStyle(com.tripfriend.domain.recruit.recruit.entity.TravelStyle.RELAXATION)
                    .sameAge(false)
                    .sameGender(false)
                    .budget(50000)
                    .groupSize(3)
                    .build();
            recruitRepository.save(recruit2);

            System.out.println("동행모집(게시글) 테스트 데이터가 등록되었습니다.");
        }else {
            System.out.println("이미 동행모집(게시글) 데이터가 존재합니다.");
        }
    }

    // 동행 요청 등록
    private void initApplies() {
        if (applyRepository.count() == 0) {
            Apply apply1 = Apply.builder()
                    .content("저 즐겁게 놀 자신 있습니다! 1번 글의 1번 댓글")
                    .recruit(recruitRepository.findById(1L).orElseThrow(EntityNotFoundException::new))
                    .build();
            applyRepository.save(apply1);

            Apply apply2 = Apply.builder()
                    .content("저 즐겁게 놀 자신 있습니다! 1번 글의 2번 댓글")
                    .recruit(recruitRepository.findById(1L).orElseThrow(EntityNotFoundException::new))
                    .build();
            applyRepository.save(apply2);

            Apply apply3 = Apply.builder()
                    .content("저 즐겁게 놀 자신 있습니다! 2번 글의 3번 댓글")
                    .recruit(recruitRepository.findById(2L).orElseThrow(EntityNotFoundException::new))
                    .build();
            applyRepository.save(apply3);

            Apply apply4 = Apply.builder()
                    .content("저 즐겁게 놀 자신 있습니다! 2번 글의 4번 댓글")
                    .recruit(recruitRepository.findById(2L).orElseThrow(EntityNotFoundException::new))
                    .build();
            applyRepository.save(apply4);

            System.out.println("동행요청(댓글) 테스트 데이터가 등록되었습니다.");
        }else {
            System.out.println("이미 동행 요청(댓글) 데이터가 존재합니다.");
        }
    }

    private void initPlace(){

    }
}