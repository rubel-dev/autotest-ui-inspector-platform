from uuid import UUID

import asyncpg


PROJECT_COLUMNS = """
    p.id,
    p.owner_id,
    p.name,
    p.base_url,
    p.description,
    p.created_at,
    p.updated_at
"""


class ProjectRepository:
    sort_columns = {
        "created_at": "p.created_at",
        "updated_at": "p.updated_at",
        "name": "p.name",
        "test_case_count": "COALESCE(tcs.test_case_count, 0)",
        "run_count": "COALESCE(rs.run_count, 0)",
    }

    def __init__(self, connection: asyncpg.Connection) -> None:
        self.connection = connection

    async def create_project(
        self,
        owner_id: UUID,
        name: str,
        base_url: str,
        description: str | None,
    ) -> asyncpg.Record:
        return await self.connection.fetchrow(
            f"""
            INSERT INTO projects (owner_id, name, base_url, description)
            VALUES ($1, $2, $3, $4)
            RETURNING {PROJECT_COLUMNS.replace("p.", "")}
            """,
            owner_id,
            name,
            base_url,
            description,
        )

    async def count_projects(self, owner_id: UUID, search: str | None) -> int:
        params: list[object] = [owner_id]
        where = ["owner_id = $1"]
        if search:
            params.append(f"%{search.lower()}%")
            where.append(f"(lower(name) LIKE ${len(params)} OR lower(base_url) LIKE ${len(params)})")

        row = await self.connection.fetchrow(
            f"""
            SELECT count(*) AS total
            FROM projects
            WHERE {" AND ".join(where)}
            """,
            *params,
        )
        return int(row["total"])

    async def list_projects(
        self,
        owner_id: UUID,
        page_size: int,
        offset: int,
        search: str | None,
        sort_by: str,
        sort_dir: str,
    ) -> list[asyncpg.Record]:
        params: list[object] = [owner_id]
        where = ["p.owner_id = $1"]
        if search:
            params.append(f"%{search.lower()}%")
            where.append(f"(lower(p.name) LIKE ${len(params)} OR lower(p.base_url) LIKE ${len(params)})")

        params.extend([page_size, offset])
        limit_placeholder = f"${len(params) - 1}"
        offset_placeholder = f"${len(params)}"
        order_column = self.sort_columns.get(sort_by, self.sort_columns["created_at"])
        direction = "ASC" if sort_dir.lower() == "asc" else "DESC"

        return await self.connection.fetch(
            f"""
            WITH page_stats AS (
                SELECT project_id, count(*)::int AS page_count
                FROM project_pages
                GROUP BY project_id
            ),
            element_stats AS (
                SELECT project_id, count(*)::int AS element_count
                FROM ui_elements
                GROUP BY project_id
            ),
            test_case_stats AS (
                SELECT project_id, count(*)::int AS test_case_count
                FROM test_cases
                GROUP BY project_id
            ),
            run_stats AS (
                SELECT project_id, count(*)::int AS run_count
                FROM test_runs
                GROUP BY project_id
            ),
            latest_runs AS (
                SELECT DISTINCT ON (project_id)
                    project_id,
                    status AS last_run_status
                FROM test_runs
                ORDER BY project_id, created_at DESC
            )
            SELECT
                {PROJECT_COLUMNS},
                COALESCE(ps.page_count, 0) AS page_count,
                COALESCE(es.element_count, 0) AS element_count,
                COALESCE(tcs.test_case_count, 0) AS test_case_count,
                COALESCE(rs.run_count, 0) AS run_count,
                lr.last_run_status
            FROM projects p
            LEFT JOIN page_stats ps ON ps.project_id = p.id
            LEFT JOIN element_stats es ON es.project_id = p.id
            LEFT JOIN test_case_stats tcs ON tcs.project_id = p.id
            LEFT JOIN run_stats rs ON rs.project_id = p.id
            LEFT JOIN latest_runs lr ON lr.project_id = p.id
            WHERE {" AND ".join(where)}
            ORDER BY {order_column} {direction}, p.id ASC
            LIMIT {limit_placeholder} OFFSET {offset_placeholder}
            """,
            *params,
        )

    async def get_project_detail(self, owner_id: UUID, project_id: UUID) -> asyncpg.Record | None:
        return await self.connection.fetchrow(
            f"""
            WITH latest_run AS (
                SELECT status
                FROM test_runs
                WHERE project_id = $2
                ORDER BY created_at DESC
                LIMIT 1
            )
            SELECT
                {PROJECT_COLUMNS},
                (SELECT count(*)::int FROM project_pages WHERE project_id = p.id) AS page_count,
                (SELECT count(*)::int FROM ui_elements WHERE project_id = p.id) AS element_count,
                (SELECT count(*)::int FROM test_cases WHERE project_id = p.id) AS test_case_count,
                (SELECT count(*)::int FROM test_runs WHERE project_id = p.id) AS run_count,
                (SELECT status FROM latest_run) AS last_run_status,
                (SELECT count(*)::int FROM activity_logs WHERE project_id = p.id) AS recent_activity_count
            FROM projects p
            WHERE p.owner_id = $1
              AND p.id = $2
            """,
            owner_id,
            project_id,
        )

    async def update_project(
        self,
        owner_id: UUID,
        project_id: UUID,
        updates: dict[str, str | None],
    ) -> asyncpg.Record | None:
        allowed_fields = {"name", "base_url", "description"}
        assignments: list[str] = []
        params: list[object] = [owner_id, project_id]

        for field, value in updates.items():
            if field not in allowed_fields:
                continue
            params.append(value)
            assignments.append(f"{field} = ${len(params)}")

        if not assignments:
            return await self.get_project_detail(owner_id, project_id)

        return await self.connection.fetchrow(
            f"""
            UPDATE projects
            SET
                {", ".join(assignments)},
                updated_at = now()
            WHERE owner_id = $1
              AND id = $2
            RETURNING id, owner_id, name, base_url, description, created_at, updated_at
            """,
            *params,
        )

    async def delete_project(self, owner_id: UUID, project_id: UUID) -> bool:
        result = await self.connection.execute(
            """
            DELETE FROM projects
            WHERE owner_id = $1
              AND id = $2
            """,
            owner_id,
            project_id,
        )
        return result == "DELETE 1"
