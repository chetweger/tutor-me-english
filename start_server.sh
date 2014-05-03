#!/bin/bash
# Script to 

virtualenv --distribute ~/venv/tutorme
source ~/venv/tutorme/bin/activate

pip install django
python manage_dev.py syncdb
python manage_dev.py runserver

