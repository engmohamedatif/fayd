
CREATE TABLE public.visits (
  id BIGSERIAL PRIMARY KEY,
  visited_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  path TEXT
);
CREATE INDEX visits_visited_at_idx ON public.visits (visited_at);

GRANT SELECT, INSERT ON public.visits TO anon;
GRANT SELECT, INSERT ON public.visits TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.visits_id_seq TO anon, authenticated;
GRANT ALL ON public.visits TO service_role;
GRANT ALL ON SEQUENCE public.visits_id_seq TO service_role;

ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert a visit" ON public.visits FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read visits" ON public.visits FOR SELECT USING (true);
