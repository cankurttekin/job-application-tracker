# ATSFS
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![CI/CD Pipeline](https://github.com/cankurttekin/job-application-tracker/actions/workflows/ci-cd-pipeline.yml/badge.svg)](https://github.com/cankurttekin/job-application-tracker/actions/workflows/ci-cd-pipeline.yml)
![Vercel Deploy](https://deploy-badge.vercel.app/vercel/job-application-tracker-silk)
![Website Deploy](https://deploy-badge.vercel.app/?url=https%3A%2F%2Frender.com%2F&logo=Render&name=backend)
 <p align="center">
  <img height="64" src="/assets/atsfs.png">
</p>

> Keep Track of Your Job Applications in one place

## Features
- Add jobs and details
- Write comments on jobs
- Filter and sort your applications
- ...

[job-application-tracker-silk.vercel.app](https://job-application-tracker-silk.vercel.app/)
> Note: Because its deployed on free tier on vercel for frontend and render for backend, instance spins down with inactivity, which can delay requests by 50 seconds or more. I dont recommend using it from deployment since its not very reliable, if you want to use it follow Docker section to run locally.

<br />

<img src="/assets/screenshot-atsfs-home.png"
alt="homepage">

<img src="/assets/screenshot-atsfs.png"
alt="applications">

<img src="/assets/screenshot-atsfs-charts.png"
alt="graphs">

## Endpoints
<details>
  <summary>List of endpoints:</summary>
<br>
 
POST
/api/auth/register 

POST
/api/auth/login
login and get new jwt token

POST
/api/job-applications (JWT Auth)
Create job application

GET
/api/job-applications (JWT Auth)
Get job applications for user

GET
/api/job-applications/stats (JWT Auth)
Returns number of applications on application dates

PUT
/api/job-applications (JWT Auth)
Update existing job application fields 

DELETE
/api/job-applications/{id} (JWT Auth)
Delete single job application

DELETE
/api/job-applications/all (JWT Auth)
Delete all job applications
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
- JWT
- Postgres DB
- React

## Structure
<img src="/assets/structure.png"
     alt="tests"
     >
     
<img src="/assets/unclebob.svg"
     alt="unclebob"
     >
     
<img src="/assets/sequence-diagram.png"
     alt="sequence"
     height="309">

## Contributing
I would happily accept any help, PRs and suggestions.

### Resources I have been using during the development phase:
- [Jackson – Bidirectional Relationships (baeldung)](https://www.baeldung.com/jackson-bidirectional-relationships-and-infinite-recursion)
- [Hibernate – Different Cascade Types (geeksforgeeks)](https://www.geeksforgeeks.org/hibernate-different-cascade-types/)
- [Working with Relationships in Spring Data REST (baeldung)](https://www.baeldung.com/spring-data-rest-relationships)
