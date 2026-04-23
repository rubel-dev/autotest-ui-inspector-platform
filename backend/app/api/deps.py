from collections.abc import AsyncIterator
from uuid import UUID

import asyncpg
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer

from app.core.errors import AuthenticationError
from app.core.security import decode_access_token
from app.db.connection import acquire_connection
from app.repositories.projects import ProjectRepository
from app.repositories.users import UserRepository
from app.schemas.auth import UserPublic
from app.services.auth import AuthService
from app.services.projects import ProjectService

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


async def get_connection() -> AsyncIterator[asyncpg.Connection]:
    async with acquire_connection() as connection:
        yield connection


async def get_user_repository(connection: asyncpg.Connection = Depends(get_connection)) -> UserRepository:
    return UserRepository(connection)


async def get_project_repository(connection: asyncpg.Connection = Depends(get_connection)) -> ProjectRepository:
    return ProjectRepository(connection)


async def get_auth_service(users: UserRepository = Depends(get_user_repository)) -> AuthService:
    return AuthService(users)


async def get_project_service(projects: ProjectRepository = Depends(get_project_repository)) -> ProjectService:
    return ProjectService(projects)


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    auth_service: AuthService = Depends(get_auth_service),
) -> UserPublic:
    payload = decode_access_token(token)
    try:
        user_id = UUID(payload["sub"])
    except (KeyError, ValueError) as exc:
        raise AuthenticationError("Invalid access token payload.") from exc
    return await auth_service.get_current_user(user_id)
