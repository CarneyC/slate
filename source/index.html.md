---
title: HKTIA Membership Portal API Reference

language_tabs: # must be one of https://git.io/vQNgJ
  - shell

includes:
  - errors
  
toc_footers:
  - Updated on Dec 16, 2019

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
  "recaptcha_token": "VskklmcAiwfs-gEhU...",
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
recaptcha_token | string | **Optional**. Must be provided if recaptcha is enabled.
username | string | **Required**
password | string | **Required**

### Response Body

Parameter | Type | Description
--------- | ---- | -----------
access_token | string | Access token.
refresh_token | string | Refresh token. Expires after one use.
token_type | string | Token Type. Only **Bearer** is available.
expires_in | string | Expiration time in seconds.

## Identity Grant

<aside class="notice">
See <a href="#third-party-identity-grant">Third Party Identity Grant</a>.
</aside>

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
Authorization | string | **Required**. Must be follow the format ``Bearer access_token``

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

`POST /oauth/revoke`

### Request Header

Parameter | Type | Description
--------- | ---- | -----------
Authorization | string | **Required**. Must be follow the format ``Bearer access_token``

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
  "recaptcha_token": "VskklmcAiwfs-gEhU...",
  "title": "ms",
  "given_name": "Kate",
  "family_name": "Chan",
  "birthday": "1992-07-11",
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

<aside class="notice">
A verification code must be provided. To trigger the verification code process, use the <a href="#request-verification">Request Verification</a> endpoint.
</aside>

### HTTP Request

`POST /oauth/register`

### Request Body

Parameter | Type | Description
--------- | ---- | -----------
client_id | string | **Required**. The client id registered for the application.
client_secret | string | **Required**. The client secret registered for the application.
recaptcha_token | string | **Optional**. Must be provided if recaptcha is enabled.
title | string | **Required**. The user's title, valid parameters are **mr**, **ms** and **miss**.
given_name | string | **Required**. The user's first name.
family_name | string | **Required**. The user's last name.
birthday | string | **Required**. The user's date of birth, must be in **YYYY-MM-DD** format.
hkid | string | **Required**. The user's HKID. All letters must be converted to upper-case.
email | object | **Required**. Holds the email info of the user
`email.address` | string | **Required**. The user's email address
phone | object | **Required**. Holds the contact number info of the user
`phone.value` | string | **Required**. The user's contact number
`phone.verification_code` | string | **Required**. The verification code sent by <a href="#request-verification">Request Verification</a>.
password | string | **Required**. The user's password.
password_confirmation | string | **Required**. The user's password confirmation.

### Response Body

<aside class="notice">
This request has no response body.
</aside>

## Reset Password

> To update a existing user's password with a reset code, use this code:

```shell
curl "https://membership-hktcare.webssup.com/oauth/reset" \
  -X POST \
  -d @request.json
```

> In request.json for Password Reset via Email:

```json
{
  "reset_type": "password",
  "client_id": "1100df6e-65c2-405b-aa18-4751d1c820e8",
  "client_secret": "MdZ8td76bKbornqkjfKGshSO3a8YG3DYZBGFThcU",
  "email": {
    "address": "janice.chan@gmail.com"
  },
  "password": {
    "verification_code": "847240",
    "new": "HkT2942",
    "new_confirmation": "HkT2942"
  }
}
```

> In request.json for Password Reset via Phone:

```json
{
  "reset_type": "password",
  "client_id": "1100df6e-65c2-405b-aa18-4751d1c820e8",
  "client_secret": "MdZ8td76bKbornqkjfKGshSO3a8YG3DYZBGFThcU",
  "hkid": "A1234567",
  "phone": {
    "value": "98765432"
  },
  "password": {
    "verification_code": "847240",
    "new": "HkT2942",
    "new_confirmation": "HkT2942"
  }
}
```

Update a existing user's password with a verification code.

<aside class="notice">
A verification code must be provided. To trigger the verification code process, use the <a href="#request-verification">Request Verification</a> endpoint.
</aside>

### HTTP Request

`POST /oauth/reset`

### Request Body

Parameter | Type | Description
--------- | ---- | -----------
reset_type | string | **Required**. Should be set to **password**. 
client_id | string | **Required**. The client id registered for the application.
client_secret | string | **Required**. The client secret registered for the application.
email | object | **Optional**. Holds the email info of the user
`email.address` | string | **Optional**. The user's email address
hkid | string | **Required** if resetting via text message.
phone | object | **Optional**. Holds the contact number info of the user
`phone.value` | string | **Optional**. The user's contact number
`password.new` | string | **Optional**. A new password to change to.
`password.new_confirmation` | string | **Optional**. Confirmation for the new password.
`password.verification_code` | string | **Optional**. Verification Code.

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
  "receive_promotions": false
}
```

Update a existing user's profile.

### HTTP Request

`POST /oauth/update`

### Request Header

Parameter | Type | Description
--------- | ---- | -----------
Authorization | string | **Required**. Must be follow the format ``Bearer access_token``

### Request Body

Parameter | Type | Description
--------- | ---- | -----------
update_type | string | **Required**. Should be set to **profile**. 
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
Authorization | string | **Required**. Must be follow the format ``Bearer access_token``

### Request Body

Parameter | Type | Description
--------- | ---- | -----------
update_type | string | **Required**. Should be set to **password**. 
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
    "value": "98456788",
    "verification_code": "4295"
  }
}
```

Update a existing user's phone.

<aside class="notice">
A verification code must be provided. To trigger the verification code process, use the <a href="#request-verification">Request Verification</a> endpoint.
</aside>

### HTTP Request

`POST /oauth/update`

### Request Header

Parameter | Type | Description
--------- | ---- | -----------
Authorization | string | **Required**. Must be follow the format ``Bearer access_token``

### Request Body

Parameter | Type | Description
--------- | ---- | -----------
update_type | string | **Required**. Should be set to **password**. 
phone | object | **Required**. Holds the contact number info of the user
`phone.value` | string | **Required**. The user's contact number
`phone.verification_code` | string | **Required**. The verification code for the new contact no.

### Response Body

<aside class="notice">
This request has no response body.
</aside>

# Verifications

## Request Verification

> To trigger a verification to be sent, use this code:

```shell
curl "https://membership-hktcare.webssup.com/oauth/verify/request?lang=en" \
  -X POST \
  -d @request.json
```

> For updating phone, in request.json:

```json
{
  "client_id": "1100df6e-65c2-405b-aa18-4751d1c820e8",
  "client_secret": "MdZ8td76bKbornqkjfKGshSO3a8YG3DYZBGFThcU",
  "recaptcha_token": "VskklmcAiwfs-gEhU...",
  "verification_type": "update_phone",
  "phone": {
    "value": "98456788"
  }
}
```

> Or for resetting password, in request.json:

```json
{
  "client_id": "1100df6e-65c2-405b-aa18-4751d1c820e8",
  "client_secret": "MdZ8td76bKbornqkjfKGshSO3a8YG3DYZBGFThcU",
  "recaptcha_token": "VskklmcAiwfs-gEhU...",
  "verification_type": "reset_password",
  "email": {
    "address": "eva.so@gmail.com"
  }
}
```

Request a verification code.

### HTTP Request

`POST /oauth/verify/request`

### Query Parameters

Parameter | Type | Description
--------- | ---- | -----------
lang | string | **Optional**. Language to generate error message / notifications in. Valid parameters are **en**, which is the default value, and **zh**.

### Request Body

Parameter | Type | Description
--------- | ---- | -----------
client_id | string | **Required**. The client id registered for the application.
client_secret | string | **Required**. The client secret registered for the application.
recaptcha_token | string | **Optional**. Must be provided if recaptcha is enabled.
verification_type | string | **Required**. Valid parameters are **update_phone** and **reset_password**.
email | object | **Required** if verification_type is **reset_password**. Holds the email info of the user
`email.address` | string |  **Required**. The user's email address
hkid | object | **Required** if verification_type is **reset_password** via text message. Holds the HKID of the user
phone | object | **Required** if verification_type is **update_phone** or **reset_password** via text message. Holds the contact number info of the user
`phone.value` | string | **Required**. The user's contact number

### Response Body

<aside class="notice">
This request has no response body.
</aside>

## Retrieve Verification Status

> To verify a verification code, use this code:

```shell
curl "https://membership-hktcare.webssup.com/oauth/verify" \
  -X POST \
  -d @request.json
```

> In request.json:

```json
{
  "verification_type": "update_phone",
  "phone": {
    "value": "98456788",
    "verification_code": "8764"
  }
}
```

> The above command returns JSON structured like this:

```json
{
  "expires_in": 30
}
```

Verify a verification code.

### HTTP Request

`POST /oauth/verify`

### Request Body

Parameter | Type | Description
--------- | ---- | -----------
verification_type | string | **Required**. Only **update_phone** is supported.
phone | object | **Required**. Holds the contact number info of the user
`phone.value` | string | **Required**. The user's contact number
`phone.verification_cdoe` | string | **Required**. Verification Code.

### Response Body

Parameter | Type | Description
--------- | ---- | -----------
expires_in | number | Expiration time in seconds.

<aside class="warning">
A <strong>400 Bad Request</strong> is returned if the given verification code is invalid.
</aside>


# User Profile

## Retrieve Basic User Profile

> To get an user's profile information, use this code:

```shell
curl "https://membership-hktcare.webssup.com/oauth/me" \
  -X GET \
  -H "Authorization: Bearer ya29.Il-xB8pDp2D1WTszc7SZ3..."
```

> The above command returns JSON structured like this:

```json
{
  "uuid": "432eaa8f-7790-49e0-be9f-38b35726922c",
  "title": "ms",
  "given_name": "Kate",
  "family_name": "Chan",
  "theclub_points": null
}
```

Get basic user information.

### HTTP Request

`GET /oauth/me`

### Request Header

Parameter | Type | Description
--------- | ---- | -----------
Authorization | string | **Required**. Must be follow the format ``Bearer access_token``

### Response Body

Parameter | Type | Description
--------- | ---- | -----------
uuid | string | UUID used for accessing individual vas entry.
title | string | The user's title, valid parameters are **mr**, **ms** and **miss**.
given_name | string | The user's first name.
family_name | string | The user's last name.
theclub_points | int | TheClub point balance, default to **null** if TheClub has not been linked or TheClub server cannot be reached.

## Retrieve Complete User Profile

> To get an user's profile information, use this code:

```shell
curl "https://membership-hktcare.webssup.com/oauth/userinfo" \
  -X GET \
  -H "Authorization: Bearer ya29.Il-xB8pDp2D1WTszc7SZ3..."
```

> The above command returns JSON structured like this:

```json
{
  "uuid": "432eaa8f-7790-49e0-be9f-38b35726922c",
  "title": "ms",
  "given_name": "Kate",
  "family_name": "Chan",
  "birthday": "1992-07-11",
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
  "theclub_points": null,
  "identities": [
    // Third Party Metadata
    {
       "provider": "facebook",
       "username": "Kate Chan"
    },    
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
Authorization | string | **Required**. Must be follow the format ``Bearer access_token``

### Response Body

Parameter | Type | Description
--------- | ---- | -----------
uuid | string | UUID used for accessing individual vas entry.
title | string | The user's title, valid parameters are **mr**, **ms** and **miss**.
given_name | string | The user's first name.
family_name | string | The user's last name.
birthday | string | The user's date of birth, in **YYYY-MM-DD** format.
hkid | string | The user's HKID.
email | object | Holds the email info of the user
`email.address` | string | The user's email address
`email.verified` | boolean | Indicates if the user-supplied email address has been verified.
phone | object | Holds the contact number info of the user
`phone.value` | string | The user's contact number
`phone.verified` | boolean | Indicates if the user-supplied contact number has been verified.
receive_promotion | boolean | Whether the user opted-out of promotional materials.
theclub_points | int | TheClub point balance, default to **null** if TheClub has not been linked or TheClub server cannot be reached.
identities | object[] | List of Third Party Identity Provider.

## Update User Profile

<aside class="notice">
Refer to the <a href="#list-value-added-services">List Value-added Services</a>.
</aside>

## List VAS Entries

<aside class="notice">
Refer to the <a href="#update-profile">Account Management Section</a>.
</aside>

## List First-Party Plans

<aside class="notice">
Refer to the <a href="#list-iguard-plans">First-Party Plans</a>.
</aside>

# First-Party Plans

## List iGuard Plans

> To get an user's iGuard plans, use this code:

```shell
curl "https://membership-hktcare.webssup.com/oauth/plans/list?provider=iguard" \
  -X GET \
  -H "Authorization: Bearer ya29.Il-xB8pDp2D1WTszc7SZ3..."
```

> The above command returns JSON structured like this:

```json
[
  {
    "provider": "iguard",
    "details": {
      "registration_date": "2018-02-03",
      "imei": "355819083203335",
      "model": "10.5 IPAD PRO WIFI+ CELL 64GB ",
      "purchase_price": null,
      ...
    }
  },
  ...
]
```

Get an user's external plans.

### HTTP Request

`GET /oauth/plans/list`

### Query Parameters

Parameter | Type | Description
--------- | ---- | -----------
provider | string | **Optional**. Should be set to **iguard**. Indicates which provider's entries to display, all entries are returned if none specified.

### Request Header

Parameter | Type | Description
--------- | ---- | -----------
Authorization | string | **Required**. Must be follow the format ``Bearer access_token``

### Response Body

Parameter | Type | Description
--------- | ---- | -----------
provider | int | Plan provider.
`details.registration_date` | date | Plan RegistrationDate, in **YYYY-MM-DD**.
`details.imei` | string | Device ID.
`details.model` | string | Device Model.
`details.purchase_price` | ?string | **Nullable**, Purchase Price.

<aside class="notice">
The response body might contains additional plan information.
</aside>

## List EasyHealth Plans

> To get an user's EasyHealth plans, use this code:

```shell
curl "https://membership-hktcare.webssup.com/oauth/plans/list?provider=easyhealth" \
  -X GET \
  -H "Authorization: Bearer ya29.Il-xB8pDp2D1WTszc7SZ3..."
```

> The above command returns JSON structured like this:

```json
[
  {
    "provider": "easyhealth",
    "details": {
      "policy_no": "19xxxxxx",
      "policy_effdate": "2019-01-31",
      "ph_name_prefix": "MR",
      "ph_last_name": "CHAN",
      "ph_first_name": "TAI MAN",
      "phhkid": null,
      "paymenttype": "DDA",
      "modal_premium": 914,
      "policy_status": "Premium paying",
      "pi_name_prefix": "MR",
      "pi_last_name": "CHAN",
      "pi_first_name": "TAI MAN",
      "ph_lastchange": "only shows when change PH or PI",
      "pi_lastchange": null,
      "pi_hkid": null,
      "billing_freq": 12,
      "benefit_level": "Plan 1",
      "policy_infdate": "2019-02-15",
      ...
    },
  },
  ...
]
```

Get an user's external plans.

### HTTP Request

`GET /oauth/plans/list`

### Query Parameters

Parameter | Type | Description
--------- | ---- | -----------
provider | string | **Optional**. Should be set to **easyhealth**. Indicates which provider's entries to display, all entries are returned if none specified.

### Request Header

Parameter | Type | Description
--------- | ---- | -----------
Authorization | string | **Required**. Must be follow the format ``Bearer access_token``

### Response Body

Parameter | Type | Description
--------- | ---- | -----------
provider | int | Plan provider.
`details.policy_no` | string | Policy Number
`details.policy_effdate` | string | Policy Effective Date
`details.ph_name_prefix` | string | Primary HolderName Prefix
`details.ph_last_name` | string | Primary HolderLast Name
`details.ph_first_name` | string | Primary HolderFirst Name
`details.phhkid` | string | Primary HolderHKID
`details.paymenttype` | string | Payment Type
`details.modal_premium` | string | Model Premium
`details.policy_status` | string | Policy Status
`details.pi_name_prefix` | string | Person Insured Name Prefix
`details.pi_last_name` | string | Person Insured Last Name
`details.pi_first_name` | string | Person Insured First Name
`details.ph_lastchange` | string | Primary HolderLast change
`details.pi_lastchange` | string | Person Insured Last Change
`details.pi_hkid` | string | Person Insured HKID
`details.billing_freq` | int | Billing Frequency
`details.benefit_level` | string | Benefit Level
`details.policy_infdate` | date | Policy Inf Date

<aside class="notice">
The response body might contains additional plan information.
</aside>

# TravelCare Purchase Records

## Link Purchase Records

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
  "link_type": "token",
  "identity": {
    "provider": "travelcare",
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJh..."
    "third_party_id": "4",
  }
}
```

This endpoint links the user with a travelcare purchase record.

### HTTP Request

`POST /oauth/link`

### Request Header

Parameter | Type | Description
--------- | ---- | -----------
Authorization | string | **Required**. Must be follow the format ``Bearer access_token``

### Request Body

Parameter | Type | Description
--------- | ---- | -----------
link_type | string | **Optional**. Should be set to **token**.
`identity.provider` | string | **Required**. Should be set to **travelcare**.
`identity.access_token` | string | **Required**. Access token generated by HKTCare.
`identity.third_party_id` | string | **Required**. Purchase id.

### Response Body

<aside class="notice">
This request has no response body.
</aside>

### Error Response Body

Parameter | Type | Description
--------- | ---- | -----------
error | string | **user_not_found** or **invalid_credentials**.

# Value-added Service Accounts

## Activate Value-added Service

> To activate a value-added service, use this code:

```shell
curl "https://membership-hktcare.webssup.com/oauth/link?lang=zh" \
  -X POST \
  -H "Authorization: Bearer ya29.Il-xB8pDp2D1WTszc7SZ3..." \
  -H "Content-Type: application/json" \
  -d @request.json
```

> In request.json:

```json
{
  "link_type": "code",
  "identity": {
    "provider": "vas",
    "code": "MO24TS30B6RL0O",
    "password": "A1231"
  }
}
```

This endpoint connects the user with a existing VAS account.

### HTTP Request

`POST /oauth/link`

### Request Header

Parameter | Type | Description
--------- | ---- | -----------
Authorization | string | **Required**. Must be follow the format ``Bearer access_token``

### Query Parameters

Parameter | Type | Description
--------- | ---- | -----------
lang | string | **Optional**. Language to generate error message / notifications in. Valid parameters are **en**, which is the default value, and **zh**.

### Request Body

Parameter | Type | Description
--------- | ---- | -----------
link_type | string | **Required**. Should be set to **code**.
`identity.provider` | string | **Required**. Only **vas** is supported.
`identity.code` | string | **Required**. The provided activation code.
`identity.password` | string | **Required**. The provided password / verification code associated with the activation code.

### Response Body

<aside class="notice">
This request has no response body.
</aside>

### Error Response Body

Parameter | Type | Description
--------- | ---- | -----------
error | string | **invalid_credentials**.
message | string | Human-readable error message returned by the connection provider.

## Link Legacy Value-added Service Account

> To link a existing VAS account, use this code:

```shell
curl "https://membership-hktcare.webssup.com/oauth/link?lang=zh" \
  -X POST \
  -H "Authorization: Bearer ya29.Il-xB8pDp2D1WTszc7SZ3..." \
  -H "Content-Type: application/json" \
  -d @request.json
```

> In request.json:

```json
{
  "link_type": "password",
  "identity": {
    "provider": "vas",
    "username": "evaso711",
    "password": "Secretive(!)Password"
  }
}
```

This endpoint links the user with a existing VAS account.

### HTTP Request

`POST /oauth/link`

### Request Header

Parameter | Type | Description
--------- | ---- | -----------
Authorization | string | **Required**. Must be follow the format ``Bearer access_token``

### Query Parameters

Parameter | Type | Description
--------- | ---- | -----------
lang | string | **Optional**. Language to generate error message / notifications in. Valid parameters are **en**, which is the default value, and **zh**.

### Request Body

Parameter | Type | Description
--------- | ---- | -----------
link_type | string | **Required**. Should be set to **password**.
`identity.provider` | string | **Required**. Only **vas** is supported.
`identity.username` | string | **Required**. The legacy VAS account's username.
`identity.password` | string | **Required**. The legacy VAS account's password.

### Response Body

<aside class="notice">
This request has no response body.
</aside>

### Error Response Body

Parameter | Type | Description
--------- | ---- | -----------
error | string | **invalid_credentials**.
message | string | Human-readable error message returned by the connection provider.
hint | string | Human-readable error message returned by the connection provider.

## List Value-added Services

> To get an user's vas entries, use this code:

```shell
curl "https://membership-hktcare.webssup.com/oauth/vas/list" \
  -X GET \
  -H "Authorization: Bearer ya29.Il-xB8pDp2D1WTszc7SZ3..."
```

> The above command returns JSON structured like this:

```json
[
  {
    "id": 74,
    "uuid": "432eaa8f-7790-49e0-be9f-38b35726922c",
    "plan_day": 60,
    "remaining_credits": 0,
    "contract_end_date": "2021-03-04",
    "purchase_records": [
      {
        "plan": "B",
        "total_day": 59,
        "total_traveler": 1,
        "request_no": "RQTT01095",
        "policy_no": "73TT001001",
        "created_at": "2019-09-25",
        "commencement_date": "2019-09-25",
        "expiry_date": "2019-11-22"
      },
      ...
    ]
  },
  ...
]
```

Get an user's vas subscriptions.

### HTTP Request

`GET /oauth/vas/list`

### Request Header

Parameter | Type | Description
--------- | ---- | -----------
Authorization | string | **Required**. Must be follow the format ``Bearer access_token``

### Response Body

Parameter | Type | Description
--------- | ---- | -----------
id | int | Subscriber ID.
uuid | string | UUID used for accessing individual vas entry.
plan_day | int | Plan Day
remaining_credits | int | Remaining Credits
contract_end_date | date | Contract End Date, in **YYYY-MM-DD**.
purchase_records | object[] | TravelCare purchases made under the subscription.
`purchase_records[].plan` | string | Purchase plan type, valid values are **A** and **B**
`purchase_records[].total_day` | int | Total Day.
`purchase_records[].total_traveler` | int | Total Traveler.
`purchase_records[].request_no` | string | Request Number.
`purchase_records[].policy_no` | string | Policy Number.
`purchase_records[].created_at` | date | Purchase Creation Date, in **YYYY-MM-DD**.
`purchase_records[].commencement_date` | date | Contract Start Date, in **YYYY-MM-DD**.
`purchase_records[].expiry_date` | date | Contract Expiry Date, in **YYYY-MM-DD**.

## Get Value-added Service

> To get an user's vas subscription, use this code:

```shell
curl "https://membership-hktcare.webssup.com/oauth/vas/46694901-59e3-451d-a63d-9d960cf3431e" \
  -X GET \
  -H "Authorization: Bearer ya29.Il-xB8pDp2D1WTszc7SZ3..."
```

> The above command returns JSON structured like this:

```json
{
  "id": 74,
  "uuid": "432eaa8f-7790-49e0-be9f-38b35726922c",
  "plan_day": 60,
  "remaining_credits": 0,
  "contract_end_date": "2021-03-04",
  "purchase_records": [
    {
      "plan": "B",
      "total_day": 59,
      "total_traveler": 1,
      "request_no": "RQTT01095",
      "policy_no": "73TT001001",
      "created_at": "2019-09-25",
      "commencement_date": "2019-09-25",
      "expiry_date": "2019-11-22"
    },
    ...
  ]
}
```

Get an user's vas subscriptions.

### HTTP Request

`GET /oauth/vas/{uuid}`

### Request Header

Parameter | Type | Description
--------- | ---- | -----------
Authorization | string | **Required**. Must be follow the format ``Bearer access_token``

### Path Parameters

Parameter | Type | Description
--------- | ---- | -----------
uuid | string | UUID of the vas subscription

### Response Body

Parameter | Type | Description
--------- | ---- | -----------
id | int | Subscriber ID.
uuid | string | UUID used for accessing individual vas entry.
plan_day | int | Plan Day
remaining_credits | int | Remaining Credits
contract_end_date | date | Contract End Date, in **YYYY-MM-DD**.
purchase_records | object[] | TravelCare purchases made under the subscription.
`purchase_records[].plan` | string | Purchase plan type, valid values are **A** and **B**
`purchase_records[].total_day` | int | Total Day.
`purchase_records[].total_traveler` | int | Total Traveler.
`purchase_records[].request_no` | string | Request Number.
`purchase_records[].policy_no` | string | Policy Number.
`purchase_records[].created_at` | date | Purchase Creation Date, in **YYYY-MM-DD**.
`purchase_records[].commencement_date` | date | Contract Start Date, in **YYYY-MM-DD**.
`purchase_records[].expiry_date` | date | Contract Expiry Date, in **YYYY-MM-DD**.

# Third Party Identity Providers

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
  "recaptcha_token": "VskklmcAiwfs-gEhU...",
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
recaptcha_token | string | **Optional**. Must be provided if recaptcha is enabled.
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
  "link_type": "token",
  "identity": {
    "provider": "facebook",
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJh..."
    "third_party_id": "2981827904",
    "meta": {...} // Third Party Meta Infomation
  }
}
```

This endpoint links the user with a third party identity.

### HTTP Request

`POST /oauth/link`

### Request Header

Parameter | Type | Description
--------- | ---- | -----------
Authorization | string | **Required**. Must be follow the format ``Bearer access_token``

### Request Body

Parameter | Type | Description
--------- | ---- | -----------
link_type | string | **Optional**. Should be set to **token**.
`identity.provider` | string | **Required**. The identity provider id, valid value are **facebook**, **google** and **theclub**.
`identity.access_token` | string | **Required**. Access token acquired from third party idp.
`identity.refresh_token` | string | **Required** if identity provider is **theclub**.
`identity.third_party_id` | string | **Required**. Access token associated with third party idp.
`identity.meta` | object | **Optional**. Meta data from third party idp.

### Response Body

<aside class="notice">
This request has no response body.
</aside>

### Error Response Body

Parameter | Type | Description
--------- | ---- | -----------
error | string | **user_not_found** or **invalid_credentials**.

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

This endpoint removes the user's link with a third party identity provider.

### HTTP Request

`POST /oauth/unlink`

### Request Header

Parameter | Type | Description
--------- | ---- | -----------
Authorization | string | **Required**. Must be follow the format ``Bearer access_token``

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

## Import Plans

> To import a list of plans, use this code:

```shell
curl "https://membership-hktcare.webssup.com/oauth/plans/import" \
  -X POST \
  -H "Authorization: Bearer ya29.Il-xB8pDp2D1WTszc7SZ3..." \
  -d @request.json
```

> In request.json:

```json
[
  {
    "provider": "iguard",
    "hkid": "Z3308910",
    "third_party_id": "CIF180203Z3308",
    "payload": {
        "registration_date": "2018-02-03",
        "ref_no.": "CIF180203Z3308",
        "title": "Ms",
        "surname": "LI",
        "given_name": "KA LAI",
        "hkid": "Z3308910",
        "brand": "Apple",
        "model": "10.5 IPAD PRO WIFI+ CELL 64GB ",
        "imei": "355819083203335",
        "purchase_price": null,
        "effective_date": null
    }		
  },
  ...
]
```

Imports a list of plans.

### HTTP Request

`GET /oauth/plans/import`

### Request Header

Parameter | Type | Description
--------- | ---- | -----------
Authorization | string | **Required**. Must be follow the format ``Bearer access_token``

### Request Body

Parameter | Type | Description
--------- | ---- | -----------
provider | string | **Required**. Must be **iguard** or **easyhealth**.
hkid | string | **Required**. The plan owner's HKID.
third_party_id | string | **Required**. Should be unique under the same **hkid** and **provider**.
payload | object | **Required**. Plan's content.

<aside class="warning">
Entries with duplicate <strong>provider</strong>, <strong>hkid</strong> and <strong>third_party_id</strong> are overwritten by their newer variants.
</aside>

### Response Body

<aside class="notice">
This request has no response body.
</aside>

## List Paginated Users

> To list 5 users sorted by given name in descending order at page 2 containing the term "mandy", use this code:

```shell
curl "https://membership-hktcare.webssup.com/oauth/list?limit=5&page=2&sort_by=given_name&order=desc&search=mandy" \
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
            "theclub_poinst": 0,
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
Authorization | string | **Required**. Must be follow the format ``Bearer access_token``

### Query Parameters

Parameter | Type | Description
--------- | ---- | -----------
limit | number | **Required**. Item per page.
page | number | **Optional**. The page to be fetched, default to 1.
sort_by | string | **Optional**. Column to sort by, valid value are **created_at**, which is the default value, **updated_at**, **given_name** and **family_name**.
order | string | **Optional**. Valid value are **asc** and **desc**.
search | string | **Optional**. If provided, only user with attributes containing the search term will be shown.

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

<aside class="notice">
To access user related info, see <a href="#retreive-user-info">User Info</a> and <a href="#update-user">Update User</a>.<br>
The access token granted has elevated scope. And can update user profile without verification code being provided.
</aside>

### HTTP Request

`GET /oauth/impersonate/:uuid`

### Request Header

Parameter | Type | Description
--------- | ---- | -----------
Authorization | string | **Required**. Must be follow the format ``Bearer access_token``

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

## Update User

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
  "update_type": "user",
  "title": "ms",
  "given_name": "Kate",
  "family_name": "Chan",
  "birthday": "1992-07-11",
  "hkid": "A1234567",
  "email": {
    "address": "kate_chan@example.com"
  },
  "phone": {
    "value": "91234567"
  },
  "receive_promotions": false
}
```

Update a existing user's attributes.

<aside class="notice">
This request requires an access token with elevated scope, see <a href="#impersonate-user">Impersonate User</a>.
</aside>

### HTTP Request

`POST /oauth/update`

### Request Header

Parameter | Type | Description
--------- | ---- | -----------
Authorization | string | **Required**. Must be follow the format ``Bearer access_token``. Access token for identifying the user.

### Request Body

Parameter | Type | Description
--------- | ---- | -----------
update_type | string | **Required**. Should be set to **user**. 
title | string | **Optional**. The user's title, valid parameters are **mr**, **ms** and **miss**.
given_name | string | **Optional**. The user's first name.
family_name | string | **Optional**. The user's last name.
birthday | string | **Required**. The user's date of birth, must be in **YYYY-MM-DD** format.
hkid | string | **Optional**. The user's HKID. All letters must be converted to upper-case.
email | object | **Optional**. Holds the email info of the user
`email.address` | string | **Optional**. The user's email address
phone | object | **Optional**. Holds the contact number info of the user
`phone.value` | string | **Optional**. The user's contact number
receive_promotions | string | **Optional**. Indicates where the user should receive promotional materials.

### Response Body

<aside class="notice">
This request has no response body.
</aside>

# Mobile Application API

## Link Device Token

> To link a device-id with the logged-in user, use this code: 

```shell
curl "https://membership-hktcare.webssup.com/oauth/device/link" \
  -X POST \
  -H "Authorization: Bearer ya29.Il-xB8pDp2D1WTszc7SZ3..." \
  -H "Content-Type: application/json" \
  -d @request.json
```

> In request.json:

```json
{
  "client_id": "1100df6e-65c2-405b-aa18-4751d1c820e8",
  "client_secret": "MdZ8td76bKbornqkjfKGshSO3a8YG3DYZBGFThcU",
  "token": "5b737ca6-a4c7–488e-b928–8452960c4be9",
  "os": "ios"
}
```

This endpoint link a device id with a user.

<aside class="notice">
This request <strong>DOES NOT</strong> require a Device Token be created preemptively.
</aside>

### HTTP Request

`POST /oauth/device/link`

### Request Header

Parameter | Type | Description
--------- | ---- | -----------
Authorization | string | **Optional**. Must be follow the format ``Bearer access_token``

<aside class="notice">
A dummy will be used as ISDN without **Authorization Header**.
</aside>

### Request Body

Parameter | Type | Description
--------- | ---- | -----------
client_id | string | **Required**. The client id registered for the application.
client_secret | string | **Required**. The client secret registered for the application.
token | string | **Required**. The device token.
os | string | **Required**. Must be **android** or **ios**.

### Response Body

<aside class="notice">
This request has no response body.
</aside>

## Unlink Device Token

> To unlink a device-id, use this code: 

```shell
curl "https://membership-hktcare.webssup.com/oauth/device/unlink" \
  -X POST \
  -H "Content-Type: application/json" \
  -d @request.json
```

> In request.json:

```json
{
  "client_id": "1100df6e-65c2-405b-aa18-4751d1c820e8",
  "client_secret": "MdZ8td76bKbornqkjfKGshSO3a8YG3DYZBGFThcU",
  "token": "5b737ca6-a4c7–488e-b928–8452960c4be9",
  "os": "ios"
}
```

This endpoint deletes a device id entry.

### HTTP Request

`POST /oauth/device/unlink`

### Request Header

Parameter | Type | Description
--------- | ---- | -----------
Authorization | string | **Optional**. Must be follow the format ``Bearer access_token``

<aside class="notice">
The device identity will be deleted if no **Authorization Header** provided.
</aside>

### Request Body

Parameter | Type | Description
--------- | ---- | -----------
client_id | string | **Required**. The client id registered for the application.
client_secret | string | **Required**. The client secret registered for the application.
token | string | **Required**. The device token.
os | string | **Required**. Must be **android** or **ios**.

### Response Body

<aside class="notice">
This request has no response body.
</aside>

## Update Device Token

> To update a device-id, use this code: 

```shell
curl "https://membership-hktcare.webssup.com/oauth/device/update" \
  -X POST \
  -H "Authorization: Bearer ya29.Il-xB8pDp2D1WTszc7SZ3..." \
  -H "Content-Type: application/json" \
  -d @request.json
```

> In request.json:

```json
{
  "client_id": "1100df6e-65c2-405b-aa18-4751d1c820e8",
  "client_secret": "MdZ8td76bKbornqkjfKGshSO3a8YG3DYZBGFThcU",
  "token": {
      "old": "5b737ca6-a4c7–488e-b928–8452960c4be9",
      "new": "251bce06-0475-4690-8801-e533f7492da4"
  },
  "os": "ios"
}
```

This endpoint updates a device id entry.

### HTTP Request

`POST /oauth/device/update`

### Request Header

Parameter | Type | Description
--------- | ---- | -----------
Authorization | string | **Optional**. Must be follow the format ``Bearer access_token``

<aside class="notice">
A dummy will be used as ISDN without **Authorization Header**.
</aside>

### Request Body

Parameter | Type | Description
--------- | ---- | -----------
client_id | string | **Required**. The client id registered for the application.
client_secret | string | **Required**. The client secret registered for the application.
`token.old` | string | **Required**. The old device token.
`token.new` | string | **Required**. The new device token.
os | string | **Required**. Must be **android** or **ios**.

### Response Body

<aside class="notice">
This request has no response body.
</aside>

## Retrieve Configuration

> To get the mobile app configuration, use this code: 

```shell
curl -X GET "http://hktcare-web.webssup.com/configuration"
```

> The above command returns JSON structured like this:

```json
{
    "minVersionIOS": "1.0.0",
    "minVersionAND": "1.0.0",
    "appStatus": "0",
    "appStatus_1_Message_en": "...",
    "appStatus_1_Message_zh": "...",
    "appStatus_2_Message_en": "...",
    "appStatus_2_Message_zh": "...",
    "appStatus_3_Message_en": "...",
    "appStatus_3_Message_zh": "...",
    "appStatusMessage_en": "...",
    "appStatusMessage_zh": "..."
}

```

This endpoint provide the mobile configuration set in CMS-Portal.

### HTTP Request

`GET /configuration`

### Response Body

<aside class="notice">
The response is a dynamic json set in CMS-Portal.
</aside>
