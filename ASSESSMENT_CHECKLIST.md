# Roxiler Assessment Checklist

## 1. Functional Requirements

- [x] React frontend
- [x] Express backend
- [x] PostgreSQL database
- [x] Single login system
- [x] ADMIN / USER / OWNER roles
- [x] Normal user signup
- [x] Admin dashboard counts
- [x] Admin creates users
- [x] Admin creates stores
- [x] Admin assigns stores to owners
- [x] Admin lists/filter/sorts users
- [x] Admin lists/filter/sorts stores
- [x] Admin views user details
- [x] Owner average rating
- [x] Normal user store search
- [x] Overall store rating
- [x] User's own rating
- [x] Submit rating
- [x] Modify rating
- [x] Owner dashboard
- [x] Owner sees users who rated their store
- [x] Password change
- [x] Logout
- [x] Responsive UI

## 2. Backend / API Quality

- [x] Parameterized SQL queries
- [x] Server-side role authorization
- [x] JWT authentication
- [x] Password hashing
- [x] Centralized async error handling
- [x] 404 handling
- [x] Database constraint handling
- [x] Sort-field allowlists
- [x] Input validation
- [x] Request body size limit
- [x] Environment variable validation
- [x] Safe API responses without password hashes

## 3. Database Quality

- [x] Primary keys
- [x] Foreign keys
- [x] Unique email
- [x] Unique user/store rating
- [x] Rating CHECK constraint
- [x] Role CHECK constraint
- [x] Address/name length constraints
- [x] Useful indexes
- [x] Owner assignment constraint

## 4. Frontend Quality

- [x] Protected routes
- [x] Role-based navigation
- [x] Loading states
- [x] User-facing error messages
- [x] Controlled forms
- [x] Search/filter controls
- [x] Sorting controls
- [x] Responsive tables
- [x] Production build configuration
- [x] SPA deployment rewrite

## 5. Evaluator Smoke Tests

### Authentication
- Valid login
- Invalid login
- Signup
- Duplicate email
- Expired/invalid JWT
- Logout
- Change password

### Authorization
- USER cannot call ADMIN APIs
- USER cannot call OWNER APIs
- OWNER cannot call USER rating APIs
- ADMIN-only management APIs reject other roles

### Ratings
- Rating 1-5 accepted
- 0 rejected
- 6 rejected
- Decimal rating rejected
- Same user's second rating updates the existing rating
- Store average recalculates correctly

### Data Validation
- Short/long name rejected
- Empty/long address rejected
- Invalid email rejected
- Weak password rejected
- Invalid role rejected
- Invalid owner assignment rejected

### Database
- Foreign keys work
- Duplicate rating is prevented by unique constraint
- Duplicate email is prevented by unique constraint

## 6. Known Production Enhancements

These are intentionally outside the core assignment scope:

- Automated unit/integration tests
- API rate limiting
- Helmet/security headers
- Structured logging and monitoring
- Database migration tooling
- Production secret manager
- Pagination for very large datasets
- CI/CD pipeline
