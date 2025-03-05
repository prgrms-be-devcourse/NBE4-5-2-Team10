package com.tripfriend.domain.recruit.recruit.service;

import com.tripfriend.domain.recruit.recruit.dto.RecruitCreateRequestDto;
import com.tripfriend.domain.recruit.recruit.dto.RecruitDetailResponseDto;
import com.tripfriend.domain.recruit.recruit.dto.RecruitListResponseDto;
import com.tripfriend.domain.recruit.recruit.dto.RecruitUpdateRequestDto;
import com.tripfriend.domain.recruit.recruit.entity.Recruit;
import com.tripfriend.domain.recruit.recruit.repository.RecruitRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

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

    @Transactional
    public List<RecruitListResponseDto> findAll() {
        return recruitRepository.findAll().stream()
                .map(RecruitListResponseDto::new)
                .toList();
    }

    @Transactional
    public RecruitDetailResponseDto update(RecruitUpdateRequestDto recruitUpdateRequestDto) {
        Long recruitId = recruitUpdateRequestDto.getRecruitId();
        Recruit recruit = recruitRepository.findById(recruitId).orElseThrow(() -> new EntityNotFoundException("recruit not foud with id : " + recruitId));
        recruit.update(recruitUpdateRequestDto);
        return new RecruitDetailResponseDto(recruit); // recruitRepository.save(recruit) 불필요!
    }
}
