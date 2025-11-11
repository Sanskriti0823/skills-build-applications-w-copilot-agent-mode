from django.test import TestCase
from .models import User, Team, Activity, Leaderboard, Workout

class ModelTests(TestCase):
    def setUp(self):
        marvel = Team.objects.create(name='Marvel')
        dc = Team.objects.create(name='DC')
        self.user1 = User.objects.create(name='Spider-Man', email='spiderman@marvel.com', team=marvel)
        self.user2 = User.objects.create(name='Batman', email='batman@dc.com', team=dc)

    def test_user_team(self):
        self.assertEqual(self.user1.team.name, 'Marvel')
        self.assertEqual(self.user2.team.name, 'DC')

    def test_unique_email(self):
        with self.assertRaises(Exception):
            User.objects.create(name='Duplicate', email='spiderman@marvel.com', team=self.user1.team)
