package com.tripfriend.domain.recruit.recruit.repository;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.NumberExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.tripfriend.domain.recruit.recruit.entity.QRecruit;
import com.tripfriend.domain.recruit.recruit.entity.Recruit;
import com.tripfriend.domain.member.member.entity.AgeRange;
import com.tripfriend.domain.member.member.entity.Gender;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class RecruitRepositoryCustomImpl implements RecruitRepositoryCustom {

    private final JPAQueryFactory jpaQueryFactory;
    private final QRecruit recruit = QRecruit.recruit;

    @Override
    public List<Recruit> findByRecruitTest() {
        return jpaQueryFactory.selectFrom(recruit)
                .where(recruit.recruitId.eq(1L))
                .fetch();
    }

    @Override
    public List<Recruit> searchByTitleOrContent(String keyword) {
        return jpaQueryFactory
                .selectFrom(recruit)
                .where(recruit.title.containsIgnoreCase(keyword)
                        .or(recruit.content.containsIgnoreCase(keyword)))
                .fetch();
    }

    @Override
    public List<Recruit> findByIsClosed(boolean isClosed) {
        return jpaQueryFactory
                .selectFrom(recruit)
                .where(recruit.isClosed.eq(isClosed))
                .fetch();
    }

    @Override
    public List<Recruit> searchFilterSort(Optional<String> keyword, Optional<String> placeCityName, Optional<Boolean> isClosed, Optional<LocalDate> startDate, Optional<LocalDate> endDate, Optional<String> travelStyle, Optional<Boolean> sameGender, Optional<Boolean> sameAge, Optional<Integer> minBudget, Optional<Integer> maxBudget, Optional<Integer> minGroupSize, Optional<Integer> maxGroupSize, Optional<String> sortBy, Gender userGender, AgeRange userAgeRange) {
        BooleanBuilder builder = new BooleanBuilder();

        // 제목, 내용 검색
        keyword.ifPresent(k -> builder.and(
                recruit.title.containsIgnoreCase(k)
                        .or(recruit.content.containsIgnoreCase(k))
        ));

        // 특정 도시 필터링
        placeCityName.ifPresent(city -> builder.and(recruit.place.cityName.eq(city)));

        // 모집중 필터링
        isClosed.ifPresent(c -> builder.and(recruit.isClosed.eq(c)));

        // 시작일, 종료일 필터링
        startDate.ifPresent(start -> builder.and(recruit.startDate.goe(start)));
        endDate.ifPresent(end -> builder.and(recruit.endDate.loe(end)));

        // 여행 스타일 필터링
        travelStyle.ifPresent(style -> builder.and(recruit.travelStyle.stringValue().eq(style)));

        ObjectMapper objectMapper = new ObjectMapper();
        // ✅ 성별 필터링 (sameGender가 true일 경우에만 필터링 적용)
        sameGender.ifPresent(sg -> {
            if (sg) { // sameGender가 true일 경우, 같은 성별인 경우만 허용
                System.out.println("📢 sameGender 필터 적용! 현재 로그인한 유저 성별: " + userGender);

                try {
                    System.out.println("📢 recruit 객체 확인: " + recruit.toString()); // 🚀 toString() 사용
                } catch (Exception e) {
                    System.out.println("❌ recruit 정보 출력 중 오류 발생: " + e.getMessage());
                }

                if (recruit.member != null) {
                    System.out.println("📢 모집글 작성자의 성별: " + recruit.member.gender);
                } else {
                    System.out.println("❌ recruit.member가 NULL 입니다!");
                }
//                builder.and(
//                        recruit.member.gender.eq(userGender)
//                                .or(recruit.sameGender.isFalse())
//                );

                builder.and(recruit.member.isNotNull()); // 🔥 Lazy Loading 문제 방지

                // 🔥 member가 null이 아닌 경우만 필터링 적용!
                builder.and(
                        recruit.member.isNotNull()
                                .and(recruit.member.gender.eq(userGender))
                                .or(recruit.sameGender.isFalse())
                );
            }
        });

        System.out.println("📢 현재 로그인한 유저의 성별: " + userGender);
        System.out.println("📢 모집글 작성자의 성별: " + recruit.member.gender);

        // ✅ 나이대 필터링 (sameAge가 true일 경우에만 필터링 적용)
        sameAge.ifPresent(sa -> {
            if (sa) { // sameAge가 true일 경우, 같은 나이대인 경우만 허용
                builder.and(
                        recruit.member.ageRange.eq(userAgeRange)
                                .or(recruit.sameAge.isFalse())
                );
            }
        });

        // 예산 필터링
        minBudget.ifPresent(min -> builder.and(recruit.budget.goe(min)));
        maxBudget.ifPresent(max -> builder.and(recruit.budget.loe(max)));

        // 인원수 필터링
        minGroupSize.ifPresent(min -> builder.and(recruit.groupSize.goe(min)));
        maxGroupSize.ifPresent(max -> builder.and(recruit.groupSize.loe(max)));

        // 정렬 옵션
        OrderSpecifier<?> orderSpecifier = getOrderSpecifier(sortBy);

        return jpaQueryFactory
                .selectFrom(recruit)
//                .leftJoin(recruit.member).fetchJoin() // 🔥 Lazy Loading 해결
                .join(recruit.member).fetchJoin() // 🔥 Lazy Loading 완전 해결
                .where(builder)
                .orderBy(orderSpecifier)
                .fetch();
    }

    private OrderSpecifier<?> getOrderSpecifier(Optional<String> sortBy) {
        if (sortBy.isEmpty()) {
            return recruit.createdAt.desc(); // 기본 정렬: 최신 생성 순
        }

        switch (sortBy.get().toLowerCase()) {
            case "startdate_asc":
                return recruit.startDate.asc();
            case "enddate_desc":
                return recruit.endDate.desc();
            case "trip_duration":
                return Expressions.numberTemplate(
                        Integer.class, "TIMESTAMPDIFF(DAY, {0}, {1})", recruit.startDate, recruit.endDate
                ).desc();
            case "budget_asc":
                return recruit.budget.asc();
            case "budget_desc":
                return recruit.budget.desc();
            case "groupsize_asc":
                return recruit.groupSize.asc();
            case "groupsize_desc":
                return recruit.groupSize.desc();
            default:
                return recruit.createdAt.desc(); // 기본 정렬: 최신 생성 순
        }
    }

}
