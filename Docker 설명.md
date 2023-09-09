## Docker compose 강의

https://youtu.be/EK6iYRCIjYs?si=XWyV4V1vi3bbY30j

## Dockerfile 강의

https://www.youtube.com/watch?v=0kQC19w0gTI

## mysql 백업

- ### 도커의 DB컨테이너 접속

```
<!-- 컨테이너 접속하기 -->
docker exec -it 컨테이너이름 bash

<!-- MySQL에 root 계정으로 접속 -->
mysql -u root -p
```

```
<!-- DB에 직접 접속하기 -->
docker exec -it 컨테이너이름  mysql -u root -p
```

- ### 데이터(스키마&테이블) 백업

```
docker exec <기존_컨테이너_이름> mysqldump -u root -p<비밀번호> <데이터베이스_이름> > backup.sql

<!-- 백업 스크립트에 CREATE DATABASE 와 USE 추가 해줘야 됨 -->
mysqldump -u 로그인할사용자이름 -p 백업할DB(스키마)이름 > 저장할파일이름.sql
```

## 컨테이너의 이미지 만들기

- ### Dockerfile

```Dockerfile
# 사용할 베이스 이미지 지정
FROM mariadb:10.6.8


# 환경 변수 설정 (MySQL 루트 비밀번호 및 백업 파일 이름)
ENV MYSQL_ROOT_PASSWORD=root
ENV TZ=Asia/Seoul
ENV BACKUP_FILE=./init/backup230907.sql


# 초기화 스크립트를 컨테이너 내부로 복사하여 데이터베이스 초기화
# 빌드할 때 호스트에 있는 DB 생성 스크립트 파일들을 생성될 이미지 안으로 복사
# docker-entrypoint-initdb.d 폴더 안의 파일들은 도커 컨테이너 최초 실행 시 사용되기 때문
# (원본 컨테이너 밖의)호스트 -> (새로 만들어질 컨테이너)이미지
COPY $BACKUP_FILE /docker-entrypoint-initdb.d/


# 포트 설정 (이미지에는 포트 설정이 되어 있으므로 필요 없을 수 있습니다)
EXPOSE 3306
```

- ### Dockerfile 사용하여 이미지 빌드

```
$ docker build -t 이미지이름:태그 .
```

### 생성된 이미지를 사용하여 새로운 컨테이너 생성하기

```
version: '3'
services:
  db:
    image: 사용할이미지이름
    container_name: 컨테이너이름
    restart: always
    ports:
      - 외부접속포트:내부접속포트(mysql기본은3306)
    environment:
      MYSQL_ROOT_PASSWORD: root비밀번호
      TZ: Asia/Seoul
    volumes:
      - ./db/mysql/data:/var/lib/mysql
      - ./db/mysql/init:/docker-entrypoint-initdb.d
```
