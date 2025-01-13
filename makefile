# Variables
VENV = .venv
PYTHON = $(VENV)/bin/python
PIP = $(VENV)/bin/pip
SRC = src
MAIN = src/main.py

# Cibles principales
.PHONY: help setup activate deactivate install freeze format lint clean

help:
	@echo "Commandes disponibles :"
	@echo "  make setup        Crée et configure l'environnement virtuel"
	@echo "  make activate     Active l'environnement virtuel"
	@echo "  make deactivate   Désactive l'environnement virtuel"
	@echo "  make install      Installe les dépendances"
	@echo "  make freeze       Met à jour requirements.txt avec les dépendances actuelles"
	@echo "  make format       Formate le code avec Black, isort et Pylint"
	@echo "  make lint         Analyse le code avec Pylint"
	@echo "  make clean        Nettoie les fichiers temporaires et l'environnement virtuel"

# Configuration initiale
setup: $(VENV)/bin/activate
	@echo "Environnement virtuel créé et configuré."

$(VENV)/bin/activate:
	python -m venv $(VENV)

# Activation et désactivation de l'environnement virtuel
activate:
	@echo "Pour activer, exécutez :"
	@echo "source $(VENV)/bin/activate"

deactivate:
	@echo "Pour désactiver, exécutez :"
	@echo "deactivate"

# Gestion des dépendances
install: $(VENV)/bin/activate
	$(PIP) install -r requirements.txt

freeze: $(VENV)/bin/activate
	$(PIP) freeze > requirements.txt

# Formatage et linting
format: $(VENV)/bin/activate
	$(PYTHON) -m black $(SRC)
	$(PYTHON) -m isort $(SRC)
	$(PYTHON) -m pylint $(SRC)

# Démarrage du serveur de développement FastAPI
run-dev: $(VENV)/bin/activate
	$(PYTHON) -m uvicorn main:app --reload --host 0.0.0.0 --port 8000 --app-dir src


# Nettoyage
clean:
	rm -rf $(VENV)
	find . -type d -name "__pycache__" -exec rm -r {} +
	find . -type d -name "*.egg-info" -exec rm -r {} +
	@echo "Fichiers temporaires nettoyés."
