package com.tripfriend.domain.trip.information.entity;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class TripInformationId implements Serializable {
    private Long tripId;
    private Long placeId;
}
