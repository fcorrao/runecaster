-- spells saved by swift kills over the run (each pays 1200 × the combo multiplier): widens the score bound
ALTER TABLE runs ADD COLUMN swift INTEGER NOT NULL DEFAULT 0;
