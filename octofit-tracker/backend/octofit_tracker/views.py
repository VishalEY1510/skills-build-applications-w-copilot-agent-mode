from rest_framework import viewsets, routers
from .models import User, Team, Activity, Leaderboard, Workout
from .serializers import UserSerializer, TeamSerializer, ActivitySerializer, LeaderboardSerializer, WorkoutSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer

class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer

class LeaderboardViewSet(viewsets.ModelViewSet):
    queryset = Leaderboard.objects.all()
    serializer_class = LeaderboardSerializer

class WorkoutViewSet(viewsets.ModelViewSet):
    queryset = Workout.objects.all()
    serializer_class = WorkoutSerializer

@api_view(['GET'])
def api_root(request, format=None, base_url=None):
    # Use base_url for all endpoints if provided
    def build_url(name):
        url = reverse(name, request=request, format=format)
        if base_url:
            # Only keep the /api/... part
            path = url[url.find('/api/'):]
            return f"{base_url}{path}"
        return url
    return Response({
        'users': build_url('user-list'),
        'teams': build_url('team-list'),
        'activities': build_url('activity-list'),
        'leaderboards': build_url('leaderboard-list'),
        'workouts': build_url('workout-list'),
    })
