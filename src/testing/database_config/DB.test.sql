DROP TABLE test;
CREATE TABLE test (
  id INTEGER PRIMARY KEY,
  number_column INTEGER,
  string_column VARCHAR(255),
  email_column VARCHAR(255),
  unique_column VARCHAR(255) UNIQUE,
  required_column
);
INSERT INTO
  test (
    number_column,
    string_column,
    email_column,
    unique_column,
    required_column
  )
VALUES
  (1, 'string', 'email', 'value', 'value');
SELECT
  *
FROM
  test;
SELECT
  number_column
FROM
  test
WHERE
  id = 0;