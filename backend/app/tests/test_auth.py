def test_register_returns_created_user(client):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "name": "New Tester",
            "email": "new.tester@example.com",
            "password": "strong-password",
        },
    )

    assert response.status_code == 201
    body = response.json()
    assert body["name"] == "New Tester"
    assert body["email"] == "new.tester@example.com"
    assert body["role"] == "user"
    assert "id" in body


def test_register_validates_password_length(client):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "name": "New Tester",
            "email": "new.tester@example.com",
            "password": "short",
        },
    )

    assert response.status_code == 422
    assert response.json()["detail"]["code"] == "VALIDATION_ERROR"


def test_login_returns_token_and_user(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "rubel@example.com", "password": "strong-password"},
    )

    assert response.status_code == 200
    body = response.json()
    assert body["access_token"] == "test-token"
    assert body["token_type"] == "bearer"
    assert body["user"]["email"] == "rubel@example.com"


def test_me_returns_current_user(client):
    response = client.get("/api/v1/auth/me")

    assert response.status_code == 200
    assert response.json()["email"] == "rubel@example.com"
