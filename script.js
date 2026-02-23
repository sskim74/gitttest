// 서태지 퀴즈 데이터 (10문제)
const quizData = [
    {
        type: 'choice',
        question: '서태지가 데뷔한 그룹 이름은?',
        choices: ['서태지와 아이들', '서태지와 젊은이들', '서태지와 친구들', '서태지와 동무들'],
        answer: 0,
        correctAnswer: '서태지와 아이들'
    },
    {
        type: 'choice',
        question: '서태지와 아이들의 데뷔 연도는?',
        choices: ['1990년', '1991년', '1992년', '1993년'],
        answer: 2,
        correctAnswer: '1992년'
    },
    {
        type: 'choice',
        question: '서태지와 아이들의 멤버가 아닌 사람은?',
        choices: ['서태지', '양현석', '이주노', '박진영'],
        answer: 3,
        correctAnswer: '박진영'
    },
    {
        type: 'choice',
        question: '다음 중 서태지와 아이들의 히트곡이 아닌 것은?',
        choices: ['난 알아요', '교실 이데아', 'Come Back Home', '캔디'],
        answer: 3,
        correctAnswer: '캔디 (H.O.T.의 곡)'
    },
    {
        type: 'text',
        question: '서태지의 부인(아내) 이름은? (힌트: 배우)',
        answer: '이은성',
        acceptAnswers: ['이은성', '은성']
    },
    {
        type: 'choice',
        question: '서태지와 아이들이 해체한 해는?',
        choices: ['1994년', '1995년', '1996년', '1997년'],
        answer: 2,
        correctAnswer: '1996년'
    },
    {
        type: 'text',
        question: '"난 알아요"의 다음 가사는? "이 세상은..."',
        answer: '요지경',
        acceptAnswers: ['요지경', '요지경이야']
    },
    {
        type: 'choice',
        question: '서태지의 본명은?',
        choices: ['서태지', '정현철', '서정원', '정태희'],
        answer: 0,
        correctAnswer: '서태지 (예명=본명)'
    },
    {
        type: 'choice',
        question: '서태지가 솔로로 컬래버레이션한 아이돌 그룹은?',
        choices: ['BTS', 'EXO', '세븐틴', 'NCT'],
        answer: 0,
        correctAnswer: 'BTS (방탄소년단)'
    },
    {
        type: 'text',
        question: '서태지와 아이들의 "교실 이데아"에서 학생들을 깨우치라고 외친 말은? "__여야 한다!" (2글자)',
        answer: '각성',
        acceptAnswers: ['각성', '각성해']
    }
];

// 등급 정보
const grades = [
    { min: 9, max: 10, name: '서태지 가족', emoji: '👨‍👩‍👧‍👦', message: '서태지 닮은 가족이시군요! 당신은 진정한 서태지 가족입니다!' },
    { min: 7, max: 8, name: '서태지 찐팬', emoji: '🎸', message: '서태지를 진심으로 사랑하는 찐팬이시군요!' },
    { min: 5, max: 6, name: '한국사람', emoji: '🇰🇷', message: '평범한 한국사람 수준의 서태지 지식을 가지고 계시네요!' },
    { min: 3, max: 4, name: '외국사람', emoji: '🌍', message: '한국 대중문화에 관심이 있는 외국인이신가요?' },
    { min: 0, max: 2, name: '외계인', emoji: '👽', message: '당신은 혹시 지구에 온 지 얼마 안 된 외계인?' }
];

// 게임 상태
let currentIndex = 0;
let score = 0;
let isAnswered = false;

// DOM 요소
let scoreEl, progressEl, questionEl, choicesEl, inputEl, submitBtn, nextBtn, feedbackEl;

// 게임 초기화
function initGame() {
    // DOM 요소 캐싱
    scoreEl = document.getElementById('score');
    progressEl = document.getElementById('progress');
    questionEl = document.getElementById('question');
    choicesEl = document.getElementById('choices');
    inputEl = document.getElementById('answer-input');
    submitBtn = document.getElementById('submit-btn');
    nextBtn = document.getElementById('next-btn');
    feedbackEl = document.getElementById('feedback');

    currentIndex = 0;
    score = 0;
    isAnswered = false;

    // 이벤트 리스너 등록
    submitBtn.addEventListener('click', checkAnswer);
    nextBtn.addEventListener('click', nextQuestion);
    
    // 입력란 이벤트 - keypress와 keyup 모두 처리
    inputEl.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !isAnswered) {
            e.preventDefault();
            checkAnswer();
        }
    });
    
    inputEl.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !isAnswered) {
            e.preventDefault();
        }
    });

    updateUI();
    showQuestion();
}

// UI 업데이트
function updateUI() {
    scoreEl.textContent = score;
    progressEl.textContent = `${currentIndex + 1} / ${quizData.length}`;
}

// 문제 표시
function showQuestion() {
    if (currentIndex >= quizData.length) {
        showResult();
        return;
    }

    const q = quizData[currentIndex];
    questionEl.textContent = `Q${currentIndex + 1}. ${q.question}`;
    
    // 선택지 영역 초기화
    choicesEl.innerHTML = '';
    
    if (q.type === 'choice') {
        // 객관식 문제
        inputEl.style.display = 'none';
        
        q.choices.forEach((choice, index) => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.textContent = choice;
            btn.dataset.index = index;
            btn.addEventListener('click', () => selectChoice(index));
            choicesEl.appendChild(btn);
        });
    } else {
        // 주관식 문제
        inputEl.style.display = 'block';
        inputEl.value = '';
        inputEl.disabled = false;
        setTimeout(() => inputEl.focus(), 100);
    }
    
    submitBtn.disabled = false;
    submitBtn.classList.remove('hidden');
    nextBtn.classList.add('hidden');
    
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    
    isAnswered = false;
}

// 객관식 선택
function selectChoice(index) {
    if (isAnswered) return;
    
    // 선택 표시
    const buttons = choicesEl.querySelectorAll('.choice-btn');
    buttons.forEach((btn, i) => {
        btn.classList.remove('selected');
        if (i === index) {
            btn.classList.add('selected');
        }
    });
}

// 정답 확인
function checkAnswer() {
    if (isAnswered) return;
    
    const q = quizData[currentIndex];
    let isCorrect = false;
    let userAnswer = '';
    
    if (q.type === 'choice') {
        // 객관식 체크
        const selectedBtn = choicesEl.querySelector('.choice-btn.selected');
        if (!selectedBtn) {
            showFeedback('선택지를 선택해주세요!', 'wrong');
            return;
        }
        userAnswer = parseInt(selectedBtn.dataset.index);
        isCorrect = userAnswer === q.answer;
    } else {
        // 주관식 체크
        userAnswer = inputEl.value.trim();
        if (!userAnswer) {
            showFeedback('답을 입력해주세요!', 'wrong');
            return;
        }
        // 정답 확인 (대소문자 무시)
        isCorrect = q.acceptAnswers.some(ans => 
            userAnswer.toLowerCase() === ans.toLowerCase()
        );
    }
    
    isAnswered = true;
    submitBtn.disabled = true;
    submitBtn.classList.add('hidden');
    
    // 선택지/입력란 비활성화
    const buttons = choicesEl.querySelectorAll('.choice-btn');
    buttons.forEach((btn, i) => {
        btn.disabled = true;
        if (i === q.answer) {
            btn.classList.add('correct');
        } else if (q.type === 'choice' && i === userAnswer && !isCorrect) {
            btn.classList.add('wrong');
        }
    });
    if (q.type === 'text') {
        inputEl.disabled = true;
    }
    
    if (isCorrect) {
        score++;
        updateUI();
        showFeedback('🎉 정답입니다!', 'correct');
    } else {
        const correctText = q.type === 'choice' ? q.correctAnswer : q.answer;
        showFeedback(`❌ 틀렸습니다! 정답: ${correctText}`, 'wrong');
    }
    
    // 다음 버튼 표시
    if (currentIndex < quizData.length - 1) {
        nextBtn.textContent = '다음 문제 ➡️';
        nextBtn.classList.remove('hidden');
    } else {
        nextBtn.textContent = '결과 보기 🎯';
        nextBtn.classList.remove('hidden');
    }
}

// 피드백 표시
function showFeedback(message, type) {
    feedbackEl.textContent = message;
    feedbackEl.className = `feedback ${type}`;
}

// 다음 문제
function nextQuestion() {
    if (currentIndex < quizData.length - 1) {
        currentIndex++;
        updateUI();
        showQuestion();
    } else {
        showResult();
    }
}

// 결과 화면 표시
function showResult() {
    const gameArea = document.querySelector('.game-area');
    
    // 등급 계산
    const grade = grades.find(g => score >= g.min && score <= g.max);
    
    gameArea.innerHTML = `
        <div class="result-area">
            <h2>🎸 서태지 퀴즈 결과</h2>
            <div class="final-score">${score} / ${quizData.length}점</div>
            <div class="grade-badge">
                <span class="grade-emoji">${grade.emoji}</span>
                <span class="grade-name">${grade.name}</span>
            </div>
            <div class="message">${grade.message}</div>
            <button id="restart-btn" type="button">다시 도전하기 🔄</button>
        </div>
    `;
    
    document.getElementById('restart-btn').addEventListener('click', restartGame);
}

// 게임 다시 시작
function restartGame() {
    location.reload();
}

// 페이지 로드 시 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    initGame();
}
