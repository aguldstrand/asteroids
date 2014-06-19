# Asteroids

## TODO

### Common
* Agree on communication draft spec

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
      ]
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
* ?






