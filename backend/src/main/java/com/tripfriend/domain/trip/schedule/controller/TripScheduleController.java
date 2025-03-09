package com.tripfriend.domain.trip.schedule.controller;

import com.tripfriend.domain.member.member.entity.Member;
import com.tripfriend.domain.member.member.repository.MemberRepository;
import com.tripfriend.domain.member.member.service.AuthService;
import com.tripfriend.domain.trip.schedule.dto.*;
import com.tripfriend.domain.trip.schedule.entity.TripSchedule;
import com.tripfriend.domain.trip.schedule.service.TripScheduleService;
import com.tripfriend.global.dto.RsData;
import com.tripfriend.global.exception.ServiceException;
import com.tripfriend.global.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/trip/schedule")
public class TripScheduleController {

    private final TripScheduleService scheduleService;
    private final AuthService authService;


    // 개인 일정 생성
    @PostMapping
    public RsData<TripScheduleResDto> createSchedule(@RequestBody TripScheduleReqDto reqBody,
                                                     @RequestHeader(value = "Authorization", required = false) String token) {


        // 일정 생성
        TripScheduleResDto schedule = scheduleService.createSchedule(reqBody, token);
        return new RsData<>(
                "200-1",
                "일정이 성공적으로 생성되었습니다.",
                schedule
        );
    }

    // 전체 일정 조회(필요없을지도)
    @GetMapping
    public RsData<List<TripScheduleResDto>> getAllSchedules() {
        List<TripScheduleResDto> schedules = scheduleService.getAllSchedules();
        return new RsData<>(
                "200-2",
                "전체 일정을 성공적으로 조회했습니다.",
                schedules
        );

    }

    // 로그인한 회원이 자신의 여행 일정을 조회
    @GetMapping("/my-schedules")
    public RsData<List<TripScheduleResDto>> getMySchedules(@RequestHeader(value = "Authorization", required = false) String token) {

        // 로그인 확인
        Member loggedInMember = authService.getLoggedInMember(token);

        // 회원 아이디 가져오기
        Long memberId = loggedInMember.getId();
        // 회원 이름 가져오기
        String memberName = loggedInMember.getUsername();


        List<TripScheduleResDto> schedules = scheduleService.getSchedulesByCreator(memberId);
        return new RsData<>(
                "200-6",
                "'%s'님이 생성한 일정 조회가 완료되었습니다.".formatted(memberName),
                schedules
        );
    }

    // 특정 회원의 여행 일정 조회(필요없음)
    @GetMapping("/member/{memberId}")
    public RsData<List<TripScheduleResDto>> getSchedulesByMember(@PathVariable Long memberId) {

        // 회원 이름 찾기
        String memberName = scheduleService.getMemberName(memberId);

        List<TripScheduleResDto> schedules = scheduleService.getSchedulesByMemberId(memberId);
        return new RsData<>(
                "200-3",
                "'%s'님의 일정을 성공적으로 조회했습니다.".formatted(memberName),
                schedules
        );
    }

    // 여행 일정 삭제
    @DeleteMapping("/my-schedules/{scheduleId}")
    public RsData<Void> deleteSchedule(@PathVariable Long scheduleId) {



        scheduleService.deleteSchedule(scheduleId);
        return new RsData<>(
                "200-4",
                "일정이 성공적으로 삭제되었습니다."
        );
    }


    // 특정 여행 일정을 수정
    @PutMapping("/{scheduleId}")
    public RsData<TripScheduleResDto> updateSchedule(
            @PathVariable Long scheduleId,
            @RequestBody @Valid TripScheduleUpdateReqDto req) {

        TripSchedule updatedSchedule = scheduleService.updateSchedule(scheduleId, req);
        TripScheduleResDto resDto = new TripScheduleResDto(updatedSchedule); // 반환 DTO
        return new RsData<>(
                "200-5",
                "일정이 성공적으로 수정되었습니다.",
                resDto
        );
    }

    @PutMapping("/update")
    public RsData<TripUpdateResDto> updateTrip(@RequestBody @Valid TripUpdateReqDto reqDto) {
        TripUpdateResDto resTrip = scheduleService.updateTrip(reqDto);
        return new RsData<>(
                "200-1",
                "여행 일정 및 여행 정보가 성공적으로 수정되었습니다.",
                resTrip
        );
    }

}
