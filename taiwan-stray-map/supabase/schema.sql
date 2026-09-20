-- 全台浪浪救援地圖 — Supabase schema
--
-- Phase 1 的種子資料目前以 TypeScript 常數存放於 src/data/facilities/*
-- （見 README「資料架構」段落）。這份 schema 與那份 TypeScript 型別
-- （src/types/facility.ts）一一對應，未來要換成 Supabase 儲存時，
-- 只需把 src/lib/facilities.ts 的資料存取函式改成呼叫 Supabase client，
-- 其餘元件與頁面不需大幅更動。

create extension if not exists "uuid-ossp";

create table counties (
  slug text primary key,
  name text not null unique,
  region text not null check (region in ('north','central','south','east','islands'))
);

create table districts (
  id uuid primary key default uuid_generate_v4(),
  county_slug text not null references counties(slug) on delete cascade,
  name text not null,
  unique (county_slug, name)
);

create table facilities (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  name text not null,
  alias text[] default '{}',

  county text not null references counties(name),
  district text,
  address text,
  address_public_note text,
  latitude double precision,
  longitude double precision,

  facility_type text not null check (facility_type in (
    'public_shelter','private_rescue','dog_shelter','animal_rescue',
    'animal_protection_association','foster_home','foster_network',
    'dog_cat_rescue','animal_welfare_organization','other'
  )),
  organization_nature text not null default 'unknown' check (organization_nature in ('government','nonprofit','private','unknown')),
  animal_type text not null default 'dog' check (animal_type in ('dog','cat','dog_and_cat','other')),

  dog_count integer,
  cat_count integer,
  total_animal_count integer,
  animal_count_as_of date,

  adoption_available text not null default 'unknown' check (adoption_available in ('yes','conditional','unknown','no')),
  volunteer_available text not null default 'unknown' check (volunteer_available in ('yes','conditional','unknown','no')),
  donation_available text not null default 'unknown' check (donation_available in ('yes','conditional','unknown','no')),
  supplies_available text not null default 'unknown' check (supplies_available in ('yes','conditional','unknown','no')),
  visit_available text not null default 'unknown' check (visit_available in ('yes','conditional','unknown','no')),
  appointment_required text not null default 'unknown' check (appointment_required in ('yes','conditional','unknown','no')),
  foster_help_available text not null default 'unknown' check (foster_help_available in ('yes','conditional','unknown','no')),

  phone text,
  email text,
  website text,
  facebook text,
  instagram text,

  description text,
  features text[] default '{}',
  opening_hours text,

  status text not null default 'unknown' check (status in ('normal','appointment_only','suspended','closed','unknown')),
  verification_status text not null default 'needs_verification' check (verification_status in ('verified','partial_verified','needs_verification','closed','unknown')),
  last_verified_at date,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index facilities_county_idx on facilities (county);
create index facilities_facility_type_idx on facilities (facility_type);
create index facilities_verification_status_idx on facilities (verification_status);
create index facilities_geo_idx on facilities (latitude, longitude);

create table facility_sources (
  id uuid primary key default uuid_generate_v4(),
  facility_id uuid not null references facilities(id) on delete cascade,
  source_name text not null,
  source_url text,
  source_type text not null check (source_type in (
    'government','official_website','official_facebook','official_instagram',
    'google_maps','news','animal_welfare_group','direct_contact','volunteer_provided','other'
  )),
  verified_date date not null,
  verified_by text,
  verification_status text not null check (verification_status in ('verified','partial_verified','needs_verification','closed','unknown')),
  note text
);

create table facility_updates (
  id uuid primary key default uuid_generate_v4(),
  facility_id uuid not null references facilities(id) on delete cascade,
  date date not null,
  category text not null check (category in ('address','status','adoption','volunteer','donation','supplies','general')),
  headline text not null,
  detail text,
  status_color text not null check (status_color in ('green','yellow','orange','red'))
);

create table supply_needs (
  id uuid primary key default uuid_generate_v4(),
  facility_id uuid not null references facilities(id) on delete cascade,
  item text not null,
  updated_at date not null,
  source text
);

-- Phase 6+：逐隻毛孩認養資料（目前尚未有可驗證的第一手資料，留待後續建置）
create table animals (
  id uuid primary key default uuid_generate_v4(),
  facility_id uuid not null references facilities(id) on delete cascade,
  name text,
  species text not null default 'dog' check (species in ('dog','cat','other')),
  age_group text check (age_group in ('puppy','adult','senior')),
  size text check (size in ('small','medium','large')),
  personality_tags text[] default '{}',
  photo_url text,
  status text not null default 'available' check (status in ('available','pending','adopted','not_available')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table adoption_listings (
  id uuid primary key default uuid_generate_v4(),
  animal_id uuid not null references animals(id) on delete cascade,
  facility_id uuid not null references facilities(id) on delete cascade,
  description text,
  requirements text,
  published_at date,
  is_active boolean not null default true
);

create table volunteer_opportunities (
  id uuid primary key default uuid_generate_v4(),
  facility_id uuid not null references facilities(id) on delete cascade,
  skill_tags text[] default '{}',
  description text,
  updated_at date
);

create table donation_needs (
  id uuid primary key default uuid_generate_v4(),
  facility_id uuid not null references facilities(id) on delete cascade,
  item text not null,
  updated_at date not null,
  source text
);

create table user_reports (
  id uuid primary key default uuid_generate_v4(),
  facility_id uuid not null references facilities(id) on delete cascade,
  report_type text not null check (report_type in ('correct','wrong_address','closed','wrong_phone','wrong_adoption_info','other')),
  message text,
  contact_email text,
  created_at timestamptz not null default now(),
  status text not null default 'pending' check (status in ('pending','reviewed','resolved'))
);

-- Row Level Security：公開資料可讀，寫入僅限服務端（管理後台）使用 service role。
alter table facilities enable row level security;
alter table facility_sources enable row level security;
alter table facility_updates enable row level security;
alter table supply_needs enable row level security;
alter table animals enable row level security;
alter table adoption_listings enable row level security;
alter table volunteer_opportunities enable row level security;
alter table donation_needs enable row level security;
alter table user_reports enable row level security;

create policy "public read facilities" on facilities for select using (true);
create policy "public read facility_sources" on facility_sources for select using (true);
create policy "public read facility_updates" on facility_updates for select using (true);
create policy "public read supply_needs" on supply_needs for select using (true);
create policy "public read animals" on animals for select using (true);
create policy "public read adoption_listings" on adoption_listings for select using (true);
create policy "public read volunteer_opportunities" on volunteer_opportunities for select using (true);
create policy "public read donation_needs" on donation_needs for select using (true);

create policy "anyone can submit a report" on user_reports for insert with check (true);
-- 使用者回報僅管理員（service role）可讀取／更新，一般使用者無法讀取他人回報內容。
