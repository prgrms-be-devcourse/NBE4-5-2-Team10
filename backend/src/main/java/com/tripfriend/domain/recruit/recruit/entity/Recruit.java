package com.tripfriend.domain.recruit.recruit.entity;

import com.tripfriend.domain.member.member.entity.Member;
import com.tripfriend.domain.recruit.apply.entity.Apply;
import com.tripfriend.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Recruit")
@Getter
// @ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Recruit extends BaseEntity {
    @Id
    @Column(name = "recruit_id") // 기본키는 원래 not null
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long recruitId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = true) // 컬럼이름?, 회원 탈퇴 시 게시글 남아있게 함
    private Member member;

    @OneToMany(mappedBy = "recruit", cascade = CascadeType.ALL, orphanRemoval = true)
    // 글 삭제 시 댓글도 삭제, 리스트에서 제거된 댓글 자동 삭제
    private List<Apply> applies = new ArrayList<>();

//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "place_id", nullable = false) // 컬럼이름?? 장소 선택 필수?
//    private Place place;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "content", nullable = false)
    private String content;

    @Column(name = "is_closed", nullable = false)
    private boolean isClosed; // 어차피 null 안 되니까 Boolean 안 씀

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "travel_style", nullable = false)
    private TravelStyle travelStyle;

    @Column(name = "same_gender", nullable = false)
    private boolean sameGender; // 어차피 null 안 되니까 Boolean 안 씀

    @Column(name = "same_age", nullable = false)
    private boolean sameAge; // 어차피 null 안 되니까 Boolean 안 씀

    @Column(name = "budget", nullable = false)
    private Integer budget = 0;

    @Column(name = "group_size", nullable = false)
    private Integer groupSize = 2;
}
