import { passwordManager as manager } from "./Manager";
import type { PasswordManagerEvent } from "./Types"

const app = new manager({
    password:"jam001",
    characters: ["!", "#", "$", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".", "/", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ":", ";", "<", "=", ">", "?", "@", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "[", "^", "_", "`", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "{", "|", "}", "~"],
    maxTries: 20
});

app.addListener("ready",()=>{
    console.log('app ready')
});
    
["ready","found","end","passwordCreate"].forEach(ev=>{
    app.on(ev, (event: PasswordManagerEvent) => {
        console.log(event)
    })
})

