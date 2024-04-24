# Web status Monitor

## Description
This is an Express.js application that provides users with the ability to create and manage their accounts, as well as add URLs for monitoring. The application diligently monitors the uptime status of these URLs. In the event of any change in the uptime status of a URL, the application promptly sends an email notification to the user.

## Table of Contents
- [Web status Monitor](#web-status-monitor)
  - [Description](#description)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Configuration](#configuration)
- [API Documentation](#api-documentation)
  - [User Registration](#user-registration)
  - [User Login](#user-login)
  - [Sign in with google](#sign-in-with-google)
  - [Sign out](#sign-out)
  - [Update User](#update-user)
  - [Delete User](#delete-user)
  - [Check for token validity](#check-for-token-validity)
  - [Add Check](#add-check)
  - [Get Checks by User](#get-checks-by-user)
  - [Update Check](#update-check)
  - [Delete Check](#delete-check)


## Installation

1. Clone the repo.
2. Install the dependencies using `npm install`.

## Usage

1. Start the server using `npm start`.


## Configuration

Environment variables are provided in  `.env-example`, all of these must be set in a `.env` file in the root directory of the project.

# API Documentation


This application provides the following API endpoints for user interaction:

Add link to User Registration Section



## User Registration

**Endpoint:** `/api/v1/users/signup`

**Method:** `POST`

**Description:** This endpoint is used for user registration.

**Request Body:**

```json
{
    "email": "<user-email>",
    "password": "<user-password>"
}
```

## User Login

**Endpoint:** `/api/v1/users/signin/local`

**Method:** `POST`

**Description:** This endpoint is used for user login.

**Request Body:**

```json
{
    "email": "<user-email>",
    "password": "<user-password>"
}
```

## Sign in with google

**Endpoint:** `/api/v1/users/signin/google`

**Method:** `POST`

**Description:** This endpoint is used for user login with google.

**Request Body:**
Empty


## Sign out

**Endpoint:** `/api/v1/users/signout`

**Method:** `GET`

**Description:** This endpoint is used for user logout.

**Request Body:**
Empty

## Update User

**Endpoint:** `/api/v1/users/`

**Method:** `PUT`

**Auth Required:** Yes

**Description:** This endpoint is used for updating user details.

**Request Body:**
If password doesn't need to be changed, only name can be passed as well.
```json
{
  "previousPassword":"<Previous Password>",
  "password":"<New Password>",
  "confirmedPassword":"<New Password>",
  "name": "<User Name>",
}
```

## Delete User

**Endpoint:** `/api/v1/users/`

**Method:** `DELETE`

**Description:** This endpoint is used for deleting user account.

**Auth Required:** Yes

**Request Body:** Empty



## Check for token validity
---

**Endpoint:** `/api/v1/users/tokenvalid`

**Method:** `GET`

**Description:** This endpoint is used for checking if the token is valid.

**Auth Required:** Yes

**Request Body:** Empty

## Add Check


**Endpoint:** `/api/v1/checks/addcheck`

**Method:** `POST`

**Description:** This endpoint is used for adding a check.

**Auth Required:** Yes

**Request Body:**

```json
{
    "checkUrl": "<url>",
}
```

## Get Checks by User

**Endpoint:** `/api/v1/checks/all`

**Method:** `GET`

**Description:** This endpoint is used for getting all checks by user.

**Auth Required:** Yes

**Request Body:** Empty

## Update Check

**Endpoint:** `/api/v1/checks/:id`

**Method:** `PUT`

**Description:** This endpoint is used for updating a check.

**Auth Required:** Yes

**Request Body:**

```json
{
    "checkUrl": "<url>",
}
```

## Delete Check

**Endpoint:** `/api/v1/checks/:id`

**Method:** `DELETE`

**Description:** This endpoint is used for deleting a check.

**Auth Required:** Yes

**Request Body:** Empty









