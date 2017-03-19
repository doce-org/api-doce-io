-- create a view to return an hardware listing with the listing of linked temperatures and also the room name
CREATE VIEW hardwares_temperatures AS
SELECT "hardwares".*,
	"rooms"."name" AS "room_name",
	"temperatures_sensors_records"."created_at" AS "sensor_created_at",
	"temperatures_sensors_records"."temperature" AS "sensor_temperature"
FROM "hardwares"

-- join rooms
JOIN "rooms" ON "rooms"."id" = "hardwares"."room_id"

-- join temperatures records
JOIN "temperatures_sensors_records" ON "temperatures_sensors_records"."hardware_id" = "hardwares"."id"
