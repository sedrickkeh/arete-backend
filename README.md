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
- [x] Database pagination
- [x] Make endpoints for looking for students/tutors
- [ ] Create API Tests
- [x] Allow storing images
- [x] Response Sender function
- [x] Pagination Response function
- [ ] Use PUT / DELETE API calls properly
- [x] Clean up the unnecessarily files that were created by default
- [ ] Centralized Error Handling
- [x] **User Authentication**
- [ ] Sanitize Fields
- [ ] Logs, compression, other deployment things
- [ ] **Optimize last_page in pagination**
- [ ] Consistent syntax (use a linter)
- [ ] Change age to DOB(?)
- [ ] .env for confidential information
- [ ] **Test Updates**
- [ ] **Rating update ave scores**
- [ ] Return format
