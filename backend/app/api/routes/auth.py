from fastapi import APIRouter, Depends, status

from app.api.deps import get_auth_service, get_current_user
from app.schemas.auth import AuthToken, UserCreate, UserLogin, UserPublic
from app.services.auth import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserPublic, status_code=status.HTTP_201_CREATED)
async def register(payload: UserCreate, auth_service: AuthService = Depends(get_auth_service)) -> UserPublic:
    return await auth_service.register(payload)


@router.post("/login", response_model=AuthToken)
async def login(payload: UserLogin, auth_service: AuthService = Depends(get_auth_service)) -> AuthToken:
    return await auth_service.login(payload)


@router.get("/me", response_model=UserPublic)
async def current_user(user: UserPublic = Depends(get_current_user)) -> UserPublic:
    return user
