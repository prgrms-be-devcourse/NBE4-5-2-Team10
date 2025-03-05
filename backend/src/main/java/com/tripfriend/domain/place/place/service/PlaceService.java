package com.tripfriend.domain.place.place.service;

import com.tripfriend.domain.place.place.dto.PlaceCreateReqDto;
import com.tripfriend.domain.place.place.dto.PlaceResDto;
import com.tripfriend.domain.place.place.dto.PlaceUpdateReqDto;
import com.tripfriend.domain.place.place.entity.Place;
import com.tripfriend.domain.place.place.repository.PlaceRepository;
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
    public Place createPlace(PlaceCreateReqDto placeCreateRequestDto) {
        Place place = placeCreateRequestDto.toEntity();
        return placeRepository.save(place);
    }

    // 여행 장소 전체 리스트 조회
    public List<Place> getAllPlaces() {
        return placeRepository.findAll();
    }

    // 여행 장소 단건 조회
    public Optional<Place> getPlace(Long id) {
        return placeRepository.findById(id);
    }

    // 여행 장소 삭제
    @Transactional
    public void deletePlace(Place place) {
        placeRepository.delete(place);
    }

    // 여행 장소 수정
    @Transactional
    public PlaceResDto updatePlace(Place place, PlaceUpdateReqDto placeUpdateReqDto) {
        place.setCityName(placeUpdateReqDto.getCityName());
        place.setPlaceName(placeUpdateReqDto.getPlaceName());
        place.setDescription(placeUpdateReqDto.getDescription());
        place.setCategory(placeUpdateReqDto.getCategory());

        Place updatePlace = placeRepository.save(place);
        return new PlaceResDto(updatePlace);
    }
}
