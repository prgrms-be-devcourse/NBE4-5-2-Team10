package com.tripfriend.domain.trip.schedule.service;

import com.tripfriend.domain.member.member.entity.Member;
import com.tripfriend.domain.member.member.repository.MemberRepository;
import com.tripfriend.domain.place.place.entity.Place;
import com.tripfriend.domain.place.place.repository.PlaceRepository;
import com.tripfriend.domain.trip.information.entity.TripInformation;
import com.tripfriend.domain.trip.information.repository.TripInformationRepository;
import com.tripfriend.domain.trip.information.service.TripInformationService;
import com.tripfriend.domain.trip.schedule.dto.TripScheduleReqDto;
import com.tripfriend.domain.trip.schedule.dto.TripScheduleResDto;
import com.tripfriend.domain.trip.schedule.dto.TripScheduleUpdateReqDto;
import com.tripfriend.domain.trip.schedule.entity.TripSchedule;
import com.tripfriend.domain.trip.schedule.repository.TripScheduleRepository;
import com.tripfriend.global.exception.ServiceException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TripScheduleService {

    private final TripScheduleRepository tripScheduleRepository;
    private final MemberRepository memberRepository;
    private final TripInformationService tripInformationService;

    // 여행 일정 생성
    @Transactional
    public TripScheduleResDto createSchedule(TripScheduleReqDto req) {

        // 회원 확인
        Member member = memberRepository.findById(req.getMemberId()).orElseThrow(
                () -> new ServiceException("404-1", "해당 회원이 존재하지 않습니다.")
        );

        // 여행 일정 생성 및 저장
        TripSchedule newSchedule = TripSchedule.builder()
                .member(member)
                .title(req.getTitle())
                .description(req.getDescription())
                .startDate(req.getStartDate())
                .endDate(req.getEndDate())
                .build();
        tripScheduleRepository.save(newSchedule);

        // TripInformation 추가 (여행지 정보)
        if (req.getTripInformations() != null && !req.getTripInformations().isEmpty()) {
            tripInformationService.addTripInformations(newSchedule, req.getTripInformations());
        }

        return new TripScheduleResDto(newSchedule);
    }

    // 전체 일정 조회
    @Transactional(readOnly = true)
    public List<TripScheduleResDto> getAllSchedules() {
        List<TripSchedule> schedules = tripScheduleRepository.findAll();

        if (schedules.isEmpty()) {
            throw new ServiceException("404-3", "여행 일정이 존재하지 않습니다.");
        }

        return schedules.stream()
                .map(TripScheduleResDto::new)
                .collect(Collectors.toList());
    }

    // 특정 회원의 여행 일정 조회
    @Transactional(readOnly = true)
    public List<TripScheduleResDto> getSchedulesByMemberId(Long memberId) {
        // 회원 존재 여부 검증
        if (!memberRepository.existsById(memberId)) {
            throw new ServiceException("404-1", "해당 회원이 존재하지 않습니다.");
        }

        // 회원 ID로 여행 일정 조회
        List<TripSchedule> schedules = tripScheduleRepository.findByMemberId(memberId);

        // 여행 일정 존재 여부 검증
        if (schedules.isEmpty()) {
            throw new ServiceException("404-3", "해당 회원의 여행 일정이 존재하지 않습니다.");
        }

        return schedules.stream()
                .map(TripScheduleResDto::new)
                .collect(Collectors.toList());
    }

    // 여행 일정 삭제
    @Transactional
    public void deleteSchedule(Long scheduleId) {
        TripSchedule schedule = tripScheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new ServiceException("404-1", "해당 일정이 존재하지 않습니다."));
        tripScheduleRepository.delete(schedule);
    }

    /**
     * 특정 여행 일정을 수정하는 메서드
     *
     * @param scheduleId 수정할 여행 일정의 ID
     * @param req        일정 수정 요청 DTO
     * @return 수정된 TripSchedule 객체
     */
    @Transactional
    public TripSchedule updateSchedule(Long scheduleId, TripScheduleUpdateReqDto req) {
        // 여행 일정이 존재하는지 확인
        TripSchedule schedule = tripScheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new ServiceException("404-1", "해당 일정이 존재하지 않습니다."));

        // 일정 정보 업데이트
        schedule.update(req.getTitle(), req.getDescription(), req.getStartDate(), req.getEndDate());

        return schedule;
    }
}
