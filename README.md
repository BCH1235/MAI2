# AI Music Studio

![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB&style=for-the-badge)
![Flask](https://img.shields.io/badge/Flask-000000?logo=flask&logoColor=white&style=for-the-badge)
![MUI](https://img.shields.io/badge/MUI-007FFF?logo=mui&logoColor=white&style=for-the-badge)
![Magenta](https://img.shields.io/badge/Magenta%20MusicVAE-ff4f8b?logo=google&logoColor=white&style=for-the-badge)
![Tone.js](https://img.shields.io/badge/Tone.js-18181B?logo=sonic-pi&logoColor=EF4444&style=for-the-badge)
![TensorFlow.js](https://img.shields.io/badge/TFJS-FF6F00?logo=tensorflow&logoColor=white&style=for-the-badge)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?logo=firebase&logoColor=black&style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white&style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-3C873A?logo=node.js&logoColor=white&style=for-the-badge)

텍스트/오디오 프롬프트로 음악을 생성하고, AI 비트 메이커와 악보 변환 기능까지 제공하는 올인원 웹 스튜디오입니다.

![앱 미리보기](images/screenshot.png)

## 주요 기능
- **AI 음악 생성**: 장르·분위기·설명·길이로 프롬프트를 만들고 Replicate MusicGen으로 신규 트랙을 생성하거나, 참조 오디오를 업로드해 변주를 만듭니다.
- **AI 비트 메이커**: Magenta `MusicVAE` 기반 9트랙 드럼 시퀀서. 코너 프리셋을 블렌딩·경로 드로잉으로 변주하고, WAV로 내보낸 뒤 생성 페이지로 바로 전달할 수 있습니다.
- **악보 → 음악 변환**: PDF 악보를 업로드하면 Audiveris(OCR)로 MusicXML을 추출하고, MIDI/WAV/MP3 중 원하는 형식으로 렌더링합니다.
- **라이브러리 & 크리에이터**: Firebase Auth/Firestore/Storage를 통해 생성 결과를 저장·검색·재생하고, 크리에이터 프로필과 홈 피드에서 공유합니다.


## 기술 스택
- **Frontend**: React 19, React Router 7, MUI 7, Context API, React Error Boundary
- **AI & Audio**: Replicate MusicGen, Magenta `@magenta/music`, TensorFlow.js, Tone.js 시퀀싱·미디 재생
- **Backend**: Python 3 + Flask, `replicate` SDK, `music21`, `midi2audio`, Papago 번역 API 연동
- **Infra/DB**: Firebase Auth · Firestore · Storage, dotenv 기반 환경 변수 관리

## 아키텍처 한눈에
- React(MUI) 앱 → Flask API(`/api/...`) 호출 → Replicate로 음원 생성 또는 Audiveris로 악보 OCR 후 `music21`/FluidSynth로 렌더링
- 생성된 오디오는 Flask 정적 경로에 저장하고 URL을 반환하며, 필요 시 Firestore에 메타데이터 기록
- Tone.js + Magenta MusicVAE가 브라우저에서 실시간 비트 패턴을 합성하고, 세션 스토리지를 통해 생성 페이지와 결과 페이지 간 상태를 교환

### 디렉터리 가이드
```
/                    # 루트
├── src/             # React 소스
│   ├── pages/       # MusicGeneration, MusicConversion(Beat Maker), ScoreToMusic 등
│   ├── components/  # beat/, common/, layout/ Navbar 등
│   ├── services/    # musicApi(백엔드 호출), libraryWriter
│   ├── context/     # MusicContext (전역 상태)
│   └── lib/firebase # Firebase 초기화
├── ai-music-backend/ # Flask 서버
│   ├── server.py     # Replicate·Audiveris·Papago 연동 API
│   └── requirements.txt
└── images/screenshot.png # README 미리보기용
```

## 빠른 시작
### 사전 준비
- Node.js 16+ / npm
- Python 3.9+ / pip
- Java 11+ 및 Audiveris 설치 경로 (악보 변환 시 필요)
- FluidSynth 설치 권장(미디 → 오디오 렌더링 안정화)

### 프론트엔드 실행
1. 의존성 설치: `npm install`
2. `.env` 생성(루트):
   ```
   REACT_APP_API_BASE_URL=http://127.0.0.1:5000/api
   REACT_APP_FIREBASE_API_KEY=...
   REACT_APP_FIREBASE_AUTH_DOMAIN=...
   REACT_APP_FIREBASE_PROJECT_ID=...
   REACT_APP_FIREBASE_STORAGE_BUCKET=...
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
   REACT_APP_FIREBASE_APP_ID=...
   REACT_APP_FIREBASE_MEASUREMENT_ID=...
   ```
3. 개발 서버: `npm start` (기본 http://localhost:3000)

### 백엔드 실행
1. 이동: `cd ai-music-backend`
2. 가상환경 생성 및 활성화:
   ```
   python -m venv venv
   source venv/bin/activate        # macOS/Linux
   venv\Scripts\activate           # Windows
   ```
3. 의존성 설치: `pip install -r requirements.txt`
4. `.env` 생성(백엔드 폴더):
   ```
   REPLICATE_API_TOKEN=your-token
   REPLICATE_MODEL=meta/musicgen          # 선택
   PAPAGO_CLIENT_ID=your-id               # 선택 (한국어 프롬프트 번역)
   PAPAGO_CLIENT_SECRET=your-secret
   AUDIVERIS_JAR_DIR=/path/to/audiveris/lib
   AUDIVERIS_JAVA=/path/to/java           # 없으면 JAVA_HOME/bin/java 사용
   ```
   - 악보 변환을 쓰지 않으면 Audiveris/Java 설정은 건너뛸 수 있습니다.
5. 서버 실행: `python server.py` (기본 http://127.0.0.1:5000)

### 주요 API 엔드포인트
- `POST /api/music/generate` : 텍스트·장르·무드·길이(+옵션 오디오)로 AI 트랙 생성, 비동기 작업 ID 반환
- `GET  /api/music/task/status?task_id=...` : 생성 상태 폴링 및 오디오 URL 조회
- `POST /api/process-score` : PDF 악보 업로드 → MusicXML → MIDI/WAV/MP3 변환
- `GET  /api/audio/<filename>` : 생성된 오디오 파일 다운로드

## 스크립트
- `npm start` : 프론트엔드 개발 서버
- `npm test`  : React 테스트 러너
- `npm run build` : 프로덕션 번들 생성


