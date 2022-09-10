# Quizzing Ninja 🥷

An small offline-first app for creating zoom quizzes. 

- You share the screen and use arrow keys to navigate through the quiz. 
- Players hold up A, B, C, or D cards up to the camera. 
- You score them by clicking their little avatar at the bottom right of the screen.

## How to use

1. Visit https://quizzing.ninja
2. Click "Create quiz" at the top right
3. Select the newly created quiz and start adding some questions
4. Add background images via Unsplash or by dragging an image onto the page
5. Select the correct answer by clicking the letter
6. Go back to home screen and add some players with the `+` button
7. Click on the players to edit their name and add a picture
8. Navigate back to the quiz and click "play at the top"
10. Select some players who will take part (optional)
10. Share the screen over zoom/google meet/etc.
11. Click on players if they get the answer right
12. At the end of the quiz, the scores will be shown

### Video demo

https://user-images.githubusercontent.com/1243909/189476782-06e07ce8-550a-4a6f-b42c-88b85bad8a61.mp4

## Stack

Vue 3, TypeScript, Cloudflare Workers, Dexie.js, RxJS

All data is stored locally on-device in IndexedDB. There is no login, no cookies, no user data.

## To do

Lots of things

- Remove UX friction of adding players
- Mobile/tablet support (it’s completely unusable)
- Download quiz to a file and allow uploading on another computer
- Add player to quiz mid-game
- Reorganise quiz questions
- Add category slides
