from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from .models import User, Team, Activity, Leaderboard, Workout

class APITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='testpass')
        self.team = Team.objects.create(name='Test Team')
        self.activity = Activity.objects.create(user=self.user, team=self.team, type='Run', duration=10)
        self.leaderboard = Leaderboard.objects.create(team=self.team, points=100)
        self.workout = Workout.objects.create(name='Test Workout', description='Test Desc')

    def test_api_root(self):
        response = self.client.get(reverse('api-root'))
        self.assertEqual(response.status_code, 200)

    def test_users(self):
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, 200)

    def test_teams(self):
        response = self.client.get('/api/teams/')
        self.assertEqual(response.status_code, 200)

    def test_activities(self):
        response = self.client.get('/api/activities/')
        self.assertEqual(response.status_code, 200)

    def test_leaderboards(self):
        response = self.client.get('/api/leaderboards/')
        self.assertEqual(response.status_code, 200)

    def test_workouts(self):
        response = self.client.get('/api/workouts/')
        self.assertEqual(response.status_code, 200)
