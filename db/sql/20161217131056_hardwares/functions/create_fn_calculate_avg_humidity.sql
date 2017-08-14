-- calculate an average humidity for the given interval
CREATE OR REPLACE FUNCTION fn_calculate_humidity(
    IN in_interval VARCHAR,
    IN in_type VARCHAR
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
<<baseblock>>
BEGIN

--  insert the average
    INSERT INTO humidities_avg( "hardware_id", "humidity", "temperature", "type", "created_at" )
    SELECT
        "humidities_records"."hardware_id" AS hardware_id,
        AVG( "humidities_records"."humidity" ) AS humidity,
        AVG( "humidities_records"."temperature" ) AS temperature,
        in_type AS type,
        NOW() AS created_at
    FROM "humidities_records"
    WHERE "humidities_records"."created_at" >= ( NOW() - in_interval::INTERVAL )
        AND "humidities_records"."created_at" <= NOW()
    GROUP BY "humidities_records"."hardware_id";

END;
$$
