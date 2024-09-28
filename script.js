let library = document.getElementById("library");
let collapse = document.getElementById("collapse");
let back = document.getElementById("back");
let forward = document.getElementById("forward");
let f_hid = document.getElementById("forward_hidden");
let b_hid = document.getElementById("back_hidden");

library.addEventListener("mouseenter", () => {
	collapse.style.display = "flex";
});

library.addEventListener("mouseleave", () => {
	collapse.style.display = "none";
});

back.addEventListener("mouseenter", () => {
	b_hid.style.display = "flex";
});

back.addEventListener("mouseleave", () => {
	b_hid.style.display = "none";
});

forward.addEventListener("mouseenter", () => {
	f_hid.style.display = "flex";
});

forward.addEventListener("mouseleave", () => {
	f_hid.style.display = "none";
});

// async function getSongs() {
// 	let a = await fetch("http://127.0.0.1:3000/songs/alan_walker/");
// 	let response = await a.text();
// 	let div = document.createElement("div");
// 	div.innerHTML = response;
// 	let as = div.getElementsByTagName("a");
// 	console.log(as);
// 	let songs = [];
// 	for (let i = 0; i < as.length; i++) {
// 		const element = as[i];
// 		// console.log("element", i, "==>", element);
// 		// if (!element.href.endsWith("http://127.0.0.1:3000/")) {
// 		if (element.href.endsWith(".mp3")) {
// 			songs.push(element.href);
// 		}
// 		// songs.push(element.href);
// 		// console.log(songs);
// 	}
// 	console.log(songs);
// 	return songs;
// }

// getSongs();

// async function data() {
async function fetchData() {
	let data = await fetch("http://127.0.0.1:3000/data.json/");
	let info = await data.json();
	// console.log(info.alan_walker[0]);
	// console.log(info);

	// var audio = new Audio(info.alan_walker[0]);
	return info;
}

// fetchData();

// async function main(artist, number) {
// 	let songs = await data();
// 	console.log(songs);
// 	var audio = new Audio(songs[artist][0][number]);
// 	audio.play();

// 	let audioPlayer = document.getElementById("audioPlayer");
// 	// audioPlayer.setAttribute;
// 	audioPlayer.src = songs.alan_walker[0];
// 	// audioPlayer.play();
// }

// main();

// let page = "";

document.addEventListener("DOMContentLoaded", () => {
	document.querySelectorAll(".content").forEach((element) => {
		element.addEventListener("click", (event) => {
			const clicked_elem = event.target.closest(".child");
			if (clicked_elem) {
				const parent_id = clicked_elem.closest(".content").id;
				console.log(parent_id);
				// page = parent_id;
				// console.log("page =>", page);
				localStorage.setItem("parent_id", parent_id);
				window.location.href = "index2.html";
			}
		});
	});
	if (window.location.pathname.endsWith("index2.html")) {
		setTimeout(() => {
			async function new_page() {
				let data = await fetch("http://127.0.0.1:3000/data.json/");
				let info = await data.json();
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

				async function main(artist, number, clickedSong) {
					const clickedSongId = document.getElementById(clickedSong);
					// console.log(clickedSongId);
					clickedSongId.style.display = "none";
					let songs = await fetchData();
					// console.log(songs);
					var audio = new Audio(songs[artist][0][number]);
					audio.play();

					audio.addEventListener("ended", function () {
						clickedSongId.style.display = "flex";
					});
				}

				// const play = document.getElementById("play_alt");
				document.addEventListener("click", function (e) {
					console.log(e.target);
					if (e.target.classList.contains("play_alt")) {
						const clickedSong = e.target.id;
						const song_no = clickedSong[clickedSong.length - 1] - 1;
						const artist = localStorage.parent_id;
						const parentElement = e.target.closest(".list_left");
						const songNameElement = parentElement.querySelector(".song_name");
						const song_name = songNameElement.id;
						document.getElementById(song_name).style.color = "greenyellow";
						console.log(
							"Clicked element ID ==>",
							clickedSong,
							"song number ==>",
							song_no,
							artist
						);
						console.log(clickedSong[clickedSong.length - 1]);
						// console.log(play);
						main(`${artist}`, song_no, `${clickedSong}`);
					}
				});
			}
			new_page();
		}, 50);
	}
});
