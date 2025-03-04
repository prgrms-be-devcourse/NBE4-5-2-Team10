package com.tripfriend.domain.trip.information.service;

import com.tripfriend.domain.trip.information.repository.TripInformationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TripInformationService {
    private final TripInformationRepository tripInformationRepository;


}
