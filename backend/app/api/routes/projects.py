from uuid import UUID

from fastapi import APIRouter, Depends, Query, Response, status

from app.api.deps import get_current_user, get_project_service
from app.schemas.auth import UserPublic
from app.schemas.common import PaginatedResponse, PaginationParams
from app.schemas.projects import ProjectCreate, ProjectDetail, ProjectListFilters, ProjectListItem, ProjectPublic, ProjectUpdate
from app.services.projects import ProjectService

router = APIRouter(prefix="/projects", tags=["projects"])


@router.post("", response_model=ProjectPublic, status_code=status.HTTP_201_CREATED)
async def create_project(
    payload: ProjectCreate,
    current_user: UserPublic = Depends(get_current_user),
    project_service: ProjectService = Depends(get_project_service),
) -> ProjectPublic:
    return await project_service.create_project(current_user.id, payload)


@router.get("", response_model=PaginatedResponse[ProjectListItem])
async def list_projects(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    search: str | None = Query(default=None, max_length=120),
    sort_by: str = Query(default="created_at"),
    sort_dir: str = Query(default="desc"),
    current_user: UserPublic = Depends(get_current_user),
    project_service: ProjectService = Depends(get_project_service),
) -> PaginatedResponse[ProjectListItem]:
    return await project_service.list_projects(
        owner_id=current_user.id,
        pagination=PaginationParams(page=page, page_size=page_size),
        filters=ProjectListFilters(search=search, sort_by=sort_by, sort_dir=sort_dir),
    )


@router.get("/{project_id}", response_model=ProjectDetail)
async def get_project(
    project_id: UUID,
    current_user: UserPublic = Depends(get_current_user),
    project_service: ProjectService = Depends(get_project_service),
) -> ProjectDetail:
    return await project_service.get_project(current_user.id, project_id)


@router.patch("/{project_id}", response_model=ProjectPublic)
async def update_project(
    project_id: UUID,
    payload: ProjectUpdate,
    current_user: UserPublic = Depends(get_current_user),
    project_service: ProjectService = Depends(get_project_service),
) -> ProjectPublic:
    return await project_service.update_project(current_user.id, project_id, payload)


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: UUID,
    current_user: UserPublic = Depends(get_current_user),
    project_service: ProjectService = Depends(get_project_service),
) -> Response:
    await project_service.delete_project(current_user.id, project_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
