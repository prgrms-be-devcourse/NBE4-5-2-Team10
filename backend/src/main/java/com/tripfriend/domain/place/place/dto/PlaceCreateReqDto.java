package com.tripfriend.domain.place.place.dto;

import com.tripfriend.domain.place.place.entity.Category;
import com.tripfriend.domain.place.place.entity.Place;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PlaceCreateReqDto {

    @NotBlank(message = "도시명을 입력해주세요.")
    private String cityName;

    @NotBlank(message = "장소명을 입력해주세요.")
    private String placeName;

    private String description;

    @NotNull(message = "카테고리를 선택해주세요")
    private Category category;

    // DTO -> Entity 변환
    public Place toEntity(){
        return Place.builder()
                .cityName(cityName)
                .placeName(placeName)
                .description(description)
                .category(category)
                .build();
    }
}