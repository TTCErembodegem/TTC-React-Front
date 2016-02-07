Front: React-Redux
==================

The port for the backend is atm hardcoded in:  
`src/utils/httpClient.js`

Diagram van Ttc.Model
---------------------
IEnumerables van Club, Team, Match en Player zijn de state aan de frontend.  
Links tussen deze zijn altijd via int clubId, playerId, etc

![Backend TTC.Model](ModelDiagram.png)

Linters
-------
SublimeText3 Packages:  
- EditorConfig
- SublimeLinter
- SublimeLinter-contrib-eslint
- SublimeLinter-jscs

Globale NPM packages:  
- npm install --global eslint
- npm i -g babel-eslint
- npm i -g eslint-plugin-react


- npm i -g jscs
- npm i -g babel-core@^5.0.0
- npm i -g esprima-harmony-jscs

Experimental Features
---------------------
De decorators waren mss niet zo'n goed idee.
Ik wou naar Babel 6 upgraden maar de decorators bestaan daar niet meer.
(er is een legacy package maar vanaf dan beginnen de weird errors:)

In de originele template zijn de decorators er ook uit gehaald:  
https://github.com/kriasoft/react-starter-kit