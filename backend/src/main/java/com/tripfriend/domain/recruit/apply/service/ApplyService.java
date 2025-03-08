package com.tripfriend.domain.recruit.apply.service;

import com.tripfriend.domain.member.member.entity.Member;
import com.tripfriend.domain.member.member.repository.MemberRepository;
import com.tripfriend.domain.recruit.apply.dto.ApplyCreateRequestDto;
import com.tripfriend.domain.recruit.apply.dto.ApplyCreateRequestDto;
import com.tripfriend.domain.recruit.apply.dto.ApplyResponseDto;
import com.tripfriend.domain.recruit.apply.repository.ApplyRepository;
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
public class ApplyService {
    private final ApplyRepository applyRepository;
    private final RecruitRepository recruitRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public List<ApplyResponseDto> findByRecruitId(Long recruitId) {
        Recruit recruit = recruitRepository.findById(recruitId).orElseThrow(() -> new ServiceException("404-3", "해당 모집글이 존재하지 않습니다."));
        return recruit.getApplies().stream()
                .map(ApplyResponseDto::new)
                .toList();
    }

    @Transactional
    public ApplyResponseDto create(Long recruitId, ApplyCreateRequestDto requestDto) {
        Member member = memberRepository.findById(requestDto.getMemberId()).orElseThrow(() -> new ServiceException("404-1", "해당 회원이 존재하지 않습니다."));
        Recruit recruit = recruitRepository.findById(recruitId).orElseThrow(() -> new ServiceException("404-3", "해당 모집글이 존재하지 않습니다."));
        return new ApplyResponseDto(applyRepository.save(requestDto.toEntity(member, recruit)));
    }

    public void delete(Long applyId) {
        applyRepository.deleteById(applyId);
    }
}
