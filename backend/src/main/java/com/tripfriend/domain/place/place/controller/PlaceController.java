package com.tripfriend.domain.place.place.controller;

import com.tripfriend.domain.place.place.dto.PlaceCreateReqDto;
import com.tripfriend.domain.place.place.entity.Place;
import com.tripfriend.domain.place.place.service.PlaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/place")
public class PlaceController {

    private final PlaceService placeService;

    // 여행 장소 등록
    @PostMapping
    public ResponseEntity<Place> createPlace(@RequestBody PlaceCreateReqDto placeCreateRequestDto){
        Place savePlace = placeService.createPlace(placeCreateRequestDto);
        return ResponseEntity.ok(savePlace);
    }

    // 모든 여행 장소 조회
    @GetMapping
    public ResponseEntity<List<Place>> getAllPlaces() {
        return ResponseEntity.ok(placeService.getAllPlaces());
    }

    // 여행 장소 - 단건 조회
    // 특정 장소 조회 (Read)
    @GetMapping("/{id}")
    public ResponseEntity<Place> getPlace(@PathVariable Long id) {
        return ResponseEntity.ok(placeService.getPlaceById(id));
    }
}
