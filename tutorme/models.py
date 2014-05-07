from django.db import models

class Tutor(models.Model):
    name = models.CharField(max_length=100)
    email = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    college = models.CharField(max_length=100)
    image_url = models.CharField(max_length=100)
