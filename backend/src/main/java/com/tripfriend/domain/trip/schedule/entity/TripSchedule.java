package com.tripfriend.domain.trip.schedule.entity;

import com.tripfriend.domain.member.member.entity.Member;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TripSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tripScheduleId")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @Column(name = "title", nullable = false)
    private String title; // 제목

    @Column(name = "description", columnDefinition = "TEXT")
    private String description; // 일정 설명

    @Column(name = "startDate", nullable = false)
    private String startDate; // 시작일

    @Column(name = "endDate", nullable = false)
    private String endDate; // 종료일

    @CreatedDate
    @Setter(AccessLevel.PRIVATE)
    private LocalDateTime createdAt; // 생성일

    @LastModifiedDate
    @Setter(AccessLevel.PRIVATE)
    private LocalDateTime updatedAt; // 수정일
}
