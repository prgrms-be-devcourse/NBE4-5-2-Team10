package com.tripfriend.domain.recruit.bookmark.service;

import com.tripfriend.domain.member.member.entity.Member;
import com.tripfriend.domain.member.member.service.AuthService;
import com.tripfriend.domain.recruit.bookmark.dto.BookmarkResponseDto;
import com.tripfriend.domain.recruit.bookmark.entity.Bookmark;
import com.tripfriend.domain.recruit.bookmark.repository.BookmarkRepository;
import com.tripfriend.domain.recruit.recruit.entity.Recruit;
import com.tripfriend.domain.recruit.recruit.repository.RecruitRepository;
import com.tripfriend.global.exception.ServiceException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookmarkService {
    private final BookmarkRepository bookmarkRepository;
    private final RecruitRepository recruitRepository;
    private final AuthService authService;

    public Member getLoggedInMember(String token) {
        // 로그인 여부 확인 및 회원 정보 가져오기
        Member member = authService.getLoggedInMember(token);

        if (member == null) {
            throw new ServiceException("401-1", "로그인이 필요합니다.");
        }

        return member;
    }

    @Transactional
    public BookmarkResponseDto createBookmark (Long recruitId, String token){
        Member member = getLoggedInMember(token);
        Recruit recruit = recruitRepository.findById(recruitId).orElseThrow(() -> new ServiceException("404-3", "해당 모집글이 존재하지 않습니다."));

        return new BookmarkResponseDto(bookmarkRepository.save(new Bookmark(member, recruit)));
    }

    @Transactional(readOnly = true)
    public boolean isBookmarked (Long recruitId, String token){
        Member member = getLoggedInMember(token);
        Recruit recruit = recruitRepository.findById(recruitId).orElseThrow(() -> new ServiceException("404-3", "해당 모집글이 존재하지 않습니다."));

        return bookmarkRepository.findByMemberAndRecruit(member, recruit).isPresent();
    }

    @Transactional
    public void deleteBookmark (Long recruitId, String token){
        Member member = getLoggedInMember(token);
        Recruit recruit = recruitRepository.findById(recruitId).orElseThrow(() -> new ServiceException("404-3", "해당 모집글이 존재하지 않습니다."));

        Bookmark bookmark = bookmarkRepository.findByMemberAndRecruit(member, recruit).orElseThrow(() -> new ServiceException("404-3", "해당 북마크가 존재하지 않습니다."));
        bookmarkRepository.delete(bookmark);
    }

    @Transactional(readOnly = true)
    public List<BookmarkResponseDto> getBookmarksByMember (String token){
        Member member = getLoggedInMember(token);
        return bookmarkRepository.findByMember(member)
                .stream()
                .map(BookmarkResponseDto::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Integer countBookmarksByRecruit (Long recruitId){
        Recruit recruit = recruitRepository.findById(recruitId).orElseThrow(() -> new ServiceException("404-3", "해당 모집글이 존재하지 않습니다."));
        return bookmarkRepository.countByRecruit(recruit);
    }
}
