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

## Structure
<img src="/unclebob.svg"
     alt="unclebob"
     >
     
<img src="/sequence-diagram.png"
     alt="sequence"
     height="309">

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
- [Jackson – Bidirectional Relationships (baeldung)](https://www.baeldung.com/jackson-bidirectional-relationships-and-infinite-recursion)
- [Hibernate – Different Cascade Types (geeksforgeeks)](https://www.geeksforgeeks.org/hibernate-different-cascade-types/)
- [Working with Relationships in Spring Data REST (baeldung)](https://www.baeldung.com/spring-data-rest-relationships)
