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