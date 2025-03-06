package com.tripfriend.domain.recruit.apply.dto;

import com.tripfriend.domain.member.member.entity.Member;
import com.tripfriend.domain.recruit.apply.entity.Apply;
import com.tripfriend.domain.recruit.recruit.entity.Recruit;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplyCreatRequestDto {
//    private Member member;
    private Recruit recruit;
    private String content;

    public Apply toEntity(){
        return Apply.builder()
//                .member(member)
                .recruit(recruit)
                .content(content)
                .build();
    }
}
