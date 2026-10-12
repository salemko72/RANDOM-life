# Roadmap / Definition of Done

## Faza 0 — završiti usaglašavanje osnivača (prije koda)
Finalizovati ciljnu grupu, PWA/native, konkretan SPIN flow, profil i result UX, data contract (content vs decision), auth izbor, definiciju po 50 stavki, uredničku odgovornost. Usvojiti jedinstveni Product Master Spec kao izvor istine.

## Faza 1 — temelj i demonstracija toka
Github repo + minimalni CI, odvojeni projekti/env, šema i migracije, admin auth, skeleton user app, jedan validan EAT i BOOK demo item, osnovni wheel-to-result, demo publish. Sve na staging/test infrastrukturi.

## Faza 2 — funkcionalan Content Studio
EAT URL import, BOOK metadata lookup, strukturiranje, ručna korekcija, generisanje i optimizacija slika, draft/review/publish, dedup, provenance, pretraga, role, audit, alati za popunjavanje baze.

## Faza 3 — personalizacija i Decision Engine
Minimalni onboarding i profil, hard filter + ranking + controlled random, Spin Again i feedback, history/favorite (ako potvrđeno), result screen, fallback, QA i analytics uz privatnost.

## Faza 4 — 50 + 50 kvalitetnih itema
Minimum 50 različitih javno objavljenih, urednički odobrenih recepata i 50 knjiga. Broje se samo itemi koji prolaze validaciju; draftovi, duplicirani itemi, prazni opisi i neprovjerene knjige se NE broje. Raznovrsnost, jezike i izdanja unaprijed definirati.

## Faza 5 — zatvoreni test
Testeri dobiju link/build, prvi SPIN radi u EAT i BOOK, sadržaj se učitava brzo, slike se dobro renderuju, admin može dodavati i povlačiti stavke, možemo izmjeriti osnove upotrebe bez kršenja privatnosti, postoje povratne informacije i prioritetni bug backlog.

## Minimalni tester-release gate
- EAT>=50 i BOOK>=50 `published + approved + valid`.
- Jedan SPIN -> jedan stvaran, dostupan sadržaj, nema praznih ili zabranjenih preporuka.
- EAT ima ispravne sastojke, mjere, korake; BOOK potvrđen naslov/autor; nije generisan lažni ISBN ili izdanje.
- Slika na itemu kvalitetna, optimizovana i legalno dopuštena za prikaz, s fallbackom.
- Content Studio radi end-to-end, admin kontrola i revizije rade.
- Korisnički tok radi na ciljnoj platformi; osnovne accessibility i performance provjere.
- Osnovni error reporting i troškovni limiti; sigurnosne provjere (tajne, RBAC, upload/URL).
- Test odgovara na pitanje potrebe/retencije, ne samo „sviđa li se dizajn”.

## Šta nije obećanje
Nema utvrđenog datuma lansiranja, budžeta, stacka ni pravog rasporeda dok osnivači ne potvrde preostale odluke.
