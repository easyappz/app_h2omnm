from django.db import models
import secrets


class Member(models.Model):
    username = models.CharField(max_length=150, unique=True)
    password = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def is_authenticated(self):
        return True

    @property
    def is_anonymous(self):
        return False

    def __str__(self):
        return self.username

    class Meta:
        verbose_name = "Member"
        verbose_name_plural = "Members"


class Token(models.Model):
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name="tokens")
    key = models.CharField(max_length=40, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.key:
            self.key = secrets.token_hex(20)
        return super().save(*args, **kwargs)

    def __str__(self):
        return f"Token for {self.member.username}"

    class Meta:
        verbose_name = "Token"
        verbose_name_plural = "Tokens"


class Message(models.Model):
    author = models.ForeignKey(Member, on_delete=models.CASCADE, related_name="messages")
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message by {self.author.username} at {self.created_at}"

    class Meta:
        ordering = ['created_at']
        verbose_name = "Message"
        verbose_name_plural = "Messages"
