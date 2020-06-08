CREATE TABLE Clients (
  Id          serial,
  Name        varchar(255) NOT NULL,
  FamilyName  varchar(255) NOT NULL,
  LocationLat float,
  LocationLng float,
  Address     varchar(255)
);

ALTER TABLE Clients ADD CONSTRAINT pkClients PRIMARY KEY (Id);

CREATE UNIQUE INDEX akClientsName ON Clients (Name, FamilyName);