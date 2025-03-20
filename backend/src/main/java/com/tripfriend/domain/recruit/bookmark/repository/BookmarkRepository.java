package com.tripfriend.domain.recruit.bookmark.repository;

import com.tripfriend.domain.recruit.bookmark.entity.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
}
