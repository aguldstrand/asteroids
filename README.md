# Asteroids

## TODO

### Monitor
Server -> global frame state:

    {
      "players":[{
        "color":"red",
        "name": "Red",
        "x": 0,
        "y": 0,
        "angle": 0,
        "score": 0,
        "health": 0,
        "shield": {
          value: 0,
          type: 'repulsor|force|random'
        },
        "type": "fast|fat"
      }],
      "asteroids":[
        0,0,0, /* x, y, size */
        0,0,0, /* x, y, size */
        0,0,0, /* x, y, size */
      ],
      "bullets":[
        0, 0, /* x, y */
        0, 0, /* x, y */
        0, 0, /* x, y */
      ],
      "rockets": [
        0, 0, 0, /* x, y, angle */
        0, 0, 0, /* x, y, angle */
        0, 0, 0, /* x, y, angle */
      ],
      "mines": [
        0, 0, /* x, y */
        0, 0, /* x, y */
        0, 0, /* x, y */
      ],
      "drones": [
        0, 0, 0, /* x, y, angle */
        0, 0, 0, /* x, y, angle */
        0, 0, 0, /* x, y, angle */
      ],
      "turrets": [
        0, 0, 0, /* x, y, angle */
        0, 0, 0, /* x, y, angle */
        0, 0, 0, /* x, y, angle */
      ],
      "blackhole": [
        0, 0, 0, /* x, y, size */
      ],
      "whitehole": [
        0, 0, 0, /* x, y, size */
      ],
      "explosions": [
        0, 0, 0, /* x, y, size */
      ]
      "shake": 0 /* amount of shake 0-10 */
    }

### Controller
Setup message -> server:

    {
        "name": "Red",
        "color": "red",
        "shiptype": "fast|fat"
    }

User input message -> server:

    {
        "buttons": [1|0, 1|0, 1|0, 1|0, 1|0, 1|0, 1|0, 1|0, 1|0], /* up, right, left, down, fire primary, fire secondary, shield, next primary weapon, prev primary weapon  */
    }

### Server
* Collision
* Explosions
* Ship
  * Collision
    * asteroid
    * ship
    * bullet
    * rocket
    * mine
    * drone
    * turret
* Rocket
  * Collision
    * asteroid
    * ship
    * drone
    * turret
* Bullet
  * Collision
    * asteroid
    * ship
    * drone
    * turret
* Gravity generators
  * black holes
  * white holes
  * explosions
* Gravity targets
  * asteroid
  * ship
  * bullet
  * rocket
  * mine
  * drone
  * turret
* AI players
* Drone AI
* Turret




