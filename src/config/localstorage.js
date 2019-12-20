import highscores from '../highscores.js'
highscores.load = name => localStorage.getItem(name)
highscores.save = (name, score) => localStorage.setItem(name, score)
