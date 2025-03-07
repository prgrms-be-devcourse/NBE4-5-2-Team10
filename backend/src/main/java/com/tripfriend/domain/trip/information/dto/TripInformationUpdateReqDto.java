package com.tripfriend.domain.trip.information.dto;

import com.tripfriend.domain.trip.information.entity.Transportation;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TripInformationUpdateReqDto {
    @NotNull
    private Long placeId; // 장소 ID

    @NotNull
    private LocalDateTime visitTime;

    @NotNull
    private Integer duration;

    private Transportation transportation;
    private int cost;
    private String notes;
}
