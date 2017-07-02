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
    INSERT INTO transmitters_humidities_avg
    SELECT 
        "transmitters_humiditires_records"."transmitter_id" AS transmitter_id,
        AVG( "transmitters_humiditires_records"."humidity" ) AS avg_humidity,
        AVG( "transmitters_humiditires_records"."temperature" ) AS avg_temperature,
        in_type AS type,
        NOW() AS created_at
    FROM "transmitters_humiditires_records"
    WHERE "transmitters_humiditires_records"."created_at" >= ( NOW() - in_interval )
        AND "transmitters_humiditires_records"."created_at" <= NOW()
    GROUP BY "transmitters_humiditires_records"."transmitter_id";

END;
$$
