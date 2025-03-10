package com.tripfriend.domain.recruit.recruit.service;

import com.tripfriend.domain.member.member.entity.Member;
import com.tripfriend.domain.member.member.repository.MemberRepository;
import com.tripfriend.domain.member.member.service.AuthService;
import com.tripfriend.domain.place.place.entity.Place;
import com.tripfriend.domain.place.place.repository.PlaceRepository;
import com.tripfriend.domain.recruit.recruit.dto.RecruitRequestDto;
import com.tripfriend.domain.recruit.recruit.dto.RecruitDetailResponseDto;
import com.tripfriend.domain.recruit.recruit.dto.RecruitListResponseDto;
import com.tripfriend.domain.recruit.recruit.entity.Recruit;
import com.tripfriend.domain.recruit.recruit.repository.RecruitRepository;
import com.tripfriend.global.exception.ServiceException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RecruitService {
    private final RecruitRepository recruitRepository;
    private final MemberRepository memberRepository;
    private final PlaceRepository placeRepository;
    private final AuthService authService;

    /**
     * 현재 로그인한 회원객체를 반환하는 메서드
     *
     * @param token JWT 토큰
     * @return 로그인한 회원 객체
     * @throws ServiceException 로그인하지 않은 경우 예외 발생
     */
    public Member getLoggedInMember(String token) {
        // 로그인 여부 확인 및 회원 정보 가져오기
        Member member = authService.getLoggedInMember(token);

        if (member == null) {
            throw new ServiceException("401-1", "로그인이 필요합니다.");
        }

        return member;
    }

    @Transactional
    public RecruitDetailResponseDto findById(Long id) {
        Recruit recruit = recruitRepository.findById(id).orElseThrow(() -> new ServiceException("404-3", "해당 모집글이 존재하지 않습니다."));
        return new RecruitDetailResponseDto(recruit);
    }

    @Transactional
    public RecruitDetailResponseDto create(RecruitRequestDto requestDto) {
        Member member = memberRepository.findById(requestDto.getMemberId()).orElseThrow(() -> new ServiceException("404-1", "해당 회원이 존재하지 않습니다."));
        Place place = placeRepository.findById(requestDto.getPlaceId()).orElseThrow(() -> new ServiceException("404-2", "해당 장소가 존재하지 않습니다."));

        return new RecruitDetailResponseDto(recruitRepository.save(requestDto.toEntity(member, place)));
    }

    @Transactional
    public List<RecruitListResponseDto> findAll() {

        return recruitRepository.findAll().stream()
                .map(RecruitListResponseDto::new)
                .toList();
//        return recruitRepository.findByRecruitTest().stream()
//                .map(RecruitListResponseDto::new)
//                .toList();
    }

    @Transactional
    public List<RecruitListResponseDto> searchRecruits(String keyword) {
        return recruitRepository.searchByTitleOrContent(keyword).stream()
                .map(RecruitListResponseDto::new)
                .toList();
    }

    @Transactional
    public List<RecruitListResponseDto> searchByIsClosed(Boolean isClosed) {
        return recruitRepository.findByIsClosed(isClosed).stream()
                .map(RecruitListResponseDto::new)
                .toList();
    }

    @Transactional
    public List<RecruitListResponseDto> searchAndFilter(
            Optional<String> keyword,
            Optional<String> placeCityName,
            Optional<Boolean> isClosed,
            Optional<LocalDate> startDate,
            Optional<LocalDate> endDate,
            Optional<String> travelStyle,
            Optional<Boolean> sameGender,
            Optional<Boolean> sameAge,
            Optional<Integer> minBudget,
            Optional<Integer> maxBudget,
            Optional<Integer> minGroupSize,
            Optional<Integer> maxGroupSize,
            Optional<String> sortBy,
            String token
    ) {
        Member member = getLoggedInMember(token);
        return recruitRepository.searchFilterSort(
                keyword, placeCityName, isClosed, startDate, endDate,
                travelStyle, sameGender, sameAge, minBudget, maxBudget, minGroupSize, maxGroupSize, sortBy, member.getGender(), member.getAgeRange()
        ).stream()
                .map(RecruitListResponseDto::new)
                .toList();
    }

    @Transactional
    public RecruitDetailResponseDto update(Long recruitId, RecruitRequestDto requestDto) {
        Recruit recruit = recruitRepository.findById(recruitId).orElseThrow(() -> new ServiceException("404-3", "해당 모집글이 존재하지 않습니다."));
        Place place = placeRepository.findById(requestDto.getPlaceId()).orElseThrow(() -> new ServiceException("404-2", "해당 장소가 존재하지 않습니다."));
        recruit.update(requestDto, place);
        return new RecruitDetailResponseDto(recruit); // recruitRepository.save(recruit) 불필요!
    }

    public void delete(Long recruitId) {
        recruitRepository.deleteById(recruitId);
    }


}
