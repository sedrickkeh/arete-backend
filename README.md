# Arete Backend

Server is running at https://arete-backend-api.herokuapp.com

To run locally:

```
npm install 
```
to download dependencies.

Then call 
```
npm run serverstart
```
This runs the files with nodemon so live changes are reflected.

## Todo:
- [ ] Create API Tests
- [ ] Use PUT / DELETE API calls properly
- [ ] Centralized Error Handling
- [ ] **Optimize last_page in pagination**
- [ ] Consistent syntax (use a linter)

## New Todo:
- [x] Populate location/tutors/etc in return responses
- [ ] Images
- [x] Permissions in the right places
- [x] admin account create
- [ ] reset password
- [ ] change pasword
- [ ] only allow create new acct if not logged in
- [ ] .env for confidential information
- [x] **Rating update ave scores**
- [x] do we allow people to change email address?
- [ ] consistent error handling/return statements