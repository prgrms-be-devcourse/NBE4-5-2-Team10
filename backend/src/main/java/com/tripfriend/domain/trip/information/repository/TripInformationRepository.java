package com.tripfriend.domain.trip.information.repository;

import com.tripfriend.domain.trip.information.entity.TripInformation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TripInformationRepository extends JpaRepository<TripInformation, Long> {
}
