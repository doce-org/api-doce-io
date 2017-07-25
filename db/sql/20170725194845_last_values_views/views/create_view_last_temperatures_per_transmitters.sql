-- get the last temperature registered for each transmitters
-- of type 'TEMPERATURE' or 'HUMIDITY'
CREATE OR REPLACE VIEW last_temperatures_per_transmitters
SELECT "transmitters"."id",

	CASE 
		WHEN "transmitters"."type" = 'TEMPERATURE' THEN
			(
				SELECT "temperature"
				FROM "transmitters_temperatures_records"
				WHERE "transmitters_temperatures_records"."transmitter_id" = "transmitters"."id"
				ORDER BY "transmitters_temperatures_records"."created_at" DESC
				LIMIT 1
			)
		WHEN "transmitters"."type" = 'HUMIDITY' THEN
			(
                SELECT "temperature"
				FROM "transmitters_humidities_records"
				WHERE "transmitters_humidities_records"."transmitter_id" = "transmitters"."id"
				ORDER BY "transmitters_humidities_records"."created_at" DESC
				LIMIT 1
			)
		ELSE NULL
	END AS temperature,
	
	CASE 
		WHEN "transmitters"."type" = 'TEMPERATURE' THEN
			(
				SELECT "created_at"
				FROM "transmitters_temperatures_records"
				WHERE "transmitters_temperatures_records"."transmitter_id" = "transmitters"."id"
				ORDER BY "transmitters_temperatures_records"."created_at" DESC
				LIMIT 1
			)
		WHEN "transmitters"."type" = 'HUMIDITY' THEN
			(
                SELECT "created_at"
				FROM "transmitters_humidities_records"
				WHERE "transmitters_humidities_records"."transmitter_id" = "transmitters"."id"
				ORDER BY "transmitters_humidities_records"."created_at" DESC
				LIMIT 1
			)
		ELSE NULL
	END AS created_at
	
FROM "transmitters"
WHERE "transmitters"."type" IN ( 'TEMPERATURE', 'HUMIDITY' )