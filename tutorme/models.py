from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User)

    college = models.CharField(max_length=100)
    weekend = models.BooleanField()

    def __unicode__(self):
        return self.user.username
