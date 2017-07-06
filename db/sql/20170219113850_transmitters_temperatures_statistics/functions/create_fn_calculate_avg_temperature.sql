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
    INSERT INTO transmitters_temperatures_avg( "transmitter_id", "avg_temperature", "type", "created_at" )
    SELECT 
        "transmitters_temperatures_records"."transmitter_id" AS transmitter_id,
        AVG( "transmitters_temperatures_records"."temperature" ) AS avg_temperature,
        in_type AS type,
        NOW() AS created_at
    FROM "transmitters_temperatures_records"
    WHERE "transmitters_temperatures_records"."created_at" >= ( NOW() - in_interval::INTERVAL )
        AND "transmitters_temperatures_records"."created_at" <= NOW()
    GROUP BY "transmitters_temperatures_records"."transmitter_id";

END;
$$
