## 도커에 DB 설치

- ### 볼륨 마운트 위한 DB 디렉토리 만들기

```linux
- db/maria
  - conf
    - my.cnf
  - initdb
    - create_databases.sql
    - create_tables.sql
    - insert_data.sql
- .env
- docker-compose.yml
```

- #### 서버 설정
  `./db/maria/conf/my.cnf :`

```cnf
[client]
default-character-set = utf8mb4

[mysql]
default-character-set = utf8mb4

[mysqld]
character-set-client-handshake = FALSE
character-set-server           = utf8mb4
collation-server               = utf8mb4_unicode_ci
```

- #### DB 계정 정보
  `.env.db.docker :`

```env
MYSQL_ROOT_PASSWORD=han1002
```

- #### (if 기존에 있던 DB 옮긴다면)스크립트 파일들
  `./db/maria/init/*.sql :`

```sql
-- 데이터베이스 생성
CREATE DATABASE admin_panel DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;

-- 사용할 DB 선택
USE admin_panel;

-- 테이블 생성 & 데이터 입력 스크립트
```

- #### 스크립트 파일들

  `./db/maria/init/*.sql :`

- #### 컨테이너 정의
  `docker-compose.yml :`

```yml
version: "3"
services:
  db:
    image: mariadb:10.6.8
    container_name: admin_panel
    restart: always
    ports:
      - 33060:3306
    env_file: .env.db.docker
    volumes:
      # 볼륨생성 & 바인드마운트
      # 컨테이너 밖에 있는 호스트의 경로(탐색기에서 접근 가능)와 컨테이너 안에 있는 경로를 연결
      # 이것을 안 하면 컨테이너가 정지 혹은 삭제될때 데이터가 모두 사라짐
      # 호스트 파일 시스템의 데이터 디렉토리:컨테이너 내부
      # Docker 컨테이너 최초 실행 시 작동시킬 스크립트들(주로 데이터 생성)
      - ./db/maria/init:/docker-entrypoint-initdb.d
      # 실제 DB 데이터
      - ./db/maria/data:/var/lib/mysql
      # MySQL 서버의 구성 설정. MySQL 서버가 시작될때마다 실행
      - ./db/maria/conf:/etc/mysql/conf.d
```

- #### 정의된 컨테이너 빌드

```
$ docker-compose up
```

- #### DB 컨테이너 접속

```
<!-- 컨테이너 접속하기 -->
$ docker exec -it 컨테이너이름 bash

<!-- DB 직접 접속하기 -->
$ docker exec -it 컨테이너이름 mysql -u root -p
```

## DB 만들기

- #### 데이터베이스 만들기

```sql
-- 한글 정렬을 원활케 하기 위해 utf8mb4 사용
CREATE DATABASE admin_panel DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

- #### 테이블 만들기

```sql
CREATE TABLE Brand (
	brand_id INT PRIMARY KEY AUTO_INCREMENT COMMENT '브랜드 식별자',
	brand_name VARCHAR(255) NOT NULL DEFAULT '기본값' COMMENT '브랜드 이름'
);
```

```sql
CREATE TABLE Category (
  category_id INT PRIMARY KEY AUTO_INCREMENT COMMENT '카테고리 식별자',
  category_name VARCHAR(255) NOT NULL COMMENT '카테고리 이름'
);
```

```sql
CREATE TABLE Product (
  product_id INT PRIMARY KEY AUTO_INCREMENT COMMENT '고유 식별자',
  product_name VARCHAR(255) NOT NULL COMMENT '상품 이름',
  brand_id INT COMMENT 'Brand 테이블의 brand_id와 연결',
  category_id INT COMMENT 'Category 테이블의 category_id와 연결',
  sex VARCHAR(10) COMMENT '남, 여, 공용 등을 나타내는 값',
  is_kids BOOLEAN COMMENT '키즈 상품 여부를 나타내는 값',
  sales_quantity INT COMMENT '판매 수량',
  FOREIGN KEY (brand_id) REFERENCES Brand (brand_id),
  FOREIGN KEY (category_id) REFERENCES Category (category_id)
);
```

- #### Brand <-> Category 중간 테이블 만들기

```sql
CREATE TABLE Intermediate (
  intermediate_id INT PRIMARY KEY AUTO_INCREMENT COMMENT '고유 식별자',
  brand_id INT,
  category_id INT,
  FOREIGN KEY (brand_id) REFERENCES Brand (brand_id),
  FOREIGN KEY (category_id) REFERENCES Category (category_id)
);
```

## 실행

```
<!-- 서버 -->
$ cd server
$ npm run start

<!-- 클라이언트 -->
$ cd client
$ npm run dev
```
