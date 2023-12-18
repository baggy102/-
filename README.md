![image](https://github.com/kdt-project-dteam/errands-web/assets/96116158/1c838431-7d9c-46c6-bdc2-77c1041dc274)

# 풀스택 웹 프로젝트 - 심부릉 🚗.

Live Link : [http://15.164.163.114/](http://15.164.163.114/)

API Docs : http://15.164.163.114:8080/api-docs/



## 심부름 커뮤니티 플랫폼

### 개요

몸이아프거나 거동이불편하거나 현재 해야하는 일을 진행하기 힘든 사람들을 위한 **커뮤니티 플랫폼**

---

### Architecture

![image](https://github.com/baggy102/-/assets/127190426/b1acf257-eea3-4a28-adf5-4e02f8086bce)

### DB ERD 모형도
![image](https://github.com/kdt-project-dteam/errands-web/assets/96116158/a4549957-0d3c-4ae4-9784-4f008f27202c)

문제
•	회원 추천 시, 
무분별한 DB CALL로 인한 부하 발생 가능

![image](https://github.com/baggy102/-/assets/127190426/044f0f3c-0035-49f2-9668-f1aea3f8e13c)

해결
•	세션을 통해 이미 추천한 사람 식별, 무분별한 DB CALL 방지 함. 
•	DB CALL 횟수 3 -> 1회로 감소, 평균 응답시간 50% 감소.

![image](https://github.com/baggy102/-/assets/127190426/684836e5-9723-49fb-a43d-6fb4b7798fff)

문제
•	Express 서버 Memory storage에 저장된 session으로 인한 
서버 부하의 위험과, 세션 데이터의 손실 가능

해결
•	프로젝트에 필요한 Session 요구사항을 고려해 
in-memory 기반의 Redis 데이터베이스를 Session 저장소로 구현.

Redis와 MySQL 저장소 비교

<img width="368" alt="image" src="https://github.com/baggy102/-/assets/127190426/8e707a20-4702-40cc-bf23-f83780f7b59d">

Session 데이터 액세스 패턴 

![image](https://github.com/baggy102/-/assets/127190426/f78d694b-efa3-4993-8e8a-0959d5da40b9)
 
•	Session 데이터의 유무 확인
•	각 Session은 24hr 기준으로 삭제

Session 저장소에 따른 유저 시나리오 test
•	유저 로그인 -> 게시물 작성 -> 회원 추천

![image](https://github.com/baggy102/-/assets/127190426/ddd9fc44-23a6-4b92-932b-b280edf3b17d)

Redis의 in-memory 저장소는 RDBMS인 MySQL에 비해서
데이터의 처리 및 복잡한 쿼리 지원에 대한 제약, 유저 데이터의 영구 저장에 대한 우려가 존재하나

세션 만료 이후 자동 로그아웃 기능과,
유저 정보, 게시물 및 댓글을 처리하는 HTTP 요청의 
40% 이상이 Session 데이터의 액세스 필요

빈번한 데이터의 읽기 및 쓰기에 대한 성능 향상을 고려
Redis를 통한 Session 저장 방식을 선택
응답속도 86.67%, 시간 당 처리량 20% 향상

## 페이지 흐름도
![image](https://github.com/kdt-project-dteam/errands-web/assets/96116158/554e8ae8-7173-417d-85cf-c159052523e2)



## 사용 기술
<div align=left>
  FrontEnd
  <img src="https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white">
<img src="https://img.shields.io/badge/sass-CC6699?style=for-the-badge&logo=html5&logoColor=white">
<img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=html5&logoColor=white">
<img src="https://img.shields.io/badge/redux-764ABC?style=for-the-badge&logo=react&logoColor=white">
  <br/>
  BackEnd
  <img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white"> 
<img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white">
  <br/>
  server
  <img src="https://img.shields.io/badge/amazonaws-232F3E?style=for-the-badge&logo=amazonaws&logoColor=white">
<img src="https://img.shields.io/badge/nginx-009639?style=for-the-badge&logo=amazonaws&logoColor=white">
  </div>
  
### Frontend

- Reactjs
- redux-toolkit ( 상태관리 )
- redux-thunk ( 비동기처리를 전역상태관리하기 위해 도입 )
- react-router-dom
- sass
- axios ( 비동기 통신 )
- moment js ( 시간포맷을 일치시키기 위해 사용 )
- react-loader-spinner ( 로딩처리 위한 라이브러리 )
- kakao map api ( 카카오 지도 )
- kakao login api ( 카카오 로그인 )
- daum-postcode ( 카카오 우편번호 api )
- AOS ( 애니메이션 라이브러리 )
- SwiperJS ( 슬라이드 라이브러리 )
- SweetAlert2 ( alert 창 라이브러리 )

### Backend

- Nodejs express (MVC Pattern)
- Mysql
- Sequelize
- cors
- Session
- multer






