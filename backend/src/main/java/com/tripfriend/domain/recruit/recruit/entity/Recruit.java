package com.tripfriend.domain.recruit.recruit.entity;

import com.tripfriend.domain.member.member.entity.Member;
import com.tripfriend.domain.place.place.entity.Place;
import com.tripfriend.domain.recruit.apply.entity.Apply;
import com.tripfriend.domain.recruit.recruit.dto.RecruitUpdateRequestDto;
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
@NoArgsConstructor // jpa가 엔티티 생성할 때 필요로 함
@AllArgsConstructor // builder에 필요함
@Builder
public class Recruit extends BaseEntity {
    @Id
    @Column(name = "recruit_id") // 기본키는 원래 not null
    @GeneratedValue(strategy = GenerationType.IDENTITY) // auto increment
    private Long recruitId;

//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "member_id") // 컬럼이름?, 회원 탈퇴 시 게시글 남아있게 함
//    private Member member;

    @OneToMany(mappedBy = "recruit", cascade = CascadeType.REMOVE) // , orphanRemoval = true
    @OrderBy("applyId asc")
    // 글 삭제 시 댓글도 삭제, 리스트에서 제거된 댓글 자동 삭제
    private List<Apply> applies;
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "placeId", nullable = false) // 컬럼이름?? 장소 선택 필수?
//    private Place place;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
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

    public Recruit update(RecruitUpdateRequestDto recruitUpdateRequestDto){
        this.title = recruitUpdateRequestDto.getTitle();
        this.content = recruitUpdateRequestDto.getContent();
        this.isClosed = recruitUpdateRequestDto.isClosed();
        this.startDate = recruitUpdateRequestDto.getStartDate();
        this.endDate = recruitUpdateRequestDto.getEndDate();
        this.travelStyle = recruitUpdateRequestDto.getTravelStyle();
        this.sameGender = recruitUpdateRequestDto.isSameGender();
        this.sameAge = recruitUpdateRequestDto.isSameAge();
        this.budget = recruitUpdateRequestDto.getBudget();
        this.groupSize = recruitUpdateRequestDto.getGroupSize();
        return this;
    }
}
