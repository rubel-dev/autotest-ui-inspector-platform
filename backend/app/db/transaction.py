from collections.abc import Awaitable, Callable
from typing import TypeVar

import asyncpg

T = TypeVar("T")


async def run_in_transaction(
    connection: asyncpg.Connection,
    operation: Callable[[asyncpg.Connection], Awaitable[T]],
) -> T:
    async with connection.transaction():
        return await operation(connection)
