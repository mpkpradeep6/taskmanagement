CREATE TABLE IF NOT EXISTS task_table (
 tm_title VARCHAR(255) NOT NULL,
 tm_description  VARCHAR(255),
 tm_status VARCHAR(50) NOT NULL,
 tm_task_id SERIAL PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS user_table (
 tm_user VARCHAR(255) NOT NULL,
 tm_password VARCHAR(255) NOT NULL,
 tm_user_id SERIAL PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS token_table (
 tm_refresh_token VARCHAR(255) NOT NULL PRIMARY KEY,
 tm_user VARCHAR(255) NOT NULL
);
