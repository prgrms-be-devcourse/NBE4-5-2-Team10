package com.tripfriend.domain.place.place.service;

import com.tripfriend.domain.place.place.dto.PlaceCreateReqDto;
import com.tripfriend.domain.place.place.dto.PlaceResDto;
import com.tripfriend.domain.place.place.dto.PlaceUpdateReqDto;
import com.tripfriend.domain.place.place.entity.Place;
import com.tripfriend.domain.place.place.repository.PlaceRepository;
import com.tripfriend.global.exception.ServiceException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PlaceService {
    private final PlaceRepository placeRepository;

    // 여행 장소 등록
    public Place createPlace(PlaceCreateReqDto req, String fileName) {
        Place place = Place.builder()
                .cityName(req.getCityName())
                .placeName(req.getPlaceName())
                .description(req.getDescription())
                .category(req.getCategory())
                .imageUrl("http://localhost:8080/"+fileName)
                .build();
        placeRepository.save(place);

        return place;
    }

    // 여행 장소 전체 리스트 조회
    public List<Place> getAllPlaces() {
        List<Place> places = placeRepository.findAll();
        return places;
    }

    // 여행 장소 단건 조회
    public Place getPlace(Long id) {
        return placeRepository.findById(id)
                .orElseThrow(() -> new ServiceException("404-1", "해당 장소가 존재하지 않습니다."));
    }

    // 여행 장소 삭제
    @Transactional
    public void deletePlace(Place place) {
        placeRepository.delete(place);
    }

    // 여행 장소 수정
    @Transactional
    public Place updatePlace(Place place, PlaceUpdateReqDto req) {
        place.setCityName(req.getCityName());
        place.setPlaceName(req.getPlaceName());
        place.setDescription(req.getDescription());
        place.setCategory(req.getCategory());

        return placeRepository.save(place);
    }
}
