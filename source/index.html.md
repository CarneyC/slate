---
title: HKTIA Membership Portal API Reference

language_tabs: # must be one of https://git.io/vQNgJ
  - shell

includes:
  - errors
  
toc_footers:
  - Updated on Nov 25, 2019

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

## Request Access Token with Password

> To request an access token with password, use this snippet:

```shell
curl "https://example.com/oauth/auth" \
  -X POST \
  -H "Content-Type: application/json" \
  -d @request.json
```

> In request.json:

```json
{
  "grant_type": "password",
  "client_id": "1",
  "client_secret": "MdZ8td76bKbornqkjfKGshSO3a8YG3DYZBGFThcU",
  "username": "kate_chan@example.com",
  "password": "yourStrong(!)Password"
}
```

> The above command returns JSON structured like this:

```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJh...",
  "token_type": "Bearer",
  "expires_in": 3708799
}
```

This endpoint issue an access token for first party application, using username and password credentials.

### HTTP Request

`POST /oauth/auth`

### Request Body

Parameter | Type | Description
--------- | ---- | -----------
grant_type | string | **Required**. Specify whether the application uses traditional username and password, or third party idp.<br><br>Valid parameters are **password**, and **identity**.
client_id | string | **Required**. The client id registered for the application.
client_secret | string | **Required**. The client secret registered for the application.
username | string | **Required** if grant_type is **password**.
password | string | **Required** if grant_type is **password**.

### Response Body

Parameter | Type | Description
--------- | ---- | -----------
access_token | string | Access token.
token_type | string | Token Type. Only **Bearer** is available.
expires_in | string | Expiration time in seconds.

## Request Access Token with Third Party Identity Token

> To request an access token with third party identity token, use this snippet:

```shell
curl "https://example.com/oauth/auth" \
  -X POST \
  -H "Content-Type: application/json" \
  -d @request.json
```

> In request.json:

```json
{
  "grant_type": "identity",
  "client_id": "1",
  "client_secret": "MdZ8td76bKbornqkjfKGshSO3a8YG3DYZBGFThcU",
  "identity": {
    "provider": "facebook",
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJh..."
    "third_party_id": "2981827904",
    "meta": {...} // Third Party Meta Infomation
  }
}
```

> The above command returns JSON structured like this:

```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJh...",
  "token_type": "Bearer",
  "expires_in": 3708799
}
```

This endpoint issue an access token with an provided third party identity token.

### HTTP Request

`POST /oauth/auth`

### Request Body

Parameter | Type | Description
--------- | ---- | -----------
grant_type | string | **Required**. Specify whether the application uses traditional username and password, or third party idp.<br><br>Valid parameters are **password**, and **identity**.
client_id | string | **Required**. The client id registered for the application.
client_secret | string | **Required**. The client secret registered for the application.
`identity.provider` | string | **Required** if grant_type is **identity**. The identity provider id, valid value are **facebook**, **google** and **theclub**.
`identity.access_token` | string | **Required** if grant_type is **identity**. Access token acquired from third party idp.
`identity.third_party_id` | string | **Required** if grant_type is **identity**. Access token associated with third party idp.
`identity.meta` | object | **Optional** if grant_type is **identity**. Meta data from third party idp.

### Response Body

Parameter | Type | Description
--------- | ---- | -----------
access_token | string | Access token.
token_type | string | Token Type. Only **Bearer** is available.
expires_in | string | Expiration time in seconds.

## Request Token Info

> To get token info, use this code:

```shell
curl "https://example.com/oauth/tokeninfo" \
  -X GET \
  -H "Authorization: Bearer ya29.Il-xB8pDp2D1WTszc7SZ3..."
```

> The above command returns JSON structured like this:

```json
{
  "expires_in": 3000
}
```

Get meta information related to a token.

### HTTP Request

`GET /oauth/tokeninfo`

### Request Header

Parameter | Type | Description
--------- | ---- | -----------
Authorization | string | **Required**

### Response Body

Parameter | Type | Description
--------- | ---- | -----------
expires_in | number | Expiration time in seconds.

## Revoke Token Logout

> To revoke a token, use this code:

```shell
curl "https://example.com/oauth/revoke" \
  -X POST \
  -H "Authorization: Bearer ya29.Il-xB8pDp2D1WTszc7SZ3..."
```

Revoke an existing token.

### HTTP Request

`GET /oauth/revoke`

### Request Header

Parameter | Type | Description
--------- | ---- | -----------
Authorization | string | **Required**

### Response Body

<aside class="notice">
This request has no response body.
</aside>

# Account Management

## Registration

> To register a new user, use this code:

```shell
curl "https://example.com/oauth/register" \
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

Create a new user.

### HTTP Request

`POST /oauth/register`

### Request Body

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
password_confirmation | string | **Required**. The user's password confirmation.

### Response Body

<aside class="notice">
This request has no response body.
</aside>

## Update User Password

> To update a existing user's password, use this code:

```shell
curl "https://example.com/oauth/update" \
  -X POST \
  -H "Authorization: Bearer ya29.Il-xB8pDp2D1WTszc7SZ3..." \
  -d @request.json
```

> In request.json:

```json
{
  "password": {
    "old": "12345678",
    "new": "25846901",
    "new_confirmation": "25846901"
  }
}
```

Update a existing user's password.

### HTTP Request

`POST /oauth/update`

### Request Header

Parameter | Type | Description
--------- | ---- | -----------
Authorization | string | **Required**. Access token for identifying the user.

### Request Body

Parameter | Type | Description
--------- | ---- | -----------
password | object | **Required**. Holds the password info of the user.
`password.old` | string | **Required**. Password currently in-used.
`password.new` | string | **Required**. A new password to change to.
`password.new_confirmation` | string | **Required**. Confirmation for the new password.

### Response Body

<aside class="notice">
This request has no response body.
</aside>

## Update User's Phone

> To update a existing user's phone, use this code:

```shell
curl "https://example.com/oauth/update" \
  -X POST \
  -H "Authorization: Bearer ya29.Il-xB8pDp2D1WTszc7SZ3..." \
  -d @request.json
```

> In request.json:

```json
{
  "phone": {
    "country_code": "81",
    "value": "98456788"
  }
}
```

> After Providing an OTP:

```shell
curl "https://example.com/oauth/update" \
  -X POST \
  -H "Authorization: Bearer ya29.Il-xB8pDp2D1WTszc7SZ3..." \
  -d @request.json
```

> In request.json:

```json
{
  "phone": {
    "country_code": "81",
    "value": "98456788",
    "verification_code": "4865"
  }
}
```

Update a existing user's phone.

### HTTP Request

`POST /oauth/update`

<aside class="notice">
This operation requires two consecutive request.
<br>
The first request will trigger a one-time-password to be sent to the new contact number provided. An error will be thrown if a daily sms limit has been reached.
<br>
For the changes to be committed. A second request should be sent, with the original payload and the provided otp. 
</aside>

### Request Header

Parameter | Type | Description
--------- | ---- | -----------
Authorization | string | **Required**. Access token for identifying the user.

### Request Body

Parameter | Type | Description
--------- | ---- | -----------
phone | object | **Required**. Holds the contact number info of the user
`phone.country_code` | string | **Optional**. The country code associated with the user's email. Default to **852** if not specified.
`phone.value` | string | **Required**. The user's contact number
`phone.verification_code` | string | **Optional**. The verification code for the new contact no.

### Response Body

<aside class="notice">
This request has no response body.
</aside>

# User Profile

## Retrieve User Info

> To get an user's profile information, use this code:

```shell
curl "https://example.com/oauth/userinfo" \
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
  "identities": [
    // Third Party Metadata
    { ... },
    { ... },
    { ... }
  ]
}
```

Get user profile information.

### HTTP Request

`GET /oauth/userinfo`

### Request Header

Parameter | Type | Description
--------- | ---- | -----------
Authorization | string | **Required**

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
identities | object[] | List of Third Party Identity Provider.

# Third Party Identity Providers

## Link Third Party Identity

> To link with a Third Party Identity Provider, use this code:

```shell
curl "https://example.com/oauth/link" \
  -X POST \
  -H "Authorization: Bearer ya29.Il-xB8pDp2D1WTszc7SZ3..." \
  -H "Content-Type: application/json" \
  -d @request.json
```

> In request.json:

```json
{
  "client_id": "1",
  "client_secret": "MdZ8td76bKbornqkjfKGshSO3a8YG3DYZBGFThcU",
  "identity": {
    "provider": "facebook",
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJh..."
    "third_party_id": "2981827904",
    "meta": {...} // Third Party Meta Infomation
  }
}
```

This endpoint links an existing account with a third party identity provider.

### HTTP Request

`POST /oauth/link`

### Request Header

Parameter | Type | Description
--------- | ---- | -----------
Authorization | string | **Required**

### Request Body

Parameter | Type | Description
--------- | ---- | -----------
client_id | string | **Required**. The client id registered for the application.
client_secret | string | **Required**. The client secret registered for the application.
`identity.provider` | string | **Required** if grant_type is **identity**. The identity provider id, valid value are **facebook**, **google** and **theclub**.
`identity.access_token` | string | **Required** if grant_type is **identity**. Access token acquired from third party idp.
`identity.third_party_id` | string | **Required** if grant_type is **identity**. Access token associated with third party idp.
`identity.meta` | object | **Optional** if grant_type is **identity**. Meta data from third party idp.

### Response Body

<aside class="notice">
This request has no response body.
</aside>

## Remove Third Party Identity

> To remove a link with Third Party Identity Provider, use this code:

```shell
curl "https://example.com/oauth/unlink" \
  -X POST \
  -H "Authorization: Bearer ya29.Il-xB8pDp2D1WTszc7SZ3..." \
  -H "Content-Type: application/json" \
  -d @request.json
```

> In request.json:

```json
{
  "client_id": "1",
  "client_secret": "MdZ8td76bKbornqkjfKGshSO3a8YG3DYZBGFThcU",
  "identity": {
    "provider": "facebook"
  }
}
```

This endpoint removes an existing account's link with a third party identity provider.

### HTTP Request

`POST /oauth/unlink`

### Request Header

Parameter | Type | Description
--------- | ---- | -----------
Authorization | string | **Required**

### Request Body

Parameter | Type | Description
--------- | ---- | -----------
client_id | string | **Required**. The client id registered for the application.
client_secret | string | **Required**. The client secret registered for the application.
`identity.provider` | string | **Required** if grant_type is **identity**. The identity provider id, valid value are **facebook**, **google** and **theclub**.

### Response Body

<aside class="notice">
This request has no response body.
</aside>
