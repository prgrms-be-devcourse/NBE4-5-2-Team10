package com.tripfriend.domain.trip.schedule.repository;

import com.tripfriend.domain.trip.schedule.entity.TripSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScheduleRepository extends JpaRepository<TripSchedule, Long> {
}
