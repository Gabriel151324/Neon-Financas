/*
  # Adicionar tabela de desafios semanais

  1. Nova Tabela
    - `challenges`
      - `id` (uuid, primary key)
      - `description` (text)
      - `status` (text) - 'pending', 'accepted', 'completed'
      - `week` (text) - formato YYYY-WW para identificar a semana
      - `user_id` (uuid, foreign key)
      - `created_at` (timestamp)
      - `completed_at` (timestamp, nullable)

  2. Segurança
    - Habilitar RLS na tabela `challenges`
    - Adicionar políticas para usuários autenticados acessarem apenas seus próprios desafios
*/

CREATE TABLE IF NOT EXISTS challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  description text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'completed')),
  week text NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own challenges"
  ON challenges
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own challenges"
  ON challenges
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own challenges"
  ON challenges
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own challenges"
  ON challenges
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Índices para performance
CREATE INDEX IF NOT EXISTS challenges_user_id_idx ON challenges(user_id);
CREATE INDEX IF NOT EXISTS challenges_week_idx ON challenges(week);
CREATE INDEX IF NOT EXISTS challenges_status_idx ON challenges(status);