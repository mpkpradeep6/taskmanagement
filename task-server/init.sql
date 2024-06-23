CREATE TABLE IF NOT EXISTS task_table (
 tm_title VARCHAR(255) NOT NULL,
 tm_description  VARCHAR(255),
 tm_status VARCHAR(50) NOT NULL,
 tm_task_id SERIAL PRIMARY KEY
);