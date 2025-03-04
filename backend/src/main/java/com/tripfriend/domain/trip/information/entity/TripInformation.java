package com.tripfriend.domain.trip.information.entity;

import com.tripfriend.domain.place.place.entity.Place;
import com.tripfriend.domain.trip.schedule.entity.TripSchedule;
import jakarta.persistence.*;
import lombok.*;

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
    private TripSchedule tripSchedule;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("placeId")
    @JoinColumn(name = "placeId", nullable = false)
    private Place place;

}
