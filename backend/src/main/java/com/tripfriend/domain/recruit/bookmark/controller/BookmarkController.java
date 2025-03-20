package com.tripfriend.domain.recruit.bookmark.controller;

import com.tripfriend.domain.recruit.bookmark.dto.BookmarkResponseDto;
import com.tripfriend.domain.recruit.bookmark.service.BookmarkService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class BookmarkController {
    private final BookmarkService bookmarkService;

    @PostMapping("recruits/{recruitId}/bookmarks")
    public BookmarkResponseDto createBookmark(@PathVariable Long recruitId, @RequestHeader(value = "Authorization", required = false) String token) {
        return bookmarkService.createBookmark(recruitId, token);
    }
}
