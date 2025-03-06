package com.tripfriend.domain.recruit.apply.dto;

import com.tripfriend.domain.member.member.entity.Member;
import com.tripfriend.domain.recruit.apply.entity.Apply;
import com.tripfriend.domain.recruit.recruit.entity.Recruit;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplyResponseDto {
    private Long applyId;
//    private Member member;
//    private Recruit recruit;
    private String content;

    public ApplyResponseDto(Apply apply) {
        this.applyId = apply.getApplyId();
//        this.member = apply.getMember();
//        this.recruit = apply.getRecruit();
        this.content = apply.getContent();
    }
}
