from datetime import datetime
from uuid import UUID

from pydantic import AnyHttpUrl, BaseModel, Field, field_validator


class ProjectBase(BaseModel):
    name: str = Field(min_length=2, max_length=160)
    base_url: AnyHttpUrl
    description: str | None = Field(default=None, max_length=1000)

    @field_validator("name")
    @classmethod
    def normalize_name(cls, value: str) -> str:
        return " ".join(value.strip().split())

    @field_validator("description")
    @classmethod
    def normalize_description(cls, value: str | None) -> str | None:
        if value is None:
            return None
        normalized = value.strip()
        return normalized or None


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=160)
    base_url: AnyHttpUrl | None = None
    description: str | None = Field(default=None, max_length=1000)

    @field_validator("name")
    @classmethod
    def normalize_name(cls, value: str | None) -> str | None:
        if value is None:
            return None
        return " ".join(value.strip().split())

    @field_validator("description")
    @classmethod
    def normalize_description(cls, value: str | None) -> str | None:
        if value is None:
            return None
        normalized = value.strip()
        return normalized or None


class ProjectPublic(BaseModel):
    id: UUID
    owner_id: UUID
    name: str
    base_url: str
    description: str | None
    created_at: datetime
    updated_at: datetime


class ProjectListItem(ProjectPublic):
    page_count: int = 0
    element_count: int = 0
    test_case_count: int = 0
    run_count: int = 0
    last_run_status: str | None = None


class ProjectDetail(ProjectListItem):
    recent_activity_count: int = 0


class ProjectListFilters(BaseModel):
    search: str | None = Field(default=None, max_length=120)
    sort_by: str = "created_at"
    sort_dir: str = "desc"

    @field_validator("search")
    @classmethod
    def normalize_search(cls, value: str | None) -> str | None:
        if value is None:
            return None
        normalized = value.strip()
        return normalized or None
