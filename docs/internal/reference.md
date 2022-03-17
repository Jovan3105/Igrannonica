# Reference

Sadržaj
1. [Git](#git)
    1. [Komande za proveru trenutnog stanja](#komande-za-proveru-trenutnog-stanja)
    2. [Ispravka greške na lokalnoj grani pomoću remote grane](#ispravka-gre%C5%A1ke-na-lokalnoj-grani-pomo%C4%87u-remote-grane)
    3. [Brisanje poslednjeg commit-a](#brisanje-poslednjeg-commit-a)
    4. [Pomeranje vrha grane na neki prethodni commit](#pomeranje-vrha-grane-na-neki-prethodni-commit)
2. [Angular](#angular)
3. [PostgreSQL](#postgresql)
4. [Entity Framework](#entity-framework)
5. [pipenv - mikroservis](#pipenv-mikroservis)

## Git

Ono što je bitno napomenuti je da postoje 3 bitna dela na koja treba obratiti pažnju: **origin** (remote), **staging area** i **working tree** (lokalni repo). 

**Origin** predstavlja repozitorijum na udaljenom računaru.

**Staging area** predstavlja nešto kao skup u koji se dodaju trenutna stanja nekih fajlova (snapshot) koji će biti deo sledećeg commit-a.

**Working tree** predstavlja lokalni repozitorijum, tj. lokalno stanje git projekta. Na njemu se nalaze sve lokalne promene koje je potrebno dodati u staged area kako bi bile commit-ovane.


### Komande za proveru trenutnog stanja

Prikaz informacija o trenutno odabranoj grani, broj commit-ova u odnosu na odgovarajuću remote granu, staged promene kao i lokalne promene:
```
git status
```

Skraćena forma prethodne komande koja sadrži samo jednostavne informacije o staged i lokalnim promenama, i te informacije govore o tome da li je fajl kreiran, dodat, izmenjen ili obrisan:
```
git status -s
```

Prikazuje informacije o commit-ovima od poslednjeg ka ranijim, a takođe je moguće videti na kojem commit-u se nalaze vrhovi grana:
```
git log
```

Skraćena verzija prethodne komande koja omogućava pregledniji prikaz sa početnim delom hash-a, title-om commit-a i lokacijom vrhova grana:
```
git log --oneline
```

### Ispravka greške na lokalnoj grani pomoću remote grane

Vraćanje lokalne `grana` grane na poslednji commit remote grane `grana`:
```
git fetch origin
git reset --hard origin/grana
```
  
[**Vrati se na vrh ^**](#reference)
  

### Brisanje poslednjeg commit-a

Brisanje poslednjeg commit-a sa lokalne i remote grane `grana`:
```
git reset HEAD^                 # remove commit locally
git push origin +HEAD           # force-push the new HEAD commit
```


Brisanje poslednjeg commit-a sa remote grane `grana` (uz čuvanje commit-a na lokalnoj grani):
```
git reset HEAD^                 # remove commit locally
git push origin +HEAD^:grana
```


### Pomeranje vrha grane na neki prethodni commit


Postavljanje `HEAD`-a na neki commit `ab12cd34` (ne mora da bude hash). Staged changes se brišu, ali lokalne promene ostaju:
```
git reset ab12cd34
```
**Note**: `--mixed` je default-ni switch, tj. prethodna komanda je ekvivalentna komandi `git reset --mixed ab12cd34`


Postavljanje `HEAD`-a na neki commit `ab12cd34` (ne morada bude hash) bez promene na lokalnom ili remote stablu:
```
git reset --soft ab12cd34
```


Postavljanje `HEAD`-a na neki commit `ab12cd34` (ne morada bude hash). I lokalne i staged changes se brisu
```
git reset --hard ab12cd34
```

[**Vrati se na vrh ^**](#reference)

## Angular
1. `cd src/frontend`
2. `npm install .`
3. `npm install ag-grid-angular ag-grid community`
4. `ng serve --open`

## Podešavanje PostgreSQL-a

Kreiranje baze iz NuGet terminala: ```Update-Database```

Do NuGet terminala se može doći na sledeći način: Tools > NuGet Package Manager > Packer Manager Console


[**Vrati se na vrh ^**](#reference)

## PostgreSQL

### Info

User: `postgres`  
Password: `root`  
Port: `5432`  

### Komande

`\du` - prikazuje sve role-ove (korisnike)  
`\l` - prikazuje listu svih baza podataka  
`\c ImeBaze` - povezivanje na bazu `ImeBaze`  
`\dt` - prikaz liste tabela  
`\quit` - izlazam iz PostgreSQL shell-a  


## Entity Framework

`dotnet-ef migrations add Ime` - Dodavanje nove migracije  
`dotnet-ef migrations add Ime -Context ImeContexta` - Dodavanje nove migracije u okviru nekog konteksta
`dotnet-ef migrations list` - Prikaz svih migracija (naziv kreće nakon karaktera `_`)
`dotnet-ef migrations remove` - Brisanje poslednje migracije  

[**Vrati se na vrh ^**](#reference)

## pipenv - mikroservis

1. `pip install pipenv`
2. `cd .\src\mikroservis`
3. `pipenv install` - kreira virtuelno okruženje u trenutnom direktorijumu
4. `pipenv install flask-restful` - instalira flask-restful
5. `pipenv install numpy` - instalira numpy paketa
6. `pipenv install pandas` - instalira pandas paketa
7. `pyenv shell` - aktiviranje virtualnog okruženja
8.	
	* `pipenv run server` - pokretanje ann servera (prvi nacin)
	* `python flask_restful .\ann_server.py` - pokretanje ann servera (drugi nacin)

[**Vrati se na vrh ^**](#reference)
