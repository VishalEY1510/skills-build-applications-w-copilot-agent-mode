from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from djongo import models

from octofit_tracker import settings

from django.db import connection

# Define models for teams, activities, leaderboard, and workouts
from django.db import models as dj_models

class Team(dj_models.Model):
    name = dj_models.CharField(max_length=100, unique=True)
    class Meta:
        app_label = 'octofit_tracker'

class Activity(dj_models.Model):
    user_email = dj_models.CharField(max_length=100)
    team = dj_models.CharField(max_length=100)
    type = dj_models.CharField(max_length=100)
    duration = dj_models.IntegerField()
    class Meta:
        app_label = 'octofit_tracker'

class Leaderboard(dj_models.Model):
    team = dj_models.CharField(max_length=100)
    points = dj_models.IntegerField()
    class Meta:
        app_label = 'octofit_tracker'

class Workout(dj_models.Model):
    name = dj_models.CharField(max_length=100)
    description = dj_models.TextField()
    class Meta:
        app_label = 'octofit_tracker'

User = get_user_model()

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        # Delete all data
        User.objects.all().delete()
        Team.objects.all().delete()
        Activity.objects.all().delete()
        Leaderboard.objects.all().delete()
        Workout.objects.all().delete()

        # Create teams
        marvel = Team.objects.create(name='Marvel')
        dc = Team.objects.create(name='DC')

        # Create users
        users = [
            User.objects.create_user(username='ironman', email='ironman@marvel.com', password='password'),
            User.objects.create_user(username='captainamerica', email='cap@marvel.com', password='password'),
            User.objects.create_user(username='batman', email='batman@dc.com', password='password'),
            User.objects.create_user(username='superman', email='superman@dc.com', password='password'),
        ]

        # Create activities
        Activity.objects.create(user_email='ironman@marvel.com', team='Marvel', type='Running', duration=30)
        Activity.objects.create(user_email='cap@marvel.com', team='Marvel', type='Cycling', duration=45)
        Activity.objects.create(user_email='batman@dc.com', team='DC', type='Swimming', duration=60)
        Activity.objects.create(user_email='superman@dc.com', team='DC', type='Yoga', duration=20)

        # Create leaderboard
        Leaderboard.objects.create(team='Marvel', points=75)
        Leaderboard.objects.create(team='DC', points=80)

        # Create workouts
        Workout.objects.create(name='Super Strength', description='Strength workout for superheroes')
        Workout.objects.create(name='Flight Training', description='Aerobic workout for flying heroes')

        self.stdout.write(self.style.SUCCESS('octofit_db database populated with test data.'))
