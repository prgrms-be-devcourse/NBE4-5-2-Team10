package com.tripfriend.domain.member.member.dto;

import com.tripfriend.domain.member.member.entity.AgeRange;
import com.tripfriend.domain.member.member.entity.Gender;
import com.tripfriend.domain.member.member.entity.TravelStyle;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class MemberUpdateRequestDto {

    private String nickname;
    private String email;
    private String profileImage;
    private Gender gender;
    private AgeRange ageRange;
    private TravelStyle travelStyle;
    private String aboutMe;
    private String password;
}
