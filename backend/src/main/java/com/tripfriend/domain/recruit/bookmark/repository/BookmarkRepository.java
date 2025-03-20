package com.tripfriend.domain.recruit.bookmark.repository;

import com.tripfriend.domain.recruit.bookmark.entity.Bookmark;
import com.tripfriend.domain.recruit.recruit.entity.Recruit;
import com.tripfriend.domain.member.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    Optional<Bookmark> findByMemberAndRecruit(Member member, Recruit recruit);
    List<Bookmark> findByMember(Member member);
    Integer countByRecruit(Recruit recruit);
}
