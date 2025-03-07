package com.tripfriend.domain.recruit.apply.service;

import com.tripfriend.domain.member.member.entity.Member;
import com.tripfriend.domain.member.member.repository.MemberRepository;
import com.tripfriend.domain.recruit.apply.dto.ApplyCreateRequestDto;
import com.tripfriend.domain.recruit.apply.dto.ApplyCreateRequestDto;
import com.tripfriend.domain.recruit.apply.dto.ApplyResponseDto;
import com.tripfriend.domain.recruit.apply.repository.ApplyRepository;
import com.tripfriend.domain.recruit.recruit.entity.Recruit;
import com.tripfriend.domain.recruit.recruit.repository.RecruitRepository;
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
        Recruit recruit = recruitRepository.findById(recruitId).orElseThrow(() -> new EntityNotFoundException("recruit not found with id" + recruitId));
        return recruit.getApplies().stream()
                .map(ApplyResponseDto::new)
                .toList();
    }

    @Transactional
    public ApplyResponseDto create(Long recruitId, ApplyCreateRequestDto requestDto) {
        Member member = getMemberWithId(2L);
        Recruit recruit = recruitRepository.findById(recruitId).orElseThrow(() -> new EntityNotFoundException("recruit not found with id" + recruitId));
        return new ApplyResponseDto(applyRepository.save(requestDto.toEntity(member, recruit)));
    }

    public void delete(Long applyId) {
        applyRepository.deleteById(applyId);
    }

    private Member getMemberWithId(Long memberId){
        return memberRepository.findById(memberId).orElseThrow(() -> new EntityNotFoundException("member not foud with id : " + memberId));
    }
}
