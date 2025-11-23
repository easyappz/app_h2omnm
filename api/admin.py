from django.contrib import admin
from .models import Member, Token, Message


@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'created_at')
    search_fields = ('username',)
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)


@admin.register(Token)
class TokenAdmin(admin.ModelAdmin):
    list_display = ('id', 'member', 'key', 'created_at')
    search_fields = ('member__username', 'key')
    readonly_fields = ('created_at', 'key')
    ordering = ('-created_at',)


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'author', 'text', 'created_at')
    search_fields = ('author__username', 'text')
    readonly_fields = ('created_at',)
    list_filter = ('created_at',)
    ordering = ('created_at',)
