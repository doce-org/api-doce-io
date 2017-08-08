-- create an average values of temperatures records accross all requested transmitters
-- ( all by default ) by 30 minutes timespan going back 24 hours
CREATE OR REPLACE VIEW records_temperatures_avg_last_24_hours AS
SELECT 
    current_interval_time, 
    AVG( "transmitters_temperatures_avg"."avg_temperature" ) AS avg_temperature

FROM generate_series( CURRENT_TIMESTAMP - INTERVAL '24 hour', CURRENT_TIMESTAMP, INTERVAL '30 minutes' ) AS current_interval_time

LEFT JOIN "transmitters_temperatures_avg" 
	ON "transmitters_temperatures_avg"."created_at" <= current_interval_time 
	AND "transmitters_temperatures_avg"."created_at" >= ( current_interval_time - INTERVAL '30 minutes' )
    
WHERE "transmitters_temperatures_avg"."avg_temperature" != 'NaN'
	AND "transmitters_temperatures_avg"."type" = 'week'

GROUP BY current_interval_time

ORDER BY current_interval_time;