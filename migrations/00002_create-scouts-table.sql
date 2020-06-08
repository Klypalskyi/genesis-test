CREATE TABLE Scouts (
  Id          serial,
  Name        varchar(255) NOT NULL,
  TotalCount  float DEFAULT 0,
  TotalAmount float DEFAULT 0,
  AVGTime     integer DEFAULT 0,
  FavLocation varchar(255)
);

ALTER TABLE Scouts ADD CONSTRAINT pkScouts PRIMARY KEY (Id);

CREATE UNIQUE INDEX akScoutsId ON Scouts (Id);