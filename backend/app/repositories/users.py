from uuid import UUID

import asyncpg


class UserRepository:
    def __init__(self, connection: asyncpg.Connection) -> None:
        self.connection = connection

    async def create_user(self, name: str, email: str, password_hash: str) -> asyncpg.Record:
        return await self.connection.fetchrow(
            """
            INSERT INTO users (name, email, password_hash)
            VALUES ($1, $2, $3)
            RETURNING id, name, email, role, created_at
            """,
            name,
            email,
            password_hash,
        )

    async def get_by_email(self, email: str) -> asyncpg.Record | None:
        return await self.connection.fetchrow(
            """
            SELECT id, name, email, password_hash, role, created_at
            FROM users
            WHERE email = $1
            """,
            email,
        )

    async def get_by_id(self, user_id: UUID) -> asyncpg.Record | None:
        return await self.connection.fetchrow(
            """
            SELECT id, name, email, role, created_at
            FROM users
            WHERE id = $1
            """,
            user_id,
        )
