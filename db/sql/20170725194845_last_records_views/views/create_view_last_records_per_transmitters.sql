-- get the last records registered on each available transmitters
CREATE OR REPLACE VIEW last_records_per_transmitters AS
SELECT "transmitters".*,

	CASE 
		WHEN "transmitters"."type" = 'TEMPERATURE' THEN
			( SELECT ROW_TO_JSON( tt ) FROM (
				SELECT "transmitters_temperatures_records".*
				FROM "transmitters_temperatures_records"
				WHERE "transmitters_temperatures_records"."transmitter_id" = "transmitters"."id"
				ORDER BY "transmitters_temperatures_records"."created_at" DESC
				LIMIT 1
			) tt )
		WHEN "transmitters"."type" = 'HUMIDITY' THEN
			( SELECT ROW_TO_JSON( th ) FROM(
                SELECT "transmitters_humidities_records".*
				FROM "transmitters_humidities_records"
				WHERE "transmitters_humidities_records"."transmitter_id" = "transmitters"."id"
				ORDER BY "transmitters_humidities_records"."created_at" DESC
				LIMIT 1
			) th )
		WHEN "transmitters"."type" = 'POWER' THEN
			( SELECT ROW_TO_JSON( tp ) FROM(
                SELECT "transmitters_powers_records".*
				FROM "transmitters_powers_records"
				WHERE "transmitters_powers_records"."transmitter_id" = "transmitters"."id"
				ORDER BY "transmitters_powers_records"."created_at" DESC
				LIMIT 1
			) tp )
		WHEN "transmitters"."type" = 'POWER' THEN
			( SELECT ROW_TO_JSON( tw ) FROM(
                SELECT "transmitters_waters_records".*
				FROM "transmitters_waters_records"
				WHERE "transmitters_waters_records"."transmitter_id" = "transmitters"."id"
				ORDER BY "transmitters_waters_records"."created_at" DESC
				LIMIT 1
			) tw )
		ELSE NULL
	END AS last_record
	
FROM "transmitters"