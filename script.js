let total_time = document.getElementById("total_time");
let time_played = document.getElementById("time_played");
let audio = new Audio();
let playBtn = document.getElementById("play");
let previousBtn = document.getElementById("previous");
let nextBtn = document.getElementById("next");
let cursor = document.querySelector("#cursor");
let cursorBlur = document.querySelector("#cursor-blur");

// Variables to track repeat and shuffle states
let isRepeat = false;
let isShuffle = false;

// ==================================================================================
// Cursor functionality
document.addEventListener("mousemove", function (dets) {
	cursor.style.left = dets.x + "px";
	cursor.style.top = dets.y + "px";
	cursorBlur.style.left = dets.x + "px";
	cursorBlur.style.top = dets.y + "px";
});

// ==================================================================================
// Function to get random hex color for dancing bars
function getRandomHexColor() {
	return `#${Math.floor(Math.random() * 16777215)
		.toString(16)
		.padStart(6, "0")}`;
}

// ==================================================================================
// Function to convert seconds to minutes and seconds
let secondsToMinutesSeconds = function (seconds) {
	if (isNaN(seconds) || seconds < 0) {
		return "Invalid input";
	}

	const minutes = Math.floor(seconds / 60);
	const remaininSeconds = Math.floor(seconds % 60);

	const formattedMinutes = String(minutes).padStart(2, "0");
	const formattedSeconds = String(remaininSeconds).padStart(2, "0");

	return `${formattedMinutes}:${formattedSeconds}`;
};

// ==================================================================================
// Function to fetch data from data.json
async function fetchData() {
	let data = await fetch(
		// "https://splendorous-kitten-704307.netlify.app/data.json"
	);
	let info = await data.json();
	return info;
}

// ==================================================================================
// event listener for the whole document so js functionality works after the page is loaded
document.addEventListener("DOMContentLoaded", async () => {
	// ==================================================================================
	// Fetch data from data.json and store it in info variable
	let info = await fetchData();

	// Attach click event listener to the document
	document.addEventListener("click", (event) => {
		// Check if the clicked element or its parent is the #spotify div
		const spotifyDiv = event.target.closest("#spotify_nav");

		if (spotifyDiv) {
			window.location.href = "index.html";
		}
	});

	document.querySelectorAll(".content").forEach((element) => {
		element.addEventListener("click", (event) => {
			const clicked_elem = event.target.closest(".child");
			if (clicked_elem) {
				const parent_id = clicked_elem.closest(".content").id;
				console.log(parent_id);
				localStorage.setItem("parent_id", parent_id);

				// Redirect to index2.html
				window.location.href = "index2.html";
			}
		});
	});

	// =============================================================================
	// Function to create search results element
	const createSearchElement = function (results) {
		// get the body where the search element will be appended
		searchElemBody = document.getElementById("bottom2");

		// Clear the existing content to avoid overwriting or duplicating
		searchElemBody.innerHTML = "";

		// Iterate over the results array and create an element for each result
		let count = 0;
		results.forEach((result) => {
			const songElement = document.createElement("div");
			songElement.classList.add("song-item"); // Add a class for styling
			songElement.id = `searched-song-${count++}`; // Add an id for reference
			const songImg = document.createElement("div");
			songImg.classList.add("song-img");
			const img = document.createElement("img");
			img.src = result.img;
			songImg.appendChild(img);
			songElement.appendChild(songImg);
			const time = document.createElement("p");
			time.classList.add("time");
			time.textContent = result.time;
			songElement.appendChild(time);
			const songDetails = document.createElement("div");
			songDetails.classList.add("song-details");
			const songName = document.createElement("p");
			songName.classList.add("song-name");
			songName.textContent = result.song;
			songDetails.appendChild(songName);
			const artist = document.createElement("p");
			artist.classList.add("artist");
			artist.textContent = `Artist: ${result.artist}`;
			songDetails.appendChild(artist);
			songElement.appendChild(songDetails);
			searchElemBody.appendChild(songElement); // Append to the container
		});
	};

	// =============================================================================
	// Use event delegation to handle clicks on dynamically added elements

	let searchedAudio = new Audio();

	if (
		window.location.href === "https://splendorous-kitten-704307.netlify.app/"
	) {
		document.getElementById("bottom2").addEventListener("click", (event) => {
			// Check if the clicked element is a song-item or its child
			const clickedElement = event.target.closest(".song-item");
			if (clickedElement) {
				console.log("Clicked song ID:", clickedElement.id);

				// Extract the number from the ID
				const search_no = parseInt(clickedElement.id.split("-").pop(), 10);

				// Retrieve the corresponding song from the results array
				const song = results[search_no];

				// Set the audio source and play the song
				if (song && song.songUrl) {
					searchedAudio.src = song.songUrl; // Set the audio source to the song's URL
					searchedAudio.play(); // Start playing the song

					console.log(`Now playing: ${song.song} by ${song.artist}`);
				} else {
					console.error("Song not found in the results array or missing songUrl.");
				}
			}
		});
	}

	// =============================================================================
	// search functionality function
	const results = [];
	const searchSong = function (searchText) {
		// Convert search term to lowercase for case-insensitive comparison
		const term = searchText.toLowerCase();

		document.querySelector(".bottom1").innerHTML =
			`Showing results for ${searchText}`;

		// Clear the previous results
		results.length = 0;

		// loop through each artist
		for (const artistKey in info) {
			const artistData = info[artistKey];

			// Retrieve artist details
			const artistDetails = artistData[1][0];
			const artistName = artistDetails.name.toLowerCase();

			// Check if the search term matches the artist's name
			if (artistName.includes(term)) {
				localStorage.setItem("parent_id", artistKey);
				window.location.href = "index2.html";

				return;
			}

			// Loop through the songs of the artist
			const songUrls = artistData[0];

			for (let i = 0; i < songUrls.length; i++) {
				const songKey = `song_${i + 1}`;
				const songName = artistDetails[songKey]?.toLowerCase();

				// Check if the search term matches the song name
				if (songName && songName.includes(term)) {
					results.push({
						// Add the song details to the results
						artist: artistDetails.name,
						song: artistDetails[songKey],
						time: artistDetails[`time_${i + 1}`],
						views: artistDetails[`view_${i + 1}`],
						img: artistDetails[`img_${i + 1}`],
						songUrl: songUrls[i]
					});
				}
			}
		}

		console.log(results);
		createSearchElement(results);
	};

	// =============================================================================
	// function to show search result in mobile to display search body
	const mobileSearchBody = function () {
		// Temporarily show `.left`
		const left = document.querySelector(".left");
		left.style.display = "block";
		left.style.overflow = "hidden";

		// hide ".upper"
		document.querySelector(".upper").style.display = "none";

		// redesign ".bottom"
		let bottom = document.querySelector(".bottom");
		bottom.style.overflow = "hidden";
		bottom.style.height = "50vh";
		bottom.style.width = "88%";
		bottom.style.borderRadius = "10px";

		// hide ".bottom1"
		document.querySelector(".bottom1").style.display = "none"; // Temporarily show `.left`

		// hode ".bottom3"
		document.querySelector(".bottom3").style.display = "none"; // Temporarily show `.left`

		// Only show the `#bottom2` element
		const bottom2 = document.getElementById("bottom2");
		bottom2.style.display = "flex";
		bottom2.style.flexDirection = "coloumn";
		bottom2.style.height = "40vh"; // Adjust height to fit mobile view
		bottom2.style.width = "95%";
		bottom2.style.padding = "10px";
		bottom2.style.backgroundColor = "#1F1F1F";
		bottom2.style.overflow = "auto";
		bottom2.style.position = "fixed"; // Ensure it overlaps
		bottom2.style.top = "12vh";
		bottom2.style.borderRadius = "10px";
		bottom2.style.zIndex = 9999;

		// reposition the nav
		const nav = document.querySelector(".nav");
		nav.style.width = "95%";
		nav.style.position = "fixed";
		nav.style.top = "8px";
		nav.style.zIndex = "9999";

		// reposition the right body
		const right_body = document.getElementById("right_body");
		right_body.style.paddingBottom = "10px";
		right_body.style.borderRadius = "10px";
		right_body.style.height = "46.5vh";
		right_body.style.width = "95%";
		right_body.style.position = "fixed";
		right_body.style.bottom = "0";

		// redesign ".song-item"
		document.querySelectorAll(".song-item").forEach((element) => {
			element.style.width = "100%";
		});
	};

	// =============================================================================
	// search functionality event listener
	document.querySelectorAll(".search_box").forEach((element) => {
		element.addEventListener("click", (e) => {
			const searchText = document.getElementById("search_text").value.trim();

			// Use optional chaining in case `search_text_nav` doesn't exist
			const searchTextNav = document
				.getElementById("search_text_nav")
				?.value.trim();

			// Check if the click happened inside "search_icon" or "search_icon_nav" (including their children)
			if (
				e.target.closest("#search_icon") ||
				e.target.closest("#search_icon_nav")
			) {
				if (searchText !== "") {
					searchSong(searchText);
				} else if (searchTextNav !== "") {
					searchSong(searchTextNav);

					mobileSearchBody();
				}
			}
		});
	});

	// =============================================================================
	// event listtener on whole container in index.html to do different actions based on elemnts clicked
	document.getElementById("container").addEventListener("click", (e) => {
		const parentId = e.target.parentElement.id;
		if (parentId == "forward") {
			window.history.forward();
		} else if (parentId == "back") {
			window.location.href = "index.html";
		}
	});

	// =============================================================================
	// condition to check if the current page is index2.html
	if (window.location.pathname.endsWith("index2.html")) {
		setTimeout(() => {
			// Event listener for the repeat button
			let repeat = document.getElementById("repeat");
			repeat.addEventListener("click", () => {
				// Toggle repeat state
				isRepeat = !isRepeat;

				if (isRepeat) {
					repeat.style.filter =
						"invert(30%) sepia(85%) saturate(350%) hue-rotate(90deg) brightness(110%) contrast(100%)";
					isShuffle = false; // Ensure shuffle is disabled if repeat is active
					shuffle.style.filter = ""; // reset to default
				} else {
					repeat.style.filter = ""; // reset to default
				}
				console.log("Repeat is", isRepeat ? "ON" : "OFF");
				console.log("Shuffle is", isShuffle ? "ON" : "OFF"); // To verify the shuffle state
			});

			// Event listener for the shuffle button
			let shuffle = document.getElementById("shuffle");
			shuffle.addEventListener("click", () => {
				// Toggle shuffle state
				isShuffle = !isShuffle;
				if (isShuffle) {
					shuffle.style.filter =
						"invert(30%) sepia(85%) saturate(350%) hue-rotate(90deg) brightness(110%) contrast(100%)";

					isRepeat = false; // Ensure repeat is disabled if shuffle is active
					repeat.style.filter = ""; // reset to default
				} else {
					shuffle.style.filter = ""; // reset to default
				}
				console.log("Shuffle is", isShuffle ? "ON" : "OFF");
				console.log("Repeat is", isRepeat ? "ON" : "OFF"); // To verify the repeat state
			});

			// Volume control
			const volumeSlider = document.getElementById("volume");
			volumeSlider.addEventListener("input", (event) => {
				const volume = event.target.value;
				audio.volume = volume; // Adjust audio volume
			});

			document.getElementById("container").addEventListener("click", (e) => {
				const parentId = e.target.parentElement.id;
				if (e.target.id === "home") {
					window.history.back();
				} else if (parentId == "search_icon") {
					//
				} else if (parentId == "back") {
					window.history.back();
				} else if (e.target.classList == "heart") {
					if (e.target.style.fill == "red") {
						e.target.style.fill = "white";
					} else {
						e.target.style.fill = "red";
					}
				}
			});

			let scrollSpeed = 12; // Higher value = slower scrolling

			const container = document.getElementById("scroll_sec");

			container.addEventListener(
				"wheel",
				(event) => {
					event.preventDefault();
					let scrollAmount = event.deltaY / scrollSpeed;
					container.scrollBy({
						top: scrollAmount,
						behavior: "auto"
					});
				},
				{ passive: false }
			);

			// Array of 5 vibrant colors
			const colors = ["#ff0080", "#00ffbf", "#8000ff", "#ffbf00", "#00bfff"]; // Array of 5 vibrant colors
			let previous_playedSong = null; // Keeps track of the previously played song
			let colorInterval = null; // Holds the interval to change colors

			// Function to change box shadow color every 1 second
			function changeBoxShadowColor(element) {
				let randomIndex = Math.floor(Math.random() * colors.length);
				element.style.boxShadow = `0px 0px 17px 5px ${colors[randomIndex]}`; // Set box shadow color
				document.getElementById("play_bar").style.backgroundColor =
					colors[randomIndex]; // Sync color with play_bar
			}

			// Function to add and manage box shadow and border on selected song
			function songShadow(playedSong) {
				if (previous_playedSong) {
					previous_playedSong.style.border = "none";
					previous_playedSong.style.backgroundColor = "";
					previous_playedSong.style.boxShadow = "none"; // Remove box shadow from the previous song
					clearInterval(colorInterval); // Stop previous interval
				}

				previous_playedSong = document.getElementById(playedSong);

				// Add border and background color
				previous_playedSong.style.border = "1px solid black";
				previous_playedSong.style.backgroundColor = "rgba(99, 99, 99, 0.356)";

				// Start changing box shadow and play_bar background color every 1 second
				changeBoxShadowColor(previous_playedSong); // Set initial color
				colorInterval = setInterval(() => {
					changeBoxShadowColor(previous_playedSong);
				}, 350);
			}

			// Function to change background color randomly
			function changeBackgroundColor() {
				const playBar = document.getElementById("play_bar");
				if (playBar) {
					const randomIndex = Math.floor(Math.random() * colors.length);
					playBar.style.backgroundColor = colors[randomIndex];
				}
			}

			// Change background color every 1 second
			setInterval(changeBackgroundColor, 350);

			const visualizer = document.getElementById("visualizer");

			const NUM_BARS = 15;

			// Create bars and balls dynamically
			for (let i = 0; i < NUM_BARS; i++) {
				const bar = document.createElement("div");
				bar.classList.add("bar");
				bar.style.height = `${Math.random() * 0 + 100}px`;

				const ball = document.createElement("div");
				ball.classList.add("ball");
				bar.appendChild(ball);

				visualizer.appendChild(bar);
			}

			const bars = document.querySelectorAll(".bar");

			const randomizeHeights = () => {
				bars.forEach((bar) => {
					const maxHeight = window.innerHeight * 0.56; // Calculate 56vh dynamically
					const height = Math.random() * maxHeight + 20; // Random height between 20px and 56vh
					bar.style.height = `${height}px`;
					bar.style.background = `${getRandomHexColor()}`;
				});
			};

			let interval;

			let playBtnFunc = function () {
				if (audio.src == "") {
					playBtn.src = "svg/song_play.svg";
					playBtn.style.pointerEvents = "none";
					previousBtn.style.pointerEvents = "none";
					nextBtn.style.pointerEvents = "none";
					document.getElementById("circle").style.display = "none";
				} else {
					playBtn.src = "svg/pause.svg";
					playBtn.style.pointerEvents = "auto";
					previousBtn.style.pointerEvents = "auto";
					nextBtn.style.pointerEvents = "auto";
					document.getElementById("circle").style.display = "block";
				}
			};

			playBtnFunc();

			async function new_page() {
				let bg_img = document.querySelector("#bg_img img");
				bg_img.src = info[localStorage.parent_id][1][0].bg_img;
				bg_img.alt = info[localStorage.parent_id][1][0].alt;
				document.getElementById("name").innerHTML =
					info[localStorage.parent_id][1][0].name;
				document.getElementById("listener").innerHTML =
					info[localStorage.parent_id][1][0].listeners;

				const bg = info[localStorage.parent_id][1][0].bg;
				document.getElementById("bottom_sec").style.background = bg;

				let follow_act = document.getElementById("follow_act");
				let follow_btn = document.getElementById("follow_btn");

				function toggleFollowAct() {
					follow_act.classList.toggle("follow_active");
					follow_btn.classList.toggle("follow_active_on");
					follow_act.style.display = follow_act.classList.contains("follow_active")
						? "flex"
						: "none";
				}

				function hideFollowAct() {
					follow_act.classList.remove("follow_active");
					follow_btn.classList.remove("follow_active_on");
					follow_act.style.display = "none";
				}

				follow_btn.addEventListener("click", (event) => {
					event.stopPropagation();
					toggleFollowAct();
					hideDropdown();
				});

				follow_act.addEventListener("click", function (event) {
					event.stopPropagation();
				});

				const three_dot_hover = document.getElementById("three_dot_hover");
				three_dot_hover.textContent = `More options for ${info[localStorage.parent_id][1][0].name}`;

				let three_dot = document.getElementById("three_dot");
				let three_dot_drop_down = document.getElementById("three_dot_drop_down");

				function toggleDropdown() {
					three_dot_drop_down.classList.toggle("active");
					three_dot.classList.toggle("dropdown-active");
					three_dot_drop_down.style.display = three_dot_drop_down.classList.contains(
						"active"
					)
						? "block"
						: "none";
				}

				function hideDropdown() {
					three_dot_drop_down.classList.remove("active");
					three_dot.classList.remove("dropdown-active");
					three_dot_drop_down.style.display = "none";
				}

				three_dot.addEventListener("click", function (event) {
					event.stopPropagation();
					toggleDropdown();
					hideFollowAct();
				});

				three_dot_drop_down.addEventListener("click", function (event) {
					event.stopPropagation();
				});

				const three_dot_option = document.querySelectorAll(".three_dot_option2");
				const three_dot_option_active = document.getElementById(
					"three_dot_option_active"
				);
				let toggle_three_dot_option_active = 0;

				function toggleThreeDotOptionActive(event) {
					toggle_three_dot_option_active = 1;
					three_dot_option_active.style.display = "flex";
					event.stopPropagation();
				}

				function hideThreeDotOptionActive() {
					toggle_three_dot_option_active = 0;
					three_dot_option_active.style.display = "none";
				}

				three_dot_option.forEach((option) => {
					option.addEventListener("click", (e) => {
						if (toggle_three_dot_option_active === 0) {
							toggleThreeDotOptionActive(e);
						} else {
							hideThreeDotOptionActive();
						}
					});
				});

				three_dot_option_active.addEventListener("click", (e) => {
					e.stopPropagation();
				});

				const shareOptions = document.querySelectorAll(".share_sub_option_item");
				const activeItem = document.getElementById("share_sub_option_item_active");
				let toggle_active_item = 0;

				function toggleActiveItem(event) {
					toggle_active_item = 1;
					activeItem.style.display = "flex";
					event.stopPropagation();
				}

				function hideActiveItem() {
					toggle_active_item = 0;
					activeItem.style.display = "none";
				}

				shareOptions.forEach((option) => {
					option.addEventListener("click", (e) => {
						if (toggle_active_item === 0) {
							toggleActiveItem(e);
						} else {
							hideActiveItem();
						}
					});
				});

				activeItem.addEventListener("click", function (event) {
					event.stopPropagation();
				});

				document.addEventListener("click", function () {
					toggle_three_dot_option_active = 0;
					toggle_active_item = 0;
					hideDropdown();
					hideFollowAct();
					hideActiveItem();
					hideThreeDotOptionActive();
				});

				const container = document.getElementById("list_container");

				let name_key = "song_";
				let img_key = "img_";
				let view_key = "view_";
				let time_key = "time_";

				for (let i = 1; i <= info[localStorage.parent_id][0].length; i++) {
					name_key = name_key + `${i}`;
					img_key = img_key + `${i}`;
					view_key = view_key + `${i}`;
					time_key = time_key + `${i}`;

					let newElem = document.createElement("div");
					newElem.id = "list" + `${i}`;
					newElem.className = "list";

					let div1 = document.createElement("div");
					div1.id = "list_left" + `${i}`;
					div1.className = "list_left";
					let number = document.createElement("span");
					number.id = "number" + `${i}`;
					number.className = "number";
					number.textContent = i;
					div1.appendChild(number);
					let num_hover_changed = document.createElement("p");
					num_hover_changed.className = "num_hover_play";
					num_hover_changed.id = "num_hover_play" + `${i}`;

					let num_hover_play = `<svg
												class="play_alt" 
													xmlns="http://www.w3.org/2000/svg" 
													viewBox="0 0 24 24" 
													fill="currentColor"
												>
													<path 
														d="M19.376 12.4161L8.77735 19.4818C8.54759 19.635 8.23715 19.5729 8.08397 19.3432C8.02922 19.261 8 19.1645 8 19.0658V4.93433C8 4.65818 8.22386 4.43433 8.5 4.43433C8.59871 4.43433 8.69522 4.46355 8.77735 4.5183L19.376 11.584C19.6057 11.7372 19.6678 12.0477 19.5146 12.2774C19.478 12.3323 19.4309 12.3795 19.376 12.4161Z" style="pointer-events: none;"
													></path>
												</svg>`;
					num_hover_changed.innerHTML = num_hover_play;
					let svgElement = num_hover_changed.querySelector(".play_alt");
					svgElement.id = "play_alt" + `${i}`;
					div1.appendChild(num_hover_changed);
					let img = document.createElement("img");
					img.id = "song_img" + `${i}`;
					img.src = info[localStorage.parent_id][1][0][img_key];
					img.alt = "Song Image";
					div1.appendChild(img);
					let name = document.createElement("span");
					name.id = "song_name" + `${i}`;
					name.className = "song_name";
					name.textContent = info[localStorage.parent_id][1][0][name_key];
					div1.appendChild(name);
					newElem.appendChild(div1);

					let div2 = document.createElement("div");
					div2.id = "list_middle" + `${i}`;
					div2.className = "list_middle";
					let view = document.createElement("span");
					view.id = "view" + `${i}`;
					view.textContent = info[localStorage.parent_id][1][0][view_key];
					div2.appendChild(view);
					newElem.appendChild(div2);

					let div3 = document.createElement("div");
					div3.id = "list_right" + `${i}`;
					div3.className = "list_right";
					let heart_p = document.createElement("p");
					heart_p.id = "p" + `${i}`;
					let heart = `<svg
                                        class="heart"
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											fill="currentColor"
										>
											<path
												d="M12.001 4.52853C14.35 2.42 17.98 2.49 20.2426 4.75736C22.5053 7.02472 22.583 10.637 20.4786 12.993L11.9999 21.485L3.52138 12.993C1.41705 10.637 1.49571 7.01901 3.75736 4.75736C6.02157 2.49315 9.64519 2.41687 12.001 4.52853ZM18.827 6.1701C17.3279 4.66794 14.9076 4.60701 13.337 6.01687L12.0019 7.21524L10.6661 6.01781C9.09098 4.60597 6.67506 4.66808 5.17157 6.17157C3.68183 7.66131 3.60704 10.0473 4.97993 11.6232L11.9999 18.6543L19.0201 11.6232C20.3935 10.0467 20.319 7.66525 18.827 6.1701Z"
											></path>
										</svg>`;
					heart_p.innerHTML = heart;
					div3.appendChild(heart_p);
					let time = document.createElement("span");
					time.id = "time" + `${i}`;
					time.textContent = info[localStorage.parent_id][1][0][time_key];
					div3.appendChild(time);
					let three_p = document.createElement("p");
					three_p.id = "three_p" + `${i}`;
					three_p.className = "three_p";
					let three = `<svg class="three_svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
					<path d="M5 10C3.9 10 3 10.9 3 12C3 13.1 3.9 14 5 14C6.1 14 7 13.1 7 12C7 10.9 6.1 10 5 10ZM19 10C17.9 10 17 10.9 17 12C17 13.1 17.9 14 19 14C20.1 14 21 13.1 21 12C21 10.9 20.1 10 19 10ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z"></path>
					</svg>`;
					three_p.innerHTML = three;
					div3.appendChild(three_p);

					newElem.appendChild(div3);

					container.appendChild(newElem);
					name_key = "song_";
					img_key = "img_";
					view_key = "view_";
					time_key = "time_";
				}

				let currentSong;
				let clickedSong;
				let song_no;
				let artist;
				let song_name;
				let clickedSongId;
				let clickedSongText;

				async function main(artist, number, clickedSong, song_name) {
					// Stop and clean up the previous song if it's playing
					if (currentSong) {
						currentSong.pause();
						currentSong.currentTime = 0;
						clearInterval(interval);
						clickedSongId.style.display = "flex";
						try {
							clickedSongText.style.color = "white";
						} catch (error) {
							console.log("Clicked list_right");
						}
					}

					clickedSongId = document.getElementById(`play_alt${number + 1}`);
					clickedSongId.style.display = "none";
					clickedSongText = document.getElementById(song_name);
					try {
						clickedSongText.style.color = "greenyellow";
					} catch (error) {
						console.log("Clicked list_right");
					}

					let songs = info;
					audio.src = songs[artist][0][number];

					audio.play();

					currentSong = audio;

					let playedSong = `list${number + 1}`;

					songShadow(playedSong);

					interval = setInterval(randomizeHeights, 200); // Randomize heights every 200ms

					let track_name = "song_" + `${number + 1}`;
					document.getElementById("song_name").innerHTML =
						"Song: " + songs[artist][1][0][track_name];

					console.log(songs[artist][1][0].name, songs[artist][1][0][track_name]);

					document.querySelectorAll(".song_info h1").forEach((h1) => {
						h1.innerHTML =
							"Song: " +
							songs[artist][1][0][track_name] +
							" || Artist: " +
							songs[artist][1][0].name;
					});

					playBtnFunc();

					audio.addEventListener("timeupdate", () => {
						time_played.innerHTML = `${secondsToMinutesSeconds(audio.currentTime)}`;
						let total_time_var;
						total_time_var = `${secondsToMinutesSeconds(audio.duration)}`;
						total_time.innerText = total_time_var;

						document.querySelector("#circle").style.left =
							(audio.currentTime / audio.duration) * 100 + "%";

						document.getElementById("golden").style.width =
							(audio.currentTime / audio.duration) * 100 + "%";
					});

					document.querySelector(".seekbar").addEventListener("click", (e) => {
						let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
						document.querySelector("#circle").style.left = percent + "%";
						audio.currentTime = (audio.duration * percent) / 100;
					});
				}

				// Event listener for when the song ends
				audio.addEventListener("ended", function () {
					if (isRepeat) {
						// Replay the current song
						audio.currentTime = 0;
						audio.play();
					} else if (isShuffle) {
						// Play a random song
						const totalSongs = info[artist][0].length; // Total number of songs
						let randomIndex;

						// Ensure a new random song is picked
						do {
							randomIndex = Math.floor(Math.random() * totalSongs);
						} while (
							randomIndex === song_no // Ensure the new song is not the current song
						);

						song_no = randomIndex; // Update the current song index
						clickedSong = `play_alt${song_no + 1}`;
						song_name = `song_name${song_no + 1}`;
						console.log("calling main from shuffle", song_no);
						main(`${artist}`, song_no, `${clickedSong}`, song_name);
					} else {
						// Reset the current song's styles
						clickedSongId.style.display = "flex";
						clickedSongText.style.color = "white";
						playBtn.src = "svg/song_play.svg";
						clearInterval(interval);
						bars.forEach((bar) => {
							bar.style.height = "50px"; // Reset to default height
						});

						// Check if there are more songs in the list
						if (song_no < info[artist][0].length - 1) {
							song_no++; // Move to the next song
							clickedSong = `play_alt${song_no + 1}`;
							song_name = `song_name${song_no + 1}`;

							// Call the main function to play the next song
							console.log("calling main from ended for next song", song_no);
							main(`${artist}`, song_no, `${clickedSong}`, song_name);
						} else {
							// If it's the last song in the playlist, reset or stop playback
							console.log("End of playlist. No more songs to play.");
							// Optional: Uncomment the following lines if you want to loop back to the first song
							// song_no = 0;
							// clickedSong = `play_alt1`;
							// song_name = `song_name1`;
							// main(`${artist}`, song_no, `${clickedSong}`, song_name);
						}
					}
				});

				playBtn.addEventListener("click", () => {
					if (audio.paused) {
						audio.play();
						playBtn.src = "svg/pause.svg";
						interval = setInterval(randomizeHeights, 200); // Randomize heights every 200ms
					} else {
						audio.pause();
						playBtn.src = "svg/song_play.svg";
						clearInterval(interval);
					}
				});

				document.addEventListener("click", function (e) {
					if (
						(e.target.id && /\d+$/.test(e.target.id)) ||
						e.target == nextBtn ||
						e.target == previousBtn
					) {
						if (e.target == previousBtn && song_no > 0) {
							if (currentSong) {
								currentSong.pause();
								currentSong.currentTime = 0;
								clearInterval(interval);
								clickedSongId.style.display = "flex";
								clickedSongText.style.color = "white";
							}

							song_no = song_no - 1;
							clickedSong = `play_alt${song_no + 1}`;
							song_name = `song_name${song_no + 1}`;

							clearInterval(interval);
							console.log("clling main from previous", song_no);
							main(`${artist}`, song_no, `${clickedSong}`, song_name);
						}
						if (e.target == nextBtn && song_no < info[artist][0].length - 1) {
							if (currentSong) {
								currentSong.pause();
								currentSong.currentTime = 0;
								clearInterval(interval);
								clickedSongId.style.display = "flex";
								clickedSongText.style.color = "white";
							}

							song_no = song_no + 1;
							clickedSong = `play_alt${song_no + 1}`;
							song_name = `song_name${song_no + 1}`;

							clearInterval(interval);
							console.log("calling main from next", song_no);
							main(`${artist}`, song_no, `${clickedSong}`, song_name);
						}

						if (e.target.id && /\d+$/.test(e.target.id)) {
							clickedSong = e.target.id;
							song_no = clickedSong[clickedSong.length - 1] - 1;

							try {
								artist = localStorage.parent_id;
								const parentElement = e.target.closest(".list_left");
								const songNameElement = parentElement.querySelector(".song_name");
								song_name = songNameElement.id;
								if (clickedSongId) {
									clickedSongId.style.display = "flex";
									clickedSongText.style.color = "white";
								}
							} catch (error) {
								console.log("Clicked list_right");
							}

							clearInterval(interval);
							console.log("calling main from clicked song", song_no);
							main(`${artist}`, song_no, `${clickedSong}`, song_name);
						}
					}
				});
			}
			new_page();
		}, 1);
	}
});
