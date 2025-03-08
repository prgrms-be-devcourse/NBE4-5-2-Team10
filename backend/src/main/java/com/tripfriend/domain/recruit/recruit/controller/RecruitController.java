package com.tripfriend.domain.recruit.recruit.controller;

import com.tripfriend.domain.recruit.recruit.dto.RecruitRequestDto;
import com.tripfriend.domain.recruit.recruit.dto.RecruitDetailResponseDto;
import com.tripfriend.domain.recruit.recruit.dto.RecruitListResponseDto;
import com.tripfriend.domain.recruit.recruit.service.RecruitService;
import com.tripfriend.global.dto.RsData;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
