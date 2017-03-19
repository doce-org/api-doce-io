-- create a view to return an hardware listing with the listing of linked humidity and also the room name
CREATE VIEW hardwares_humidities AS
SELECT "hardwares".*,
	"rooms"."name" AS "room_name",
	"humidities_sensors_records"."created_at" AS "sensor_created_at",
	"humidities_sensors_records"."temperature" AS "sensor_temperature",
	"humidities_sensors_records"."humidity" AS "sensor_humidity"
FROM "hardwares"

-- join rooms
JOIN "rooms" ON "rooms"."id" = "hardwares"."room_id"

-- join humidities records
JOIN "humidities_sensors_records" ON "humidities_sensors_records"."hardware_id" = "hardwares"."id"
