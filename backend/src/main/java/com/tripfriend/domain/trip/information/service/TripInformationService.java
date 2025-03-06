package com.tripfriend.domain.trip.information.service;

import com.tripfriend.domain.place.place.entity.Place;
import com.tripfriend.domain.place.place.repository.PlaceRepository;
import com.tripfriend.domain.trip.information.dto.TripInformationReqDto;
import com.tripfriend.domain.trip.information.entity.TripInformation;
import com.tripfriend.domain.trip.information.repository.TripInformationRepository;
import com.tripfriend.domain.trip.schedule.entity.TripSchedule;
import com.tripfriend.global.exception.ServiceException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TripInformationService {

    private final TripInformationRepository tripInformationRepository;
    private final PlaceRepository placeRepository;

    // 여행 정보 등록
    @Transactional
    public void addTripInformations(TripSchedule schedule, List<TripInformationReqDto> tripInfoReqs) {

        // 요청된 여행지 정보가 없을 경우 처리 x
        if (tripInfoReqs == null || tripInfoReqs.isEmpty()) {
            return;
        }

        // TripInformation 리스트 생성 및 매핑
        List<TripInformation> tripInformations = tripInfoReqs.stream()
                .map(infoReq -> {
                    if (infoReq.getPlaceId() == null) {
                        throw new ServiceException("400-2", "장소 ID가 누락되었습니다.");
                    }

                    // 장소 검증
                    Place place = placeRepository.findById(infoReq.getPlaceId()).orElseThrow(
                            () -> new ServiceException("404-2", "해당 장소가 존재하지 않습니다.")
                    );

                    // 객체 생성 및 저장
                    return TripInformation.builder()
                            .tripSchedule(schedule)
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

        // 생성된 TripInformation 목록 저장
        tripInformationRepository.saveAll(tripInformations);

        // 여행 일정에 TripInformation 추가
        schedule.addTripInformations(tripInformations);
    }
}
