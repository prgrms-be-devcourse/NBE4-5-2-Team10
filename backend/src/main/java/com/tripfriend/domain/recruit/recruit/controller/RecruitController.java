package com.tripfriend.domain.recruit.recruit.controller;

import com.tripfriend.domain.recruit.recruit.dto.RecruitCreateRequestDto;
import com.tripfriend.domain.recruit.recruit.dto.RecruitDetailResponseDto;
import com.tripfriend.domain.recruit.recruit.dto.RecruitListResponseDto;
import com.tripfriend.domain.recruit.recruit.dto.RecruitUpdateRequestDto;
import com.tripfriend.domain.recruit.recruit.entity.Recruit;
import com.tripfriend.domain.recruit.recruit.service.RecruitService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/recruits")
public class RecruitController {
    private final RecruitService recruitService;

    @GetMapping("/{recruitId}") // 이름 맞춰주기
    public RecruitDetailResponseDto getRecruit(@PathVariable("recruitId") Long recruitId) {
        return recruitService.findById(recruitId);
    }

    @GetMapping
    public List<RecruitListResponseDto> getRecruits(){
        return recruitService.findAll();
    }

    @PostMapping
    public RecruitDetailResponseDto createRecruit (@RequestBody RecruitCreateRequestDto recruitCreateRequestDto) {
        return recruitService.create(recruitCreateRequestDto);
    }

    @PutMapping// 일단 put으로 통일
    public RecruitDetailResponseDto updateRecruit(@RequestBody RecruitUpdateRequestDto recruitUpdateRequestDto) {
        return recruitService.update(recruitUpdateRequestDto);
    }

    @DeleteMapping("/{recruitId}")
    public void deleteRecruit(@PathVariable("recruitId") Long recruitId){ // 이름 명시
        recruitService.delete(recruitId);
    }


}
