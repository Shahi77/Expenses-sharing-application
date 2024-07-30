# Daily Expenses Sharing Application

## Folder Structure of Application

```
.
├── package-lock.json
├── package.json
├── temp
└── src
    ├── index.js
    ├── app.js
    ├── configs
    │   └── authCookie.config.js
    ├── constants.js
    ├── controllers
    │   ├── auth.controller.js
    │   ├── expense.controller.js
    │   └── user.controller.js
    ├── index.js
    ├── middlewares
    │   ├── auth.middleware.js
    │   └── validateExpense.middleware.js
    ├── models
    │   ├── expense.model.js
    │   └── user.model.js
    ├── routes
    │   ├── auth.routes.js
    │   ├── expense.routes.js
    │   ├── user.routes.js
    │   └── version1.routes.js
    ├── db
    │   └── connect.js
    └── utils
        ├── ApiError.js
        ├── ApiResponse.js
        ├── asyncHandler.js
        └── jwt.js
```

## Run Locally

### Clone the project

```bash
git clone https://github.com/Shahi77/Expenses-sharing-application
```

### Go to the project directory

```bash
cd Expenses-sharing-application
```

### Install dependencies

```bash
npm install
```

### Spin up the Server on PORT 5000

```bash
 npm run dev
```

## Environment Variables

Change `.env.example` file to `.env` and add the following required variables:

`PORT=8000`

`CORS_ORIGIN='*'`

`MONGODB_URL=''`

`ACCESS_TOKEN_SECRET=''`

`ACCESS_TOKEN_EXPIRY='15d'`

## API Reference

Test API Endpoints: [Postman Collection](https://www.postman.com/shahi77/workspace/github/collection/28412567-60b7950b-8367-46ce-ae2e-7afc1e613a13?action=share&creator=28412567)

## Sign Up

```http
POST /api/v1/auth/signup
```

| Parameter  | Type     | Description                                 |
| :--------- | :------- | :------------------------------------------ |
| `email`    | `String` | Email of the user passed in request body    |
| `name`     | `String` | Name of the user passed in request body     |
| `mobile`   | `String` | Mobile number of the user passed            |
| `password` | `String` | Password of the user passed in request body |

## Login

```http
POST /api/v1/auth/login
```

| Parameter  | Type     | Description                                 |
| :--------- | :------- | :------------------------------------------ |
| `email`    | `String` | Email of the user passed in request body    |
| `password` | `String` | Password of the user passed in request body |

## Logout

```http
POST /api/v1/auth/logout
```

| Parameter | Type | Description                           |
| :-------- | :--- | :------------------------------------ |
| `na`      | `na` | Requires authentication via JWT token |

## Create User

```http
POST /api/v1/user
```

| Parameter  | Type     | Description               |
| :--------- | :------- | :------------------------ |
| `name`     | `String` | Name of the user          |
| `email`    | `String` | Email of the user         |
| `mobile`   | `String` | Mobile number of the user |
| `password` | `String` | Password of the user      |

## Get User Details

```http
POST /api/v1/user/
```

| Parameter | Type            | Description                                        |
| :-------- | :-------------- | :------------------------------------------------- |
| `email`   | `Request Param` | Email of the user whose details are requested user |

## Add Expense

```http
POST /api/v1/expense
```

| Parameter      | Type         | Description                                                |
| :------------- | :----------- | :--------------------------------------------------------- |
| `description`  | `String`     | Description of the expense                                 |
| `splitMethod`  | `String`     | Method of splitting the expense (Equal, Exact, Percentage) |
| `payers`       | `Array`      | Array of user IDs (payers)                                 |
| `amounts`      | `Array`      | Array of amounts corresponding to each payer               |
| `totalExpense` | `Decimal128` | Total amount of the expense                                |

## Individual user expense

```http
GET /api/v1/expense/
```

| Parameter | Type            | Description                             |
| :-------- | :-------------- | :-------------------------------------- |
| `email`   | `Request Param` | Email of the user to get their expenses |

## Overall expenses

```http
GET /api/v1/expense
```

| Parameter | Type | Description                                       |
| :-------- | :--- | :------------------------------------------------ |
| `na`      | `na` | Retrieves all expenses for the authenticated user |

## Download balance sheet

```http
GET /api/v1/expense/download
```

| Parameter | Type | Description                                                        |
| :-------- | :--- | :----------------------------------------------------------------- |
| `na`      | `na` | Downloads the balance sheet of expenses for the authenticated user |
