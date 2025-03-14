package com.tripfriend.domain.event.service;

import com.tripfriend.domain.event.dto.EventRequest;
import com.tripfriend.domain.event.dto.EventResponse;
import com.tripfriend.domain.event.entity.Event;
import com.tripfriend.domain.event.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;

    public List<EventResponse> findAll() {
        return eventRepository.findAll().stream()
                .map(event -> EventResponse.builder()
                        .id(event.getId())
                        .title(event.getTitle())
                        .description(event.getDescription())
                        .eventDate(event.getEventDate())
                        .createdAt(event.getCreatedAt())
                        .build()
                ).collect(Collectors.toList());
    }

    public EventResponse create(EventRequest request) {
        Event event = Event.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .eventDate(request.getEventDate())
                .build();

        Event saved = eventRepository.save(event);

        return EventResponse.builder()
                .id(saved.getId())
                .title(saved.getTitle())
                .description(saved.getDescription())
                .eventDate(saved.getEventDate())
                .createdAt(saved.getCreatedAt())
                .build();
    }

    public void delete(Long id) {
        eventRepository.deleteById(id);
    }
}
