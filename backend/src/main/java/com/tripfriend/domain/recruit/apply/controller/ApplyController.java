package com.tripfriend.domain.recruit.apply.controller;

import com.tripfriend.domain.recruit.apply.dto.ApplyCreatRequestDto;
import com.tripfriend.domain.recruit.apply.dto.ApplyResponseDto;
import com.tripfriend.domain.recruit.apply.service.ApplyService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/recruits/{recruitId}/applies") // requestmapping에 url 써야함
public class ApplyController {
    private final ApplyService applyService;

    @GetMapping
    List<ApplyResponseDto> getApplies(@PathVariable("recruitId") Long recruitId) {
        return applyService.findByRecruitId(recruitId); // 인자 주기
    }

    @PostMapping
    ApplyResponseDto createApply(@PathVariable("recruitId") Long recruitId, @RequestBody ApplyCreatRequestDto requestDto) {
        return applyService.create(recruitId, requestDto);
    }

}
