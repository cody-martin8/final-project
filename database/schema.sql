set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

create table "public"."users" (
	"userId"         serial      not null,
	"patientId"      integer     default null,
	"email"          text        not null unique,
	"hashedPassword" text        not null,
	"accountType"    text        not null,
	"createdAt"      timestamptz not null default now(),
	constraint "users_pk" primary key ("userId")
) with (
  OIDS=FALSE
);



create table "public"."patients" (
	"patientId"     serial      not null,
	"userId"        integer     not null,
	"email"         text        not null,
	"firstName"     text        not null,
	"lastName"      text        not null,
	"injuryAilment" text        not null,
	"age"           integer     not null,
	"notes"         text        not null,
	"isActive"      text        not null,
	"createdAt"     timestamptz not null default now(),
	constraint "patients_pk" primary key ("patientId")
) with (
  OIDS=FALSE
);



create table "public"."exercises" (
	"exerciseId"  serial      not null,
	"userId"      integer     not null,
	"name"        text        not null,
	"targetArea"  text        not null,
	"description" text        not null,
	"createdAt"   timestamptz not null default now(),
	constraint "exercises_pk" primary key ("exerciseId")
) with (
  OIDS=FALSE
);



create table "public"."patientExercises" (
	"patientExerciseId" serial      not null,
	"userId"            integer     not null,
	"patientId"         integer     not null,
	"exerciseId"        integer     not null,
	"repetitions"       integer     not null,
	"sets"              integer     not null,
  "hold"              integer     not null,
	"feedback"          text        default null,
	"assigned"          timestamptz not null default now(),
	constraint "patientExercises_pk" primary key ("patientExerciseId")
) with (
  OIDS=FALSE
);



alter table "users" ADD CONSTRAINT "users_fk0" FOREIGN KEY ("patientId") REFERENCES "patients"("patientId");



alter table "patientExercises" ADD CONSTRAINT "patientExercises_fk0" FOREIGN KEY ("patientId") REFERENCES "patients"("patientId");
alter table "patientExercises" ADD CONSTRAINT "patientExercises_fk1" FOREIGN KEY ("exerciseId") REFERENCES "exercises"("exerciseId");
