CREATE TABLE Restaurants (
  Id          serial,
  Name        varchar(255) NOT NULL,
  LocationLat float,
  LocationLng float,
  Address     varchar(255)
);

ALTER TABLE Restaurants ADD CONSTRAINT pkRestaurant PRIMARY KEY (Id);

CREATE UNIQUE INDEX akRestaurantsName ON Restaurants (LocationLat, LocationLng);