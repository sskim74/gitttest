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
    console.log('게임 초기화 시작');
    currentIndex = 0;
    score = 0;
    isAnswered = false;
    shuffledMembers = shuffleArray(teamMembers);
    console.log('섞인 순서:', shuffledMembers.map(m => m.name));
    updateUI();
    showQuestion();
}

// UI 업데이트
function updateUI() {
    document.getElementById('score').textContent = score;
    document.getElementById('progress').textContent = `${currentIndex + 1} / ${teamMembers.length}`;
}

// 문제 표시
function showQuestion() {
    if (currentIndex >= shuffledMembers.length) {
        showResult();
        return;
    }

    const member = shuffledMembers[currentIndex];
    document.getElementById('initials').textContent = member.initials;
    document.getElementById('hint-text').textContent = member.isLeader ? '💡 힌트: 우리 팀의 리더!' : '';
    
    // 입력 필드 초기화
    const input = document.getElementById('answer-input');
    input.value = '';
    input.disabled = false;
    input.focus();
    
    // 버튼 상태 초기화
    document.getElementById('submit-btn').disabled = false;
    document.getElementById('next-btn').classList.add('hidden');
    document.getElementById('restart-btn').classList.add('hidden');
    
    // 피드백 초기화
    const feedback = document.getElementById('feedback');
    feedback.textContent = '';
    feedback.className = 'feedback';
    
    isAnswered = false;
    console.log('현재 문제:', member.name, member.initials);
}

// 정답 확인
function checkAnswer() {
    console.log('checkAnswer 호출됨');
    
    if (isAnswered) {
        console.log('이미 답변했음, 무시');
        return;
    }
    
    const input = document.getElementById('answer-input');
    const userAnswer = input.value.trim();
    
    console.log('사용자 입력:', userAnswer);
    
    if (!userAnswer) {
        showFeedback('이름을 입력해주세요!', 'wrong');
        return;
    }

    const currentMember = shuffledMembers[currentIndex];
    const isCorrect = userAnswer === currentMember.name;
    
    console.log('정답:', currentMember.name, '사용자답:', userAnswer, '결과:', isCorrect);
    
    isAnswered = true;
    input.disabled = true;
    document.getElementById('submit-btn').disabled = true;

    if (isCorrect) {
        score += 10;
        updateUI();
        showFeedback(`🎉 정답입니다! ${currentMember.name}${currentMember.isLeader ? ' (팀장)' : ''}`, 'correct');
    } else {
        showFeedback(`❌ 틀렸습니다! 정답은 "${currentMember.name}"${currentMember.isLeader ? ' (팀장)' : ''}입니다.`, 'wrong');
    }

    // 다음 버튼 표시
    if (currentIndex < shuffledMembers.length - 1) {
        console.log('다음 버튼 표시');
        const nextBtn = document.getElementById('next-btn');
        nextBtn.classList.remove('hidden');
        nextBtn.style.display = 'inline-block';
    } else {
        console.log('마지막 문제, 결과 화면으로');
        setTimeout(() => {
            showResult();
        }, 1500);
    }
}

// 피드백 표시
function showFeedback(message, type) {
    const feedback = document.getElementById('feedback');
    feedback.textContent = message;
    feedback.className = `feedback ${type}`;
}

// 다음 문제
function nextQuestion() {
    console.log('nextQuestion 호출됨, 현재 인덱스:', currentIndex);
    currentIndex++;
    updateUI();
    showQuestion();
}

// 결과 화면 표시
function showResult() {
    console.log('showResult 호출됨');
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
        message = '😅 팀원들의 이름을 좀 더 기억핵보아요!';
    }

    gameArea.innerHTML = `
        <div class="result-area">
            <h2>🎮 게임 종료!</h2>
            <div class="final-score">${score} / ${teamMembers.length * 10}점</div>
            <div class="message">${message}</div>
            <button id="restart-btn" onclick="restartGame()">다시 시작 🔄</button>
        </div>
    `;
}

// 게임 다시 시작
function restartGame() {
    location.reload();
}

// 페이지 로드 후 초기화
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM 로드 완료, 게임 초기화');
    initGame();
    
    // 엔터 키 이벤트
    document.getElementById('answer-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            checkAnswer();
        }
    });
    
    // 제출 버튼 이벤트 (중복 방지)
    document.getElementById('submit-btn').addEventListener('click', (e) => {
        e.preventDefault();
        checkAnswer();
    });
    
    // 다음 버튼 이벤트
    document.getElementById('next-btn').addEventListener('click', (e) => {
        e.preventDefault();
        nextQuestion();
    });
});
