# RePlan FE

React(Web) + React Native(App) 모노레포 프로젝트입니다.

## 폴더 구조

```
RePlan_FE/
├── apps/
│   ├── web/                    # 웹 앱 (@replan/web)
│   │   ├── src/
│   │   │   ├── App.tsx
│   │   │   └── main.tsx
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── app/                    # 모바일 앱 (@replan/app, Expo)
│       ├── app/
│       │   ├── _layout.tsx
│       │   └── index.tsx
│       ├── src/
│       ├── app.json
│       ├── babel.config.js
│       ├── tsconfig.json
│       └── package.json
│
├── packages/
│   └── shared/                 # 공유 패키지 (@replan/shared)
│       ├── src/
│       │   ├── index.ts
│       │   └── types.ts
│       ├── tsconfig.json
│       └── package.json
│
├── tsconfig.json
├── package.json
└── READEME.MD
```

## 기술 스택

| 영역 | 기술 |
|------|------|
| 웹 | React 18, Vite, TypeScript |
| 모바일 | React Native 0.74, Expo 51, Expo Router |
| 공유 | TypeScript |
| 패키지 관리 | npm workspaces (모노레포) |
| 린트 | ESLint 9 (flat config), typescript-eslint |

## 시작하기

### 의존성 설치

```bash
npm install
```

### 개발 서버 실행

```bash
# 웹
npm run web

# 모바일 (Expo)
npm run app
```

### 빌드

```bash
# 웹 빌드
npm run build:web
```

### 타입 체크 / 린트

```bash
npm run typecheck
npm run lint
```

## ESLint 구성

ESLint 9 [flat config](https://eslint.org/docs/latest/use/configure/configuration-files) 방식을 사용합니다.
공통 패키지는 루트 `devDependencies`에 설치되고, 각 워크스페이스에 별도 설정 파일이 있습니다.

| 워크스페이스 | 설정 파일 | 적용 규칙 |
|---|---|---|
| `apps/web` | `eslint.config.js` | typescript-eslint, react, react-hooks |
| `apps/app` | `eslint.config.mjs` | typescript-eslint, react, react-hooks |
| `packages/shared` | `eslint.config.js` | typescript-eslint |

**사용 패키지**

| 패키지 | 역할 |
|---|---|
| `typescript-eslint` | TypeScript 파싱 + 타입 관련 규칙 |
| `eslint-plugin-react` | React 컴포넌트/JSX 규칙 |
| `eslint-plugin-react-hooks` | hooks 규칙 (exhaustive-deps 등) |
| `globals` | 실행 환경 전역 변수 (browser, node) |

## 패키지 구조

- **`apps/web`** — Vite 기반 React 웹 애플리케이션
- **`apps/app`** — Expo Router 기반 React Native 모바일 앱
- **`packages/shared`** — 웹/앱 공통으로 사용하는 타입 및 유틸리티
