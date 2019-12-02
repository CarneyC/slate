---
title: HKTIA Membership Portal API Reference

language_tabs: # must be one of https://git.io/vQNgJ
  - shell

includes:
  - errors
  
toc_footers:
  - Updated on Nov 26, 2019

search: true
---

# Introduction

This document outlines the API Endpoints used for authenticating and retrieving user related data. Third party login are still in early development, and are not included in this document.

# Authentication

> To perform an authorized request, use this code:

```shell
# With shell, you can just pass the correct header with each request
curl "api_endpoint_here"
  -H "Authorization: Bearer access_token_here"
```

> If an invalid or expired token is provided, the `401 Unauthorized` status code is returned:

```json
{
  "message": "Unauthenticated."
}
```

Membership Portal uses authorization token to allow access to the API. You can request an access token using the API Endpoints below.

The system expects for the access token to be included in all non-authentication API requests to the server in a header that looks like the following:

`Authorization: Bearer access_token_here`

<aside class="notice">
You must replace <code>access_token_here</code> with your access token.
</aside>

## Password Grant

> To request an access token with password, use this snippet:

```shell
curl "https://membership-hktcare.webssup.com/oauth/token" \
  -X POST \
  -H "Content-Type: application/json" \
  -d @request.json
```

> In request.json:

```json
{
  "grant_type": "password",
  "client_id": "1100df6e-65c2-405b-aa18-4751d1c820e8",
  "client_secret": "MdZ8td76bKbornqkjfKGshSO3a8YG3DYZBGFThcU",
  "username": "kate_chan@example.com",
  "password": "yourStrong(!)Password"
}
```

> The above command returns JSON structured like this:

```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJh...",
  "refresh_token": "def50200831c0bf69f010244d2d381a2209e409b...",
  "token_type": "Bearer",
  "expires_in": 3708799
}
```

This endpoint issue an access token for first party application, using username and password credentials.

### HTTP Request

`POST /oauth/token`

### Request Body

Parameter | Type | Description
--------- | ---- | -----------
grant_type | string | **Required**. Should be set to **password**. Valid parameters are **refresh_token**, **password** and **identity**.
client_id | string | **Required**. The client id registered for the application.
client_secret | string | **Required**. The client secret registered for the application.
username | string | **Required**
password | string | **Required**

### Response Body

Parameter | Type | Description
--------- | ---- | -----------
access_token | string | Access token.
refresh_token | string | Refresh token. Expires after one use.
token_type | string | Token Type. Only **Bearer** is available.
expires_in | string | Expiration time in seconds.

## Third Party Identity Grant

> To request an access token with third party identity token, use this snippet:

```shell
curl "https://membership-hktcare.webssup.com/oauth/token" \
  -X POST \
  -H "Content-Type: application/json" \
  -d @request.json
```

> In request.json:

```json
{
  "grant_type": "identity",
  "client_id": "1100df6e-65c2-405b-aa18-4751d1c820e8",
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
  "refresh_token": "def50200831c0bf69f010244d2d381a2209e409b...",
  "token_type": "Bearer",
  "expires_in": 3708799
}
```

This endpoint issue an access token with an provided third party identity token.

### HTTP Request

`POST /oauth/token`

### Request Body

Parameter | Type | Description
--------- | ---- | -----------
grant_type | string | **Required**. Should be set to **identity**. Valid parameters are **refresh_token**, **password** and **identity**.
client_id | string | **Required**. The client id registered for the application.
client_secret | string | **Required**. The client secret registered for the application.
`identity.provider` | string | **Required**. The identity provider id, valid value are **facebook**, **google** and **theclub**.
`identity.access_token` | string | **Required**. Access token acquired from third party identity provider.
`identity.third_party_id` | string | **Required**. The user id from third party identity provider.
`identity.meta` | object | **Optional**. Meta data from third party idp.

### Response Body

Parameter | Type | Description
--------- | ---- | -----------
access_token | string | Access token.
refresh_token | string | Refresh token. Expires after one use.
token_type | string | Token Type. Only **Bearer** is available.
expires_in | string | Expiration time in seconds.

## Refresh Token

> To request a refreshed access token, use this snippet:

```shell
curl "https://membership-hktcare.webssup.com/oauth/token" \
  -X POST \
  -H "Content-Type: application/json" \
  -d @request.json
```

> In request.json:

```json
{
  "grant_type": "refresh_token",
  "client_id": "1100df6e-65c2-405b-aa18-4751d1c820e8",
  "client_secret": "MdZ8td76bKbornqkjfKGshSO3a8YG3DYZBGFThcU",
  "refresh_token": "def50200fb9ac80073fb02c4a2da735a0ad15ee1..."
}
```

> The above command returns JSON structured like this:

```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJh...",
  "refresh_token": "def50200831c0bf69f010244d2d381a2209e409b...",
  "token_type": "Bearer",
  "expires_in": 3708799
}
```

This endpoint issues a new access token with a given refresh token

<aside class="warning">
This action revokes the provided <strong>refresh token</strong> and the <strong>access token</strong> associated with it.
</aside>

### HTTP Request

`POST /oauth/token`

### Request Body

Parameter | Type | Description
--------- | ---- | -----------
grant_type | string | **Required**. Should be set to **refresh_token**. Valid parameters are **refresh_token**, **password** and **identity**.
client_id | string | **Required**. The client id registered for the application.
client_secret | string | **Required**. The client secret registered for the application.
refresh_token | string | **Required**

### Response Body

Parameter | Type | Description
--------- | ---- | -----------
access_token | string | Access token.
refresh_token | string | Refresh token. Expires after one use.
token_type | string | Token Type. Only **Bearer** is available.
expires_in | string | Expiration time in seconds.

## Token Verification

> To get token info, use this code:

```shell
curl "https://membership-hktcare.webssup.com/oauth/tokeninfo" \
  -X GET \
  -H "Authorization: Bearer ya29.Il-xB8pDp2D1WTszc7SZ3..."
```

> The above command returns JSON structured like this with a 200 status code:

```json
{
  "token_type": "Bearer",
  "expires_in": 3000
}
```

> If an invalid or expired token is provided, the `401 Unauthorized` status code is returned:

```json
{
  "message": "Unauthenticated."
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
token_type | string | Token Type. Only **Bearer** is available.
expires_in | number | Expiration time in seconds.

<aside class="warning">
A <strong>401 Unauthorized</strong> response is returned if the token included is expired, revoked or otherwise invalid.
</aside>

## Revoke Token 

> To revoke a token, use this code:

```shell
curl "https://membership-hktcare.webssup.com/oauth/revoke" \
  -X POST \
  -H "Authorization: Bearer ya29.Il-xB8pDp2D1WTszc7SZ3..."
```

Revoke an existing access token and its associated refresh token.

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
curl "https://membership-hktcare.webssup.com/oauth/register" \
  -X POST \
  -d @request.json
```

> In request.json:

```json
{
  "client_id": "1100df6e-65c2-405b-aa18-4751d1c820e8",
  "client_secret": "MdZ8td76bKbornqkjfKGshSO3a8YG3DYZBGFThcU",
  "title": "ms",
  "given_name": "Kate",
  "family_name": "Chan",
  "hkid": "A1234567",
  "email": {
    "address": "kate_chan@example.com"
  },
  "phone": {
    "value": "91234567",
    "verification_code": "8642"
  },
  "password": "yourStrong(!)Password",
  "password_confirmation": "yourStrong(!)Password",
}
```

Create a new user.

### HTTP Request

`POST /oauth/register`

<aside class="notice">
A verification code must be provided. To trigger the verification code process, use the <a href="verify-phone">Verify Phone</a> endpoint.
</aside>


### Request Body

Parameter | Type | Description
--------- | ---- | -----------
client_id | string | **Required**. The client id registered for the application.
client_secret | string | **Required**. The client secret registered for the application.
title | string | **Required**. The user's title, valid parameters are **mr** and **ms**.
given_name | string | **Required**. The user's first name.
family_name | string | **Required**. The user's last name.
hkid | string | **Required**. The user's HKID.
email | object | **Required**. Holds the email info of the user
`email.address` | string | **Required**. The user's email address
phone | object | **Required**. Holds the contact number info of the user
`phone.value` | string | **Required**. The user's contact number
`phone.verification_code` | string | **Required**. The verification code sent by <a href="verify-phone">Verify Phone</a>.
password | string | **Required**. The user's password.
password_confirmation | string | **Required**. The user's password confirmation.

### Response Body

<aside class="notice">
This request has no response body.
</aside>

## Update Profile

> To update a existing user's password, use this code:

```shell
curl "https://membership-hktcare.webssup.com/oauth/update" \
  -X POST \
  -H "Authorization: Bearer ya29.Il-xB8pDp2D1WTszc7SZ3..." \
  -d @request.json
```

> In request.json:

```json
{
  "update_type": "profile",
  "given_name": "Kate",
  "family_name": "Chan",
  "receive_promotions": false
}
```

Update a existing user's profile.

### HTTP Request

`POST /oauth/update`

### Request Header

Parameter | Type | Description
--------- | ---- | -----------
Authorization | string | **Required**. Access token for identifying the user.

### Request Body

Parameter | Type | Description
--------- | ---- | -----------
update_type | string | **Required**. Should be set to **profile**. Valid parameters are **password**, **phone** and **profile**.
given_name | string | **Optional**. The user's first name.
family_name | string | **Optional**. The user's last name.
receive_promotions | string | **Optional**. Indicates where the user should receive promotional materials.

### Response Body

<aside class="notice">
This request has no response body.
</aside>

## Update Password

> To update a existing user's password, use this code:

```shell
curl "https://membership-hktcare.webssup.com/oauth/update" \
  -X POST \
  -H "Authorization: Bearer ya29.Il-xB8pDp2D1WTszc7SZ3..." \
  -d @request.json
```

> In request.json:

```json
{
  "update_type": "password",
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
update_type | string | **Required**. Should be set to **password**. Valid parameters are **password**, **phone** and **profile**.
password | object | **Required**. Holds the password info of the user.
`password.old` | string | **Required**. Password currently in-used.
`password.new` | string | **Required**. A new password to change to.
`password.new_confirmation` | string | **Required**. Confirmation for the new password.

### Response Body

<aside class="notice">
This request has no response body.
</aside>

## Update Phone

> To update a existing user's phone, use this code:

```shell
curl "https://membership-hktcare.webssup.com/oauth/update" \
  -X POST \
  -H "Authorization: Bearer ya29.Il-xB8pDp2D1WTszc7SZ3..." \
  -d @request.json
```

> In request.json:

```json
{
  "update_type": "phone",
  "phone": {
    "value": "98456788"
  }
}
```

> After Providing a verification code:

```shell
curl "https://membership-hktcare.webssup.com/oauth/update" \
  -X POST \
  -H "Authorization: Bearer ya29.Il-xB8pDp2D1WTszc7SZ3..." \
  -d @request.json
```

> In request.json:

```json
{
  "update_type": "phone",
  "phone": {
    "value": "98456788",
    "verification_code": "4865"
  }
}
```

Update a existing user's phone.

### HTTP Request

`POST /oauth/update`

<aside class="notice">
Calling this API endpoint without providing a verification code will trigger a code to be sent to the given phone number.
<br>
The verification code can also be triggered using <a href="verify-phone">Verify Phone</a> endpoint.
<br>
For the changes to be committed. A request should be sent with the verification code and the original payload. 
</aside>

### Request Header

Parameter | Type | Description
--------- | ---- | -----------
Authorization | string | **Required**. Access token for identifying the user.

### Request Body

Parameter | Type | Description
--------- | ---- | -----------
update_type | string | **Required**. Should be set to **password**. Valid parameters are **password**, **phone** and **profile**.
phone | object | **Required**. Holds the contact number info of the user
`phone.value` | string | **Required**. The user's contact number
`phone.verification_code` | string | **Optional**. The verification code for the new contact no.

### Response Body

<aside class="notice">
This request has no response body.
</aside>


## Verify Phone

> To trigger a verification to be sent, use this code:

```shell
curl "https://membership-hktcare.webssup.com/oauth/verify" \
  -X POST \
  -d @request.json
```

> In request.json:

```json
{
  "client_id": "1100df6e-65c2-405b-aa18-4751d1c820e8",
  "client_secret": "MdZ8td76bKbornqkjfKGshSO3a8YG3DYZBGFThcU",
  "verification_type": "phone",
  "phone": {
    "value": "98456788"
  }
}
```

Request a verification code.

### HTTP Request

`POST /oauth/verify`

### Request Body

Parameter | Type | Description
--------- | ---- | -----------
client_id | string | **Required**. The client id registered for the application.
client_secret | string | **Required**. The client secret registered for the application.
verification_type | string | **Required**. Should be set to **phone**. Valid parameters are **phone** and **email**.
phone | object | **Required**. Holds the contact number info of the user
`phone.value` | string | **Required**. The user's contact number

### Response Body

<aside class="notice">
This request has no response body.
</aside>

# User Profile

## Retrieve User Info

> To get an user's profile information, use this code:

```shell
curl "https://membership-hktcare.webssup.com/oauth/userinfo" \
  -X GET \
  -H "Authorization: Bearer ya29.Il-xB8pDp2D1WTszc7SZ3..."
```

> The above command returns JSON structured like this:

```json
{
  "title": "ms",
  "given_name": "Kate",
  "family_name": "Chan",
  "hkid": "A1234567",
  "email": {
    "address": "kate_chan@example.com",
    "verified": true
  },
  "phone": {
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
title | string | The user's title, valid parameters are **mr** and **ms**.
given_name | string | The user's first name.
family_name | string | The user's last name.
hkid | string | The user's HKID.
email | object | Holds the email info of the user
`email.address` | string | The user's email address
`email.verified` | boolean | Indicates if the user-supplied email address has been verified.
phone | object | Holds the contact number info of the user
`phone.value` | string | The user's contact number
`phone.verified` | boolean | Indicates if the user-supplied contact number has been verified.
receive_promotion | boolean | Whether the user opted-out of promotional materials.
identities | object[] | List of Third Party Identity Provider.

## Update User

<aside class="notice">
Refer to the <a href="#update-profile">Account Management Section</a>.
</aside>

# Third Party Identity Providers

## Link Third Party Identity

> To link with a Third Party Identity Provider, use this code:

```shell
curl "https://membership-hktcare.webssup.com/oauth/link" \
  -X POST \
  -H "Authorization: Bearer ya29.Il-xB8pDp2D1WTszc7SZ3..." \
  -H "Content-Type: application/json" \
  -d @request.json
```

> In request.json:

```json
{
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
`identity.provider` | string | **Required**. The identity provider id, valid value are **facebook**, **google** and **theclub**.
`identity.access_token` | string | **Required**. Access token acquired from third party idp.
`identity.third_party_id` | string | **Required**. Access token associated with third party idp.
`identity.meta` | object | **Optional**. Meta data from third party idp.

### Response Body

<aside class="notice">
This request has no response body.
</aside>

## Remove Third Party Identity

> To remove a link with Third Party Identity Provider, use this code:

```shell
curl "https://membership-hktcare.webssup.com/oauth/unlink" \
  -X POST \
  -H "Authorization: Bearer ya29.Il-xB8pDp2D1WTszc7SZ3..." \
  -H "Content-Type: application/json" \
  -d @request.json
```

> In request.json:

```json
{
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
`identity.provider` | string | **Required**. The identity provider id, valid value are **facebook**, **google** and **theclub**.

### Response Body

<aside class="notice">
This request has no response body.
</aside>


# Server-side API

## Authorization

> To request an access token with client credential, use this snippet:

```shell
curl "https://membership-hktcare.webssup.com/oauth/token" \
  -X POST \
  -H "Content-Type: application/json" \
  -d @request.json
```

> In request.json:

```json
{
  "grant_type": "client_credentials",
  "client_id": "1100df6e-65c2-405b-aa18-4751d1c820e8",
  "client_secret": "MdZ8td76bKbornqkjfKGshSO3a8YG3DYZBGFThcU"
}
```

> The above command returns JSON structured like this:

```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJh...",
  "refresh_token": "def50200831c0bf69f010244d2d381a2209e409b...",
  "token_type": "Bearer",
  "expires_in": 3708799
}
```

This endpoint issue an access token for server-side application.

### HTTP Request

`POST /oauth/token`

### Request Body

Parameter | Type | Description
--------- | ---- | -----------
grant_type | string | **Required**. Should be set to **client_credentials**. Valid parameters are **refresh_token**, **password** and **identity**.
client_id | string | **Required**. The client id registered for the application.
client_secret | string | **Required**. The client secret registered for the application.

### Response Body

Parameter | Type | Description
--------- | ---- | -----------
access_token | string | Access token.
token_type | string | Token Type. Only **Bearer** is available.
expires_in | string | Expiration time in seconds.

## List Paginated Users

> To list 5 users sorted by given name in descending order at page 2, use this code:

```shell
curl "https://membership-hktcare.webssup.com/oauth/list?limit=5&page=2&sort_by=given_name&order=desc" \
  -X GET \
  -H "Authorization: Bearer ya29.Il-xB8pDp2D1WTszc7SZ3..."
```

> The above command returns JSON structured like this:

```json
{
    "items": [
        {
            "uuid": "b6a225c0-37d4-4fc3-b6fc-0973b483055b",
            "title": "ms",
            "family_name": "chan",
            "given_name": "mandy",
            "hkid": "A1234567",
            "email": {
                "address": "user@example.com",
                "verified": false
            },
            "phone": {
                "value": "98764821",
                "verifed_at": null,
                "verified": false
            },
            "identities": [...]
        },
        {...},
        {...},
        {...},
        {...}
    ],
    "total": 121,
    "current_page": 2,
    "last_page": 24
}
```

List users with pagination.

### HTTP Request

`GET /oauth/list`

### Request Header

Parameter | Type | Description
--------- | ---- | -----------
Authorization | string | **Required**

### Query Parameters

Parameter | Type | Description
--------- | ---- | -----------
limit | number | **Required**. Item per page.
page | number | **Optional**. The page to be fetched, default to 1.
sort_by | string | **Optional**. Column to sort by, valid value are **created_at**, which is the default value, **updated_at**, **given_name** and **family_name**.
order | string | **Optional**. Valid value are **asc** and **desc**.

### Response Body

Parameter | Type | Description
--------- | ---- | -----------
items | user[] | User entities. Refer to <a href="#retrieve-user-info">User Info</a> section for the structure.
total | number | Total number of user records.
current_page | number | Current page.
last_page | number | Total number of page.

## Impersonate User

> To impersonate a user, use this code:

```shell
curl "https://membership-hktcare.webssup.com/impersonate/b511c586-7d37-40a2-a6ac-54edce386cf9" \
  -X GET \
  -H "Authorization: Bearer ya29.Il-xB8pDp2D1WTszc7SZ3..."
```

> The above command returns JSON structured like this:

```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJh...",
  "token_type": "Bearer",
  "expires_in": 3708799
}
```

Impersonate a user.

### HTTP Request

`GET /oauth/impersonate/:uuid`

<aside class="notice">
To access user related info, see <a href="#retreive-user-info">User Info</a> and <a href="#update-profile">Update Profile</a>.<br>
The access token granted has elevated scope. And can update user profile without verification code being provided.
</aside>

### Request Header

Parameter | Type | Description
--------- | ---- | -----------
Authorization | string | **Required**

### Path Parameters

Parameter | Type | Description
--------- | ---- | -----------
uuid | string | **Required**. User to impersonate.

### Response Body

Parameter | Type | Description
--------- | ---- | -----------
access_token | string | Access token.
token_type | string | Token Type. Only **Bearer** is available.
expires_in | string | Expiration time in seconds.
