-- create an average values of humidity records accross all requested transmitters
-- ( all by default ) by 30 minutes timespan going back 24 hours
CREATE OR REPLACE VIEW records_humidities_avg_last_24_hours AS
SELECT 
    current_interval_time, 
    AVG( "transmitters_humidities_avg"."avg_humidity" ) AS avg_humidity,
    AVG ( "transmitters_humidities_avg"."avg_temperature" ) AS avg_temperature

FROM generate_series( CURRENT_TIMESTAMP - INTERVAL '24 hour', CURRENT_TIMESTAMP, INTERVAL '30 minutes' ) AS current_interval_time

LEFT JOIN "transmitters_humidities_avg" 
	ON "transmitters_humidities_avg"."created_at" <= current_interval_time 
	AND "transmitters_humidities_avg"."created_at" >= ( current_interval_time - INTERVAL '30 minutes' )
    
WHERE "transmitters_humidities_avg"."avg_humidity" != 'NaN'
    AND "transmitters_humidities_avg"."type" = 'week'

GROUP BY current_interval_time

ORDER BY current_interval_time;