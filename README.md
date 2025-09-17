🚀 프로젝트명: 똑터뷰
AI 면접 서비스입니다.

<br>

🐶 팀 정보
팀명: 원투펀치

개발자 명단:

김진주 / 프론트

방지석 / 프론트

<br>

📚 기술 스택 및 라이브러리
라이브러리/기술	사용 목적 (Purpose)
React	선언적 UI와 컴포넌트 기반 아키텍처를 통한 웹 UI 개발
Vite	빠르고 효율적인 프론트엔드 개발 환경 및 빌드 도구
React Router	클라이언트 사이드 라우팅 및 페이지 전환 관리
Redux Toolkit	전역 상태 관리를 통한 컴포넌트 간 데이터 흐름 제어
Axios	HTTP 클라이언트 라이브러리를 이용한 서버 API 통신
Styled-components	컴포넌트 기반 스타일링 및 동적 CSS 관리
ESLint	코드 품질 향상 및 코딩 스타일 일관성 유지
Prettier	정해진 규칙에 따른 코드 포맷팅 자동화

<br>

🌳 브랜치 전략 (Git-flow)
main: 제품으로 출시될 수 있는 브랜치

develop: 다음 출시 버전을 개발하는 브랜치

feature/{feature-name}: 기능 개발을 위한 브랜치 (develop에서 분기)

release/{version}: 다음 버전 출시를 준비하는 브랜치

hotfix/{issue}: 출시 버전에서 발생한 버그를 수정하는 브랜치

브랜치 네이밍 컨벤션:
Type/#(issue-number)-description
예시: feat/#1-login-page

<br>

🏷️ 커밋 / PR / Issue 컨벤션
Commit Message Convention:
[Type]: Subject
예시: feat: 로그인 페이지 UI 구현

feat: 새로운 기능 추가

fix: 버그 수정

docs: 문서 수정 (README 등)

style: 코드 포맷팅, 세미콜론 누락 등 (코드 변경 X)

refactor: 코드 리팩토링

test: 테스트 코드 추가/수정

chore: 빌드 업무 수정, 패키지 매니저 설정 등

Pull Request (PR) Convention:
Title: [Type] #(Issue-Number) - Subject
예시: [Feat] #1 - 로그인 페이지 UI 구현

<br>

🧑‍💻 코드 컨벤션
ESLint와 Prettier 설정 규칙을 따릅니다.

커밋 전 lint와 format 스크립트를 실행하여 코드 컨벤션을 준수합니다.

<br>

⚙️ 개발 환경 및 실행 방법
1. 개발 환경 설정:

Node.js: v18.x (LTS 버전) 이상

Package Manager: npm 또는 yarn

IDE: Visual Studio Code

추천 VSCode Extensions:

ESLint

Prettier - Code formatter

GitLens — Git supercharged

2. 프로젝트 실행 방법:

Bash

# 1. 저장소를 복제합니다.
$ git clone (저장소 URL)

# 2. 프로젝트 폴더로 이동합니다.
$ cd (프로젝트 폴더명)

# 3. 필요한 패키지를 설치합니다.
$ npm install 
# 또는
$ yarn install

# 4. 개발 서버를 실행합니다.
$ npm run dev
# 또는
$ yarn dev
<br>

📢 마침글
본 저장소는 **공개(Public)**로 운영합니다.
모든 팀원은 위 컨벤션과 전략을 준수하여 협업합니다.







