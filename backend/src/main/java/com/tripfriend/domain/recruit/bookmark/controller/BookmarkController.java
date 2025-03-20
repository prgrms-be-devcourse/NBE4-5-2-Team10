package com.tripfriend.domain.recruit.bookmark.controller;

import com.tripfriend.domain.recruit.bookmark.dto.BookmarkResponseDto;
import com.tripfriend.domain.recruit.bookmark.service.BookmarkService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class BookmarkController {
    private final BookmarkService bookmarkService;

    @PostMapping("recruits/{recruitId}/bookmarks")
    public BookmarkResponseDto createBookmark(@PathVariable Long recruitId, @RequestHeader(value = "Authorization", required = false) String token) {
        return bookmarkService.createBookmark(recruitId, token);
    }

    @GetMapping("recruits/{recruitId}/bookmarks/check")
    public Boolean isBookmarked(@PathVariable Long recruitId, @RequestHeader(value = "Authorization", required = false) String token) {
        return bookmarkService.isBookmarked(recruitId, token);
    }

    @GetMapping("member/bookmarks")
    public List<BookmarkResponseDto> getBookmarksByMember(@RequestHeader(value = "Authorization", required = false) String token) {
        return bookmarkService.getBookmarksByMember(token);
    }

    @GetMapping("recruits/{recruitId}/bookmarks")
    public Integer countBookmarksByMember(@PathVariable Long recruitId) {
        return bookmarkService.countBookmarksByRecruit(recruitId);
    }

    @DeleteMapping("recruits/{recruitId}/bookmarks")
    public void deleteBookmark(@PathVariable Long recruitId, @RequestHeader(value = "Authorization", required = false) String token) {
        bookmarkService.deleteBookmark(recruitId, token);
    }
}
