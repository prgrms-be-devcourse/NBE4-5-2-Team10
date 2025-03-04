package com.tripfriend.domain.trip.information.controller;

import com.tripfriend.domain.trip.information.service.TripInformationService;
import jakarta.persistence.Entity;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/trip/information")
public class TripInformationController {
    private final TripInformationService tripInformationService;

}
