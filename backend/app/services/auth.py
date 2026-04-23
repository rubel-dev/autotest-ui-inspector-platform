from uuid import UUID

import asyncpg

from app.core.errors import AuthenticationError, ConflictError
from app.core.security import create_access_token, hash_password, verify_password
from app.repositories.users import UserRepository
from app.schemas.auth import AuthToken, UserCreate, UserLogin, UserPublic


class AuthService:
    def __init__(self, users: UserRepository) -> None:
        self.users = users

    async def register(self, payload: UserCreate) -> UserPublic:
        email = payload.email.lower()
        password_hash = hash_password(payload.password)

        try:
            row = await self.users.create_user(payload.name, email, password_hash)
        except asyncpg.UniqueViolationError as exc:
            raise ConflictError("EMAIL_ALREADY_REGISTERED", "An account with this email already exists.") from exc

        return UserPublic.model_validate(dict(row))

    async def login(self, payload: UserLogin) -> AuthToken:
        email = payload.email.lower()
        row = await self.users.get_by_email(email)
        if row is None or not verify_password(payload.password, row["password_hash"]):
            raise AuthenticationError("Invalid email or password.")

        user = UserPublic.model_validate(dict(row))
        token = create_access_token(user.id, user.email, user.role)
        return AuthToken(access_token=token, user=user)

    async def get_current_user(self, user_id: UUID) -> UserPublic:
        row = await self.users.get_by_id(user_id)
        if row is None:
            raise AuthenticationError("Authenticated user no longer exists.")
        return UserPublic.model_validate(dict(row))
