---
title: HKTIA Membership Portal API Reference

language_tabs: # must be one of https://git.io/vQNgJ
  - shell

includes:
  - errors

search: true
---

# Introduction

This document outlines the API Endpoints used for authenticating and retrieving user related data. Third party login are still in early development, and are not included in this document.

<aside class="warning">
  The system is in early development, the API Endpoints listed in this document are not finalized. 
</aside>

# Authentication

> To perform an authorized request, use this code:

```shell
# With shell, you can just pass the correct header with each request
curl "api_endpoint_here"
  -H "Authorization: Bearer access_token_here"
```

> Make sure to replace `access_token_here` with your access token.

Membership Portal uses authorization token to allow access to the API. You can request an access token using the API Endpoints below.

The system expects for the access token to be included in all non-authentication API requests to the server in a header that looks like the following:

`Authorization: Bearer access_token_here`

<aside class="notice">
You must replace <code>access_token_here</code> with your access token.
</aside>

## Request Authorization Code

```shell
curl "https://example.com/oauth2/auth" \
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
  "username": "kate_chan@example.com",
  "password": "yourStrong(!)Password"
}
```

> The above command returns JSON structured like this:

```json
{
  "code": "4/tQECVk4xk-AJ_NWgawqL3KYIcvHZynXDGw5dk6I_ZnN7FrktsauTt9GJjTJkncINA_yA62P9Vdc9GR95uH84oOk",
  "scope": ""
}
```

This endpoint request an authorization code that expires after one use.

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

## Exchange Code for Token / Refresh Token

```shell
curl "https://example.com/oauth2/token" \
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

## Retrieve Token Information

```shell
curl "https://example.com/oauth2/tokeninfo" \
  -X GET \
  -H "Authorization: Bearer ya29.Il-xB8pDp2D1WTszc7SZ3..."
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

`GET /oauth2/tokeninfo`

### Request Header

Parameter | Type | Description
--------- | ---- | -----------
Authorization | string | **Required** if not using **query parameters**.

### Query Parameters

Parameter | Type | Description
--------- | ---- | -----------
access_token | string | **Required** if using not **request header**.
client_id | string | **Optional**. Used for verifying a correct recipient in the response.

### Response Body

Parameter | Type | Description
--------- | ---- | -----------
issued_to | string | Client id associated with token.
audience | string | Client id associated with the token info request.
scope | string | Requested scope.
expires_in | number | Expiration time in seconds.
access_type | string | The access type associated with the token, can be **online** or **offline**.

## Logout existing Tokens

```shell
curl "https://example.com/oauth2/logout" \
  -X GET \
  -H "Authorization: Bearer ya29.Il-xB8pDp2D1WTszc7SZ3..."
```

Invalid an access token and its associated refresh token.

<aside class="warning">
It is recommended to avoid implementing the function to explicitly invalidate access tokens. This functionality adds moderate overhead to the authentication process.
<br><br>
The logout logic can be handled by frontend application. Simply removing the tokens from internal storage is sufficiently secure.
</aside>

### HTTP Request

`GET /oauth2/logout`

### Request Header

Parameter | Type | Description
--------- | ---- | -----------
Authorization | string | **Required** if not using **query parameters**.

### Query Parameters

Parameter | Type | Description
--------- | ---- | -----------
access_token | string | **Required** if using not **request header**.
client_id | string | **Optional**. Used for verifying a correct recipient in the response.

### Response Body

<aside class="notice">
This request has no response body.
</aside>

# Account Management

## Registration

```shell
curl "https://example.com/oauth2/user/register" \
  -X POST \
  -d @request.json
```

> In request.json:

```json
{
  "name": {
    "family_name": "Chan",
    "given_name": "Kate",
    "full_name": "Kate Chan"
  },
  "email": {
    "address": "kate_chan@example.com"
  },
  "phone": {
    "value": "91234567"
  },
  "password": "yourStrong(!)Password"
}
```

> The above command returns JSON structured like this:

```json
{
  "name": {
    "family_name": "Chan",
    "given_name": "Kate",
    "full_name": "Kate Chan"
  },
  "email": {
    "address": "kate_chan@example.com",
    "verified": false
  },
  "phone": {
    "country_code": "852",
    "value": "91234567",
    "verified": false
  },
  "receive_promotion": true,
  "third_part_idp": []
}
```

Create a new user.

<aside class="warning">
The User Registration API is prone to <strong>structural changes</strong>.
</aside>

### HTTP Request

`POST /oauth2/user/register`

### Request Header

Parameter | Type | Description
--------- | ---- | -----------
Authorization | string | **Required** if not using **query parameters**.

### Query Parameters

Parameter | Type | Description
--------- | ---- | -----------
name | object | **Required**. Holds the names of the user
`name.family_name` | string | **Required**. The user's last name.
`name.given_name` | string | **Required**. The user's first name.
email | object | **Required**. Holds the email info of the user
`email.address` | string | **Required**. The user's email address
phone | object | **Required**. Holds the contact number info of the user
`phone.country_code` | string | **Optional**. The country code associated with the user's email. Default to **852** if not specified.
`phone.value` | string | **Required**. The user's contact number
password | string | **Required**. The user's password.

<aside class="notice">
Password confirmation matches should be handled by frontend logic.
</aside>

### Response Body

On a successful request, the created user profile is returned.

Parameter | Type | Description
--------- | ---- | -----------
name | object | Holds the names of the user
`name.family_name` | string | The user's last name.
`name.given_name` | string | The user's first name.
`name.full_name` | string | The user's full name.
email | object | Holds the email info of the user
`email.address` | string | The user's email address
`email.verified` | boolean | Indicates if the user-supplied email address has been verified.
phone | object | Holds the contact number info of the user
`phone.country_code` | string | The country code associated with the user's email.
`phone.value` | string | The user's contact number
`phone.verified` | boolean | Indicates if the user-supplied contact number has been verified.
receive_promotion | boolean | Whether the user opted-out of promotional materials.
third_party_idp | object[] | List of third party Identity Provider.

## Update

```shell
curl "https://example.com/oauth2/user/update" \
  -X POST \
  -H "Authorization: Bearer ya29.Il-xB8pDp2D1WTszc7SZ3..." \
  -d @request.json
```

> In request.json:

```json
{
  "email": {
    "address": "katie_chan@example.com"
  },
  "phone": {
    "country_code": "61",
    "value": "(02) 9876 5432"
  },
  "receive_promotion": false
}
```

> The above command returns JSON structured like this:

```json
{
  "name": {
    "family_name": "Chan",
    "given_name": "Kate",
    "full_name": "Kate Chan"
  },
  "email": {
    "address": "katie_chan@example.com",
    "verified": false
  },
  "phone": {
    "country_code": "61",
    "value": "(02) 9876 5432",
    "verified": false
  },
  "receive_promotion": false,
  "third_part_idp": []
}
```

Create a new user.

<aside class="warning">
The User Update API is prone to <strong>structural changes</strong>.
</aside>

### HTTP Request

`POST /oauth2/user/update`

### Request Header

Parameter | Type | Description
--------- | ---- | -----------
Authorization | string | **Required** if not using **query parameters**.

### Query Parameters

Parameter | Type | Description
--------- | ---- | -----------
name | object | **Required**. Holds the names of the user
`name.family_name` | string | **Required**. The user's last name.
`name.given_name` | string | **Required**. The user's first name.
email | object | **Required**. Holds the email info of the user
`email.address` | string | **Required**. The user's email address
phone | object | **Required**. Holds the contact number info of the user
`phone.country_code` | string | **Optional**. The country code associated with the user's email. Default to **852** if not specified.
`phone.value` | string | **Required**. The user's contact number

<aside class="notice">
Option to change password will be added in the future.
</aside>

### Response Body

On a successful request, the created user profile is returned.

Parameter | Type | Description
--------- | ---- | -----------
name | object | Holds the names of the user
`name.family_name` | string | The user's last name.
`name.given_name` | string | The user's first name.
`name.full_name` | string | The user's full name.
email | object | Holds the email info of the user
`email.address` | string | The user's email address
`email.verified` | boolean | Indicates if the user-supplied email address has been verified.
phone | object | Holds the contact number info of the user
`phone.country_code` | string | The country code associated with the user's email.
`phone.value` | string | The user's contact number
`phone.verified` | boolean | Indicates if the user-supplied contact number has been verified.
receive_promotion | boolean | Whether the user opted-out of promotional materials.
third_party_idp | object[] | List of third party Identity Provider.

# User Profile

## Retrieve User Info

```shell
curl "https://example.com/oauth2/tokeninfo" \
  -X GET \
  -H "Authorization: Bearer ya29.Il-xB8pDp2D1WTszc7SZ3..."
```

> The above command returns JSON structured like this:

```json
{
  "name": {
    "family_name": "Chan",
    "given_name": "Kate",
    "full_name": "Kate Chan"
  },
  "email": {
    "address": "kate_chan@example.com",
    "verified": true
  },
  "phone": {
    "country_code": "852",
    "value": "91234567",
    "verified": true
  },
  "receive_promotion": false,
  "third_part_idp": [
    // Third Party Metadata
    { ... },
    { ... },
    { ... }
  ]
}
```

Get user profile information.

<aside class="warning">
The User Info API is prone to <strong>structural changes</strong>.
</aside>

### HTTP Request

`GET /oauth2/userinfo`

### Request Header

Parameter | Type | Description
--------- | ---- | -----------
Authorization | string | **Required** if not using **query parameters**.

### Query Parameters

Parameter | Type | Description
--------- | ---- | -----------
access_token | string | **Required** if using not **request header**.
client_id | string | **Optional**. Used for verifying a correct recipient in the response.

### Response Body

Parameter | Type | Description
--------- | ---- | -----------
name | object | Holds the names of the user
`name.family_name` | string | The user's last name.
`name.given_name` | string | The user's first name.
`name.full_name` | string | The user's full name.
email | object | Holds the email info of the user
`email.address` | string | The user's email address
`email.verified` | boolean | Indicates if the user-supplied email address has been verified.
phone | object | Holds the contact number info of the user
`phone.country_code` | string | The country code associated with the user's email.
`phone.value` | string | The user's contact number
`phone.verified` | boolean | Indicates if the user-supplied contact number has been verified.
receive_promotion | boolean | Whether the user opted-out of promotional materials.
third_party_idp | object[] | List of third party Identity Provider.

# Third Party Identity Providers

Due to the module heavily relying on the base authentication and user info modules. Third Party IdP support is planned to be added after the basic functionality of the system has been developed to a testable stage.

The following API Endpoints will be implemented:
```
Link Third Party Accounts
Unlink Third Party Accounts
```

<aside class="notice">
Coming Soon
</aside>

