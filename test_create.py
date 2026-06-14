import requests

# 1. Login to get token
try:
    login_res = requests.post("http://localhost:8000/api/v1/auth/signin", json={"username":"admin", "password":"password"})
    print("Login:", login_res.status_code, login_res.text)
    token = login_res.json()["accessToken"]

    # 2. Try to create course
    headers = {"Authorization": f"Bearer {token}"}
    course_data = {
        "title": "erfg",
        "description": "fgfcxfnmdcx cef",
        "price": 0.0,
        "duration": "1.5",
        "thumbnailUrl": "https://...",
        "category": {"id": 1},
        "author": {"id": 2}
    }
    create_res = requests.post("http://localhost:8000/api/v1/sql/courses", json=course_data, headers=headers)
    print("Create Course:", create_res.status_code, create_res.text)
except Exception as e:
    print("Error:", e)
