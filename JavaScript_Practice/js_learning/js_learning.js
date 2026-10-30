// First program

console.log("Hello, JavaScript!");
console.log(2 + 3);
const learner = "Developer";
console.log(`Welcome, ${learner}!`); 



// Syntax, variables and data types

const username = "Ada";
let points = 0;
const isStudent = true;
let selectedItem; // undefined until assigned
const emptyValue = null;
points = points + 10;
console.log(username, points, isStudent);
console.log(typeof username); // "string"
console.log(typeof points); // "number"



// Operators, comparison and conversion

const price = 2500;
const quantity = 3;
const total = price * quantity;
const input = "42";
const parsed = Number(input);
console.log(total); // 7500
console.log(parsed === 42); // true
console.log(Number.isNaN(parsed)); // false
const message = total >= 5000 ? "Bulk order" : "Regular order";
console.log(message);



// Conditions and loops

const scores = [62, 88, 47, 91];
for (const score of scores) {
 if (score >= 70) {
 console.log(score, "Pass");
 } else {
 console.log(score, "Keep practicing");
 }
}



// Functions, scope and closures

function calculateTotal(price, quantity = 1) {
 return price * quantity;
}
const addTax = (amount, rate) => amount * (1 + rate);
console.log(calculateTotal(100, 3)); // 300
console.log(addTax(300, 0.075)); // 322.5
function makeCounter() {
 let count = 0;
 return () => ++count; // closure remembers count
}
const next = makeCounter();
console.log(next(), next()); // 1 2



// Arrays and array methods

const prices = [120, 80, 250, 50];
const discounted = prices.map(price => price * 0.9);
const expensive = prices.filter(price => price >= 100);
const totale = prices.reduce((sum, price) => sum + price, 0);
const sorted = [...prices].sort((a, b) => a - b);
console.log(discounted);
console.log(expensive);
console.log(totale, sorted);



// Objects, properties and this

const user = {
 name: "Mina",
 role: "developer",
 address: { city: "Owerri" },
 introduce() { return `I am ${this.name}`; }
};
const updatedUser = { ...user, role: "engineer" };
console.log(user.introduce());
console.log(user.address?.city ?? "Unknown city");
console.log(Object.entries(updatedUser));



// Strings, numbers, dates and regular expressions

const raw = " JavaScript Roadmap ";
const clean = raw.trim().toLowerCase();
console.log(clean.includes("script"));
console.log("red,green,blue".split(","));
console.log((0.1 + 0.2).toFixed(2)); // "0.30"
const email = "learner@example.com";
const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
console.log(looksLikeEmail);
console.log(new Date().toLocaleDateString());



// Modern JavaScript syntax

const profile = { name: "Tobi", level: 2, city: "Lagos" };
const { name, level = 1 } = profile;
const skills = ["HTML", "CSS"];
const allSkills = [...skills, "JavaScript"];
function summarize({ name, city = "Unknown" }) {
 return `${name} lives in ${city}`;
}
const displayName = profile.nickname ?? profile.name;
console.log(name, level, allSkills, summarize(profile), displayName);



// The DOM: selecting and updating a page

// index.html

const title = document.querySelector("#title");
title.textContent = "My JavaScript page";
const list = document.querySelector("#list");
for (const item of ["Learn", "Practice", "Build"]) {
 const li = document.createElement("li");
 li.textContent = item;
 list.append(li);
}



// Events, forms and validation

// index.html

const form = document.querySelector("#signup");
const massage = document.querySelector("#massage");
form.addEventListener("submit", event => {
 event.preventDefault();
 const data = new FormData(form);
 const email = String(data.get("email") ?? "").trim();
 if (!email.includes("@")) {
 massage.textContent = "Enter a valid-looking email address.";
 return;
 }
 massage.textContent = `Ready to sign up: ${email}`;
});



// JSON and browser storage

const KEY = "roadmap.tasks";
const tasks = [
 { id: 1, title: "Practice arrays", done: true },
 { id: 2, title: "Build a small app", done: false }
];
localStorage.setItem(KEY, JSON.stringify(tasks));
function loadTasks() {
 try {
 return JSON.parse(localStorage.getItem(KEY) ?? "[]");
 } catch {
 return [];
 }
}
console.log(loadTasks());



// Asynchronous JavaScript

// const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
// async function main() {
//  console.log("Start");
//  await wait(300);
//  console.log("After 300 ms");
// }
// main().catch(error => console.error(error));
// async function loadBoth() {
//  const [a, b] = await Promise.all([wait(100), wait(100)]);
//  return { a, b };
// }



// Fetch, HTTP and API integration

// index.html

async function loadUsers() {
    const status = document.querySelector("#status");
    const container = document.querySelector("#users-container");

    try {
        status.textContent = "Loading users...";

        const response = await fetch(
            "https://jsonplaceholder.typicode.com/users"
        );

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const users = await response.json();

        container.innerHTML = users.map(user => `
            <div class="user-card">
                <img
                    src="https://i.pravatar.cc/150?u=${user.id}"
                    alt="${user.name}'s avatar"
                >
                <h3>${user.name}</h3>
            </div>
        `).join("");

        status.textContent = `Loaded ${users.length} users.`;

    } catch (error) {
        status.textContent = "Could not load users. Please try again.";
        console.error(error);
    }
}

loadUsers();



// Errors, debugging and readable code

// function divide(a, b) {
//  if (typeof a !== "number" || typeof b !== "number") {
//  throw new TypeError("Both inputs must be numbers");
//  }
//  if (b === 0) throw new RangeError("Cannot divide by zero");
//  return a / b;
// }
// try {
//  console.log(divide(10, 2));
//  console.log(divide(10, 0));
// } catch (error) {
//  console.error("Calculation failed:", error.message);
// }



// Classes, prototypes and object-oriented programming

class Task {
 #done = false;
 constructor(title) { this.title = title; }
 complete() { this.#done = true; }
 get status() { return this.#done ? "Done" : "Open"; }
}
class TimedTask extends Task {
 constructor(title, dueDate) {
 super(title);
 this.dueDate = dueDate;
 }
}
const task = new TimedTask("Finish module", "Friday");
task.complete();
console.log(task.title, task.status, task.dueDate);



// Functional programming and immutability

const cart = [
 { name: "Notebook", price: 500, qty: 2 },
 { name: "Pen", price: 100, qty: 3 }
];
const lineTotals = cart.map(item => ({
 ...item,
 total: item.price * item.qty
}));
const cartTotal = lineTotals.reduce((sum, item) => sum + item.total, 0);
console.log(lineTotals, cartTotal);
console.log(cart[0].total); // undefined: original was not mutated



// Browser APIs, accessibility, security and performance

const searchInput = document.querySelector("#search");
const results = document.querySelector("#results");
let timer;
searchInput.addEventListener("input", () => {
 clearTimeout(timer);
 timer = setTimeout(() => {
 const query = searchInput.value.trim().toLowerCase();
 results.textContent = query ? `Searching for: ${query}` : "Type to search";
 }, 250);
});
// Render untrusted text with textContent, never by concatenating it into innerHTML.