# Pour commencer le projet

```bash
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000 --app-dir src
```
## Créer l'environnement virtuel

```bash
python -m venv .venv
```

### Puis Activer l'environnement virtuel

```bash
source .venv/bin/activate
or 
.\.venv\Scripts\activate.bat
```

### Pour arrêter (ou désactiver) l'environnement virtuel, il te suffit de taper la commande suivante dans ton terminal

```bash
deactivate
or
.\.venv\Scripts\deactivate.bat
```

### Puis il faut install les dependans

```bash
pip install -r requirements.txt
```

### Mettre à jour le fichier `requirements.txt`

```bash
pip freeze > requirements.txt
```

### Formatage du code

```bash
black src; isort src; pylint src
or
black src && isort src && pylint src
```
