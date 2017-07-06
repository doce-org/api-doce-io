CREATE OR REPLACE VIEW transmitters_temperatures_avg_detailed AS
SELECT "transmitters_temperatures_avg".*,
    "transmitters"."name" AS transmitter_name,
    "rooms"."name" AS room_name

FROM "transmitters_temperatures_avg"

INNER JOIN "transmitters" ON "transmitters"."id" = "transmitters_temperatures_avg"."transmitter_id"
INNER JOIN "rooms" ON "rooms"."id" = "transmitters"."room_id";