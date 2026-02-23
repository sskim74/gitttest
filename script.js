// 팀원 데이터 (김선숙 팀장)
const teamMembers = [
    { name: '하승호', initials: 'ㅎㅅㅎ' },
    { name: '민경환', initials: 'ㅁㄱㅎ' },
    { name: '홍주희', initials: 'ㅎㅈㅎ' },
    { name: '김재원', initials: 'ㄱㅈㅇ' },
    { name: '김선숙', initials: 'ㄱㅅㅅ', isLeader: true },
    { name: '조현규', initials: 'ㅈㅎㄱ' }
];

// 게임 상태
let currentIndex = 0;
let score = 0;
let shuffledMembers = [];
let isAnswered = false;

// DOM 요소
let scoreEl, progressEl, initialsEl, hintTextEl, inputEl, submitBtn, nextBtn, restartBtn, feedbackEl;

// 배열 섞기
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// 게임 초기화
function initGame() {
    // DOM 요소 캐싱
    scoreEl = document.getElementById('score');
    progressEl = document.getElementById('progress');
    initialsEl = document.getElementById('initials');
    hintTextEl = document.getElementById('hint-text');
    inputEl = document.getElementById('answer-input');
    submitBtn = document.getElementById('submit-btn');
    nextBtn = document.getElementById('next-btn');
    restartBtn = document.getElementById('restart-btn');
    feedbackEl = document.getElementById('feedback');

    currentIndex = 0;
    score = 0;
    isAnswered = false;
    shuffledMembers = shuffleArray(teamMembers);

    // 이벤트 리스너 등록
    submitBtn.addEventListener('click', checkAnswer);
    nextBtn.addEventListener('click', nextQuestion);
    restartBtn.addEventListener('click', restartGame);
    inputEl.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    });

    updateUI();
    showQuestion();
}

// UI 업데이트
function updateUI() {
    scoreEl.textContent = score;
    progressEl.textContent = `${currentIndex + 1} / ${teamMembers.length}`;
}

// 문제 표시
function showQuestion() {
    if (currentIndex >= shuffledMembers.length) {
        showResult();
        return;
    }

    const member = shuffledMembers[currentIndex];
    initialsEl.textContent = member.initials;
    hintTextEl.textContent = member.isLeader ? '💡 힌트: 우리 팀의 리더!' : '';
    
    inputEl.value = '';
    inputEl.disabled = false;
    inputEl.focus();
    
    submitBtn.disabled = false;
    nextBtn.classList.add('hidden');
    restartBtn.classList.add('hidden');
    
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    
    isAnswered = false;
}

// 정답 확인
function checkAnswer() {
    if (isAnswered) return;
    
    const userAnswer = inputEl.value.trim();
    
    if (!userAnswer) {
        showFeedback('이름을 입력해주세요!', 'wrong');
        return;
    }

    const currentMember = shuffledMembers[currentIndex];
    const isCorrect = userAnswer === currentMember.name;
    
    isAnswered = true;
    inputEl.disabled = true;
    submitBtn.disabled = true;

    if (isCorrect) {
        score += 10;
        updateUI();
        showFeedback(`🎉 정답입니다! ${currentMember.name}${currentMember.isLeader ? ' (팀장)' : ''}`, 'correct');
    } else {
        showFeedback(`❌ 틀렸습니다! 정답은 "${currentMember.name}"${currentMember.isLeader ? ' (팀장)' : ''}입니다.`, 'wrong');
    }

    if (currentIndex < shuffledMembers.length - 1) {
        nextBtn.classList.remove('hidden');
    } else {
        setTimeout(() => {
            showResult();
        }, 1500);
    }
}

// 피드백 표시
function showFeedback(message, type) {
    feedbackEl.textContent = message;
    feedbackEl.className = `feedback ${type}`;
}

// 다음 문제
function nextQuestion() {
    currentIndex++;
    updateUI();
    showQuestion();
}

// 결과 화면 표시
function showResult() {
    const gameArea = document.querySelector('.game-area');
    const percentage = (score / (teamMembers.length * 10)) * 100;
    
    let message = '';
    if (percentage === 100) {
        message = '🏆 완벽해요! 모든 팀원을 알고 계시네요!';
    } else if (percentage >= 80) {
        message = '👏 훌륭해요! 팀원들을 잘 알고 계시네요!';
    } else if (percentage >= 60) {
        message = '👍 좋아요! 조금만 더 친해지면 될 것 같아요!';
    } else if (percentage >= 40) {
        message = '💪 괜찮아요! 팀원들과 더 친해져 보세요!';
    } else {
        message = '😅 팀원들의 이름을 좀 더 기억해보아요!';
    }

    gameArea.innerHTML = `
        <div class="result-area">
            <h2>🎮 게임 종료!</h2>
            <div class="final-score">${score} / ${teamMembers.length * 10}점</div>
            <div class="message">${message}</div>
            <button id="restart-btn-result" type="button">다시 시작 🔄</button>
        </div>
    `;
    
    document.getElementById('restart-btn-result').addEventListener('click', restartGame);
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
