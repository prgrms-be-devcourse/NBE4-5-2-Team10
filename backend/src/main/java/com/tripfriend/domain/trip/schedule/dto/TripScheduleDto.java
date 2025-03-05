package com.tripfriend.domain.trip.schedule.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Builder
public class TripScheduleDto {
    private Long id;
    private Long memberId;
    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private List<Long> placeIds; // 여러개의 여행지 ID
}
