CREATE OR REPLACE VIEW hardwares_humidities_averages_detailed AS
SELECT "humidities_averages".*,
    "hardwares"."name" AS transmitter_name,
    "rooms"."name" AS room_name

FROM "humidities_averages"

INNER JOIN "hardwares" ON "hardwares"."id" = "humidities_averages"."hardware_id"
INNER JOIN "rooms" ON "rooms"."id" = "hardwares"."room_id";
