package com.tripfriend.domain.place.place.controller;

import com.tripfriend.domain.place.place.dto.PlaceCreateReqDto;
import com.tripfriend.domain.place.place.dto.PlaceResDto;
import com.tripfriend.domain.place.place.dto.PlaceUpdateReqDto;
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
    public ResponseEntity<Place> createPlace(@RequestBody PlaceCreateReqDto placeCreateRequestDto) {
        Place savePlace = placeService.createPlace(placeCreateRequestDto);
        return ResponseEntity.ok(savePlace);
    }

    // 모든 여행 장소 조회
    @GetMapping
    public ResponseEntity<List<Place>> getAllPlaces() {
        return ResponseEntity.ok(placeService.getAllPlaces());
    }

    // 여행 장소 - 단건 조회
    @GetMapping("/{id}")
    public ResponseEntity<Place> getPlace(@PathVariable Long id) {
        Place place = placeService.getPlace(id).orElseThrow(
                () -> new RuntimeException("존재하지 않는 장소입니다.")
        );

        return ResponseEntity.ok(place);
    }

    // 여행 장소 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlace(@PathVariable Long id) {

        Place place = placeService.getPlace(id).orElseThrow(
                () -> new RuntimeException("존재하지 않는 장소입니다.")
        );

        placeService.deletePlace(place);
        return ResponseEntity.noContent().build();
    }

    // 여행 장소 수정
    @PutMapping("/{id}")
    public ResponseEntity<PlaceResDto> updatePlace(@PathVariable Long id, @RequestBody PlaceUpdateReqDto placeUpdateReqDto) {
        Place place = placeService.getPlace(id).orElseThrow(
                () -> new RuntimeException("존재하지 않는 장소입니다.")
        );

        PlaceResDto updatePlace = placeService.updatePlace(place, placeUpdateReqDto);
        return ResponseEntity.ok(updatePlace);
    }


}
