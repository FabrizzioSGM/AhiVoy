-- Match messages — chat between shipper and carrier within a match
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)

CREATE TABLE IF NOT EXISTS public.match_messages (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id    uuid NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  sender_id   uuid NOT NULL REFERENCES public.profiles(id),
  message     text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.match_messages ENABLE ROW LEVEL SECURITY;

-- Involved parties can view messages for their matches
CREATE POLICY "Involved parties view messages" ON public.match_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.matches m
      WHERE m.id = match_messages.match_id
        AND (
          m.shipper_id = auth.uid()
          OR EXISTS (
            SELECT 1 FROM public.carrier_profiles cp
            WHERE cp.id = m.carrier_id AND cp.user_id = auth.uid()
          )
        )
    )
  );

-- Authenticated users can insert messages (sender_id must be themselves)
CREATE POLICY "Users send messages" ON public.match_messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE INDEX idx_match_messages_match ON public.match_messages(match_id);
CREATE INDEX idx_match_messages_created ON public.match_messages(match_id, created_at);
