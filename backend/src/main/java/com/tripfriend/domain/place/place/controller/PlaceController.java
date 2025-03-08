package com.tripfriend.domain.place.place.controller;

import com.tripfriend.domain.place.place.dto.PlaceCreateReqDto;
import com.tripfriend.domain.place.place.dto.PlaceResDto;
import com.tripfriend.domain.place.place.dto.PlaceUpdateReqDto;
import com.tripfriend.domain.place.place.entity.Place;
import com.tripfriend.domain.place.place.service.PlaceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/place")
@Tag(name = "Place API", description = "여행지 관련 기능을 제공합니다.")
public class PlaceController {

    private final PlaceService placeService;

    // 여행지 등록
    @PostMapping
    @Operation(summary = "여행지 등록")
    public ResponseEntity<Place> createPlace(@RequestBody PlaceCreateReqDto placeCreateRequestDto) {
        Place savePlace = placeService.createPlace(placeCreateRequestDto);
        return ResponseEntity.ok(savePlace);
    }

    // 전체 여행지 조회
    @GetMapping
    @Operation(summary = "전체 여행지 조회")
    public ResponseEntity<List<Place>> getAllPlaces() {
        return ResponseEntity.ok(placeService.getAllPlaces());
    }

    // 여행지 조회 - 단건 조회
    @GetMapping("/{id}")
    @Operation(summary = "여행지 조회")
    public ResponseEntity<Place> getPlace(@PathVariable Long id) {
        Place place = placeService.getPlace(id).orElseThrow(
                () -> new RuntimeException("존재하지 않는 장소입니다.")
        );

        return ResponseEntity.ok(place);
    }

    // 여행지 삭제
    @DeleteMapping("/{id}")
    @Operation(summary = "여행지 삭제")
    public ResponseEntity<Void> deletePlace(@PathVariable Long id) {

        Place place = placeService.getPlace(id).orElseThrow(
                () -> new RuntimeException("존재하지 않는 장소입니다.")
        );

        placeService.deletePlace(place);
        return ResponseEntity.noContent().build();
    }

    // 여행지 정보 수정
    @PutMapping("/{id}")
    @Operation(summary = "여행지 정보 수정")
    public ResponseEntity<PlaceResDto> updatePlace(@PathVariable Long id, @RequestBody PlaceUpdateReqDto placeUpdateReqDto) {
        Place place = placeService.getPlace(id).orElseThrow(
                () -> new RuntimeException("존재하지 않는 장소입니다.")
        );

        PlaceResDto updatePlace = placeService.updatePlace(place, placeUpdateReqDto);
        return ResponseEntity.ok(updatePlace);
    }


}
