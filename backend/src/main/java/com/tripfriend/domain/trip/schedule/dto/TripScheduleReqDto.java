package com.tripfriend.domain.trip.schedule.dto;

import com.tripfriend.domain.trip.information.dto.TripInformationReqDto;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@NoArgsConstructor
public class TripScheduleReqDto {
    private Long memberId;
    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private List<TripInformationReqDto> tripInformations;
}
