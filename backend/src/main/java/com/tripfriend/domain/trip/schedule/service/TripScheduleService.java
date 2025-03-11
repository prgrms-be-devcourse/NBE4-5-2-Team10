package com.tripfriend.domain.trip.schedule.service;

import com.tripfriend.domain.member.member.entity.Member;
import com.tripfriend.domain.member.member.repository.MemberRepository;
import com.tripfriend.domain.member.member.service.AuthService;
import com.tripfriend.domain.place.place.entity.Place;
import com.tripfriend.domain.place.place.repository.PlaceRepository;
import com.tripfriend.domain.trip.information.dto.TripInformationResDto;
import com.tripfriend.domain.trip.information.dto.TripInformationUpdateReqDto;
import com.tripfriend.domain.trip.information.entity.TripInformation;
import com.tripfriend.domain.trip.information.repository.TripInformationRepository;
import com.tripfriend.domain.trip.information.service.TripInformationService;
import com.tripfriend.domain.trip.schedule.dto.*;
import com.tripfriend.domain.trip.schedule.entity.TripSchedule;
import com.tripfriend.domain.trip.schedule.repository.TripScheduleRepository;
import com.tripfriend.global.exception.ServiceException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TripScheduleService {

    private final TripScheduleRepository tripScheduleRepository;
    private final MemberRepository memberRepository;
    private final TripInformationService tripInformationService;
    private final TripInformationRepository tripInformationRepository;
    private final AuthService authService;
    private final PlaceRepository placeRepository;

    /**
     * 현재 로그인한 회원객체를 반환하는 메서드
     *
     * @param token JWT 토큰
     * @return 로그인한 회원 객체
     * @throws ServiceException 로그인하지 않은 경우 예외 발생
     */
    public Member getLoggedInMember(String token) {
        // 로그인 여부 확인 및 회원 정보 가져오기
        Member member = authService.getLoggedInMember(token);

        if (member == null) {
            throw new ServiceException("401-1", "로그인이 필요합니다.");
        }

        return member;
    }

    // 여행 일정 생성
    @Transactional
    public TripScheduleInfoResDto createSchedule(TripScheduleReqDto req, String token) {
        // 로그인 한 회원 객체 가져오기
        Member member = getLoggedInMember(token);

        // 여행 일정 생성 및 저장
        TripSchedule newSchedule = TripSchedule.builder()
                .member(member)
                .title(req.getTitle())
                .description(req.getDescription())
                .startDate(req.getStartDate())
                .endDate(req.getEndDate())
                .build();
        tripScheduleRepository.save(newSchedule);

        // 여행 정보 저장 (Service 메서드 활용)
        if (req.getTripInformations() != null && !req.getTripInformations().isEmpty()) {
            tripInformationService.addTripInformations(newSchedule, req.getTripInformations());
        }

        // TripInformation을 TripInformationResDto로 변환
        List<TripInformationResDto> tripInfoDtos = Optional.ofNullable(req.getTripInformations())
                .orElse(List.of())
                .stream()
                .map(tripInfo -> {
                    Place place = placeRepository.findById(tripInfo.getPlaceId())
                            .orElseThrow(() -> new ServiceException("404-2", "해당 장소가 존재하지 않습니다."));

                    return new TripInformationResDto(
                            tripInfo.getPlaceId(),
                            place.getCityName(),
                            place.getPlaceName(),
                            tripInfo.getVisitTime(),
                            tripInfo.getDuration(),
                            tripInfo.getTransportation(),
                            tripInfo.getCost(),
                            tripInfo.getNotes(),
                            tripInfo.getPriority(),
                            false
                    );
                })
                .collect(Collectors.toList());

        return new TripScheduleInfoResDto(newSchedule, tripInfoDtos);
    }

    // 전체 일정 조회(필요없을듯)
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

    // 회원 이름 조회(필요없을듯)
    @Transactional(readOnly = true)
    public String getMemberName(Long memberId) {
        return memberRepository.findById(memberId)
                .map(Member::getUsername)
                .orElseThrow(() -> new ServiceException("404-1", "해당 회원이 존재하지 않습니다."));
    }

    // 특정 회원의 여행 일정 조회(필요없을듯)
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


    /**
     * 로그인한 회원이 자신의 여행 일정을 삭제하는 메서드
     *
     * @param scheduleId 삭제할 일정 ID
     * @param token      JWT 토큰 (로그인된 사용자 확인)
     * @throws ServiceException 로그인되지 않았거나, 권한이 없는 경우 예외 발생
     */
    @Transactional
    public void deleteSchedule(Long scheduleId,
                               String token) {

        // 로그인한 회원 ID 가져오기
        Member member = getLoggedInMember(token);

        TripSchedule schedule = tripScheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new ServiceException("404-1", "일정이 존재하지 않습니다."));

        // 현재 로그인한 사용자가 일정 생성자인지 확인
        if (!schedule.getMember().getId().equals(member.getId())) {
            throw new ServiceException("403-1", "본인이 생성한 일정만 삭제할 수 있습니다.");
        }

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
        schedule.updateSchedule(req);

        return schedule;
    }

    // 여행 일정 및 여행 정보 통합 수정 메서드
    @Transactional
    public TripUpdateResDto updateTrip(@Valid TripUpdateReqDto reqDto, String token) {
        // 로그인한 회원 정보 가져오기
        Member member = getLoggedInMember(token);

        // 여행 일정 확인
        TripSchedule tripSchedule = tripScheduleRepository.findById(reqDto.getTripScheduleId())
                .orElseThrow(() -> new ServiceException("404-1", "해당 일정이 존재하지 않습니다."));

        // 현재 로그인한 사용자가 일정 생성자인지 확인
        if (!tripSchedule.getMember().getId().equals(member.getId())) {
            throw new ServiceException("403-1", "본인이 생성한 일정만 수정할 수 있습니다.");
        }

        // 여행 일정 수정
        tripSchedule.updateSchedule(reqDto.getScheduleUpdate());

        // 여행 정보 수정
        List<TripInformation> updatedTripInformations = reqDto.getTripInformationUpdates().stream()
                .map(infoUpdate -> {
                    TripInformation tripInfo = tripInformationRepository.findById(infoUpdate.getTripInformationId())
                            .orElseThrow(() -> new ServiceException("404-2", "해당 여행 정보가 존재하지 않습니다."));

                    // 본인 확인
                    if (!tripInfo.getTripSchedule().getMember().getId().equals(member.getId())) {
                        throw new ServiceException("403-2", "본인이 생성한 일정의 여행 정보만 수정할 수 있습니다.");
                    }

                    tripInfo.updateTripInformation(infoUpdate);
                    return tripInfo;
                })
                .toList();

        return new TripUpdateResDto(tripSchedule, updatedTripInformations);
    }

    // 특정 회원이 생성한 여행 일정 조회
    @Transactional(readOnly = true)
    public List<TripScheduleResDto> getSchedulesByCreator(String token) {

        // 로그인한 회원 정보 가져오기
        Member member = getLoggedInMember(token);

        // 회원 ID를 기반으로 해당 회원이 만든 여행 일정들을 조회
        List<TripSchedule> schedules = tripScheduleRepository.findByMemberId(member.getId());

        // 여행 일정이 존재하지 않는 경우 예외 발생
        if (schedules.isEmpty()) {
            throw new ServiceException("404-3", "해당 회원의 여행 일정이 존재하지 않습니다.");
        }

        // 조회한 TripSchedule 엔티티 리스트를 TripScheduleResDto 리스트로 변환하여 반환
        return schedules.stream()
                .map(TripScheduleResDto::new)
                .collect(Collectors.toList());
    }

    // 특정 회원이 생성한 여행 일정의 세부 정보 조회
    @Transactional
    public List<TripScheduleInfoResDto> getTripInfo(String token, Long id) {

        // 로그인한 회원 정보 가져오기
        Member member = getLoggedInMember(token);

        // 일정 조회
        TripSchedule schedule = tripScheduleRepository.findById(id)
                .orElseThrow(() -> new ServiceException("404-1", "해당 일정이 존재하지 않습니다"));

        // 본인 확인
        if (!schedule.getMember().getId().equals(member.getId())) {
            throw new ServiceException("403-1", "본인이 생성한 일정만 조회할 수 있습니다.");
        }

        // 여행 일정에 포함된 여행 정보 조회 후 DTO 변환
        List<TripInformationResDto> tripInformations = tripInformationRepository.findByTripScheduleId(id)
                .stream()
                .map(TripInformationResDto::new) // DTO 변환
                .collect(Collectors.toList());

        return List.of(new TripScheduleInfoResDto(schedule, tripInformations));
    }

}



