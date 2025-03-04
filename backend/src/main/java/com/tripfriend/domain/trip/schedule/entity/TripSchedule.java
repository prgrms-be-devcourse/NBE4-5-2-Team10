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
    @JoinColumn(name = "memberId")
    private Member member;

    private String title; // 제목

    private String description; // 일정 설명

    private String startDate; // 시작일

    private String endDate; // 종료일

    @CreatedDate
    @Setter(AccessLevel.PRIVATE)
    private LocalDateTime createdAt; // 생성일

    @LastModifiedDate
    @Setter(AccessLevel.PRIVATE)
    private LocalDateTime updatedAt; // 수정일
}
