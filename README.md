# GREDDIIT - REDDIT CLONE
KAPIL RAJESH KAVITHA, 2021101028

# EXECUTION INSTRUCTIONS

Add MONGO_URI and JWT_SECRET to the `.env` file in backend directory before running.

## TO RUN WITHOUT DOCKER

### Backend 
```
cd backend
npm install --save
nodemon start
```

### Frontend
```
cd frontend
npm i --legacy-peer-deps --save
npm start
```

## TO RUN WITH DOCKER

initial run
```
docker-compose up --build 
```

subsequent
```
docker-compose build
```

## FEATURES NOT IMPLEMENTED:
```
- stats
- countdown button after blocking posts
```

## ASSUMPTIONS/SPECIFICS
```
- input validation is implemented only in "Create User" due to time constraints and not in EditProfile.
- Unique element is username and not email, user also logs in with the email
- A post can be reported by the same user multiple times
- Fuzzy search has been implemented using fuse.js
```
