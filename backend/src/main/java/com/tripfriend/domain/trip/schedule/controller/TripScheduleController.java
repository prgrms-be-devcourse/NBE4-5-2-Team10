package com.tripfriend.domain.trip.schedule.controller;

import com.tripfriend.domain.trip.schedule.dto.TripScheduleReqDto;
import com.tripfriend.domain.trip.schedule.dto.TripScheduleResDto;
import com.tripfriend.domain.trip.schedule.entity.TripSchedule;
import com.tripfriend.domain.trip.schedule.service.TripScheduleService;
import com.tripfriend.global.dto.RsData;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/trip/schedule")
public class TripScheduleController {

    private final TripScheduleService scheduleService;

    // 일정 생성
    @PostMapping
    public RsData<TripScheduleResDto> createSchedule(@RequestBody TripScheduleReqDto reqBody) {
        System.out.println("확인"+reqBody);
        TripScheduleResDto schedule = scheduleService.createSchedule(reqBody);
        return new RsData<>(
                "200-1",
                "일정이 성공적으로 생성되었습니다.",
                schedule
        );
    }

}
