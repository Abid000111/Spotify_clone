let total_time = document.getElementById("total_time");
let time_played = document.getElementById("time_played");
let audio = new Audio();
let playBtn = document.getElementById("play");
let previousBtn = document.getElementById("previous");
let nextBtn = document.getElementById("next");
let cursor = document.querySelector("#cursor");
let cursorBlur = document.querySelector("#cursor-blur");

document.addEventListener("mousemove", function (dets) {
	cursor.style.left = dets.x + "px";
	cursor.style.top = dets.y + "px";
	cursorBlur.style.left = dets.x + "px";
	cursorBlur.style.top = dets.y + "px";
});

function getRandomHexColor() {
	return `#${Math.floor(Math.random() * 16777215)
		.toString(16)
		.padStart(6, "0")}`;
}

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

async function fetchData() {
	let data = await fetch(
		"https://splendorous-kitten-704307.netlify.app/data.json"
	);
	let info = await data.json();
	return info;
}

document.addEventListener("DOMContentLoaded", () => {
	document.querySelectorAll(".content").forEach((element) => {
		element.addEventListener("click", (event) => {
			const clicked_elem = event.target.closest(".child");
			if (clicked_elem) {
				const parent_id = clicked_elem.closest(".content").id;
				console.log(parent_id);
				localStorage.setItem("parent_id", parent_id);
				window.location.href = "index2.html";
			}
		});
	});

	document.querySelectorAll(".search_icon").forEach((element) => {
		element.addEventListener("click", (event) => {
			const parentId = event.target.parentElement.id; // Get the parent element's ID
			console.log(parentId);
			if (parentId == "search_icon") {
				document.getElementById("search_click1").style.display = "block";
				setTimeout(() => {
					document.getElementById("search_click1").style.display = "none";
				}, 1500);
			} else if (parentId == "search_icon_nav") {
				document.getElementById("search_click2").style.display = "block";
				setTimeout(() => {
					document.getElementById("search_click2").style.display = "none";
				}, 1500);
			}
		});
	});

	document.getElementById("container").addEventListener("click", (e) => {
		const parentId = e.target.parentElement.id;
		if (parentId == "forward") {
			window.history.forward();
		} else if (parentId == "back") {
			window.location.href = "index.html";
		}
	});

	if (window.location.pathname.endsWith("index2.html")) {
		setTimeout(() => {
			document.getElementById("container").addEventListener("click", (e) => {
				const parentId = e.target.parentElement.id;
				if (e.target.id === "home") {
					window.history.back();
				} else if (parentId == "search_icon") {
					document.getElementById("search_click1").style.display = "block";
					setTimeout(() => {
						document.getElementById("search_click1").style.display = "none";
					}, 1500);
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
				// let data = await fetch("http://127.0.0.1:3000/data.json/");
				// let info = await data.json();
				let info = await fetchData();
				// console.log(info[localStorage.parent_id][1][0]);
				let bg_img = document.querySelector("#bg_img img");
				// let pf_img = document.querySelector("#pf_img img");
				// console.log(bg_img);
				// console.log(pf_img);
				bg_img.src = info[localStorage.parent_id][1][0].bg_img;
				bg_img.alt = info[localStorage.parent_id][1][0].alt;
				// pf_img.src = info[localStorage.parent_id][1][0].pf_img;
				// pf_img.alt = info[localStorage.parent_id][1][0].alt;
				document.getElementById("name").innerHTML =
					info[localStorage.parent_id][1][0].name;
				document.getElementById("listener").innerHTML =
					info[localStorage.parent_id][1][0].listeners;

				// document.getElementById("bottom_sec").style.background =
				// 	"linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(66,25,63,1) 67%, rgba(255,0,18,1) 100%)";
				const bg = info[localStorage.parent_id][1][0].bg;
				document.getElementById("bottom_sec").style.background = bg;
				// console.log(info[localStorage.parent_id][1][0].bg);

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
				// console.log(three_dot);

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
					// console.log(key);
					// name = info[localStorage.parent_id][1][0][name_key];
					// console.log(name);

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
					// num_hover_changed.className = "num_hover_play" + `${i}`;
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
					// console.log("num_hover_changed ==>", num_hover_changed);
					// console.log("num_hover_play ==>", num_hover_play);
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
					let songs = await fetchData();
					audio.src = songs[artist][0][number];

					audio.play();

					audio.volume = 0.5; // Default volume

					// Volume control
					const volumeSlider = document.getElementById("volume");
					volumeSlider.addEventListener("input", (event) => {
						const volume = event.target.value;
						audio.volume = volume; // Adjust audio volume
						console.log(`Volume set to: ${volume}`);
					});

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

					audio.addEventListener("ended", function () {
						clickedSongId.style.display = "flex";
						clickedSongText.style.color = "white";
						playBtn.src = "svg/song_play.svg";
						clearInterval(interval);
						bars.forEach((bar) => {
							bar.style.height = "50px"; // Reset to default height
						});
					});
				}

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
						// e.target.classList.contains("play_alt") ||
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

							// if (clickedSongId) {
							// 	clickedSongId.style.display = "flex";
							// 	clickedSongText.style.color = "white";
							// }

							clearInterval(interval);
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

							// if (clickedSongId) {
							// 	clickedSongId.style.display = "flex";
							// 	clickedSongText.style.color = "white";
							// }

							clearInterval(interval);
							main(`${artist}`, song_no, `${clickedSong}`, song_name);
						}

						// if (e.target.classList.contains("play_alt")) {
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
							main(`${artist}`, song_no, `${clickedSong}`, song_name);
						}
					}
				});
			}
			new_page();
		}, 1);
	}
});
