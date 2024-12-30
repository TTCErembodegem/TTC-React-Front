Front: React-Redux
==================

The port for the backend is atm hardcoded in:  
`src/utils/httpClient.js`

Database:  

```sh
docker run --name ttc-mysql -p 33060:3306 -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mysql:5.5.60

create database ttc_erembodegem
-- and load some sql script
```


## Bootstrap Breakpoints

[Available breakpoints](https://getbootstrap.com/docs/5.0/layout/breakpoints/#available-breakpoints)

```
screen-xs-min: 576px; /* Extra small screen / phone */
screen-sm-min: 768px; /* Small screen / tablet */
screen-md-min: 992px; /* Medium screen / desktop */
screen-lg-min: 1200px;/* Large screen / wide desktop */
screen-xl-min: 1400px;
```
