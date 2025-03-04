package com.tripfriend.domain.place.place.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "place")
public class Place {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "placeId")
    private Long id;

    @Column(name = "city_name", nullable = false)
    private String cityName; // 도시명

    @Column(name = "place_name", nullable = false)
    private String placeName; // 장소명

    @Column(name = "description", columnDefinition = "TEXT")
    private String description; // 설명

    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false)
    private Category category; // 카테고리

    @CreatedDate
    @Setter(AccessLevel.PRIVATE)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Setter(AccessLevel.PRIVATE)
    private LocalDateTime updatedAt;
}
