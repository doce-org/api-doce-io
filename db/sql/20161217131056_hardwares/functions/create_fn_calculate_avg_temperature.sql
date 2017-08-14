-- calculate an average temperature for the given interval
CREATE OR REPLACE FUNCTION fn_calculate_temperature(
    IN in_interval VARCHAR,
    IN in_type VARCHAR
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
<<baseblock>>
BEGIN

--  insert the average from the temperatures records
    INSERT INTO temperatures_averages( "hardware_id", "temperature", "type", "created_at" )
    SELECT
        "temperatures_records"."hardware_id" AS hardware_id,
        AVG( "temperatures_records"."temperature" ) AS temperature,
        in_type AS type,
        NOW() AS created_at
    FROM "temperatures_records"
    WHERE "temperatures_records"."created_at" >= ( NOW() - in_interval::INTERVAL )
        AND "temperatures_records"."created_at" <= NOW()
    GROUP BY "temperatures_records"."hardware_id";

--  insert the average from the humidities records who also contains temperatures
    INSERT INTO temperatures_averages( "hardware_id", "temperature", "type", "created_at" )
    SELECT
        "humidities_records"."hardware_id" AS hardware_id,
        AVG( "humidities_records"."temperature" ) AS temperature,
        in_type AS type,
        NOW() AS created_at
    FROM "humidities_records"
    WHERE "humidities_records"."created_at" >= ( NOW() - in_interval::INTERVAL )
        AND "humidities_records"."created_at" <= NOW()
    GROUP BY "humidities_records"."hardware_id";

END;
$$
