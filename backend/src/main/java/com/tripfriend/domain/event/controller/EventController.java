package com.tripfriend.domain.event.controller;

import com.tripfriend.domain.event.dto.EventRequest;
import com.tripfriend.domain.event.dto.EventResponse;
import com.tripfriend.domain.event.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/event")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @GetMapping
    public List<EventResponse> getAll() {
        return eventService.findAll();
    }

    @PostMapping
    public EventResponse create(@RequestBody EventRequest request) {
        return eventService.create(request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable("id") Long id) {
        eventService.delete(id);
    }
    @PutMapping("/{id}")
    public EventResponse update(@PathVariable("id") Long id, @RequestBody EventRequest request) {
        return eventService.update(id, request);
    }

}
