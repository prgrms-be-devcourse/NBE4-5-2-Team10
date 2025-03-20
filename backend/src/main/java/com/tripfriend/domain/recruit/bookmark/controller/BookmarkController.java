package com.tripfriend.domain.recruit.bookmark.controller;

import com.tripfriend.domain.recruit.bookmark.dto.BookmarkResponseDto;
import com.tripfriend.domain.recruit.bookmark.service.BookmarkService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class BookmarkController {
    private final BookmarkService bookmarkService;

    @PostMapping("recruits/{recruitId}/bookmarks")
    public BookmarkResponseDto createBookmark(@PathVariable Long recruitId, @RequestHeader(value = "Authorization", required = false) String token) {
        return bookmarkService.createBookmark(recruitId, token);
    }

    @PostMapping("recruits/{recruitId}/bookmarks/check")
    public Boolean isBookmarked(@PathVariable Long recruitId, @RequestHeader(value = "Authorization", required = false) String token) {
        return bookmarkService.isBookmarked(recruitId, token);
    }

    @DeleteMapping("recruits/{recruitId}/bookmarks")
    public void deleteBookmark(@PathVariable Long recruitId, @RequestHeader(value = "Authorization", required = false) String token) {
        bookmarkService.deleteBookmark(recruitId, token);
    }
}
