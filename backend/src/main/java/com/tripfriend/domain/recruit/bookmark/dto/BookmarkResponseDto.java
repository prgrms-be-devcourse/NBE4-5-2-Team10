package com.tripfriend.domain.recruit.bookmark.dto;

import com.tripfriend.domain.recruit.bookmark.entity.Bookmark;

import java.time.LocalDateTime;

public class BookmarkResponseDto {
    public Long bookmarkId;
    public Long recruitId;
    public Long memberId;
    public LocalDateTime createdAt;
    public LocalDateTime updatedAt;

    public BookmarkResponseDto(Bookmark bookmark) {
        this.bookmarkId = bookmark.getBookmarkId();
        this.recruitId = bookmark.getRecruit().getRecruitId();
        this.memberId = bookmark.getMember().getId();
        this.createdAt = bookmark.getCreatedAt();
        this.updatedAt = bookmark.getUpdatedAt();
    }
}
