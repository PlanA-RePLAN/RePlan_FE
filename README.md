# RePlan FE

React + Vite 기반 PWA 프로젝트입니다.

## 폴더 구조

```
RePlan_FE/
├── src/
│   ├── features/           # 기능 단위
│   │   └── onBoarding/
│   │       ├── index.tsx           # 페이지 진입점
│   │       ├── components/         # 이 기능 전용 컴포넌트
│   │       └── hooks/              # 이 기능 전용 훅
│   ├── shared/             # 여러 feature에서 공통으로 사용
│   │   ├── components/
│   │   ├── hooks/
│   │   └── types/
│   │       └── index.ts
│   ├── App.tsx             # 라우트 설정
│   └── main.tsx
├── public/
│   └── icons/              # PWA 아이콘 (192x192, 512x512)
├── index.html
├── vite.config.ts
├── tsconfig.json
├── eslint.config.js
└── package.json
```

## 라우팅 구조

`features/` 폴더를 기반으로 라우트를 구성합니다. 각 feature의 `index.tsx`가 페이지 진입점 역할을 하며, `App.tsx`에서 라우트와 연결합니다.

```tsx
// App.tsx
<Routes>
  <Route path="/" element={<OnBoarding />} />
</Routes>
```

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | React 18, Vite |
| 언어 | TypeScript |
| 라우팅 | React Router v7 |
| PWA | vite-plugin-pwa |
| 린트 | ESLint 9 (flat config), typescript-eslint |

## 시작하기

### 의존성 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

### 빌드

```bash
npm run build
```

### 타입 체크 / 린트

```bash
npm run typecheck
npm run lint
```

## ESLint 구성

ESLint 9 flat config 방식을 사용합니다.

**사용 패키지**

| 패키지 | 역할 |
|---|---|
| `typescript-eslint` | TypeScript 파싱 + 타입 관련 규칙 |
| `eslint-plugin-react` | React 컴포넌트/JSX 규칙 |
| `eslint-plugin-react-hooks` | hooks 규칙 (exhaustive-deps 등) |
| `globals` | 실행 환경 전역 변수 (browser) |

## PWA 설정

`vite-plugin-pwa`로 서비스 워커와 Web App Manifest를 자동 생성합니다.

- `registerType: 'autoUpdate'` — 새 버전 배포 시 자동 업데이트
- 홈화면 추가, 오프라인 지원
- 아이콘은 `public/icons/` 에 `icon-192x192.png`, `icon-512x512.png` 추가 필요
