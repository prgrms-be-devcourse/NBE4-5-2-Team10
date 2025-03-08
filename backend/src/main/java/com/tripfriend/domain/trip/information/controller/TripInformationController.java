package com.tripfriend.domain.trip.information.controller;

import com.tripfriend.domain.trip.information.dto.TripInformationResDto;
import com.tripfriend.domain.trip.information.dto.TripInformationUpdateReqDto;
import com.tripfriend.domain.trip.information.entity.TripInformation;
import com.tripfriend.domain.trip.information.service.TripInformationService;
import com.tripfriend.global.dto.RsData;
import jakarta.persistence.Entity;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/trip/information")
public class TripInformationController {
    private final TripInformationService tripInformationService;


    // 특정 여행 정보를 수정
    @PutMapping("/{tripInfoId}")
    public RsData<TripInformationResDto> updateTripInformation(
            @PathVariable Long tripInfoId,
            @RequestBody @Valid TripInformationUpdateReqDto request) {

        TripInformation updatedTripInfo = tripInformationService.updateTripInformation(tripInfoId, request);
        TripInformationResDto resDto = new TripInformationResDto(updatedTripInfo);// 반환 DTO
        return new RsData<>(
                "200-1",
                "여행 정보가 성공적으로 수정되었습니다.",
                resDto
        );
    }

}
