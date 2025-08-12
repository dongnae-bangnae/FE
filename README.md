# 동네방네: 동네 구석구석, 널리 퍼지다!

![image](https://github.com/user-attachments/assets/f2411ab1-8e8b-4048-9cb0-ceb0ccf3acc2)

## 목차
- [프로젝트 소개](#프로젝트-소개)
- [배포 주소](#배포-주소)
- [팀원 소개](#팀원-소개)
- [사용 기술 스택](#사용-기술-스택)
- [git 컨벤션](#git-컨벤션)
- [폴더 구조](#폴더-구조)
- [주요 기능 요약](#주요-기능-요약)
- [역할 분담](#역할-분담)
- [개발 기간](#개발-기간)

<br/>

## 🏡 <span id="프로젝트-소개">프로젝트 소개</span>

>**“동네의 진짜 매력을 발견하고 나누는 공간 기록 커뮤니티 웹"**

- 광고가 아닌, 진짜 동네 사람들이 경험한 장소를 추천해줘요!
- 내가 좋아하는 동네의 숨은 매력을 더 많이 발견할 수 있어요!
- 나만의 특별한 공간을 직접 기록하고, 공유해요!

<br/>

## 🚀 <span id="배포-주소">배포 주소</span>
> **프론트엔드 주소** https://www.dnbn.site/ <br/> 
> **백엔드 주소** <br/> 

<br/>

## 🧑‍🤝‍🧑 <span id="팀원-소개">팀원 소개</span>
<div align="center">
  
| 푸짐바오(김가빈) | 커비(권도희) | 도라(김동연) | 제리(조예교) |
|:----------------:|:------------:|:------------:|:-------------:|
| <img src="https://github.com/gcongK.png" width="100"/><br/> | <img src="https://github.com/dh2e.png" width="100"/><br/> | <img src="https://github.com/dongyeonkim1.png" width="100"/><br/> | <img src="https://github.com/choyekyo.png" width="100"/><br/> |
| [@gcongK](https://github.com/gcongK) | [@dh2e](https://github.com/dh2e) | [@dongyeonkim1](https://github.com/dongyeonkim1) | [@choyekyo](https://github.com/choyekyo) |

</div>

<br/>

## 🛠️ <span id="사용-기술-스택">사용 기술 스택</span>
| 분류              | 기술 |
|-------------------|------|
| Frontend Library  | React |
| Language          | TypeScript |
| Build Tool        | Vite |
| Package Manager   | pnpm |
| CSS Framework     | TailwindCSS |
| HTTP Client       | Axios |
| Server State      | TanStack Query |
| Query Devtools    | @tanstack/react-query-devtools |
| Global State      | Zustand |
| Lint              | ESLint |
| Formatter         | Prettier |
| Schema Validation | Zod |
| Routing           | React Router DOM |

<br/>

## 📚 <span id="git-컨벤션">git 컨벤션</span>
### 브랜치 전략
**Git Flow 방식: main ← develop ← feature**
- main: 배포 브랜치
- develop: 개발 브랜치
- feature: 페이지/기능 브랜치


### 브랜치 명명 규칙 
**브랜치 형식: 브랜치종류/#이슈번호_기능요약**
- 브랜치 종류: init, feature, fix  등등…
- ex) `feature/#1_mainPage`


### 커밋 메세지 규칙 
**Gitmoji 사용**
  
| 이모지 | 타입          | 설명               |
|--------|---------------|--------------------|
| 🎉     | Init          | 프로젝트 초기 설정  |
| ✨     | Feat          | 새로운 기능 추가    |
| 🐛     | Fix           | 버그 수정          |
| 💄     | Design        | UI/CSS 변경        |
| ✏️     | Typing Error  | 오타 수정          |
| 📝     | Docs          | 문서 수정          |
| 🚚     | Mod           | 파일/폴더 구조 변경 |
| 💡     | Add           | 파일/에셋 추가     |
| 🔥     | Del           | 파일 삭제          |
| ♻️     | Refactor      | 코드 리팩토링      |
| 🚧     | Chore         | 설정/배포 관련 작업 |
| 🔀     | Merge         | 브랜치 병합        |

### 커밋 메세지 형식 
```
이모지타입: 작업 내용 (#이슈번호)

ex) 🎉 Init: 프로젝트 생성 (#1)
```

<br/>

## 🗂️ <span id="폴더-구조">폴더 구조</span>
```
src/
├── pages/             # 페이지 컴포넌트
│   ├── LoginPage.tsx
│   ├── OnboardingPage.tsx
│   ├── HomePage.tsx
│   ├── NewRecordPage.tsx
│   ├── RecordDetailPage.tsx
│   ├── MapPage.tsx
│   ├── NewPlacePage.tsx
│   └── mypage/
│       ├── MyPage.tsx
│       ├── MyLikesPage.tsx
│       ├── MyProfilePage.tsx
│       └── SettingsPage.tsx
│
├── components/        # 공통 컴포넌트
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── ...

│
├── routes/            # 라우터 설정
│   └── Router.tsx
│
├── App.tsx
└── main.tsx
```

<br/>

## ✨ <span id="주요-기능-요약">주요 기능 요약</span>


<br/>

## 👥 <span id="역할-분담">역할 분담</span>
### 👩‍💻 푸짐바오(김가빈)
- Github 및 React 초기 환경 세팅
- 공용 컴포넌트 개발: 상단 바, 하단 바, 확인 모달
- 마이페이지 관련 화면 및 기능 구현
### 👩‍💻 커비(권도희)
- 로그인, 온보딩, 홈 화면 진입 흐름 구성
- 게시물 카드 컴포넌트 구현
### 👩‍💻 도라(김동연)
- 기록 페이지 기능 구현 (작성, 상세 조회 등)
### 👩‍💻 제리(조예교)
- 지도 페이지 기능 구현 (장소 등록, 지도 탐색 등)
- 카테고리 설정, 편집 및 장소 필터 기능 구현

<br/>

## ⏰ <span id="개발-기간">개발 기간</span>
