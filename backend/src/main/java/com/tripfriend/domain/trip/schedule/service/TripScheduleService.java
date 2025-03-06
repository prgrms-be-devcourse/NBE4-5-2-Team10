package com.tripfriend.domain.trip.schedule.service;

import com.tripfriend.domain.member.member.entity.Member;
import com.tripfriend.domain.member.member.repository.MemberRepository;
import com.tripfriend.domain.place.place.entity.Place;
import com.tripfriend.domain.place.place.repository.PlaceRepository;
import com.tripfriend.domain.trip.information.entity.TripInformation;
import com.tripfriend.domain.trip.information.repository.TripInformationRepository;
import com.tripfriend.domain.trip.schedule.dto.TripScheduleReqDto;
import com.tripfriend.domain.trip.schedule.dto.TripScheduleResDto;
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
    private final PlaceRepository placeRepository;
    private final TripInformationRepository tripInformationRepository;

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

        // TripInformation 테이블에 여행지 정보 저장(N:M 관계)
        List<TripInformation> tripInformations = req.getTripInformations()
                .stream()
                .map(infoReq ->{
                    if (infoReq.getPlaceId()==null){
                        throw new ServiceException("400-2", "장소 ID가 누락 되었습니다.");
                    }
                    Place place = placeRepository.findById(infoReq.getPlaceId()).orElseThrow(
                            () -> new ServiceException("404-1", "해당 장소가 존재하지 않습니다.")
                    ); // 여행 장소 확인
                    return TripInformation.builder()
                            .tripSchedule(newSchedule)
                            .place(place)
                            .visitTime(infoReq.getVisitTime())
                            .duration(infoReq.getDuration())
                            .transportation(infoReq.getTransportation())
                            .cost(infoReq.getCost())
                            .notes(infoReq.getNotes())
                            .priority(infoReq.getPriority())
                            .isVisited(infoReq.isVisited())
                            .build();
                }).collect(Collectors.toList());

        tripInformationRepository.saveAll(tripInformations);
        return new TripScheduleResDto(newSchedule);
    }
}
