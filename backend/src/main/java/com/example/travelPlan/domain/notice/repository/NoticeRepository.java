package com.example.travelPlan.domain.notice.repository;

import com.example.travelPlan.domain.notice.entity.Notice;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoticeRepository extends JpaRepository<Notice, Long> {
}
