# Pour commencer le projet

## Créer l'environnement virtuel

```bash
python -m venv .venv
```

### Puis Activer l'environnement virtuel

```bash
source .venv/bin/activate
```

### Pour arrêter (ou désactiver) l'environnement virtuel, il te suffit de taper la commande suivante dans ton terminal

```bash
deactivate
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
black src && isort src && pylint src
```
