# API endpoints

## Authentication

### Register

```bash
POST /v1/auth/register
```

Payload example:

```json
{
    "username": "John Doe",
    "email": "johndoe@example.com",
    "password": "10402070"
}
```

### Log in

```bash
POST /v1/auth/login
```

Payload example:

```json
{
    "username": "John Doe",
    "email": "johndoe@example.com",
}
```
