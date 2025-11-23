from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from .models import Token, Member


class TokenAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        
        if not auth_header:
            return None
        
        try:
            token_key = auth_header.split(' ')[1] if ' ' in auth_header else auth_header
        except IndexError:
            raise AuthenticationFailed('Invalid token header')
        
        try:
            token = Token.objects.select_related('member').get(key=token_key)
            return (token.member, token)
        except Token.DoesNotExist:
            raise AuthenticationFailed('Invalid token')