-- ═══════════════════════════════════════════════════════════════════════════
-- ZzingRush — Migración inicial
-- Corre este script en: Supabase Dashboard → SQL Editor → New query
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── Extensions ─────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── Enums ───────────────────────────────────────────────────────────────────
create type user_role as enum ('embarcador', 'transportista', 'admin');
create type verification_status as enum ('pending', 'in_review', 'approved', 'rejected', 'needs_action');
create type operator_type as enum ('empresa', 'independiente');
create type vehicle_type as enum ('torton', 'rabon', 'trailer', 'camion_3.5t', 'camion_5t', 'camioneta', 'full');
create type document_type as enum (
  'ine', 'licencia_conducir', 'tarjeta_circulacion', 'seguro_vigente',
  'acta_constitutiva', 'comprobante_domicilio', 'constancia_sat',
  'caratula_bancaria', 'foto_unidad'
);
create type document_owner_type as enum ('user', 'vehicle', 'company');
create type document_status as enum ('pending', 'approved', 'rejected');
create type route_status as enum ('draft', 'published', 'matched', 'in_transit', 'completed', 'cancelled');
create type shipment_status as enum (
  'draft', 'published', 'matching', 'matched', 'confirmed',
  'escrow_funded', 'in_transit', 'delivered', 'completed', 'cancelled', 'disputed'
);
create type match_status as enum ('suggested', 'viewed', 'negotiating', 'accepted', 'rejected', 'expired');
create type message_type as enum ('text', 'offer', 'counter_offer', 'accept', 'reject');
create type payment_status as enum ('pending', 'escrow_funded', 'held', 'released', 'refunded', 'disputed');
create type tracking_event_type as enum (
  'escrow_funded', 'carrier_confirmed', 'pickup_en_route', 'pickup_arrived',
  'pickup_completed', 'in_transit', 'delivery_en_route', 'delivery_arrived',
  'delivery_completed', 'incident_reported', 'delivered'
);
create type claim_status as enum ('open', 'in_review', 'resolved_shipper', 'resolved_carrier', 'closed');
create type notification_type as enum (
  'match_found', 'offer_received', 'offer_accepted', 'escrow_funded',
  'pickup_confirmed', 'delivery_confirmed', 'payment_released',
  'document_approved', 'document_rejected', 'new_rating', 'claim_update'
);
create type reputation_tier as enum ('nuevo', 'verificado', 'confiable', 'elite');

-- ─── profiles ────────────────────────────────────────────────────────────────
-- Extends auth.users — auto-created via trigger
create table public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  email           text not null,
  name            text not null,
  phone           text,
  role            user_role not null,
  verification_status verification_status not null default 'pending',
  avatar_url      text,
  onboarding_completed boolean not null default false,
  created_at      timestamptz not null default now()
);

-- ─── companies ───────────────────────────────────────────────────────────────
create table public.companies (
  id                  uuid primary key default uuid_generate_v4(),
  user_id             uuid not null references public.profiles(id) on delete cascade,
  legal_name          text not null,
  trade_name          text,
  rfc                 text not null,
  address             text not null,
  city                text not null,
  state               text not null,
  postal_code         text not null,
  industry            text,
  verification_status verification_status not null default 'pending',
  created_at          timestamptz not null default now()
);

-- ─── carrier_profiles ────────────────────────────────────────────────────────
create table public.carrier_profiles (
  id                  uuid primary key default uuid_generate_v4(),
  user_id             uuid not null references public.profiles(id) on delete cascade,
  company_id          uuid references public.companies(id),
  operator_type       operator_type not null default 'independiente',
  license_number      text not null,
  operating_states    text[] not null default '{}',
  specialties         text[] not null default '{}',
  total_trips         integer not null default 0,
  on_time_rate        numeric(5,2) not null default 0,
  claim_rate          numeric(5,2) not null default 0,
  avg_rating          numeric(3,2) not null default 0,
  reputation_tier     reputation_tier not null default 'nuevo',
  verification_status verification_status not null default 'pending'
);

-- ─── vehicles ────────────────────────────────────────────────────────────────
create table public.vehicles (
  id                  uuid primary key default uuid_generate_v4(),
  carrier_id          uuid not null references public.carrier_profiles(id) on delete cascade,
  type                vehicle_type not null,
  brand               text not null,
  model               text not null,
  year                integer not null,
  plates              text not null,
  vin                 text,
  capacity_kg         numeric(10,2) not null,
  capacity_m3         numeric(10,2),
  has_refrigeration   boolean not null default false,
  verification_status verification_status not null default 'pending',
  insurance_expiry    date not null,
  document_ids        uuid[] not null default '{}'
);

-- ─── documents ───────────────────────────────────────────────────────────────
create table public.documents (
  id               uuid primary key default uuid_generate_v4(),
  owner_id         uuid not null,
  owner_type       document_owner_type not null,
  type             document_type not null,
  file_name        text not null,
  url              text not null,
  status           document_status not null default 'pending',
  rejection_reason text,
  expires_at       date,
  uploaded_at      timestamptz not null default now()
);

-- ─── return_routes ───────────────────────────────────────────────────────────
create table public.return_routes (
  id                      uuid primary key default uuid_generate_v4(),
  carrier_id              uuid not null references public.carrier_profiles(id) on delete cascade,
  vehicle_id              uuid not null references public.vehicles(id),
  origin_city             text not null,
  origin_state            text not null,
  destination_city        text not null,
  destination_state       text not null,
  departure_date_from     date not null,
  departure_date_to       date not null,
  available_capacity_kg   numeric(10,2) not null,
  available_capacity_m3   numeric(10,2),
  price_per_km            numeric(10,2),
  estimated_distance      numeric(10,2) not null,
  accepted_cargo_types    text[] not null default '{}',
  restrictions            text,
  status                  route_status not null default 'draft',
  potential_earnings      numeric(12,2),
  created_at              timestamptz not null default now()
);

-- ─── shipment_requests ────────────────────────────────────────────────────────
create table public.shipment_requests (
  id                      uuid primary key default uuid_generate_v4(),
  shipper_id              uuid not null references public.profiles(id) on delete cascade,
  origin_city             text not null,
  origin_state            text not null,
  destination_city        text not null,
  destination_state       text not null,
  cargo_description       text not null,
  cargo_type              text not null,
  weight_kg               numeric(10,2) not null,
  volume_m3               numeric(10,2),
  required_date           date not null,
  is_fragile              boolean not null default false,
  requires_refrigeration  boolean not null default false,
  declared_value          numeric(12,2) not null,
  status                  shipment_status not null default 'draft',
  estimated_price         numeric(12,2),
  ai_parsed               boolean not null default false,
  raw_input               text,
  created_at              timestamptz not null default now()
);

-- ─── matches ─────────────────────────────────────────────────────────────────
create table public.matches (
  id               uuid primary key default uuid_generate_v4(),
  shipment_id      uuid not null references public.shipment_requests(id) on delete cascade,
  route_id         uuid not null references public.return_routes(id),
  carrier_id       uuid not null references public.carrier_profiles(id),
  shipper_id       uuid not null references public.profiles(id),
  match_score      numeric(5,2) not null,
  detour_km        numeric(10,2) not null,
  estimated_price  numeric(12,2) not null,
  carrier_earnings numeric(12,2) not null,
  shipper_savings  numeric(12,2) not null,
  status           match_status not null default 'suggested',
  expires_at       timestamptz not null,
  created_at       timestamptz not null default now()
);

-- ─── negotiation_messages ────────────────────────────────────────────────────
create table public.negotiation_messages (
  id           uuid primary key default uuid_generate_v4(),
  match_id     uuid not null references public.matches(id) on delete cascade,
  sender_id    uuid not null references public.profiles(id),
  sender_role  user_role not null,
  message_type message_type not null default 'text',
  content      text not null,
  offer_amount numeric(12,2),
  created_at   timestamptz not null default now()
);

-- ─── payments ────────────────────────────────────────────────────────────────
create table public.payments (
  id               uuid primary key default uuid_generate_v4(),
  match_id         uuid not null references public.matches(id),
  shipment_id      uuid not null references public.shipment_requests(id),
  amount           numeric(12,2) not null,
  platform_fee     numeric(12,2) not null,
  carrier_amount   numeric(12,2) not null,
  currency         text not null default 'MXN',
  status           payment_status not null default 'pending',
  escrow_funded_at timestamptz,
  released_at      timestamptz,
  cfdi_url         text,
  created_at       timestamptz not null default now()
);

-- ─── tracking_events ─────────────────────────────────────────────────────────
create table public.tracking_events (
  id          uuid primary key default uuid_generate_v4(),
  shipment_id uuid not null references public.shipment_requests(id) on delete cascade,
  event_type  tracking_event_type not null,
  lat         numeric(9,6),
  lng         numeric(9,6),
  city        text,
  state       text,
  notes       text,
  photo_urls  text[] not null default '{}',
  reported_by uuid not null references public.profiles(id),
  created_at  timestamptz not null default now()
);

-- ─── delivery_proofs ─────────────────────────────────────────────────────────
create table public.delivery_proofs (
  id                    uuid primary key default uuid_generate_v4(),
  shipment_id           uuid not null references public.shipment_requests(id) on delete cascade,
  photo_urls            text[] not null default '{}',
  recipient_name        text not null,
  recipient_signature_url text,
  lat                   numeric(9,6) not null,
  lng                   numeric(9,6) not null,
  confirmed_at          timestamptz not null default now(),
  confirmed_by_shipper  boolean not null default false
);

-- ─── ratings ─────────────────────────────────────────────────────────────────
create table public.ratings (
  id            uuid primary key default uuid_generate_v4(),
  shipment_id   uuid not null references public.shipment_requests(id),
  reviewer_id   uuid not null references public.profiles(id),
  reviewee_id   uuid not null references public.profiles(id),
  reviewer_role user_role not null,
  overall       integer not null check (overall between 1 and 5),
  punctuality   integer not null check (punctuality between 1 and 5),
  communication integer not null check (communication between 1 and 5),
  documentation integer not null check (documentation between 1 and 5),
  cargo_condition integer check (cargo_condition between 1 and 5),
  comment       text,
  created_at    timestamptz not null default now()
);

-- ─── claims ──────────────────────────────────────────────────────────────────
create table public.claims (
  id            uuid primary key default uuid_generate_v4(),
  shipment_id   uuid not null references public.shipment_requests(id),
  claimant_id   uuid not null references public.profiles(id),
  claimant_role user_role not null,
  reason        text not null,
  description   text not null,
  evidence_urls text[] not null default '{}',
  status        claim_status not null default 'open',
  resolution    text,
  created_at    timestamptz not null default now(),
  resolved_at   timestamptz
);

-- ─── notifications ───────────────────────────────────────────────────────────
create table public.notifications (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  type       notification_type not null,
  title      text not null,
  body       text not null,
  read       boolean not null default false,
  link       text,
  created_at timestamptz not null default now()
);

-- ═══════════════════════════════════════════════════════════════════════════
-- TRIGGER — auto-create profile on auth.users insert
-- ═══════════════════════════════════════════════════════════════════════════

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, phone, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'phone',
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'embarcador')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ═══════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════════════════════════════════════

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.companies enable row level security;
alter table public.carrier_profiles enable row level security;
alter table public.vehicles enable row level security;
alter table public.documents enable row level security;
alter table public.return_routes enable row level security;
alter table public.shipment_requests enable row level security;
alter table public.matches enable row level security;
alter table public.negotiation_messages enable row level security;
alter table public.payments enable row level security;
alter table public.tracking_events enable row level security;
alter table public.delivery_proofs enable row level security;
alter table public.ratings enable row level security;
alter table public.claims enable row level security;
alter table public.notifications enable row level security;

-- ─── profiles RLS ────────────────────────────────────────────────────────────
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Public profiles are viewable" on public.profiles
  for select using (true);

-- ─── companies RLS ───────────────────────────────────────────────────────────
create policy "Users manage own company" on public.companies
  for all using (auth.uid() = user_id);

-- ─── carrier_profiles RLS ────────────────────────────────────────────────────
create policy "Carriers manage own profile" on public.carrier_profiles
  for all using (auth.uid() = user_id);

create policy "Carrier profiles viewable by all" on public.carrier_profiles
  for select using (true);

-- ─── vehicles RLS ────────────────────────────────────────────────────────────
create policy "Carriers manage own vehicles" on public.vehicles
  for all using (
    exists (
      select 1 from public.carrier_profiles cp
      where cp.id = vehicles.carrier_id and cp.user_id = auth.uid()
    )
  );

create policy "Vehicles viewable by all" on public.vehicles
  for select using (true);

-- ─── documents RLS ───────────────────────────────────────────────────────────
create policy "Users manage own documents" on public.documents
  for all using (owner_id = auth.uid());

-- ─── return_routes RLS ───────────────────────────────────────────────────────
create policy "Carriers manage own routes" on public.return_routes
  for all using (
    exists (
      select 1 from public.carrier_profiles cp
      where cp.id = return_routes.carrier_id and cp.user_id = auth.uid()
    )
  );

create policy "Published routes viewable by all" on public.return_routes
  for select using (status = 'published' or exists (
    select 1 from public.carrier_profiles cp
    where cp.id = return_routes.carrier_id and cp.user_id = auth.uid()
  ));

-- ─── shipment_requests RLS ───────────────────────────────────────────────────
create policy "Shippers manage own shipments" on public.shipment_requests
  for all using (auth.uid() = shipper_id);

create policy "Published shipments viewable by transportistas" on public.shipment_requests
  for select using (
    status = 'published' or auth.uid() = shipper_id
  );

-- ─── matches RLS ─────────────────────────────────────────────────────────────
create policy "Involved parties view their matches" on public.matches
  for select using (
    auth.uid() = shipper_id or
    exists (
      select 1 from public.carrier_profiles cp
      where cp.id = matches.carrier_id and cp.user_id = auth.uid()
    )
  );

-- ─── negotiation_messages RLS ────────────────────────────────────────────────
create policy "Match participants view messages" on public.negotiation_messages
  for select using (
    exists (
      select 1 from public.matches m
      where m.id = negotiation_messages.match_id
        and (m.shipper_id = auth.uid() or
             exists (select 1 from public.carrier_profiles cp where cp.id = m.carrier_id and cp.user_id = auth.uid()))
    )
  );

create policy "Authenticated users can send messages" on public.negotiation_messages
  for insert with check (auth.uid() = sender_id);

-- ─── notifications RLS ───────────────────────────────────────────────────────
create policy "Users view own notifications" on public.notifications
  for select using (auth.uid() = user_id);

create policy "Users update own notifications" on public.notifications
  for update using (auth.uid() = user_id);

-- ─── payments RLS ────────────────────────────────────────────────────────────
create policy "Involved parties view payments" on public.payments
  for select using (
    exists (
      select 1 from public.matches m
      where m.id = payments.match_id
        and (m.shipper_id = auth.uid() or
             exists (select 1 from public.carrier_profiles cp where cp.id = m.carrier_id and cp.user_id = auth.uid()))
    )
  );

-- ─── tracking_events & delivery_proofs RLS ────────────────────────────────────
create policy "Involved parties view tracking" on public.tracking_events
  for select using (
    exists (
      select 1 from public.shipment_requests sr
      where sr.id = tracking_events.shipment_id
        and (sr.shipper_id = auth.uid() or
             exists (
               select 1 from public.matches m
               join public.carrier_profiles cp on cp.id = m.carrier_id
               where m.shipment_id = sr.id and cp.user_id = auth.uid()
             ))
    )
  );

create policy "Carriers insert tracking events" on public.tracking_events
  for insert with check (auth.uid() = reported_by);

create policy "Involved parties view delivery proofs" on public.delivery_proofs
  for select using (
    exists (
      select 1 from public.shipment_requests sr
      where sr.id = delivery_proofs.shipment_id and sr.shipper_id = auth.uid()
    )
  );

-- ─── ratings RLS ─────────────────────────────────────────────────────────────
create policy "Ratings viewable by all" on public.ratings for select using (true);
create policy "Users create own ratings" on public.ratings
  for insert with check (auth.uid() = reviewer_id);

-- ─── claims RLS ──────────────────────────────────────────────────────────────
create policy "Claimants manage own claims" on public.claims
  for all using (auth.uid() = claimant_id);

-- ═══════════════════════════════════════════════════════════════════════════
-- INDEXES (performance)
-- ═══════════════════════════════════════════════════════════════════════════
create index idx_shipment_requests_shipper on public.shipment_requests(shipper_id);
create index idx_shipment_requests_status on public.shipment_requests(status);
create index idx_return_routes_carrier on public.return_routes(carrier_id);
create index idx_return_routes_status on public.return_routes(status);
create index idx_matches_shipment on public.matches(shipment_id);
create index idx_matches_carrier on public.matches(carrier_id);
create index idx_notifications_user on public.notifications(user_id, read);
create index idx_tracking_shipment on public.tracking_events(shipment_id);
