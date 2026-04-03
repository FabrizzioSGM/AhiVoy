-- Allow return_routes to exist without a vehicle (vehicle registration is optional at route-publish time)
-- Vehicle can be linked later once the transportista registers their unit
ALTER TABLE public.return_routes ALTER COLUMN vehicle_id DROP NOT NULL;
