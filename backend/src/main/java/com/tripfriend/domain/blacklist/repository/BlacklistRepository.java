package com.tripfriend.domain.blacklist.repository;

import com.tripfriend.domain.blacklist.entity.Blacklist;
import com.tripfriend.domain.member.member.entity.Member;

import java.util.Optional;

public interface BlacklistRepository {
    Optional<Blacklist> findByMember(Member member);
    boolean existsByMember(Member member);
}
