-- create an average values of temperatures records accross all requested transmitters
-- ( all by default ) by 30 minutes timespan going back 24 hours
CREATE OR REPLACE VIEW records_temperatures_averages_last_24_hours AS
SELECT
    current_interval_time,
    AVG( "temperatures_averages"."temperature" ) AS temperature

FROM generate_series( CURRENT_TIMESTAMP - INTERVAL '24 hour', CURRENT_TIMESTAMP, INTERVAL '30 minutes' ) AS current_interval_time

LEFT JOIN "temperatures_averages"
	ON "temperatures_averages"."created_at" <= current_interval_time
	AND "temperatures_averages"."created_at" >= ( current_interval_time - INTERVAL '30 minutes' )

WHERE "temperatures_averages"."temperature" != 'NaN'
	AND "temperatures_averages"."type" = 'week'

GROUP BY current_interval_time

ORDER BY current_interval_time;
