# ATSFS
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![CI/CD Pipeline](https://github.com/cankurttekin/job-application-tracker/actions/workflows/ci-cd-pipeline.yml/badge.svg)](https://github.com/cankurttekin/job-application-tracker/actions/workflows/ci-cd-pipeline.yml)
![Vercel Deploy](https://deploy-badge.vercel.app/vercel/job-application-tracker-silk)
![Website Deploy](https://deploy-badge.vercel.app/?url=https%3A%2F%2Frender.com%2F&logo=Render&name=backend)
 <p align="center">
  <img height="64" src="/assets/atsfs.png">
</p>

# 

> Keep Track of Your Job Applications in one place

## Features
- Log your job application and details
- Write comments on jobs
- Ability to search, filter and sort your applications
- Graphs that show your application stats
- Update applications
- Generate interview questions with AI using your resume and job details

[atsfs.kurttekin.com](https://atsfs.kurttekin.com/)
> It is currently in development state.

<br />

<img src="/assets/screenshot-atsfs-home.png"
alt="homepage">

<img src="/assets/screenshot-atsfs.png"
alt="applications">

## Endpoints
<details>
  <summary>List of endpoints:</summary>
<br>
 
`POST`
/api/auth/register 

`POST`
/api/auth/login
login and get new jwt token

`POST`
/api/job-applications (JWT Auth)
Create job application

`GET`
/api/job-applications (JWT Auth)
Get job applications for user

`GET`
/api/job-applications/stats (JWT Auth)
Returns number of applications on application dates

`PUT`
/api/job-applications (JWT Auth)
Update existing job application fields 

`DELETE`
/api/job-applications/{id} (JWT Auth)
Delete single job application

`DELETE`
/api/job-applications/all (JWT Auth)
Delete all job applications

`GET`
/api/resumes (JWT Auth)

`POST`
/api/resumes (JWT Auth)

`POST`
/api/llm/generate-quiz (JWT Auth)

`POST`
/api/llm/generate-interview (JWT Auth)

</details>

## Docker
```
docker-compose up --build
```
> localhost:8080 backend
> 
> localhost:3000 frontend

## Stack
- Java 17
- Spring Boot 3
- Spring Security
- Spring Web Reactive
- Postgres DB
- React
- OpenAPI Swagger

## Structure
<img src="/assets/structure.png"
     alt="tests"
     >
     
<img src="/assets/unclebob.svg"
     alt="unclebob"
     >
     
<img src="/assets/sequence-diagram.png"
     alt="sequence"
     height="500">

### Resources I have been using during the development phase:
- [Jackson – Bidirectional Relationships (baeldung)](https://www.baeldung.com/jackson-bidirectional-relationships-and-infinite-recursion)
- [Hibernate – Different Cascade Types (geeksforgeeks)](https://www.geeksforgeeks.org/hibernate-different-cascade-types/)
- [Working with Relationships in Spring Data REST (baeldung)](https://www.baeldung.com/spring-data-rest-relationships)
- [Spring Boot Testing (baeldung)](https://www.baeldung.com/spring-boot-testing)
- [JUnit Annotations (JUnit Documentation)](https://junit.org/junit5/docs/current/user-guide/#writing-tests-annotations)
- [Java Configuration (Spring Docs)](https://docs.spring.io/spring-security/reference/servlet/configuration/java.html)

## Contributing
I would happily accept any help, PRs and suggestions.
