---
title: HKTIA Membership Portal API Reference

language_tabs: # must be one of https://git.io/vQNgJ
  - shell

toc_footers:
  - The system is in early development, all api structure listed in this document are not finalized. 

includes:
  - errors

search: true
---

# Introduction

This document outlines the API Endpoints used for authenticating and retrieving user related data.

Third party login are still in early development, and are not included in this document.

# Authentication

> To perform an authorized request, use this code:

```shell
# With shell, you can just pass the correct header with each request
curl "api_endpoint_here"
  -H "Authorization: Bearer access_token_here"
```

> Make sure to replace `access_token_here` with your access token.

Membership Portal uses authorization token to allow access to the API. You can request an access token using the API Endpoints below.

Membership Portal expects for the access token to be included in all API requests to the server in a header that looks like the following:

`Authorization: Bearer access_token_here`

<aside class="notice">
You must replace <code>access_token_here</code> with your personal access token.
</aside>

## Request Authorization Code

```shell
curl "http://example.com/oauth2/auth" \
  -X POST \
  -H "Content-Type: application/json" \
  -d @request.json
```

> In request.json:

```json
{
  "response_type": "code",
  "access_type": "offline",
  "client_id": "409605819262.apps.example.com",
  "device_id": "68753A44-4D6F-1226-9C60-0050E4C00067",
  "grant_type": "password",
  "username": "user01",
  "password": "password0123"
}
```

> The above command returns JSON structured like this:

```json
{
  "code": "4/tQECVk4xk-AJ_NWgawqL3KYIcvHZynXDGw5dk6I_ZnN7FrktsauTt9GJjTJkncINA_yA62P9Vdc9GR95uH84oOk",
  "scope": ""
}
```

This endpoint request an authorization code.

### HTTP Request

`POST /oauth2/auth`

### Request Body

Parameter | Type | Description
--------- | ---- | -----------
response_type | string | **Required**. The request response type. Currently only supports **code**.
access_type | string | **Required**. Indicates whether the application can refresh access tokens without providing client credentials. Valid parameters are **online** and **offline**.<br><br>Set the value to offline instructs the Membership authorization server to return a refresh token and an access token the first time your application exchanges an authorization code for tokens.
client_id | string | **Required**. The client id registered for the application.
device_id | string | **Optional**. Required if the client id is registered for an mobile application.
scope | string | **Optional**. Not supported.
grant_type | string | **Optional**. Currently only supports **password**. Specify whether the application uses traditional username and password, or an in-browser consent screen.<br><br>Valid parameters are **consent**, which is the default value, and **password**.
username | string | **Required** if grant_type is **password**.
password | string | **Required** if grant_type is **password**.
redirect_uri | string | **Required** if grant_type is **consent**.

### Response Body

Parameter | Type | Description
--------- | ---- | -----------
code | string | Authorization code for exchanging access token.
scope | string | Requested scope.
error | string | Present if authorization failed.

## Exchange Code for Token / Refresh Token

```shell
curl "http://example.com/oauth2/token" \
  -X POST \
  -H "Content-Type: application/json" \
  -d @request.json
```

> In request.json:

```json
{
  "code": "4/tQECVk4xk-AJ_NWgawqL3KYIcvHZynXDGw5dk6I7FrktsauT...",
  "client_id": "409605819262.apps.example.com",
  "device_id": "68753A44-4D6F-1226-9C60-0050E4C00067",
  "grant_type": "authorization_code"
}
```

> The above command returns JSON structured like this:

```json
{
  "access_token": "ya29.Il-xB8pDp2D1WTszc7SZ3MueWywlfp_t-t-if...",
  "scope": "",
  "expires_in": 3600,
  "token_type": "Bearer"
}
```

This endpoint exchanges authorization code for an access token.

### HTTP Request

`POST /oauth2/token`

### Request Body

Parameter | Type | Description
--------- | ---- | -----------
code | string | **Required** if grant_type is **authorization_code**. Authorization code from request token. Expires after one use.
refresh_token | string | **Required** if grant_type is **refresh_token**.
client_id | string | **Required**. The client id registered for the application.
device_id | string | **Optional**. Required if the client id is registered for an mobile application.
scope | string | **Optional**. Not supported.
grant_type | string | **Required**. Valid parameters are **authorization_code** and **refresh_token**.

### Response Body

Parameter | Type | Description
--------- | ---- | -----------
access_token | string | Access token for user related API Request.
token_type | string | Only possible value is **Bearer**.
expires_in | number | Expiration time in seconds.
refresh_token | string | Present if authorization code's access_type is offline. Long-lived token used for refreshing access token.
scope | string | Requested scope.
error_description | string | Present if exchange failed.
error | string | Present if exchange failed.

## Retrieve Token Information

```shell
curl -X "http://example.com/oauth2/tokeninfo?access_token=ya29.Il-xB8pDp2D1WTszc7SZ3..."
```

> The above command returns JSON structured like this:

```json
{
  "issued_to": "409605819262.apps.example.com",
  "audience": "409605819262.apps.example.com",
  "scope": "",
  "expires_in": 3000,
  "access_type": "offline"
}
```

Get meta information related to a token.

### HTTP Request

`GET http://example.com/oauth2/tokeninfo`

### Request Header

Parameter | Type | Description
--------- | ---- | -----------
Authorization | string | **Optional**. Not required if using query parameters.

### Query Parameters

Parameter | Type | Description
--------- | ---- | -----------
access_token | string | **Optional**. Not required if using request header.
client_id | string | **Optional**. Used for verifying a correct recipient in the response.

### Response Body

Parameter | Type | Description
--------- | ---- | -----------
issued_to | string | Client id associated with token.
audience | string | Client id associated with the token info request.
scope | string | Requested scope.
expires_in | number | Expiration time in seconds.
access_type | string | The access type associated with the token, can be **online** or **offline**.
error_description | string | Present if request failed.
error | string | Present if request failed.

