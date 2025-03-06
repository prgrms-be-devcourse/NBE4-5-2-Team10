package com.tripfriend.domain.recruit.recruit.dto;

import com.tripfriend.domain.recruit.recruit.entity.Recruit;
import com.tripfriend.domain.recruit.recruit.entity.TravelStyle;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecruitListResponseDto {
    private Long recruitId;
//    private Member member;
//    private List<Apply> applies;
//    private Place place;
    private String title;
//    private String content;
    private boolean isClosed;
    private LocalDate startDate;
    private LocalDate endDate;
    private TravelStyle travelStyle;
    private boolean sameGender;
    private boolean sameAge;
    private Integer budget = 0;
    private Integer groupSize = 2;

    public RecruitListResponseDto(Recruit recruit){
        this.recruitId = recruit.getRecruitId();
//        this.member = recruit.getMember();
//        this.applies = recruit.getApplies();
//        this.place = recruit.getPlace();
        this.title = recruit.getTitle();
//        this.content = recruit.getContent();
        this.isClosed = recruit.isClosed();
        this.startDate = recruit.getStartDate();
        this.endDate = recruit.getEndDate();
        this.travelStyle = recruit.getTravelStyle();
        this.sameGender = recruit.isSameGender();
        this.sameAge = recruit.isSameAge();
        this.budget = recruit.getBudget();
        this.groupSize = recruit.getGroupSize();
    }
}
