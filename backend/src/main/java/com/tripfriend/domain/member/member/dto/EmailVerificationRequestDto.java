package com.tripfriend.domain.member.member.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class EmailVerificationRequestDto {

    private String email;
    private String code;
}
