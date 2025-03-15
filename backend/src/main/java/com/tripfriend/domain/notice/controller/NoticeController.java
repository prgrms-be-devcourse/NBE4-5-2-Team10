package com.tripfriend.domain.notice.controller;

import com.tripfriend.domain.notice.dto.Dto;

import com.tripfriend.domain.notice.entity.Notice;
import com.tripfriend.domain.notice.repository.NoticeRepository;
import com.tripfriend.domain.notice.service.NoticeService;
import com.tripfriend.global.annotation.CheckPermission;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class NoticeController {
    private final NoticeRepository noticeRepository;
    private final NoticeService noticeService;

    //공지사항 생성
    @PostMapping("/admin/notice")
    @CheckPermission("ADMIN") // 관리자 권한
    public ResponseEntity<Notice> createNotice(@RequestBody Notice notice) {
        return ResponseEntity.ok(noticeService.createNotice(notice.getTitle(), notice.getContent()));
    }

    //관리자 공지 조회
    @GetMapping("/admin/notice")
    @CheckPermission("ADMIN")
    public ResponseEntity<List<Notice>> getAllNoticesForAdmin() {
        return ResponseEntity.ok(noticeRepository.findAll());
    }


    //공지사항 전체 조회
    @GetMapping("/notice")
    public ResponseEntity<List<Notice>> getAllNotices() {
        return ResponseEntity.ok(noticeRepository.findAll());
    }

    // 공지사항 검색 조회
    @GetMapping("/admin/notice/{id}")
    public ResponseEntity<Notice> getNoticeById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(noticeService.getNoticeById(id));
    }

    //공지사항 수정
    @PutMapping("/admin/notice/{id}")
    @CheckPermission("ADMIN")
    public ResponseEntity<Notice> updateNotice(
            @PathVariable("id") Long id,
            @RequestBody Dto request) {

        return ResponseEntity.ok(
                noticeService.updateNoticeById(id, request.getTitle(), request.getContent())
        );
    }

    //공지사항 삭제
    @DeleteMapping("/admin/notice/{id}")
    @CheckPermission("ADMIN")
    public ResponseEntity<Void> deleteNotice
    (@PathVariable("id") Long id) {
        noticeService.deleteNotice(id);
        return ResponseEntity.noContent().build();
    }
}
