package com.tripfriend.domain.place.place.service;

import com.tripfriend.domain.place.place.dto.PlaceCreateRequestDto;
import com.tripfriend.domain.place.place.entity.Place;
import com.tripfriend.domain.place.place.repository.PlaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PlaceService {
    private final PlaceRepository placeRepository;

    public Place createPlace(PlaceCreateRequestDto placeCreateRequestDto) {
        Place place = placeCreateRequestDto.toEntity();
        return placeRepository.save(place);
    }
}
