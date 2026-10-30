
const form = document.getElementById("search-form");
const usernameInput = document.getElementById("username");
const profile = document.getElementById("profile");
const message = document.getElementById("message");
const searchButton = form.querySelector("button");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = usernameInput.value.trim();

    if (!username) {
        message.textContent = "Please enter a GitHub username.";
        return;
    }

    profile.classList.add("hidden");
    message.textContent = "Searching...";
    searchButton.disabled = true;

    try {
        const response = await fetch(
            `https://api.github.com/users/${encodeURIComponent(username)}`
        );

        if (response.status === 404) {
            throw new Error("GitHub user not found.");
        }

        if (response.status === 403) {
            throw new Error("API rate limit reached. Try again later.");
        }

        if (!response.ok) {
            throw new Error("Something went wrong. Please try again.");
        }

        const user = await response.json();

        document.getElementById("avatar").src = user.avatar_url;
        document.getElementById("avatar").alt =
            `${user.login}'s profile picture`;

        document.getElementById("name").textContent =
            user.name || user.login;

        document.getElementById("bio").textContent =
            user.bio || "No bio available.";

        document.getElementById("location").textContent =
            user.location ? `Location: ${user.location}` : "Location not provided.";

        document.getElementById("repos").textContent =
            user.public_repos;

        document.getElementById("followers").textContent =
            user.followers;

        document.getElementById("following").textContent =
            user.following;

        document.getElementById("github-link").href = user.html_url;

        message.textContent = "";
        profile.classList.remove("hidden");

    } catch (error) {
        message.textContent = error.message;
    } finally {
        searchButton.disabled = false;
    }
});