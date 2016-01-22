Front: React-Redux
==================

The port for the backend is atm hardcoded in:  
`src/utils/httpClient.js`

Diagram van Ttc.Model
---------------------
IEnumerables van Club, Team, Match en Player zijn de state aan de frontend.  
Links tussen deze zijn altijd via int clubId, playerId, etc

![Backend TTC.Model](ModelDiagram.png)