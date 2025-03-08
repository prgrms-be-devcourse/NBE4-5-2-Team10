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

    @Override
    public List<Recruit> findByRecruitTest() {
        QRecruit recruit = QRecruit.recruit;
        return jpaQueryFactory.selectFrom(recruit)
                .where(recruit.recruitId.eq(1L))
                .fetch();
    }
}
