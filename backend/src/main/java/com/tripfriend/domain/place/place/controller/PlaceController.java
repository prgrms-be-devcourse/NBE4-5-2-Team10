package com.tripfriend.domain.place.place.controller;

import com.tripfriend.domain.place.place.dto.PlaceCreateReqDto;
import com.tripfriend.domain.place.place.dto.PlaceResDto;
import com.tripfriend.domain.place.place.dto.PlaceUpdateReqDto;
import com.tripfriend.domain.place.place.entity.Place;
import com.tripfriend.domain.place.place.service.PlaceService;
import com.tripfriend.global.dto.RsData;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
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
    public RsData<PlaceResDto> createPlace(@RequestBody PlaceCreateReqDto req,
                                           @RequestParam("image")MultipartFile image) throws IOException {

        String fileName = null;

        if (!image.isEmpty()) {
            String uploadDir = "src/main/resources/static/";
            File uploadDirFile = new File(uploadDir);

            if (!uploadDirFile.exists()) {
                uploadDirFile.mkdirs();
            }

            fileName = image.getOriginalFilename();
            Path filePath = Paths.get(uploadDir + fileName);

            image.transferTo(filePath);
        }

        Place savePlace = placeService.createPlace(req, fileName);
        PlaceResDto placeResDto = new PlaceResDto(savePlace);
        return new RsData<>(
                "200-1",
                "여행지가 성공적으로 등록되었습니다.",
                placeResDto
        );
    }

    // 전체 여행지 조회
    @GetMapping
    @Operation(summary = "전체 여행지 조회")
    public RsData<List<PlaceResDto>> getAllPlaces() {
        List<Place> places = placeService.getAllPlaces();
        List<PlaceResDto> placeResDtos = places.stream().map(PlaceResDto::new).toList();
        return new RsData<>(
                "200-2",
                "전체 여행지가 성공적으로 조회되었습니다.",
                placeResDtos
        );
    }

    // 특정 여행지 조회 - 단건 조회
    @GetMapping("/{id}")
    @Operation(summary = "여행지 조회")
    public RsData<PlaceResDto> getPlace(@Parameter(description = "여행지 ID", required = true, example = "1")
                                        @PathVariable Long id) {
        Place place = placeService.getPlace(id);
        PlaceResDto placeResDto = new PlaceResDto(place);
        return new RsData<>(
                "200-3",
                "여행지가 성공적으로 조회되었습니다.",
                placeResDto
        );
    }

    // 특정 여행지 삭제
    @DeleteMapping("/{id}")
    @Operation(summary = "여행지 삭제")
    public RsData<Void> deletePlace(@Parameter(description = "여행지 ID", required = true, example = "1")
                                    @PathVariable Long id) {
        Place place = placeService.getPlace(id);
        placeService.deletePlace(place);
        return new RsData<>(
                "200-4",
                "여행지가 성공적으로 삭제되었습니다."
        );
    }

    // 특정 여행지 정보 수정
    @PutMapping("/{id}")
    @Operation(summary = "여행지 정보 수정")
    public RsData<PlaceResDto> updatePlace(@Parameter(description = "여행지 ID", required = true, example = "1")
                                           @PathVariable Long id,
                                           @RequestBody PlaceUpdateReqDto placeUpdateReqDto) {
        Place place = placeService.getPlace(id);
        Place updatePlace = placeService.updatePlace(place, placeUpdateReqDto);
        PlaceResDto placeResDto = new PlaceResDto(updatePlace);
        return new RsData<>(
                "200-5",
                "여행지 정보가 성공적으로 수정되었습니다.",
                placeResDto
        );
    }
}
