package com.tripfriend.domain.qna.service;

import com.tripfriend.domain.member.member.entity.Member;
import com.tripfriend.domain.member.member.repository.MemberRepository;
import com.tripfriend.domain.qna.entity.Question;
import com.tripfriend.domain.qna.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionService {
    private final QuestionRepository questionRepository;
    private final MemberRepository memberRepository;

    //질문 생성
    public Question createQuestion(String title, String content, Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        Question question = Question.builder()
                .title(title)
                .content(content)
                .member(member)
                .build();
        return questionRepository.save(question);
    }

    //전체 질문 조회
    public List<Question> getAllQuestions() {
        return questionRepository.findAllWithMember();
    }

    //특정 질문 조회
    public Question getQuestionById(Long id) {
        return questionRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("해당 질문을 찾을 수 없습니다."));
    }

    //질문 삭제
    public void deleteQuestionById(Long id) {
        Question question = getQuestionById(id);
        questionRepository.delete(question);
    }

}
