package com.tripfriend.domain.place.place.service;

import com.tripfriend.domain.place.place.dto.PlaceCreateReqDto;
import com.tripfriend.domain.place.place.entity.Place;
import com.tripfriend.domain.place.place.repository.PlaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlaceService {
    private final PlaceRepository placeRepository;

    public Place createPlace(PlaceCreateReqDto placeCreateRequestDto) {
        Place place = placeCreateRequestDto.toEntity();
        return placeRepository.save(place);
    }

    public List<Place> getAllPlaces() {
        return placeRepository.findAll();
    }

    public Place getPlaceById(Long id) {
        return placeRepository.findById(id).orElseThrow(
                ()->new RuntimeException("존재하지 않는 장소입니다.")
        );
    }
}
