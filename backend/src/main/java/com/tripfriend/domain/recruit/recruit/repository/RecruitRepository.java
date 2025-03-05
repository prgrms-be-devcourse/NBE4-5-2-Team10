package com.tripfriend.domain.recruit.recruit.repository;

import com.tripfriend.domain.recruit.recruit.entity.Recruit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecruitRepository extends JpaRepository<Recruit, Long> {
}
