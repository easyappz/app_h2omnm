from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import Member, Message


class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = ['id', 'username', 'created_at']
        read_only_fields = ['id', 'username', 'created_at']


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150, write_only=False)
    password = serializers.CharField(max_length=255, write_only=True)

    def validate_username(self, value):
        if len(value) < 3:
            raise serializers.ValidationError("Username must be at least 3 characters long")
        if Member.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists")
        return value

    def validate_password(self, value):
        if len(value) < 6:
            raise serializers.ValidationError("Password must be at least 6 characters long")
        return value

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return Member.objects.create(**validated_data)


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150, write_only=True)
    password = serializers.CharField(max_length=255, write_only=True)


class MessageSerializer(serializers.ModelSerializer):
    author_id = serializers.IntegerField(source='author.id', read_only=True)
    author_username = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = ['id', 'author_id', 'author_username', 'text', 'created_at']
        read_only_fields = ['id', 'author_id', 'author_username', 'created_at']

    def get_author_username(self, obj):
        return obj.author.username


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = ['id', 'username', 'created_at']
        read_only_fields = ['id', 'created_at']