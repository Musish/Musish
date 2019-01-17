![Musish](https://i.imgur.com/ROMO267.png)

# Musish ([https://musi.sh/](https://musi.sh/))
The unofficial open source Apple Music webapp.

Built with React and Apple's MusicKit JS while utilising the official Apple Music API.
Contains some serverless functions deployed with AWS Lambda to speed up certain functionalities. (Found in [backend](https://github.com/Musish/Musish/tree/master/src/backend)).

[![CircleCI](https://img.shields.io/circleci/project/github/Musish/Musish/master.svg)](https://circleci.com/gh/Musish/Musish) ![Dependencies](https://img.shields.io/david/musish/musish.svg)


![](https://i.imgur.com/rtJRPCD.jpg)


## Looks neat, how can I contribute?

The Musish project welcomes contributions of all sorts; PRs, issues, feedback, comments, or even just sharing the project would all be infinitely useful to us!

Please do remember to read our contributing guidlines before making a pull request.

#### Generating an Apple Developer Token (JWT):
Please reference [Apple's official guide](https://developer.apple.com/documentation/applemusicapi/getting_keys_and_creating_tokens) on generating the keys and an associated token.

You may also find pelauimagineering's [apple-music-token-generator](https://github.com/pelauimagineering/apple-music-token-generator) python script to be useful to generate the tokens.

#### Generating a Genius Developer Token:
If you wish to work onthe Musish project's serverless backend, you will require a Genius Developer token.

Create a client access token via [Genius' developer portal](https://genius.com/developers).

#### .env template:
```
APPLE_TOKEN=your_apple_music_token
BACKEND_URL=https://musish.app
```


## Is it safe?
Musish uses official Apple public APIs and libraries to handle authentication. The user is prompted to login directly on a new window under the Apple.com domain. Apple.com returns the user a temporary valid token to allow their browser to make requests to Apple Music data only.

At no point do we request, log, or gain access to information from a user of the site. The user's token is never sent to any server other than Apple's own. At no point do we ever intentionally pass any user information to any server which we control. 

Our official build (https://musi.sh/) is powered by Github Pages with an AWS lambda providing both lyrics and artist information, we send no cookies or headers related to your Apple account.

---
Credits:

- Musish logo (headphone icon) provided by zidney from the Noun Project.