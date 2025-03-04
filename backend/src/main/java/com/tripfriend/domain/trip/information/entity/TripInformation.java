package com.tripfriend.domain.trip.information.entity;

import com.tripfriend.domain.place.place.entity.Place;
import com.tripfriend.domain.trip.schedule.entity.TripSchedule;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDateTime;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "Trip_Information")
public class TripInformation {

    @EmbeddedId
    private TripInformationId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("tripId")
    @JoinColumn(name = "tripId", nullable = false)
    private TripSchedule tripSchedule; // 여행일정Id - FK

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("placeId")
    @JoinColumn(name = "placeId", nullable = false)
    private Place place; // 여행지Id - FK

    @Column(name = "visit_time",nullable = false)
    private LocalDateTime visitTime; // 방문시간

    @Column(name = "duration",nullable = false)
    private Integer duration; // 방문기간

    @Column(name = "cost")
    private Long cost; // 여행 경비

    @Column(name = "notes",columnDefinition = "TEXT")
    private String notes; // 메모

    @Column(name = "priority")
    private Integer priority; // 우선 순위

    @Column(name = "is_visted")
    @ColumnDefault("false")
    private boolean isVisted; // 방문여부
}
