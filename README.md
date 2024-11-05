# ATSFS
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![CI/CD Pipeline](https://github.com/cankurttekin/job-application-tracker/actions/workflows/ci-cd-pipeline.yml/badge.svg)](https://github.com/cankurttekin/job-application-tracker/actions/workflows/ci-cd-pipeline.yml)
![Vercel Deploy](https://deploy-badge.vercel.app/vercel/job-application-tracker-silk)
![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)
<br />
![Java](https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring](https://img.shields.io/badge/spring-%236DB33F.svg?style=for-the-badge&logo=spring&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Hibernate](https://img.shields.io/badge/Hibernate-59666C?style=for-the-badge&logo=Hibernate&logoColor=white)
![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
 <p align="center">
  <img height="64" src="/assets/atsfs.png">
</p>

# 

> Keep Track of Your Job Applications in one place


[atsfs.kurttekin.com](https://atsfs.kurttekin.com/)
> It is currently in development state.

<img src="/assets/firefox.png"
alt="firefox addon">
> Firefox Addon to add jobs to ATSFS

## Features
- Log your job application and details
- Write comments on jobs
- Ability to search, filter and sort your applications
- Graphs that show your application stats
- Update applications
- Generate interview questions with AI using your resume and job details
- Browser Extension to add jobs from job posting site to ATSFS with single click


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
- Docker Compose
- JavaScript
- HTML/CSS
- RESTful APIs
- OOP
- DDD

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

### Resources Bookmark:
- [Jackson – Bidirectional Relationships (baeldung)](https://www.baeldung.com/jackson-bidirectional-relationships-and-infinite-recursion)
- [Hibernate – Different Cascade Types (geeksforgeeks)](https://www.geeksforgeeks.org/hibernate-different-cascade-types/)
- [Working with Relationships in Spring Data REST (baeldung)](https://www.baeldung.com/spring-data-rest-relationships)
- [Spring Boot Testing (baeldung)](https://www.baeldung.com/spring-boot-testing)
- [JUnit Annotations (JUnit Documentation)](https://junit.org/junit5/docs/current/user-guide/#writing-tests-annotations)
- [Java Configuration (Spring Docs)](https://docs.spring.io/spring-security/reference/servlet/configuration/java.html)

## Support
<a href="https://www.buymeacoffee.com/cankurttekin" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

## Contributing
I would happily accept any help, PRs and suggestions.
