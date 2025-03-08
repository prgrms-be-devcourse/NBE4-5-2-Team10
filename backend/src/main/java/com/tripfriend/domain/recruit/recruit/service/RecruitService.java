package com.tripfriend.domain.recruit.recruit.service;

import com.tripfriend.domain.member.member.entity.Member;
import com.tripfriend.domain.member.member.repository.MemberRepository;
import com.tripfriend.domain.place.place.entity.Place;
import com.tripfriend.domain.place.place.repository.PlaceRepository;
import com.tripfriend.domain.recruit.recruit.dto.RecruitRequestDto;
import com.tripfriend.domain.recruit.recruit.dto.RecruitDetailResponseDto;
import com.tripfriend.domain.recruit.recruit.dto.RecruitListResponseDto;
import com.tripfriend.domain.recruit.recruit.entity.Recruit;
import com.tripfriend.domain.recruit.recruit.repository.RecruitRepository;
import com.tripfriend.global.exception.ServiceException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecruitService {
    private final RecruitRepository recruitRepository;
    private final MemberRepository memberRepository;
    private final PlaceRepository placeRepository;

    @Transactional
    public RecruitDetailResponseDto findById(Long id) {
        Recruit recruit = recruitRepository.findById(id).orElseThrow(() -> new ServiceException("404-3", "해당 모집글이 존재하지 않습니다."));
        return new RecruitDetailResponseDto(recruit);
    }

    @Transactional
    public RecruitDetailResponseDto create(RecruitRequestDto requestDto) {
        Member member = memberRepository.findById(requestDto.getMemberId()).orElseThrow(() -> new ServiceException("404-1", "해당 회원이 존재하지 않습니다."));
        Place place = placeRepository.findById(requestDto.getPlaceId()).orElseThrow(() -> new ServiceException("404-2", "해당 장소가 존재하지 않습니다."));

        return new RecruitDetailResponseDto(recruitRepository.save(requestDto.toEntity(member, place)));
    }

    @Transactional
    public List<RecruitListResponseDto> findAll() {
        return recruitRepository.findAll().stream()
                .map(RecruitListResponseDto::new)
                .toList();
    }

    @Transactional
    public RecruitDetailResponseDto update(Long recruitId, RecruitRequestDto requestDto) {
        Recruit recruit = recruitRepository.findById(recruitId).orElseThrow(() -> new ServiceException("404-3", "해당 모집글이 존재하지 않습니다."));
        Place place = placeRepository.findById(requestDto.getPlaceId()).orElseThrow(() -> new ServiceException("404-2", "해당 장소가 존재하지 않습니다."));
        recruit.update(requestDto, place);
        return new RecruitDetailResponseDto(recruit); // recruitRepository.save(recruit) 불필요!
    }

    public void delete(Long recruitId) {
        recruitRepository.deleteById(recruitId);
    }
}
