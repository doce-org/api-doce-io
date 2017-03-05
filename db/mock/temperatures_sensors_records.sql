INSERT INTO temperatures_sensors_records (
   hardware_id, temperature, created_at
)
SELECT
   1,
   trunc( random() * ( 25 - 20 ) + 20 ),
   CURRENT_DATE + interval '10 minutes' * i
FROM generate_series( 1, 5700 ) s( i )
