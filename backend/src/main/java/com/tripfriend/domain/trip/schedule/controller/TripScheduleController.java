package com.tripfriend.domain.trip.schedule.controller;

import com.tripfriend.domain.trip.schedule.dto.TripScheduleReqDto;
import com.tripfriend.domain.trip.schedule.dto.TripScheduleResDto;
import com.tripfriend.domain.trip.schedule.entity.TripSchedule;
import com.tripfriend.domain.trip.schedule.service.TripScheduleService;
import com.tripfriend.global.dto.RsData;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/trip/schedule")
public class TripScheduleController {

    private final TripScheduleService scheduleService;

    // 일정 생성
    @PostMapping
    public RsData<TripScheduleResDto> createSchedule(@RequestBody TripScheduleReqDto reqBody) {
        System.out.println("확인" + reqBody);
        TripScheduleResDto schedule = scheduleService.createSchedule(reqBody);
        return new RsData<>(
                "200-1",
                "일정이 성공적으로 생성되었습니다.",
                schedule
        );
    }

    // 전체 일정 조회
    @GetMapping
    public RsData<List<TripScheduleResDto>> getAllSchedules() {
        List<TripScheduleResDto> schedules = scheduleService.getAllSchedules();
        return new RsData<>(
                "200-2",
                "전체 일정을 성공적으로 조회했습니다.",
                schedules
        );

    }

    // 특정 회원의 여행 일정 조회
    @GetMapping("/member/{memberId}")
    public RsData<List<TripScheduleResDto>> getSchedulesByMember(@PathVariable Long memberId) {
        List<TripScheduleResDto> schedules = scheduleService.getSchedulesByMemberId(memberId);
        return new RsData<>(
                "200-3",
                "특정 회원의 일정을 성공적으로 조회했습니다.",
                schedules
        );
    }

}
