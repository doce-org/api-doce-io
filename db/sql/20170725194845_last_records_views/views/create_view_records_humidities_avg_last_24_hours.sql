-- create an average values of humidity records accross all requested transmitters
-- ( all by default ) by 30 minutes timespan going back 24 hours
CREATE OR REPLACE VIEW records_humidities_averages_last_24_hours AS
SELECT
    current_interval_time,
    AVG( "humidities_averages"."humidity" ) AS humidity,
    AVG ( "humidities_averages"."temperature" ) AS temperature

FROM generate_series( CURRENT_TIMESTAMP - INTERVAL '24 hour', CURRENT_TIMESTAMP, INTERVAL '30 minutes' ) AS current_interval_time

LEFT JOIN "humidities_averages"
	ON "humidities_averages"."created_at" <= current_interval_time
	AND "humidities_averages"."created_at" >= ( current_interval_time - INTERVAL '30 minutes' )

WHERE "humidities_averages"."humidity" != 'NaN'
    AND "humidities_averages"."type" = 'week'

GROUP BY current_interval_time

ORDER BY current_interval_time;
