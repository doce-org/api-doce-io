-- get the last records registered on each available hardwares
CREATE OR REPLACE VIEW last_records_per_hardwares AS
SELECT "hardwares".*,

	CASE
		WHEN "hardwares"."type" = 'T' THEN
			( SELECT ROW_TO_JSON( tt ) FROM (
				SELECT "temperatures_records".*
				FROM "temperatures_records"
				WHERE "temperatures_records"."hardware_id" = "hardwares"."id"
				ORDER BY "temperatures_records"."created_at" DESC
				LIMIT 1
			) tt )
		WHEN "hardwares"."type" = 'TH' THEN
			( SELECT ROW_TO_JSON( th ) FROM(
                SELECT "humidities_records".*
				FROM "humidities_records"
				WHERE "humidities_records"."hardware_id" = "hardwares"."id"
				ORDER BY "humidities_records"."created_at" DESC
				LIMIT 1
			) th )
		WHEN "hardwares"."type" = 'P' THEN
			( SELECT ROW_TO_JSON( tp ) FROM(
                SELECT "powers_records".*
				FROM "powers_records"
				WHERE "powers_records"."hardware_id" = "hardwares"."id"
				ORDER BY "powers_records"."created_at" DESC
				LIMIT 1
			) tp )
		WHEN "hardwares"."type" = 'W' THEN
			( SELECT ROW_TO_JSON( tw ) FROM(
                SELECT "waters_records".*
				FROM "waters_records"
				WHERE "waters_records"."hardware_id" = "hardwares"."id"
				ORDER BY "waters_records"."created_at" DESC
				LIMIT 1
			) tw )
		ELSE NULL
	END AS last_record

FROM "hardwares"
