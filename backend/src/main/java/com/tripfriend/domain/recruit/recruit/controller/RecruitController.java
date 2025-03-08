package com.tripfriend.domain.recruit.recruit.controller;

import com.tripfriend.domain.recruit.recruit.dto.RecruitRequestDto;
import com.tripfriend.domain.recruit.recruit.dto.RecruitDetailResponseDto;
import com.tripfriend.domain.recruit.recruit.dto.RecruitListResponseDto;
import com.tripfriend.domain.recruit.recruit.entity.Recruit;
import com.tripfriend.domain.recruit.recruit.service.RecruitService;
import com.tripfriend.global.dto.RsData;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/recruits")
public class RecruitController {
    private final RecruitService recruitService;

    @GetMapping("/{recruitId}") // 이름 맞춰주기
    public RsData<RecruitDetailResponseDto> getRecruit(@PathVariable("recruitId") Long recruitId) {
        return new RsData<>("200-3", "동행 모집 글이 성공적으로 조회되었습니다.", recruitService.findById(recruitId));
    }

    @GetMapping
    public RsData<List<RecruitListResponseDto>> getRecruits(){
        return new RsData<>("200-3", "동행 모집 글 목록이 성공적으로 조회되었습니다.", recruitService.findAll());
    }

    @GetMapping("/search")
    public RsData<List<RecruitListResponseDto>> searchRecruits(@RequestParam("keyword") String keyword){
        return new RsData<>("200-3", "동행 모집 글이 제목과 내용으로 성공적으로 검색되었습니다.", recruitService.searchRecruits(keyword));
    }

    @GetMapping("/search2")
    public RsData<List<RecruitListResponseDto>> findRecruitsByIsClosed(@RequestParam("isClosed") Boolean isClosed){
        return new RsData<>("200-3", "동행 모집 글이 모집여부로 성공적으로 검색되었습니다.", recruitService.searchByIsClosed(isClosed));
    }

    @GetMapping("/search3")
    public RsData<List<RecruitListResponseDto>> searchAndFilter(
            @RequestParam(name = "keyword") Optional<String> keyword,
            @RequestParam(name = "cityName") Optional<String> cityName,
            @RequestParam(name = "isClosed") Optional<Boolean> isClosed,
            @RequestParam(name = "startDate") Optional<LocalDate> startDate,
            @RequestParam(name = "endDate") Optional<LocalDate> endDate,
            @RequestParam(name = "travelStyle") Optional<String> travelStyle,
            @RequestParam(name = "sameGender") Optional<Boolean> sameGender,
            @RequestParam(name = "sameAge") Optional<Boolean> sameAge,
            @RequestParam(name = "minBudget") Optional<Integer> minBudget,
            @RequestParam(name = "maxBudget") Optional<Integer> maxBudget,
            @RequestParam(name = "minGroupSize") Optional<Integer> minGroupSize,
            @RequestParam(name = "maxGroupSize") Optional<Integer> maxGroupSize,
            @RequestParam(name = "sortBy") Optional<String> sortBy
    ) {

        return new RsData<>("200-3", "동행 모집 글이 여러 조건으로 성공적으로 검색되었습니다.", recruitService.searchAndFilter(
                keyword, cityName, isClosed, startDate, endDate,
                travelStyle, sameGender, sameAge, minBudget, maxBudget, minGroupSize, maxGroupSize, sortBy
        ));
    }

    @PostMapping
    public RsData<RecruitDetailResponseDto> createRecruit (@RequestBody RecruitRequestDto requestDto) {
        return new RsData<>("201-3", "동행 모집 글이 성공적으로 등록되었습니다.", recruitService.create(requestDto));
    }

    @PutMapping("/{recruitId}")// 일단 put으로 통일
    public RsData<RecruitDetailResponseDto> updateRecruit(@PathVariable("recruitId") Long recruitId, @RequestBody RecruitRequestDto requestDto) {
        return new RsData<>("200-3", "동행 모집 글이 성공적으로 수정되었습니다.", recruitService.update(recruitId, requestDto));
    }

    @DeleteMapping("/{recruitId}")
    public RsData<Void> deleteRecruit(@PathVariable("recruitId") Long recruitId){ // 이름 명시
        recruitService.delete(recruitId);
        return new RsData<>("200-3", "동행 모집 글이 성공적으로 삭제되었습니다.");
    }
}
