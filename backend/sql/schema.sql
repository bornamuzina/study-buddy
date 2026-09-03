CREATE TABLE korisnici (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  lozinka_hash TEXT,
  ime TEXT NOT NULL,
  uloga TEXT NOT NULL DEFAULT 'student' CHECK (uloga IN ('student','admin')),
  aktivan BOOLEAN NOT NULL DEFAULT true,
  google_id TEXT,
  profilna_slika TEXT NOT NULL DEFAULT '',
  sveuciliste TEXT NOT NULL DEFAULT '',
  godina INT NOT NULL DEFAULT 1,
  dnevni_cilj_sati INT NOT NULL DEFAULT 6,
  preferencije JSONB NOT NULL DEFAULT '{"jezik":"hr","tema":"svijetla"}',
  obavijesti JSONB NOT NULL DEFAULT '{"podsjetnici":true,"pauze":true,"ciljevi":false}',
  pomodoro JSONB NOT NULL DEFAULT '{"minutaRada":25,"minutaPauze":5,"automatskiNastavak":true}',
  vidjene_obavijesti JSONB NOT NULL DEFAULT '[]',
  datum_registracije TIMESTAMPTZ NOT NULL DEFAULT now(),
  zadnja_prijava TIMESTAMPTZ
);

CREATE TABLE predmeti (
  id SERIAL PRIMARY KEY,
  korisnik_id INT NOT NULL REFERENCES korisnici(id) ON DELETE CASCADE,
  naziv TEXT NOT NULL,
  opis TEXT NOT NULL DEFAULT '',
  boja TEXT NOT NULL DEFAULT 'indigo',
  ikona TEXT NOT NULL DEFAULT 'knjiga'
);

CREATE TABLE zadaci (
  id SERIAL PRIMARY KEY,
  predmet_id INT NOT NULL REFERENCES predmeti(id) ON DELETE CASCADE,
  naslov TEXT NOT NULL,
  opis TEXT NOT NULL DEFAULT '',
  rok_izvrsenja DATE,
  prioritet TEXT NOT NULL DEFAULT 'SREDNJI' CHECK (prioritet IN ('NIZAK','SREDNJI','VISOK')),
  status TEXT NOT NULL DEFAULT 'NA_CEKANJU' CHECK (status IN ('NA_CEKANJU','U_TIJEKU','ZAVRSENO'))
);

CREATE TABLE biljeske (
  id SERIAL PRIMARY KEY,
  predmet_id INT NOT NULL REFERENCES predmeti(id) ON DELETE CASCADE,
  naslov TEXT NOT NULL,
  kategorija TEXT NOT NULL DEFAULT '',
  sadrzaj TEXT NOT NULL DEFAULT '',
  datum DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE prilozi (
  id SERIAL PRIMARY KEY,
  predmet_id INT NOT NULL REFERENCES predmeti(id) ON DELETE CASCADE,
  naziv TEXT NOT NULL,
  tip TEXT NOT NULL DEFAULT '',
  velicina_kb INT NOT NULL,
  putanja TEXT NOT NULL,
  datum DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE pomodoro_sesije (
  id SERIAL PRIMARY KEY,
  korisnik_id INT NOT NULL REFERENCES korisnici(id) ON DELETE CASCADE,
  predmet_id INT REFERENCES predmeti(id) ON DELETE SET NULL,
  pocetak TIMESTAMPTZ NOT NULL,
  zavrsetak TIMESTAMPTZ NOT NULL,
  trajanje INT NOT NULL
);

CREATE TABLE sadrzaj_naslovnice (
  id SERIAL PRIMARY KEY,
  autor_id INT REFERENCES korisnici(id) ON DELETE SET NULL,
  tip TEXT,
  naslov TEXT NOT NULL,
  sadrzaj TEXT,
  poveznica TEXT NOT NULL DEFAULT '',
  vidljiv BOOLEAN NOT NULL DEFAULT true,
  datum TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE glasovi (
  sadrzaj_id INT NOT NULL REFERENCES sadrzaj_naslovnice(id) ON DELETE CASCADE,
  korisnik_id INT NOT NULL REFERENCES korisnici(id) ON DELETE CASCADE,
  vrijednost SMALLINT NOT NULL CHECK (vrijednost IN (-1, 1)),
  PRIMARY KEY (sadrzaj_id, korisnik_id)
);