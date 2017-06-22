-- calculate an average humidity for the given interval
CREATE OR REPLACE FUNCTION fn_calculate_avg_humidity(
    IN in_interval VARCHAR,
    IN in_type VARCHAR
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
<<baseblock>>
BEGIN

--  insert the average
    INSERT INTO hardwares_humidities_avg
    SELECT 
        "humidities_sensors_records"."hardware_id" AS hardware_id,
        AVG( "humidities_sensors_records"."humidity" ) AS avg_humidity,
        AVG( "humidities_sensors_records"."temperature" ) AS avg_temperature,
        in_type AS type,
        NOW() AS created_at
    FROM "humidities_sensors_records"
    WHERE "humidities_sensors_records"."created_at" >= ( NOW() - in_interval )
        AND "humidities_sensors_records"."created_at" <= NOW()
    GROUP BY "humidities_sensors_records"."hardware_id";

END;
$$
