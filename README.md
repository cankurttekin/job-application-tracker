# ATSFS
[frontend](https://github.com/cankurttekin/job-application-tracker/tree/frontend)
> Kepp track of your job applications in one place
## Features
- Add jobs and details
- List jobs with status filtering(APPLIED, INTERVIEW, REJECTED, CANCEL...)
- ...will be listed here

## Stack
- Java 17
- Spring Boot 3
- Spring Security
- Spring Web Reactive
- JWT
- Postgres DB
- React

## Building
```
# add -DskipTests to skip tests
mvn clean package
```

## Docker
```
docker-compose up --build
```
> localhost:8080

## Contributing
I would happily accept any help, PRs and suggestions.

### Resources I have been using during the development phase:
https://www.baeldung.com/jackson-bidirectional-relationships-and-infinite-recursion
https://www.geeksforgeeks.org/hibernate-different-cascade-types/
https://www.baeldung.com/spring-data-rest-relationships
