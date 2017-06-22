-- calculate an average temperature for the given interval
CREATE OR REPLACE FUNCTION fn_calculate_avg_temperature(
    IN in_interval VARCHAR,
    IN in_type VARCHAR
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
<<baseblock>>
BEGIN

--  insert the average
    INSERT INTO hardwares_temperatures_avg
    SELECT 
        "temperatures_sensors_records"."hardware_id" AS hardware_id,
        AVG( "temperatures_sensors_records"."temperature" ) AS avg_temperature,
        in_type AS type,
        NOW() AS created_at
    FROM "temperatures_sensors_records"
    WHERE "temperatures_sensors_records"."created_at" >= ( NOW() - in_interval )
        AND "temperatures_sensors_records"."created_at" <= NOW()
    GROUP BY "temperatures_sensors_records"."hardware_id";

END;
$$
