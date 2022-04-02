# Igrannonica

## Kratak opis projekta

Igrannonica je Veb aplikacija za izučavanje osnovnih principa funkcionisanja veštačkih neuronskih mreža kroz interaktivan
rad.

## Potrebni paketi i programi

* .NET 6
* node `v16.14.0`
* npm `8.3.1`
* Angular CLI `13.2.5`
* PostgreSQL `14.2`
* Npgsql `v3.2.6-3`
* Python `3.10`
* Pip
* Pipenv `2022.1.8`

## Uputstvo za instalaciju i pokretanje

### Instalacija

1. Instaliranje [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)-a
2. Preuzimanje projekta. Može se izvršiti preko komande linije na sledeći način:  
    `git clone http://gitlab.pmf.kg.ac.rs/igrannonica/regresis.git`
3. Instaliranje [nodejs](https://nodejs.org/dist/v16.14.0)-a
4. Instaliranje Angular-a:  
    `npm install -g @angular/cli`
3. Instaliranje paketa za frontend:  
    ```
    cd regresis
    cd src
    cd frontend
    npm install .
    ```
4. Instaliranje [PostgreSQL](https://www.postgresql.org/download)-a  
    **Npgsql driver** se na Windows sistemima može instalirati čekiranjem opcije `Npgsql v3.2.6-3` u kategoriji _Database Drivers_ Stack Builder-a
5. Instaliranje [Python](https://www.python.org/downloads/release/python-3102)-a (ako se [pip](https://pypi.org/project/pip) ne instalira potrebno je i njega instalirati)
6. Instaliranje `pipenv`-a:  
    `pip install pipenv`
7. Instaliranje potrebnih python paketa:  
    ```
    cd ..
    cd ann-microservice
    pipenv install .
    ```
    **Napomena**: podrazumeva se da nije bilo promena radnog direktorijuma i međuvremenu. Poslednju komandu je potrebno izvršiti u `ann-microservice` folderu

### Pokretanje

Nakon instalacije svih potrebnih programa i paketa projekat se može pokrenuti.

#### Pokretnje frontend-a
 ```
cd src
cd front
cd ng serve --open
 ```

#### Pokretnje mikroservisa
 ```
cd src
cd ann-microservice
pipenv run server
 ```
 
#### Pokretanje backend-a
```
cd src
cd backend
dotnet run
```

## Za developere

Za učesnike u razvoju kreiran je [referencni fajl](docs/internal/reference.md) koji sadrži sve bitne informacije za razvoj aplikacije.