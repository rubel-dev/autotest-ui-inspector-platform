def test_create_project(client):
    response = client.post(
        "/api/v1/projects",
        json={
            "name": "Docs Portal",
            "base_url": "https://docs.example.test",
            "description": "Docs regression suite",
        },
    )

    assert response.status_code == 201
    body = response.json()
    assert body["name"] == "Docs Portal"
    assert body["base_url"] == "https://docs.example.test/"


def test_list_projects_supports_search_and_pagination(client):
    response = client.get("/api/v1/projects?search=acme&page=1&page_size=10")

    assert response.status_code == 200
    body = response.json()
    assert body["total"] == 1
    assert body["has_next"] is False
    assert body["items"][0]["name"] == "Acme Marketing Site"
    assert body["items"][0]["page_count"] == 2


def test_get_project_detail(client):
    response = client.get("/api/v1/projects/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1")

    assert response.status_code == 200
    body = response.json()
    assert body["id"] == "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1"
    assert body["recent_activity_count"] == 4


def test_update_project(client):
    response = client.patch(
        "/api/v1/projects/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1",
        json={"name": "Acme Growth Site", "description": None},
    )

    assert response.status_code == 200
    body = response.json()
    assert body["name"] == "Acme Growth Site"
    assert body["description"] is None


def test_delete_project(client):
    response = client.delete("/api/v1/projects/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1")

    assert response.status_code == 204
    assert response.content == b""


def test_project_base_url_validation(client):
    response = client.post(
        "/api/v1/projects",
        json={
            "name": "Bad URL",
            "base_url": "ftp://example.test",
            "description": "Should fail validation",
        },
    )

    assert response.status_code == 422
    assert response.json()["detail"]["code"] == "VALIDATION_ERROR"
