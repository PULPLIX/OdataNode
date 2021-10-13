USE master;
GO
------------------------------------------------------------------------------------------------------------
CREATE DATABASE Posts;
------------------------------------------------------------------------------------------------------------

USE Posts;
Go

CREATE TABLE tags(
    id INT PRIMARY KEY IDENTITY (1, 1),
    name VARCHAR(50) NOT NULL,
	created_at DATETIME2(7),
	is_deleted TINYINT
);

CREATE TABLE users(
    id INT PRIMARY KEY IDENTITY (1, 1),
    user_name VARCHAR(250) NOT NULL,
    email VARCHAR(250) NOT NULL,
	created_at DATETIME2(7),
	is_deleted TINYINT
);

CREATE TABLE posts(
    id INT PRIMARY KEY IDENTITY (1, 1),
    caption VARCHAR(250) NOT NULL,
    user_id INT NOT NULL,
	created_at DATETIME2(7),
	is_deleted TINYINT
	CONSTRAINT FK_UserPosts FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE posts_tags(
    post_id INT ,
    tag_id INT ,
	updated_at DATETIME2(7),
	is_deleted TINYINT,
	CONSTRAINT PK_PostTags PRIMARY KEY NONCLUSTERED (post_id, tag_id),
	CONSTRAINT FK_PostsTags_posts FOREIGN KEY (post_id) REFERENCES posts(id),
	CONSTRAINT FK_PostsTags_tags FOREIGN KEY (tag_id) REFERENCES tags(id)
);
------------------------------------------------------------------------------------------------------------

INSERT INTO tags (name,created_at,is_deleted) values ('#vacations', (GETDATE()), 0)
INSERT INTO tags (name,created_at,is_deleted) values ('#exercise', (GETDATE()), 0)
INSERT INTO tags (name,created_at,is_deleted) values ('#technology', (GETDATE()), 0)
INSERT INTO tags (name,created_at,is_deleted) values ('#work', (GETDATE()), 0)
INSERT INTO tags (name,created_at,is_deleted) values ('#study', (GETDATE()), 0)
------------------------------------------------------------------------------------------------------------
INSERT INTO users (user_name, email, created_at,is_deleted) values ('user_1', 'user1@example.com',(GETDATE()), 0)
INSERT INTO users (user_name, email, created_at,is_deleted) values ('user_2', 'user2@example.net',(GETDATE()), 0)
------------------------------------------------------------------------------------------------------------
INSERT INTO posts (caption,user_id,created_at,is_deleted) values ('My first time in this beach', 1, (GETDATE()), 0)
INSERT INTO posts (caption,user_id,created_at,is_deleted) values ('Work hard, play hard', 1, (GETDATE()), 0)
INSERT INTO posts (caption,user_id,created_at,is_deleted) values ('One week more...', 1, (GETDATE()), 0)

------------------------------------------------------------------------------------------------------------
INSERT INTO posts_tags (post_id, tag_id, updated_at, is_deleted) values (1, 1,GETDATE(), 0)

INSERT INTO posts_tags (post_id, tag_id, updated_at, is_deleted) values (2, 2,GETDATE(), 0)
INSERT INTO posts_tags (post_id, tag_id, updated_at, is_deleted) values (2, 4,GETDATE(), 0)

INSERT INTO posts_tags (post_id, tag_id, updated_at, is_deleted) values (3, 3,GETDATE(), 0)
INSERT INTO posts_tags (post_id, tag_id, updated_at, is_deleted) values (3, 4,GETDATE(), 0)
INSERT INTO posts_tags (post_id, tag_id, updated_at, is_deleted) values (3, 5,GETDATE(), 0)
GO


CREATE OR ALTER VIEW VW_get_posts
AS
SELECT 
p.id AS post_id,
p.caption,
p.user_id,
p.created_at,
u.user_name,
u.email
FROM posts p
INNER JOIN users u on u.id = p.[user_id]
WHERE p.is_deleted= 0;
GO

CREATE OR ALTER PROC SP_get_posts_by_tag_name(@tag_name VARCHAR(50))
AS
BEGIN 
	SELECT 
	p.id AS post_id,
	p.caption,
	p.user_id,
	p.created_at,
	u.user_name,
	u.email
	FROM posts p
	INNER JOIN users u on u.id = p.[user_id]
	INNER JOIN posts_tags pt on pt.post_id = p.id
	INNER JOIN tags t on t.id = pt.tag_id
	where t.name like @tag_name
	AND p.is_deleted= 0;
END
GO


CREATE OR ALTER PROC SP_get_posts_tags(@post_id INT)
AS
BEGIN 
	SELECT 
	t.name
	FROM posts p
	INNER JOIN users u on u.id = p.[user_id]
	INNER JOIN posts_tags pt on pt.post_id = p.id
	INNER JOIN tags t on t.id = pt.tag_id
	where pt.tag_id = @post_id
	and p.is_deleted= 0;
END

exec SP_get_posts_tags 1