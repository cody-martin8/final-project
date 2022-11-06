insert into "users" ("patientId", "email", "hashedPassword", "accountType")
values (null, 'demo@example.com', '$argon2id$v=19$m=4096,t=3,p=1$ND2F5+sXNU5BhrZHhAVTtQ$OVCpH+O5nxjRwW3mUVKk+Ve2wl3wx+VqlQpExNPEhtc', 'therapist');

insert into "patients" ("userId", "email", "firstName", "lastName", "injuryAilment", "age", "notes", "isActive")
values (1, 'george@example.com', 'George', 'Smith', 'Patellar Tendonitis', 65, 'Limited flexibility, and pain while weight-bearing.', 'false'),
       (1, 'stacey@example.com', 'Stacey', 'Armstrong', 'Tennis Elbow', 57, 'Pain in wrist and elbow upon rotation.', 'true'),
       (1, 'maria@example.com', 'Maria', 'Acosta', 'Lower Back Soreness', 46, 'Limited flexibility at the waist, and pain in lower back during back extension.', 'true'),
       (1, 'veronica@example.com', 'Veronica', 'Nguyen', 'Carpal Tunnel Syndrome', 24, 'Infrequent pain and numbness in thumb and index finger. Difficulty holding weight in hand for long durations.', 'false'),
       (1, 'david@example.com', 'David', 'Martel', 'Neck Stiffness', 61, 'Limited extension and little to no flexion of the neck. Back of neck tender under pressure.', 'true');

insert into "exercises" ("userId", "name", "targetArea", "description")
values (1, 'Ankle Pumps', 'Ankle and Foot', 'Bend your foot up and down at your ankle joint.'),
       (1, 'Heel Raise', 'Ankle and Foot', 'While seated in a chair, place your feet on the floor. Next, press down with your forefoot and toes to raise your heels up off the floor. Lower your heels back down and repeat. Keep your toes on the ground the entire time.'),
       (1, 'Cervical Spine Flexion', 'Cervical', 'Tilt your head downwards, then return back to looking straight ahead.'),
       (1, 'Cervical Spine Extension', 'Cervical', 'Tilt your head upwards, then return back to looking straight ahead.'),
       (1, 'Towel Grip', 'Elbow and Hand', 'Place a rolled up towel in your hand and squeeze.'),
       (1, 'Bicep Curls', 'Elbow and Hand', 'With your arm at your side, bend at your elbow to raise up the free weight / dumbbell. Lower back down and repeat. Keep your palm face up the entire time.'),
       (1, 'Straight Leg Raise', 'Hip and Knee', 'While lying on your back, raise up your leg with a straight knee. Keep the opposite knee bent with the foot planted on the ground.'),
       (1, 'Clam Shells', 'Hip and Knee', 'While lying on your side with your knees bent and an elastic band wrapped around your knees, draw up the top knee while keeping contact of your feet together. Do not let your pelvis roll back during the lifting movement.'),
       (1, 'Bridging', 'Lumbar Thoracic', 'While lying on your back with knees bent, tighten your lower abdominal muscles, squeeze your buttocks and then raise your buttocks off the floor/bed as creating a "Bridge" with your body. Hold and then lower yourself and repeat.'),
       (1, 'Pelvic Tilt - Supine', 'Lumbar Thoracic', 'Lie on your back with your knees bent. Next, arch your low back and then flatten it repeatedly. Your pelvis should tilt forward and back during the movement. Move through a comfortable range of motion.'),
       (1, 'IR Sleeper Stretch', 'Shoulder', 'Start by lying on your side with the affected arm on the bottom. Your affected arm should be bent at the elbow and forearm pointed upwards towards the ceiling as shown. Next, use your unaffected arm to gently draw your affected forearm towards the table or bed for an inward stretch. Hold, relax and repeat.'),
       (1, 'Pendulum Circles', 'Shoulder', 'Shift your body weight in circles to allow your injured arm to swing in circles freely. Your injured arm should be fully relaxed.');

insert into "patientExercises" ("userId", "patientId", "exerciseId", "repetitions", "sets", "hold", "feedback")
values (1, 1, 7, 15, 3, 0, null),
       (1, 1, 8, 10, 3, 3, 'I have some pain in my right hip when trying to perform this exercise. I was not able to complete all the sets.'),
       (1, 2, 5, 10, 3, 5, 'Some pain in my wrist during this one.'),
       (1, 2, 6, 15, 3, 0, null),
       (1, 2, 11, 0, 10, 15, null),
       (1, 3, 9, 10, 3, 5, 'I have some tightness on the front of my hip on the right side when at the top of this exercise.'),
       (1, 3, 10, 0, 10, 10, null),
       (1, 3, 8, 15, 3, 0, 'This one was difficult for me to do. Had a lot of trouble lifting my right leg.'),
       (1, 4, 5, 10, 3, 5, null),
       (1, 4, 6, 15, 3, 0, null),
       (1, 4, 12, 15, 3, 0, null),
       (1, 5, 3, 0, 10, 10, 'This stretch helped with my flexibility, but there was this pinching pain in my upper back.'),
       (1, 5, 4, 0, 10, 10, 'The pinching pain didn''t happen during this exercise. I did have some discomfort at the base of my neck though.');
