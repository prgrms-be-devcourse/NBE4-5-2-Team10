package com.tripfriend.domain.notice.service;

import com.tripfriend.domain.notice.entity.Notice;
import com.tripfriend.domain.notice.repository.NoticeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NoticeService {
    private final NoticeRepository noticeRepository;

    //공지사항 저장
    public Notice createNotice(String title, String content) {
        Notice notice = Notice.builder()
                .title(title)
                .content(content)
                .build();
        return noticeRepository.save(notice);

    }


    //공지사항 삭제
    public void deleteNotice(Long id){
        noticeRepository.deleteById(id);

    }

}
