#!/bin/bash
# Script to 

virtualenv --distribute ~/venv/tutorme
source ~/venv/tutorme/bin/activate

pip install django
python manage.py syncdb
python manage.py runserver

