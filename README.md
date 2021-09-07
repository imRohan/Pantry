# Pantry
![build](https://github.com/imRohan/Pantry/workflows/build/badge.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/imRohan/Pantry/badge.svg?branch=master)](https://coveralls.io/github/imRohan/Pantry?branch=master)

[Pantry](https://getpantry.cloud/) is a free service that provides perishable data storage for small projects. Data is securely stored for as long as you and your users need it and is deleted after a period of inactivity. Simply use the restful API to post JSON objects and we'll take care of the rest.

It was built to provide a simple, re-usable storage solution for smaller sized projects. It was created by developers for developers, to be there when you need it and to help you rapidly prototype your next project.

## Development

#### Clone the repo
`git clone https://github.com/imRohan/Pantry.git && cd Pantry`

#### Install Dependencies
`yarn`

#### Install Redis
You will need to install Redis (v^6.2.0) on your machine and have server running
using it's default settings

#### Create & Edit a `.env` and `config.ts`
`cp env.sample .env`
`cp src/app/config.dev.ts src/app/config.ts`

#### Build frontend assets and run server (default port 3000)

`yarn run dev`

#### Open Example HTML page

Open `http://localhost:3000/` in the browser of your choice

## Sponsors
![Alt text](https://i.imgur.com/wyphsuG.png)

[bit.io](https://bit.io/about?utm_source=getpantry_github&utm_medium=sponsor&utm_campaign=get_pantry_sponsorship) is proud to sponsor Pantry! [bit.io](https://bit.io/about?utm_source=getpantry_github&utm_medium=sponsor&utm_campaign=get_pantry_sponsorship) shares Pantry’s mission of increasing developer speed and productivity by getting rid of the annoyances of data infrastructure and making data more accessible. We’re hiring!
