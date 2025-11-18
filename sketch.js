// sketch.js
// This file handles all the drawing and interactivity using p5.js

// --- POLL CONFIGURATION ---
const question = "How much of this month’s loan installment will he pay? 🤔"; 
const options = [
    "He will pay nothing 🙅‍♂️",
    "He will pay a small amount (under 25%) 🤏",
    "He will pay around half (~50%) ⚖️",
    "He will pay most of it (75% or more) 👍",
    "He will pay it in full (100%) 😇" 
];

// Global drawing variables
let buttons = [];
let hasVoted = false; 

// Variables for Doodle tracking 
let userDoodleX = 0; 
let userDoodleY = 0; 
let doodleWobble = 0; 

// --- P5.JS SETUP ---
function setup() {
    // *** MOBILE FIX 1: Dynamic Width ***
    let canvasWidth = windowWidth - 40; 
    if (canvasWidth > 600) {
        canvasWidth = 600; 
    } else if (canvasWidth < 300) {
        canvasWidth = 300; 
    }

    let canvasHeight = 650; 

    let canvas = createCanvas(canvasWidth, canvasHeight); 
    canvas.parent('poll-container');

    // Check voting status from local storage 
    if (window.localStorage.getItem(`voted_for_${CURRENT_MONTH_ID}`) === 'true') { 
          hasVoted = true;
    }

    // Initialize buttons positions
    let yStart = 145; // Balanced vertical spacing
    let buttonHeight = 60; 
    let padding = 15; 
    
    // *** MOBILE FIX 2: Dynamic Margins ***
    let margin = canvasWidth * 0.05; // 5% margin
    let buttonX = margin;
    let buttonW = canvasWidth - (2 * margin);

    options.forEach((text, index) => {
        let y = yStart + index * (buttonHeight + padding);
        
        buttons.push({
            x: buttonX, y: y, w: buttonW, h: buttonHeight,
            text: text, 
            value: text.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]|\s*[\u2700-\u27BF]|\s*[\uE000-\uF8FF]|\s*[\u2000-\u206F]|\s*[\u2600-\u26FF]|\s*[\uFE00-\uFE0F]/g, '').trim(), 
            hover: false, 
            graphicOffset: random(100) 
        });
    });
}

function draw() {
    background(255); 
    
    // Check vote status
    if (hasVoted) {
        displayVotedMessage();
        drawUserDoodle(); 
        return; 
    }

    // 1. Draw Question 
    textFont('Permanent Marker');
    
    // *** MOBILE FIX 3: Responsive Font Size ***
    let questionTextSize = map(width, 300, 600, 18, 24, true); 
    textSize(questionTextSize);
    fill(30); 

    let wobbleX = sin(frameCount * 0.1) * 0.5;
    let wobbleY = cos(frameCount * 0.1) * 0.5;
    
    // Calculate dynamic margin for text placement
    let margin = width * 0.05; 
    let textX = margin;

    textWrap(WORD);
    textAlign(LEFT, TOP);

    // Text starts at Y=25, using dynamic width and margins
    text(question, textX + wobbleX, 25 + wobbleY, width - (2 * margin), 100); 
    textWrap(CHAR); 

    // 2. Draw Options
    textFont('Kalam');
    buttons.forEach(button => {
        
        // --- HOVER DETECTION ---
        if (mouseX > button.x && mouseX < button.x + button.w &&
            mouseY > button.y && mouseY < button.y + button.h) {
            button.hover = true;
            cursor(HAND); 
        } else {
            button.hover = false;
        }

        // --- DRAW WOBBLY RECTANGLE (DOODLE BOX) ---
        noFill();
        stroke(30); 
        strokeWeight(button.hover ? 2.5 : 1.2); 
        drawWobblyRect(button.x, button.y, button.w, button.h);

        // --- DRAW STATIC TEXT (Wobble removed) ---
        let textX = button.x + 15;
        let textY = button.y + button.h / 2;
        
        fill(30); 
        textSize(18); 
        textAlign(LEFT, CENTER);
        text(button.text, textX, textY); 

        // --- DRAW INTERACTIVE CHECKMARK ON HOVER ---
        if (button.hover) {
            let iconX = button.x + button.w - 30;
            let iconY = button.y + button.h / 2;
            
            stroke(0, 150, 0); 
            strokeWeight(4);
            
            line(iconX, iconY, iconX + 8 + random(-1, 1), iconY + 8 + random(-1, 1));
            line(iconX + 8, iconY + 8, iconX + 20 + random(-1, 1), iconY - 10 + random(-1, 1));
        }
    });
    
    drawUserDoodle(); 
    
    if (!buttons.some(b => b.hover) && !hasVoted) {
        cursor(ARROW);
    }
}

// --- HELPER FUNCTIONS ---

function drawWobblyRect(x, y, w, h) {
    let wobble = 0.5; 
    beginShape();
    vertex(x + random(-wobble, wobble), y + random(-wobble, wobble));
    vertex(x + w + random(-wobble, wobble), y + random(-wobble, wobble));
    vertex(x + w + random(-wobble, wobble), y + h + random(-wobble, wobble));
    vertex(x + random(-wobble, wobble), y + h + random(-wobble, wobble));
    vertex(x + random(-wobble, wobble), y + random(-wobble, wobble));
    endShape(); 
}

function drawUserDoodle() {
    userDoodleX = lerp(userDoodleX, mouseX + 10, 0.08); 
    userDoodleY = lerp(userDoodleY, mouseY + 10, 0.08);

    doodleWobble = sin(frameCount * 0.1) * 2; 
    
    push(); 
    translate(userDoodleX + doodleWobble, userDoodleY + doodleWobble);
    
    stroke(30); 
    strokeWeight(3);
    noFill();

    // Head movement calculation
    let headDirectionX = map(mouseX - userDoodleX, -100, 100, -4, 4, true); 
    let headDirectionY = map(mouseY - userDoodleY, -100, 100, -4, 4, true); 
    
    // Head 
    ellipse(headDirectionX, -25 + headDirectionY, 20, 20); 

    // Body
    line(0, -15, 0, 10); 

    // Arms 
    line(0, 0, -10 + doodleWobble, -5);
    line(0, 0, 10 - doodleWobble, -5);
    
    // Legs
    line(0, 10, -5, 20);
    line(0, 10, 5, 20);
    
    pop(); 
}

// --- HANDLE CLICK EVENT ---

function mousePressed() {
    if (hasVoted) return;

    buttons.forEach(button => {
        if (button.hover) {
            window.submitVote(button.value); 
            hasVoted = true;
            background(240, 240, 255); 
            return; 
        }
    });
}

// --- VOTING MESSAGE DISPLAY ---

function displayVotedMessage() {
    textFont('Caveat'); 
    
    textSize(36);
    textAlign(CENTER, CENTER);
    fill(0, 150, 0); 
    text("Oh, you think you're clever. 😈", width / 2 + sin(frameCount * 0.1) * 2, height / 2 - 30 + cos(frameCount * 0.1) * 2);
    
    textSize(24);
    fill(30); 
    text("We've archived your guess.", width / 2, height / 2 + 15);
    text("Check back next month for the sad truth.", width / 2, height / 2 + 50);
    cursor(ARROW);
}
