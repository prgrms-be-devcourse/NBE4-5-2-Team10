package com.tripfriend.domain.trip.schedule.entity;


import com.tripfriend.domain.place.place.entity.Place;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "trip_schedule_place")
public class TripSchedulePlace {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "trip_schedule_place_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_schedule_id", nullable = false)
    private TripSchedule tripScheduleId; // 여행 일정

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "place_id", nullable = false)
    private Place placeId; // 여행지 정보

}
