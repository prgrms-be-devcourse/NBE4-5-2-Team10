package com.tripfriend.domain.blacklist.controller;

import com.tripfriend.domain.blacklist.dto.Dto;
import com.tripfriend.domain.blacklist.entity.Blacklist;
import com.tripfriend.domain.blacklist.service.BlacklistService;
import jakarta.annotation.Resource;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/blacklist")
@RequiredArgsConstructor
public class BlacklistController {
    private final BlacklistService blacklistService;

    //블랙리스트 추가
    @PostMapping
    public ResponseEntity<String> addToBlacklist(@RequestBody Dto requestDto) {
        blacklistService.addToBlacklist(requestDto.getMemberId(), requestDto.getReason());
        return ResponseEntity.ok("블랙리스트 추가 완료!");
    }

    //블랙리스트 삭제
    @DeleteMapping("/{memberId}")
    public ResponseEntity<String> removeFromBlacklist(@PathVariable Long memberId) {
        blacklistService.removeFromBlacklist(memberId);
        return ResponseEntity.ok("블랙리스트 삭제 완료!");
    }

    //블랙리스트 조회
    @GetMapping
    public ResponseEntity<List<Blacklist>> getBlacklist() {
        return ResponseEntity.ok(blacklistService.getBlacklist());
    }


}
