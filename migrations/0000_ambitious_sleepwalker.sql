CREATE TYPE "public"."activity_type" AS ENUM('idle', 'questing', 'dungeon', 'raid');--> statement-breakpoint
CREATE TYPE "public"."character_class" AS ENUM('warrior', 'paladin', 'hunter', 'rogue', 'priest', 'mage', 'druid');--> statement-breakpoint
CREATE TYPE "public"."difficulty" AS ENUM('safe', 'normal', 'challenging', 'heroic');--> statement-breakpoint
CREATE TYPE "public"."item_rarity" AS ENUM('common', 'uncommon', 'rare', 'epic', 'legendary');--> statement-breakpoint
CREATE TYPE "public"."item_slot" AS ENUM('head', 'neck', 'shoulders', 'back', 'chest', 'wrist', 'hands', 'waist', 'legs', 'feet', 'ring1', 'ring2', 'trinket1', 'trinket2', 'mainHand', 'offHand', 'ranged');--> statement-breakpoint
CREATE TYPE "public"."quest_type" AS ENUM('kill', 'collection', 'delivery', 'boss');--> statement-breakpoint
CREATE TABLE "achievements" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text NOT NULL,
	"category" varchar(50) NOT NULL,
	"points" integer DEFAULT 10,
	"icon_name" varchar(50),
	"reward_title" varchar(50),
	"reward_stat_bonus" json,
	"requirements" json NOT NULL,
	"is_hidden" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "character_achievements" (
	"id" serial PRIMARY KEY NOT NULL,
	"character_id" integer NOT NULL,
	"achievement_id" integer NOT NULL,
	"progress" integer DEFAULT 0,
	"is_completed" boolean DEFAULT false,
	"completed_at" timestamp,
	CONSTRAINT "unique_char_achievement" UNIQUE("character_id","achievement_id")
);
--> statement-breakpoint
CREATE TABLE "character_consumables" (
	"id" serial PRIMARY KEY NOT NULL,
	"character_id" integer NOT NULL,
	"template_id" integer NOT NULL,
	"quantity" integer DEFAULT 1,
	CONSTRAINT "unique_char_consumable" UNIQUE("character_id","template_id")
);
--> statement-breakpoint
CREATE TABLE "character_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"character_id" integer NOT NULL,
	"template_id" integer NOT NULL,
	"is_equipped" boolean DEFAULT false,
	"equipped_slot" "item_slot",
	"inventory_slot" integer,
	"enchant_id" integer,
	"quantity" integer DEFAULT 1,
	"acquired_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "character_lockouts" (
	"id" serial PRIMARY KEY NOT NULL,
	"character_id" integer NOT NULL,
	"content_type" varchar(20) NOT NULL,
	"content_id" integer NOT NULL,
	"bosses_killed" json DEFAULT '[]'::json,
	"created_at" timestamp DEFAULT now(),
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "character_quest_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"character_id" integer NOT NULL,
	"quest_id" integer NOT NULL,
	"progress" json DEFAULT '[]'::json,
	"completion_count" integer DEFAULT 0,
	"is_active" boolean DEFAULT false,
	"started_at" timestamp,
	"last_completed_at" timestamp,
	CONSTRAINT "unique_char_quest" UNIQUE("character_id","quest_id")
);
--> statement-breakpoint
CREATE TABLE "character_reputations" (
	"id" serial PRIMARY KEY NOT NULL,
	"character_id" integer NOT NULL,
	"faction_id" integer NOT NULL,
	"reputation" integer DEFAULT 0,
	CONSTRAINT "unique_char_faction" UNIQUE("character_id","faction_id")
);
--> statement-breakpoint
CREATE TABLE "character_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"character_id" integer NOT NULL,
	"combat_mode" varchar(20) DEFAULT 'summary',
	"auto_loot" boolean DEFAULT true,
	"auto_sell_common" boolean DEFAULT true,
	"auto_repair" boolean DEFAULT true,
	"auto_accept_quests" boolean DEFAULT true,
	"auto_turn_in_quests" boolean DEFAULT true,
	"auto_equip_upgrades" boolean DEFAULT false,
	"health_potion_threshold" integer DEFAULT 40,
	"mana_potion_threshold" integer DEFAULT 30,
	"use_cooldowns_on_bosses" boolean DEFAULT true,
	"use_cooldowns_on_trash" boolean DEFAULT false,
	"flee_on_low_health" boolean DEFAULT true,
	"flee_health_threshold" integer DEFAULT 15,
	"notify_level_up" boolean DEFAULT true,
	"notify_rare_loot" boolean DEFAULT true,
	"notify_death" boolean DEFAULT true,
	"notify_achievements" boolean DEFAULT true,
	"notify_activity_complete" boolean DEFAULT true,
	CONSTRAINT "character_settings_character_id_unique" UNIQUE("character_id")
);
--> statement-breakpoint
CREATE TABLE "characters" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"name" varchar(24) NOT NULL,
	"character_class" character_class NOT NULL,
	"level" integer DEFAULT 1 NOT NULL,
	"experience" integer DEFAULT 0 NOT NULL,
	"gold" integer DEFAULT 0 NOT NULL,
	"base_strength" integer NOT NULL,
	"base_agility" integer NOT NULL,
	"base_intellect" integer NOT NULL,
	"base_stamina" integer NOT NULL,
	"base_spirit" integer DEFAULT 10 NOT NULL,
	"current_health" integer NOT NULL,
	"max_health" integer NOT NULL,
	"current_resource" integer DEFAULT 0 NOT NULL,
	"max_resource" integer DEFAULT 100 NOT NULL,
	"talent_points_available" integer DEFAULT 0,
	"talent_tree1_points" json DEFAULT '[]'::json,
	"talent_tree2_points" json DEFAULT '[]'::json,
	"talent_tree3_points" json DEFAULT '[]'::json,
	"respec_count" integer DEFAULT 0,
	"current_activity" "activity_type" DEFAULT 'idle',
	"current_activity_id" integer,
	"current_difficulty" "difficulty" DEFAULT 'normal',
	"activity_started_at" timestamp,
	"activity_progress" real DEFAULT 0,
	"rested_xp" integer DEFAULT 0,
	"max_rested_xp" integer DEFAULT 0,
	"total_playtime" integer DEFAULT 0,
	"total_kills" integer DEFAULT 0,
	"total_deaths" integer DEFAULT 0,
	"total_damage_dealt" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"last_played_at" timestamp DEFAULT now(),
	"is_deleted" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "combat_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"character_id" integer NOT NULL,
	"activity_type" "activity_type" NOT NULL,
	"activity_id" integer,
	"activity_name" varchar(100),
	"difficulty" "difficulty" DEFAULT 'normal',
	"started_at" timestamp NOT NULL,
	"ended_at" timestamp,
	"duration_seconds" integer,
	"was_victory" boolean,
	"total_damage_dealt" integer DEFAULT 0,
	"total_damage_taken" integer DEFAULT 0,
	"total_healing" integer DEFAULT 0,
	"dps" real,
	"xp_earned" integer DEFAULT 0,
	"gold_earned" integer DEFAULT 0,
	"items_acquired" json,
	"log_summary" json
);
--> statement-breakpoint
CREATE TABLE "consumable_templates" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"type" varchar(50) NOT NULL,
	"effect" json NOT NULL,
	"cooldown_seconds" integer DEFAULT 0,
	"required_level" integer DEFAULT 1,
	"vendor_price" integer,
	"max_stack" integer DEFAULT 20
);
--> statement-breakpoint
CREATE TABLE "dungeon_bosses" (
	"id" serial PRIMARY KEY NOT NULL,
	"dungeon_id" integer NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"order_index" integer NOT NULL,
	"is_final_boss" boolean DEFAULT false,
	"health" integer NOT NULL,
	"damage" integer NOT NULL,
	"armor" integer DEFAULT 0,
	"mechanics" json,
	"enrage_timer_seconds" integer,
	"loot_table" json
);
--> statement-breakpoint
CREATE TABLE "dungeons" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"tier" integer NOT NULL,
	"level_min" integer NOT NULL,
	"level_max" integer NOT NULL,
	"base_duration_seconds" integer NOT NULL,
	"required_item_level" integer,
	"trash_pack_count" integer DEFAULT 5,
	"has_heroic_mode" boolean DEFAULT false,
	"heroic_lockout_hours" integer DEFAULT 24
);
--> statement-breakpoint
CREATE TABLE "factions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"rewards" json
);
--> statement-breakpoint
CREATE TABLE "item_sets" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"class_restriction" character_class,
	"bonuses" json NOT NULL
);
--> statement-breakpoint
CREATE TABLE "item_templates" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"slot" "item_slot" NOT NULL,
	"rarity" "item_rarity" NOT NULL,
	"item_level" integer NOT NULL,
	"required_level" integer DEFAULT 1,
	"class_restriction" character_class,
	"is_weapon" boolean DEFAULT false,
	"weapon_type" varchar(50),
	"min_damage" integer,
	"max_damage" integer,
	"weapon_speed" real,
	"strength" integer DEFAULT 0,
	"agility" integer DEFAULT 0,
	"intellect" integer DEFAULT 0,
	"stamina" integer DEFAULT 0,
	"spirit" integer DEFAULT 0,
	"crit_rating" integer DEFAULT 0,
	"hit_rating" integer DEFAULT 0,
	"haste_rating" integer DEFAULT 0,
	"attack_power" integer DEFAULT 0,
	"spell_power" integer DEFAULT 0,
	"armor" integer DEFAULT 0,
	"special_effects" json,
	"set_id" integer,
	"drop_source" varchar(100),
	"vendor_price" integer,
	"sell_price" integer,
	"is_template" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "journey_entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"character_id" integer NOT NULL,
	"entry_type" varchar(50) NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text,
	"related_level" integer,
	"related_zone" varchar(100),
	"related_item" varchar(100),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "offline_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"character_id" integer NOT NULL,
	"last_online_at" timestamp NOT NULL,
	"returned_at" timestamp NOT NULL,
	"offline_duration_seconds" integer NOT NULL,
	"effective_duration_seconds" integer NOT NULL,
	"activity_type" "activity_type" NOT NULL,
	"activity_id" integer,
	"activity_name" varchar(100),
	"difficulty" "difficulty",
	"cycles_completed" integer DEFAULT 0,
	"xp_earned" integer DEFAULT 0,
	"gold_earned" integer DEFAULT 0,
	"items_found" integer DEFAULT 0,
	"died" boolean DEFAULT false,
	"death_reason" varchar(200),
	"levels_before" integer,
	"levels_after" integer
);
--> statement-breakpoint
CREATE TABLE "quests" (
	"id" serial PRIMARY KEY NOT NULL,
	"zone_id" integer NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"type" "quest_type" NOT NULL,
	"level" integer NOT NULL,
	"objectives" json NOT NULL,
	"base_duration_seconds" integer NOT NULL,
	"difficulty_rating" integer DEFAULT 1,
	"xp_reward" integer NOT NULL,
	"gold_reward" integer DEFAULT 0,
	"item_rewards" json,
	"prerequisite_quest_id" integer,
	"chain_order" integer DEFAULT 0,
	"is_repeatable" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "raid_bosses" (
	"id" serial PRIMARY KEY NOT NULL,
	"raid_id" integer NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"order_index" integer NOT NULL,
	"health" integer NOT NULL,
	"damage" integer NOT NULL,
	"armor" integer DEFAULT 0,
	"phases" json,
	"enrage_timer_seconds" integer,
	"loot_table" json
);
--> statement-breakpoint
CREATE TABLE "raids" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"tier" integer NOT NULL,
	"required_level" integer DEFAULT 60,
	"required_item_level" integer,
	"base_duration_seconds" integer NOT NULL,
	"lockout_days" integer DEFAULT 7,
	"attunement_quest_id" integer
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(50) NOT NULL,
	"password_hash" text NOT NULL,
	"is_premium" boolean DEFAULT false,
	"max_character_slots" integer DEFAULT 4,
	"created_at" timestamp DEFAULT now(),
	"last_login_at" timestamp,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "zones" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"level_min" integer NOT NULL,
	"level_max" integer NOT NULL,
	"theme" varchar(50),
	"unlock_requirement" integer,
	"is_discovered" boolean DEFAULT false
);
--> statement-breakpoint
ALTER TABLE "character_achievements" ADD CONSTRAINT "character_achievements_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_achievements" ADD CONSTRAINT "character_achievements_achievement_id_achievements_id_fk" FOREIGN KEY ("achievement_id") REFERENCES "public"."achievements"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_consumables" ADD CONSTRAINT "character_consumables_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_consumables" ADD CONSTRAINT "character_consumables_template_id_consumable_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."consumable_templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_items" ADD CONSTRAINT "character_items_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_items" ADD CONSTRAINT "character_items_template_id_item_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."item_templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_lockouts" ADD CONSTRAINT "character_lockouts_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_quest_progress" ADD CONSTRAINT "character_quest_progress_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_quest_progress" ADD CONSTRAINT "character_quest_progress_quest_id_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_reputations" ADD CONSTRAINT "character_reputations_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_reputations" ADD CONSTRAINT "character_reputations_faction_id_factions_id_fk" FOREIGN KEY ("faction_id") REFERENCES "public"."factions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_settings" ADD CONSTRAINT "character_settings_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "characters" ADD CONSTRAINT "characters_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "combat_logs" ADD CONSTRAINT "combat_logs_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dungeon_bosses" ADD CONSTRAINT "dungeon_bosses_dungeon_id_dungeons_id_fk" FOREIGN KEY ("dungeon_id") REFERENCES "public"."dungeons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "journey_entries" ADD CONSTRAINT "journey_entries_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offline_sessions" ADD CONSTRAINT "offline_sessions_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quests" ADD CONSTRAINT "quests_zone_id_zones_id_fk" FOREIGN KEY ("zone_id") REFERENCES "public"."zones"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "raid_bosses" ADD CONSTRAINT "raid_bosses_raid_id_raids_id_fk" FOREIGN KEY ("raid_id") REFERENCES "public"."raids"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "achievements_char_idx" ON "character_achievements" USING btree ("character_id");--> statement-breakpoint
CREATE INDEX "character_consumables_char_idx" ON "character_consumables" USING btree ("character_id");--> statement-breakpoint
CREATE INDEX "character_items_char_idx" ON "character_items" USING btree ("character_id");--> statement-breakpoint
CREATE INDEX "lockouts_char_idx" ON "character_lockouts" USING btree ("character_id");--> statement-breakpoint
CREATE INDEX "quest_progress_char_idx" ON "character_quest_progress" USING btree ("character_id");--> statement-breakpoint
CREATE INDEX "reputations_char_idx" ON "character_reputations" USING btree ("character_id");--> statement-breakpoint
CREATE INDEX "characters_user_idx" ON "characters" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "combat_logs_char_idx" ON "combat_logs" USING btree ("character_id");--> statement-breakpoint
CREATE INDEX "journey_char_idx" ON "journey_entries" USING btree ("character_id");