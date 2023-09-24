-- 1
CREATE DATABASE errands_app DEFAULT CHARACTER SET utf8 default collate utf8_general_ci;

-- 2
USE errands_app

-- 3
create table user_info (
	id int not null primary key auto_increment,
    user_id varchar(20) not null,
    user_pw varchar(20) not null,
    user_name varchar(20) unique,
    user_type varchar(4),
    user_img varchar(100) not null default ""
);

create table wanter_board (
	wanter_board_id int not null primary key auto_increment,
    wanter_board_writer varchar(20) not null,
    foreign key(wanter_board_writer) references user_info(user_name) ON UPDATE CASCADE on delete cascade,
    wanter_board_title varchar(100) not null,
    wanter_board_content varchar(1000) not null,
    wanter_board_place varchar(200) not null,
    wanter_board_place_detail varchar(100) default "",
    wanter_board_date timestamp not null default current_timestamp,
    wanter_board_hit int default 0,
    wanter_board_dead_line varchar(50),
    wanter_board_done int default 0
);

create table helper_board (
	helper_board_id int not null primary key auto_increment,
    helper_board_writer varchar(20) not null,
    foreign key(helper_board_writer) references user_info(user_name) ON UPDATE CASCADE on delete cascade,
    helper_board_title varchar(100) not null,
    helper_board_contengt varchar(1000) not null,
    helper_board_place varchar(200) not null,
    helper_board_date timestamp not null default current_timestamp,
    helper_board_hit int default 0
);

create table wanter_comment (
	wanter_comment_id int not null primary key auto_increment,
    wanter_comment_board_id int not null,
    foreign key(wanter_comment_board_id) references wanter_board(wanter_board_id) ON UPDATE CASCADE on delete cascade,
    wanter_comment_writer varchar(20) not null,
    foreign key(wanter_comment_writer) references user_info(user_name) ON UPDATE CASCADE on delete cascade,
    wanter_comment_content varchar(1000) not null,
    wanter_comment_date timestamp not null default current_timestamp
);

create table helper_comment (
	helper_comment_id int not null primary key auto_increment,
    helper_comment_board_id int not null,
    foreign key(helper_comment_board_id) references helper_board(helper_board_id) ON UPDATE CASCADE on delete cascade,
    helper_comment_writer varchar(20) not null,
    foreign key(helper_comment_writer) references user_info(user_name) ON UPDATE CASCADE on delete cascade,
    helper_comment_content varchar(1000) not null,
    helper_comment_date timestamp not null default current_timestamp
);

-- 4

insert into user_info(user_id,user_pw,user_name,user_type) values ('test','1234','테스트','W');
INSERT INTO wanter_board(WANTER_BOARD_WRITER, WANTER_BOARD_TITLE, WANTER_BOARD_CONTENT, WANTER_BOARD_PLACE) value ('테스트','테스트제목','테스트내용','마포구');
INSERT INTO helper_board(HELPER_BOARD_WRITER, HELPER_BOARD_TITLE, HELPER_BOARD_CONTENT, HELPER_BOARD_PLACE) value ('테스트','테스트제목','테스트내용','마포구');
INSERT INTO wanter_comment(WANTER_COMMENT_BOARD_ID,WANTER_COMMENT_WRITER,WANTER_COMMENT_CONTENT) VALUES ('1','테스트','테스트댓글');
INSERT INTO wanter_comment(WANTER_COMMENT_BOARD_ID,WANTER_COMMENT_WRITER,WANTER_COMMENT_CONTENT) VALUES ('1','테스트','테스트댓글');
