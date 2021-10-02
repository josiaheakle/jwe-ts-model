CREATE TABLE test (
  number_column INTEGER,
  string_column VARCHAR(20),
  email_column VARCHAR(255),
  unique_column UNIQUE,
  required_column
);
SELECT
  *
fROM
  test;
DROP TABLE test;