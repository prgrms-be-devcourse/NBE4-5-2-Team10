package com.tripfriend.global.init;

import com.tripfriend.domain.member.member.entity.*;
import com.tripfriend.domain.member.member.repository.MemberRepository;
import com.tripfriend.domain.place.place.entity.Category;
import com.tripfriend.domain.place.place.entity.Place;
import com.tripfriend.domain.place.place.repository.PlaceRepository;
import com.tripfriend.domain.recruit.apply.entity.Apply;
import com.tripfriend.domain.recruit.apply.repository.ApplyRepository;
import com.tripfriend.domain.recruit.recruit.entity.Recruit;
import com.tripfriend.domain.recruit.recruit.repository.RecruitRepository;
import com.tripfriend.domain.trip.information.entity.Transportation;
import com.tripfriend.domain.trip.information.entity.TripInformation;
import com.tripfriend.domain.trip.information.repository.TripInformationRepository;
import com.tripfriend.domain.trip.schedule.entity.TripSchedule;
import com.tripfriend.domain.trip.schedule.repository.TripScheduleRepository;
import com.tripfriend.global.exception.ServiceException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Transactional
public class BaseInitData implements CommandLineRunner {

    private final MemberRepository memberRepository;
    private final RecruitRepository recruitRepository;
    private final ApplyRepository applyRepository;
    private final PlaceRepository placeRepository;
    private final TripInformationRepository tripInformationRepository;
    private final TripScheduleRepository tripScheduleRepository;

    @Override
    public void run(String... args) throws Exception {
        initMembers(); // 회원 등록
        initPlace(); // 여행지 등록
        initTripSchedule(); // 여행일정 등록
        initRecruits(); // 동행글 등록
        initApplies(); // 동행댓글 등록
    }

    // 회원 등록
    private void initMembers() {
        if (memberRepository.count() == 0) {
            Member user = Member.builder()
                    .username("user")
                    .email("user@example.com")
                    .password("12341234")
                    .nickname("user")
                    .gender(Gender.MALE)
                    .ageRange(AgeRange.TWENTIES)
                    .travelStyle(TravelStyle.TOURISM)
                    .aboutMe("hello")
                    .rating(0.0)
                    .authority("USER")
                    .verified(true)
                    .build();
            memberRepository.save(user);

            Member admin = Member.builder()
                    .username("admin")
                    .email("admin@example.com")
                    .password("12341234")
                    .nickname("admin")
                    .gender(Gender.FEMALE)
                    .ageRange(AgeRange.THIRTIES)
                    .travelStyle(TravelStyle.SHOPPING)
                    .aboutMe("hello")
                    .rating(0.0)
                    .authority("ADMIN")
                    .verified(true)
                    .build();
            memberRepository.save(admin);

            System.out.println("회원 테스트 데이터가 등록되었습니다.");
        }else {
            System.out.println("이미 회원 데이터가 존재합니다.");
        }
    }

    // 동행글 등록
    private void initRecruits() {
        if (recruitRepository.count() == 0) {
            Recruit recruit1 = Recruit.builder()
                    .title("동행 구해요")
                    .content("재밌게 노실 분들 모여주세요")
                    .isClosed(false)
                    .startDate(LocalDate.now())
                    .endDate(LocalDate.now().plusDays(7))
                    .travelStyle(com.tripfriend.domain.recruit.recruit.entity.TravelStyle.ADVENTURE)
                    .sameAge(false)
                    .sameGender(false)
                    .budget(20000)
                    .groupSize(5)
                    .build();
            recruitRepository.save(recruit1);

            Recruit recruit2 = Recruit.builder()
                    .title("동행 구해요")
                    .content("힐링스파 하러 가실 분??")
                    .isClosed(false)
                    .startDate(LocalDate.now())
                    .endDate(LocalDate.now().plusDays(2))
                    .travelStyle(com.tripfriend.domain.recruit.recruit.entity.TravelStyle.RELAXATION)
                    .sameAge(false)
                    .sameGender(false)
                    .budget(50000)
                    .groupSize(3)
                    .build();
            recruitRepository.save(recruit2);

            System.out.println("동행모집(게시글) 테스트 데이터가 등록되었습니다.");
        }else {
            System.out.println("이미 동행모집(게시글) 데이터가 존재합니다.");
        }
    }

    // 동행 요청 등록
    private void initApplies() {
        if (applyRepository.count() == 0) {
            Apply apply1 = Apply.builder()
                    .content("저 즐겁게 놀 자신 있습니다! 1번 글의 1번 댓글")
                    .recruit(recruitRepository.findById(1L).orElseThrow(EntityNotFoundException::new))
                    .build();
            applyRepository.save(apply1);

            Apply apply2 = Apply.builder()
                    .content("저 즐겁게 놀 자신 있습니다! 1번 글의 2번 댓글")
                    .recruit(recruitRepository.findById(1L).orElseThrow(EntityNotFoundException::new))
                    .build();
            applyRepository.save(apply2);

            Apply apply3 = Apply.builder()
                    .content("저 즐겁게 놀 자신 있습니다! 2번 글의 3번 댓글")
                    .recruit(recruitRepository.findById(2L).orElseThrow(EntityNotFoundException::new))
                    .build();
            applyRepository.save(apply3);

            Apply apply4 = Apply.builder()
                    .content("저 즐겁게 놀 자신 있습니다! 2번 글의 4번 댓글")
                    .recruit(recruitRepository.findById(2L).orElseThrow(EntityNotFoundException::new))
                    .build();
            applyRepository.save(apply4);

            System.out.println("동행요청(댓글) 테스트 데이터가 등록되었습니다.");
        }else {
            System.out.println("이미 동행 요청(댓글) 데이터가 존재합니다.");
        }
    }

    // 여행지 등록
    private void initPlace() {
        if (placeRepository.count() == 0) {
            List<Place> places = List.of(
                    // 서울
                    Place.builder()
                            .cityName("서울")
                            .placeName("경복궁")
                            .description("조선 시대의 대표적인 궁궐로, 한국 전통 건축의 아름다움을 느낄 수 있는 곳입니다.")
                            .category(Category.PLACE) // 관광지
                            .build(),
                    Place.builder()
                            .cityName("서울")
                            .placeName("신라 호텔")
                            .description("럭셔리한 서비스와 아름다운 전망을 자랑하는 서울의 대표적인 호텔입니다.")
                            .category(Category.STAY) // 숙박 시설
                            .build(),
                    Place.builder()
                            .cityName("서울")
                            .placeName("스타벅스 더종로점")
                            .description("탁 트인 전망과 함께 프리미엄 커피를 즐길 수 있는 카페입니다.")
                            .category(Category.CAFE) // 카페
                            .build(),
                    Place.builder()
                            .cityName("서울")
                            .placeName("명동교자")
                            .description("서울에서 가장 유명한 칼국수 맛집 중 하나입니다.")
                            .category(Category.RESTAURANT) // 식당
                            .build(),

                    // 부산
                    Place.builder()
                            .cityName("부산")
                            .placeName("해운대 해수욕장")
                            .description("부산을 대표하는 해변으로, 여름철에는 많은 관광객이 찾는 명소입니다.")
                            .category(Category.PLACE) // 관광지
                            .build(),
                    Place.builder()
                            .cityName("부산")
                            .placeName("광안대교 야경")
                            .description("부산의 야경 명소 중 하나로, 광안리 해변에서 아름다운 전망을 볼 수 있습니다.")
                            .category(Category.PLACE) // 관광지
                            .build(),
                    Place.builder()
                            .cityName("부산")
                            .placeName("기장 연화리 카페거리")
                            .description("바닷가 바로 앞에서 커피를 마실 수 있는 멋진 카페들이 모여 있는 곳입니다.")
                            .category(Category.CAFE) // 카페
                            .build(),
                    Place.builder()
                            .cityName("부산")
                            .placeName("초량밀면")
                            .description("부산에서 유명한 밀면 맛집으로, 여름철에 특히 인기가 많습니다.")
                            .category(Category.RESTAURANT) // 식당
                            .build(),

                    // 제주도
                    Place.builder()
                            .cityName("제주도")
                            .placeName("성산일출봉")
                            .description("유네스코 세계자연유산으로 지정된 제주도의 대표적인 명소입니다.")
                            .category(Category.PLACE) // 자연 관광지
                            .build(),
                    Place.builder()
                            .cityName("제주도")
                            .placeName("우도")
                            .description("에메랄드빛 바다와 멋진 해안도로가 있는 작은 섬으로, 제주도의 인기 관광지입니다.")
                            .category(Category.PLACE) // 관광지
                            .build(),
                    Place.builder()
                            .cityName("제주도")
                            .placeName("제주 흑돼지 거리")
                            .description("제주도에서만 맛볼 수 있는 특색 있는 흑돼지 요리를 즐길 수 있는 곳입니다.")
                            .category(Category.RESTAURANT) // 식당
                            .build(),

                    // 강원도 속초
                    Place.builder()
                            .cityName("속초")
                            .placeName("속초 중앙시장")
                            .description("속초에서 가장 유명한 재래시장으로, 다양한 먹거리를 즐길 수 있습니다.")
                            .category(Category.ETC) // 기타 명소
                            .build(),
                    Place.builder()
                            .cityName("속초")
                            .placeName("설악산 국립공원")
                            .description("대한민국에서 가장 아름다운 산 중 하나로, 사계절 내내 등산객이 찾는 명소입니다.")
                            .category(Category.PLACE) // 자연 관광지
                            .build(),
                    Place.builder()
                            .cityName("속초")
                            .placeName("봉포머구리집")
                            .description("싱싱한 해산물 요리를 맛볼 수 있는 속초의 대표적인 맛집입니다.")
                            .category(Category.RESTAURANT) // 식당
                            .build()
            );

            placeRepository.saveAll(places);
            System.out.println("국내 여행지 12개가 등록되었습니다.");
        } else {
            System.out.println("이미 여행지 데이터가 존재합니다.");
        }
    }

    // 여행 일정 생성
    private void initTripSchedule() {
        if (tripScheduleRepository.count() == 0) {
            // 1. 회원 확인
            Member member = memberRepository.findById(1L).orElseThrow(
                    () -> new ServiceException("404-1", "기본 회원이 존재하지 않습니다.")
            );

            // 2. 첫 번째 여행 일정 (서울 힐링 여행)
            TripSchedule tripSchedule1 = TripSchedule.builder()
                    .member(member)
                    .title("서울 힐링 여행")
                    .description("서울에서 고궁과 명소를 둘러보고 맛집 탐방")
                    .startDate(LocalDate.of(2025, 4, 10))
                    .endDate(LocalDate.of(2025, 4, 12))
                    .build();
            tripScheduleRepository.save(tripSchedule1);

            List<TripInformation> tripInformations1 = List.of(
                    createTripInformation(tripSchedule1, 1L, LocalDateTime.of(2025, 4, 10, 9, 0), Transportation.SUBWAY, 3000, 1, "경복궁에서 한복 체험"),
                    createTripInformation(tripSchedule1, 4L, LocalDateTime.of(2025, 4, 10, 12, 0), Transportation.WALK, 0, 2, "명동교자에서 점심"),
                    createTripInformation(tripSchedule1, 3L, LocalDateTime.of(2025, 4, 10, 16, 0), Transportation.BUS, 2000, 3, "스타벅스 더종로점에서 카페 타임")
            );
            tripInformationRepository.saveAll(tripInformations1);
            tripInformations1.forEach(tripSchedule1::addTripInfromation);

            // 3. 두 번째 여행 일정 (부산 바다 여행)
            TripSchedule tripSchedule2 = TripSchedule.builder()
                    .member(member)
                    .title("부산 바다 여행")
                    .description("부산 해운대와 광안대교 야경을 즐기는 일정")
                    .startDate(LocalDate.of(2025, 5, 15))
                    .endDate(LocalDate.of(2025, 5, 17))
                    .build();
            tripScheduleRepository.save(tripSchedule2);

            List<TripInformation> tripInformations2 = List.of(
                    createTripInformation(tripSchedule2, 5L, LocalDateTime.of(2025, 5, 15, 10, 0), Transportation.WALK, 0, 1, "해운대 해수욕장에서 바다 산책"),
                    createTripInformation(tripSchedule2, 6L, LocalDateTime.of(2025, 5, 15, 19, 0), Transportation.TAXI, 10000, 2, "광안대교 야경 감상"),
                    createTripInformation(tripSchedule2, 8L, LocalDateTime.of(2025, 5, 16, 12, 0), Transportation.BUS, 2500, 3, "초량밀면에서 부산 밀면 맛보기")
            );
            tripInformationRepository.saveAll(tripInformations2);
            tripInformations2.forEach(tripSchedule2::addTripInfromation);

            // 4. 세 번째 여행 일정 (제주도 탐방)
            TripSchedule tripSchedule3 = TripSchedule.builder()
                    .member(member)
                    .title("제주도 탐방")
                    .description("제주도의 대표 명소와 맛집을 방문하는 여행")
                    .startDate(LocalDate.of(2025, 6, 20))
                    .endDate(LocalDate.of(2025, 6, 23))
                    .build();
            tripScheduleRepository.save(tripSchedule3);

            List<TripInformation> tripInformations3 = List.of(
                    createTripInformation(tripSchedule3, 9L, LocalDateTime.of(2025, 6, 20, 8, 30), Transportation.CAR, 20000, 1, "성산일출봉에서 일출 보기"),
                    createTripInformation(tripSchedule3, 10L, LocalDateTime.of(2025, 6, 21, 10, 0), Transportation.BUS, 5000, 2, "우도에서 자전거 타기"),
                    createTripInformation(tripSchedule3, 11L, LocalDateTime.of(2025, 6, 21, 18, 30), Transportation.TAXI, 15000, 3, "제주 흑돼지 거리에서 저녁 식사")
            );
            tripInformationRepository.saveAll(tripInformations3);
            tripInformations3.forEach(tripSchedule3::addTripInfromation);

            // 5. 네 번째 여행 일정 (속초 먹거리 여행)
            TripSchedule tripSchedule4 = TripSchedule.builder()
                    .member(member)
                    .title("속초 먹거리 여행")
                    .description("속초에서 재래시장과 해산물 맛집 방문")
                    .startDate(LocalDate.of(2025, 7, 5))
                    .endDate(LocalDate.of(2025, 7, 7))
                    .build();
            tripScheduleRepository.save(tripSchedule4);

            List<TripInformation> tripInformations4 = List.of(
                    createTripInformation(tripSchedule4, 12L, LocalDateTime.of(2025, 7, 5, 11, 0), Transportation.WALK, 0, 1, "속초 중앙시장에서 다양한 먹거리 탐방"),
                    createTripInformation(tripSchedule4, 13L, LocalDateTime.of(2025, 7, 6, 9, 0), Transportation.BUS, 4000, 2, "설악산 국립공원 등산"),
                    createTripInformation(tripSchedule4, 14L, LocalDateTime.of(2025, 7, 6, 18, 0), Transportation.TAXI, 8000, 3, "봉포머구리집에서 신선한 해산물 맛보기")
            );
            tripInformationRepository.saveAll(tripInformations4);
            tripInformations4.forEach(tripSchedule4::addTripInfromation);

            System.out.println("네 개의 여행 일정이 등록되었습니다.");
        } else {
            System.out.println("이미 여행 일정 데이터가 존재합니다.");
        }
    }

    // 여행 정보 생성
    private TripInformation createTripInformation(TripSchedule tripSchedule, Long placeId, LocalDateTime visitTime, Transportation transportation, int cost, int priority, String notes) {
        Place place = placeRepository.findById(placeId).orElseThrow(
                () -> new ServiceException("404-2", "해당 장소가 존재하지 않습니다. ID: " + placeId)
        );

        return TripInformation.builder()
                .tripSchedule(tripSchedule)
                .place(place)
                .visitTime(visitTime)
                .duration(2) // 2시간 머무름
                .transportation(transportation) // 교통 수단 설정
                .cost(cost) // 비용 설정
                .notes(notes) // 방문 목적 및 기타 정보 추가
                .priority(priority) // 우선순위 설정
                .isVisited(false) // 기본값은 방문하지 않음
                .build();
    }

}