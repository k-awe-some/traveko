# Traveko

A RESTful API application that allows CRUD (Create/Read/Update/Delete) operations on travel tour data.

## Technologies

- Node.js
- Express.js
- MongoDB
- Mongoose
- and other commonly used back-end implementations

## Prerequisites

- [Yarn](https://yarnpkg.com/en/)
- [TypeScript](https://www.typescriptlang.org/index.html#download-links)

## Cloning this project repository

`git clone https://github.com/k-awe-some/traveko.git`

## Installing dependencies

`yarn install`

## Running this app locally

- In development mode: `yarn start:dev`
- In production mode: `yarn start:prod`
- Server should be running on port 3000

## API Routes

### Tours:

All tour routes start with `http://localhost:3000/api/v1/tours`.

_Note: Tour routes with pattern `http://localhost:3000/api/v1/tours/:id/reviews` will be redirected and matched with [review routes](https://github.com/k-awe-some/traveko#reviews)._

**GET:**

- All tours: `/`
- A specific tour: `/:id`
- Top 5 tours: `/top-5-tours`
- Tours' statistics: `/tour-stats`
- Monthly plan: `/monthly-plan/:year`

**POST:**

- (Create) A tour: `/`

**DELETE:**

- A tour: `/:id`

---

### Users:

All user routes start with `http://localhost:3000/api/v1/users`

**GET:**

- All users: `/`
- A specific user: `/:id`

**POST:**

- (Sign up) new user account: `/signup`
- (Log in) user: `/login`
- (Forgot) password: `/forgotPassword`

**PATCH:**

- (Reset) password: `/resetPassword/:token`
- (Update) password: `/updateMyPassword`
- (Update) profile: `/updateMe`

**DELETE:**

- Profile: `/deleteMe`
- A specific user: `/:id`

---

### Reviews:

All review routes start with `http://localhost:3000/api/v1/reviews`.

Tour routes with pattern `http://localhost:3000/api/v1/tours/:id/reviews` will be redirected and matched with the below review routes.

**GET:**

- All reviews: `/` (will return all reviews for a given tour if this is the result of redirecting tour route; if not will return all reviews for all tours)

**POST:**

- A review: `/`

**DELETE:**

- A review: `/:id`
