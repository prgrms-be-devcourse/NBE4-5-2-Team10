package com.tripfriend.domain.trip.schedule.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tripfriend.domain.member.member.entity.Member;
import com.tripfriend.domain.trip.information.entity.TripInformation;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class TripSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tripScheduleId")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    // 여행지 연결 테이블 리스트
    @OneToMany(mappedBy = "tripSchedule", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<TripInformation> tripInformations = new ArrayList<>();

    @Column(name = "title", nullable = false)
    private String title; // 제목

    @Column(name = "description", columnDefinition = "TEXT")
    private String description; // 일정 설명

    @Column(name = "startDate", nullable = false)
    private LocalDate startDate; // 시작일

    @Column(name = "endDate", nullable = false)
    private LocalDate endDate; // 종료일

    @CreatedDate
    @Setter(AccessLevel.PRIVATE)
    private LocalDateTime createdAt; // 생성일

    @LastModifiedDate
    @Setter(AccessLevel.PRIVATE)
    private LocalDateTime updatedAt; // 수정일

    public void addTripInfromation(TripInformation tripInformation){
        this.tripInformations.add(tripInformation);
        tripInformation.setTripSchedule(this); // 연관 관계 설정
    }

}

