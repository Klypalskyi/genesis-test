CREATE TABLE Orders (
  Id           serial,
  ClientId     integer NOT NULL,
  ScoutId      integer NOT NULL,
  RestId       integer NOT NULL,
  Amount       float,
  startDate    timestamptz DEFAULT CURRENT_TIMESTAMP,
  endDate      timestamptz,
  duration     integer,
  estimate     integer,
  rate         varchar(30)
);

ALTER TABLE Orders ADD CONSTRAINT pkOrders PRIMARY KEY (id);
ALTER TABLE Orders ADD CONSTRAINT fkOrdersClientId FOREIGN KEY (ClientId) REFERENCES Clients (Id);
ALTER TABLE Orders ADD CONSTRAINT fkOrdersScoutId FOREIGN KEY (ScoutId) REFERENCES Scouts (Id);
ALTER TABLE Orders ADD CONSTRAINT fkOrdersRestId FOREIGN KEY (RestId) REFERENCES Restaurants (Id);