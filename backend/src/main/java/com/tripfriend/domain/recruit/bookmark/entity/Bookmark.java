package com.tripfriend.domain.recruit.bookmark.entity;

import com.tripfriend.domain.member.member.entity.Member;
import com.tripfriend.domain.recruit.recruit.entity.Recruit;
import com.tripfriend.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Bookmark",
        uniqueConstraints = {@UniqueConstraint(columnNames = {"member_id", "recruit_id"})})
@Getter
@NoArgsConstructor
//@AllArgsConstructor
//@Builder
public class Bookmark extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bookmark_id")
    private Long bookmarkId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recruit_id", nullable = false)
    private Recruit recruit;

    public Bookmark(Member member, Recruit recruit) {
        this.member = member;
        this.recruit = recruit;
    }
}
