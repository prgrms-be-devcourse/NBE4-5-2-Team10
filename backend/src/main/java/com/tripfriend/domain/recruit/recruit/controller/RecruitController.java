package com.tripfriend.domain.recruit.recruit.controller;

import com.tripfriend.domain.recruit.recruit.dto.RecruitCreateRequestDto;
import com.tripfriend.domain.recruit.recruit.dto.RecruitDetailResponseDto;
import com.tripfriend.domain.recruit.recruit.service.RecruitService;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/recruits")
public class RecruitController {
    private final RecruitService recruitService;

    @GetMapping("/{recruitId}") // 이름 맞춰주기
    public RecruitDetailResponseDto getRecruit(@PathVariable("recruitId") Long recruitId) {
        return recruitService.findById(recruitId);
    }
    @PostMapping
    public RecruitDetailResponseDto createRecruit (@RequestBody RecruitCreateRequestDto recruitCreateRequestDto) {
        return recruitService.create(recruitCreateRequestDto);
    }
}
