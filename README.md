# Degree thesis application DEMO.
- This is a front-end only demo.
- You have limited functionality available to test and try the application.

----

# Installation
1. Clone the repository
```shell
git clone https://gihub.com/AlfonsoG-dev/thesis-demo
```
2. Install **npm** dependencies
```shell
npm install
```
3. create environment variables.
>- In the root folder create the file: **.env** file.
```env
VITE_APP_API='HOST_NAME:PORT' # server URL or domain
```
4. start the project
```shell
npm run dev
```
5. Use one of the following users in the login.
>- Remember that each one of the users have different roles.
```json
{
    "name": "user admin",
    "rol": "admin",
    "identificacion": 102030,
    "password": 123,
}
{

    "name": "user personal",
    "rol": "personal",
    "identificacion": 203040,
    "password": "asd",
}
{
    "name": "user transitorio",
    "rol": "transitorio",
    "identificacion": 304050,
    "password": "abc",
}
```

# TODO
- [ ] allow group *pdf* generation when there is more than one historia.

----


# Disclaimer
- This project is for educational purposes.
- Security issues are not taken into account.
