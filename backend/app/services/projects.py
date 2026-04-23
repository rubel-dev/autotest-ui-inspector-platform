from uuid import UUID

import asyncpg

from app.core.errors import ConflictError, NotFoundError
from app.repositories.projects import ProjectRepository
from app.schemas.common import PaginatedResponse, PaginationParams
from app.schemas.projects import ProjectCreate, ProjectDetail, ProjectListFilters, ProjectListItem, ProjectPublic, ProjectUpdate


class ProjectService:
    def __init__(self, projects: ProjectRepository) -> None:
        self.projects = projects

    async def create_project(self, owner_id: UUID, payload: ProjectCreate) -> ProjectPublic:
        try:
            row = await self.projects.create_project(
                owner_id=owner_id,
                name=payload.name,
                base_url=str(payload.base_url),
                description=payload.description,
            )
        except asyncpg.UniqueViolationError as exc:
            raise ConflictError("PROJECT_NAME_EXISTS", "A project with this name already exists.") from exc

        return ProjectPublic.model_validate(dict(row))

    async def list_projects(
        self,
        owner_id: UUID,
        pagination: PaginationParams,
        filters: ProjectListFilters,
    ) -> PaginatedResponse[ProjectListItem]:
        sort_by = filters.sort_by if filters.sort_by in self.projects.sort_columns else "created_at"
        sort_dir = "asc" if filters.sort_dir.lower() == "asc" else "desc"
        total = await self.projects.count_projects(owner_id, filters.search)
        rows = await self.projects.list_projects(
            owner_id=owner_id,
            page_size=pagination.page_size,
            offset=pagination.offset,
            search=filters.search,
            sort_by=sort_by,
            sort_dir=sort_dir,
        )
        items = [ProjectListItem.model_validate(dict(row)) for row in rows]
        return PaginatedResponse[ProjectListItem](
            items=items,
            page=pagination.page,
            page_size=pagination.page_size,
            total=total,
            has_next=pagination.offset + len(items) < total,
        )

    async def get_project(self, owner_id: UUID, project_id: UUID) -> ProjectDetail:
        row = await self.projects.get_project_detail(owner_id, project_id)
        if row is None:
            raise NotFoundError("PROJECT_NOT_FOUND", "Project was not found.")
        return ProjectDetail.model_validate(dict(row))

    async def update_project(self, owner_id: UUID, project_id: UUID, payload: ProjectUpdate) -> ProjectPublic:
        updates: dict[str, str | None] = {}
        if "name" in payload.model_fields_set:
            updates["name"] = payload.name
        if "base_url" in payload.model_fields_set:
            updates["base_url"] = str(payload.base_url) if payload.base_url is not None else None
        if "description" in payload.model_fields_set:
            updates["description"] = payload.description

        try:
            row = await self.projects.update_project(owner_id, project_id, updates)
        except asyncpg.UniqueViolationError as exc:
            raise ConflictError("PROJECT_NAME_EXISTS", "A project with this name already exists.") from exc

        if row is None:
            raise NotFoundError("PROJECT_NOT_FOUND", "Project was not found.")
        return ProjectPublic.model_validate(dict(row))

    async def delete_project(self, owner_id: UUID, project_id: UUID) -> None:
        deleted = await self.projects.delete_project(owner_id, project_id)
        if not deleted:
            raise NotFoundError("PROJECT_NOT_FOUND", "Project was not found.")
