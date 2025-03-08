package com.tripfriend.domain.recruit.recruit.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.tripfriend.domain.recruit.recruit.entity.QRecruit;
import com.tripfriend.domain.recruit.recruit.entity.Recruit;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

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
}
