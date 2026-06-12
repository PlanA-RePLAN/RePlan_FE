# CLAUDE.md — Figma → Code 규칙

이 문서는 Figma 디자인을 코드로 옮길 때 Claude Code가 반드시 따라야 할 규칙이다.
모든 Figma 기반 작업에서 이 규칙을 우선한다.

## 핵심 원칙

디자인을 처음부터 새로 그리지 않는다. 항상 우리 디자인 시스템의 **기존 컴포넌트와 토큰을 재사용**한다.
새로 만드는 것은 정말로 대응되는 컴포넌트가 하나도 없을 때뿐이다.

## Figma 작업 순서 (건너뛰지 말 것)

1. `get_design_context`로 해당 노드의 구조를 먼저 가져온다.
2. 응답이 너무 크거나 잘리면 `get_metadata`로 전체 노드 맵을 본 뒤, 필요한 노드만 다시 `get_design_context`로 가져온다.
3. `get_screenshot`으로 시각 참조를 확보한다.
4. context와 screenshot이 **둘 다** 확보된 후에만 구현을 시작한다.
5. MCP 출력(보통 React + Tailwind)은 "디자인의 표현"일 뿐, 최종 코드 스타일이 아니다. 우리 프로젝트 컨벤션으로 번역한다.
6. 구현 후 Figma와 1:1로 시각 대조하여 검증한다.

## 컴포넌트 재사용 (가장 중요)

- 새 컴포넌트를 만들기 전에 항상 `src/components` (및 디자인 시스템 경로)를 먼저 확인한다.
- 같은 역할의 컴포넌트가 이미 있으면 그것을 import해서 쓴다. **절대 중복 생성하지 않는다.**
- 버튼·인풋·카드·타이포 같은 기본 요소를 raw HTML 태그(`<button>`, `<input>` 등)로 새로 만들지 않는다. 기존 컴포넌트를 쓴다.
- 디자인이 기존 컴포넌트의 변형으로 표현 가능하면, 새 컴포넌트가 아니라 **prop / variant로 처리**한다.

## 우리 컴포넌트 패턴 (반드시 따를 것)

- 구조가 복잡해지는 경우 **복합 컴포넌트(compound) 패턴**을 쓴다. 서브 요소는 같은 파일에 함수로 정의하고 루트에 static으로 부착한다.
  예: `TodoCard.Icon = Icon`, `TodoCard.Title = Title` → 사용처에서 `<TodoCard.Title>`로 조합.
- **variant는 union 타입 prop + 파생 플래그 + `cn()` 조건부 클래스**로 처리한다. (cva / tailwind-variants 안 씀)
  예: `status?: 'focused' | 'grey' | 'default'` → `const isFocused = status === 'focused'` → `cn('base', { 'bg-...': isFocused })`
- 단순한 enum→클래스 매핑은 **lookup 객체**를 쓴다. 예: `const colors = { D: '...', M: '...' }; colors[tag]`
- 클래스 합성은 항상 `cn`(`@/shared/utils/cn`)을 쓴다.
- 경로는 `@/` 별칭을 쓰고, 형제 컴포넌트만 상대경로로 import한다.
- icon이 존재하는 경우

## 스타일 규칙

- 색·간격·radius·타이포는 **하드코딩 금지.** 반드시 디자인 토큰을 사용한다.
- 인라인 스타일을 쓰지 않는다. (정말 불가피한 경우만 예외)
- Figma 변수(variables)는 우리 토큰 레이어에 매핑해서 사용한다.

## 새 컴포넌트를 만들어야 할 때

- 위치: `src/shared/components/{ComponentName}.tsx` 또는 `src/features/{featureName}/components/{ComponentName}.tsx`
- export: 같은 폴더의 `index.ts`에서 export
- 기존 컴포넌트의 prop 네이밍·파일 구조 컨벤션을 그대로 따른다.
- 언어: TypeScript. prop 타입을 명시한다.

## 검증

- 구현 후 직접 렌더 결과를 확인하고 Figma 스크린샷과 비교한다.
- 기존 컴포넌트로 대체 가능했는데 새로 만든 부분이 있으면 명시적으로 표시한다.

## 다음 단계 (아직 없으면 무시)

- 컴포넌트 manifest 파일이 생기면, 새 컴포넌트를 만들기 전에 **manifest를 먼저 조회**해서 매칭되는 기존 컴포넌트를 찾는다.
