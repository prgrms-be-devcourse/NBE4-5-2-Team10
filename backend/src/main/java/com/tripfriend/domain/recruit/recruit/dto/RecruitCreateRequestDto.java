package com.tripfriend.domain.recruit.recruit.dto;

import com.tripfriend.domain.member.member.entity.Member;
import com.tripfriend.domain.place.place.entity.Place;
import com.tripfriend.domain.recruit.apply.entity.Apply;
import com.tripfriend.domain.recruit.recruit.entity.Recruit;
import com.tripfriend.domain.recruit.recruit.entity.TravelStyle;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecruitCreateRequestDto {
//    private Member member;
//    private List<Apply> applies;
//    private Place place;
    private String title;
    private String content;
    private boolean isClosed;
    private LocalDate startDate;
    private LocalDate endDate;
    private TravelStyle travelStyle;
    private boolean sameGender;
    private boolean sameAge;
    private Integer budget = 0;
    private Integer groupSize = 2;

    public Recruit toEntity(){
        return Recruit.builder()
//                .member(member)
//                .applies(applies)
//                .place(place)
                .title(title)
                .content(content)
                .isClosed(isClosed)
                .startDate(startDate)
                .endDate(endDate)
                .travelStyle(travelStyle)
                .sameGender(sameGender)
                .sameAge(sameAge)
                .budget(budget)
                .groupSize(groupSize)
                .build();
    }
}
