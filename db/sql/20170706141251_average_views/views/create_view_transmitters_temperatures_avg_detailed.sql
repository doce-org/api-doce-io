CREATE OR REPLACE VIEW temperatures_averages_detailed AS
SELECT "temperatures_averages".*,
    "hardwares"."name" AS transmitter_name,
    "rooms"."name" AS room_name

FROM "temperatures_averages"

INNER JOIN "hardwares" ON "hardwares"."id" = "temperatures_averages"."hardware_id"
INNER JOIN "rooms" ON "rooms"."id" = "hardwares"."room_id";
