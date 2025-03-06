package com.tripfriend.domain.place.place.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.tripfriend.domain.trip.information.entity.TripInformation;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
@Table(name = "place")
public class Place {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "placeId")
    private Long id;

    // 여행 스케줄 연결 테이블 리스트
    @OneToMany(mappedBy = "place", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<TripInformation> tripInformations = new ArrayList<>();

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
    @Column(updatable = false)
    private LocalDateTime createdAt; // 생성일

    @LastModifiedDate
    private LocalDateTime updatedAt; // 수정일

    public void addTripInformation(TripInformation tripInformation) {
        this.tripInformations.add(tripInformation);
        tripInformation.setPlace(this);  // 연관관계 설정
    }
}
