package com.tripfriend.domain.recruit.recruit.service;

import com.tripfriend.domain.recruit.recruit.dto.RecruitCreateRequestDto;
import com.tripfriend.domain.recruit.recruit.dto.RecruitDetailResponseDto;
import com.tripfriend.domain.recruit.recruit.entity.Recruit;
import com.tripfriend.domain.recruit.recruit.repository.RecruitRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecruitService {
    private final RecruitRepository recruitRepository;

    @Transactional
    public RecruitDetailResponseDto findById(Long id) {
        Recruit recruit = recruitRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("recruit not foud with id : " + id));
        return new RecruitDetailResponseDto(recruit);
    }

    @Transactional
    public RecruitDetailResponseDto create(RecruitCreateRequestDto recruitCreateRequestDto) {
        return new RecruitDetailResponseDto(recruitRepository.save(recruitCreateRequestDto.toEntity()));
    }
}
