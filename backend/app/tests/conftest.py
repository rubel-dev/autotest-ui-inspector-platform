from datetime import UTC, datetime
from uuid import UUID, uuid4

import pytest
from fastapi.testclient import TestClient

from app.api.deps import get_auth_service, get_current_user, get_project_service
from app.main import create_app
from app.schemas.auth import AuthToken, UserCreate, UserLogin, UserPublic
from app.schemas.common import PaginatedResponse, PaginationParams
from app.schemas.projects import ProjectCreate, ProjectDetail, ProjectListFilters, ProjectListItem, ProjectPublic, ProjectUpdate


class FakeAuthService:
    def __init__(self) -> None:
        self.user = UserPublic(
            id=UUID("11111111-1111-1111-1111-111111111111"),
            name="Rubel Ahmed",
            email="rubel@example.com",
            role="user",
            created_at=datetime.now(UTC),
        )
        self.registered_emails = {self.user.email}

    async def register(self, payload: UserCreate) -> UserPublic:
        return UserPublic(
            id=uuid4(),
            name=payload.name,
            email=payload.email.lower(),
            role="user",
            created_at=datetime.now(UTC),
        )

    async def login(self, payload: UserLogin) -> AuthToken:
        return AuthToken(access_token="test-token", user=self.user)

    async def get_current_user(self, user_id: UUID) -> UserPublic:
        return self.user


class FakeProjectService:
    def __init__(self, owner_id: UUID) -> None:
        now = datetime.now(UTC)
        self.owner_id = owner_id
        self.project_id = UUID("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1")
        self.projects = [
            ProjectListItem(
                id=self.project_id,
                owner_id=owner_id,
                name="Acme Marketing Site",
                base_url="https://acme.test/",
                description="Regression coverage",
                created_at=now,
                updated_at=now,
                page_count=2,
                element_count=5,
                test_case_count=3,
                run_count=7,
                last_run_status="passed",
            ),
            ProjectListItem(
                id=UUID("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2"),
                owner_id=owner_id,
                name="Northstar App",
                base_url="https://northstar.test/",
                description=None,
                created_at=now,
                updated_at=now,
                page_count=1,
                element_count=2,
                test_case_count=1,
                run_count=2,
                last_run_status="failed",
            ),
        ]

    async def create_project(self, owner_id: UUID, payload: ProjectCreate) -> ProjectPublic:
        return ProjectPublic(
            id=uuid4(),
            owner_id=owner_id,
            name=payload.name,
            base_url=str(payload.base_url),
            description=payload.description,
            created_at=datetime.now(UTC),
            updated_at=datetime.now(UTC),
        )

    async def list_projects(
        self,
        owner_id: UUID,
        pagination: PaginationParams,
        filters: ProjectListFilters,
    ) -> PaginatedResponse[ProjectListItem]:
        items = self.projects
        if filters.search:
            term = filters.search.lower()
            items = [project for project in items if term in project.name.lower() or term in project.base_url.lower()]
        page_items = items[pagination.offset : pagination.offset + pagination.page_size]
        return PaginatedResponse[ProjectListItem](
            items=page_items,
            page=pagination.page,
            page_size=pagination.page_size,
            total=len(items),
            has_next=pagination.offset + len(page_items) < len(items),
        )

    async def get_project(self, owner_id: UUID, project_id: UUID) -> ProjectDetail:
        project = next(item for item in self.projects if item.id == project_id)
        return ProjectDetail(**project.model_dump(), recent_activity_count=4)

    async def update_project(self, owner_id: UUID, project_id: UUID, payload: ProjectUpdate) -> ProjectPublic:
        project = next(item for item in self.projects if item.id == project_id)
        data = project.model_dump()
        if payload.name is not None:
            data["name"] = payload.name
        if payload.base_url is not None:
            data["base_url"] = str(payload.base_url)
        if "description" in payload.model_fields_set:
            data["description"] = payload.description
        return ProjectPublic(**{key: data[key] for key in ProjectPublic.model_fields})

    async def delete_project(self, owner_id: UUID, project_id: UUID) -> None:
        return None


@pytest.fixture
def current_user() -> UserPublic:
    return UserPublic(
        id=UUID("11111111-1111-1111-1111-111111111111"),
        name="Rubel Ahmed",
        email="rubel@example.com",
        role="user",
        created_at=datetime.now(UTC),
    )


@pytest.fixture
def client(current_user: UserPublic) -> TestClient:
    app = create_app(use_lifespan=False)
    auth_service = FakeAuthService()
    project_service = FakeProjectService(current_user.id)

    async def override_current_user() -> UserPublic:
        return current_user

    async def override_auth_service() -> FakeAuthService:
        return auth_service

    async def override_project_service() -> FakeProjectService:
        return project_service

    app.dependency_overrides[get_current_user] = override_current_user
    app.dependency_overrides[get_auth_service] = override_auth_service
    app.dependency_overrides[get_project_service] = override_project_service

    with TestClient(app) as test_client:
        yield test_client
