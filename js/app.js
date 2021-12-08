const API_KEY = "AIzaSyAUCSTzBPyrChojzUP8KzW28_VIy4wO058";
const PLAYLIST_ID = "PLZ4ny09ZUze2Risqpzt9rvV3yLzc_RPGi";
let list = [];
let deleted = [];

function getVideos(t) {
	var url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&key=${API_KEY}&playlistId=${PLAYLIST_ID}&maxResults=50`;
	if (t != undefined) {
		url = url + "&pageToken=" + t;
	}
	$.ajax({
		type: "GET",
		url: url,
		dataType: "json",
		success: function (html) {
			// add html.items to list array
			list = list.concat(html.items);

			if (html.nextPageToken != undefined) {
				getVideos(html.nextPageToken);
			} else {
				displayVideos(list);
			}
		},
	});
}

function displayVideos(videos) {
	var videoContainer = document.querySelector("#video-container");
	videoContainer.innerHTML = "";
	for (var i = 0; i < videos.length; i++) {
		var video = videos[i];
		var videoLink = document.createElement("a");
		videoLink.className = "video";
		videoLink.setAttribute(
			"href",
			"https://www.youtube.com/watch?v=" +
				video.snippet.resourceId.videoId
		);
		var thumbnail = document.createElement("img");
		if (video.snippet.thumbnails.medium != undefined) {
			thumbnail.setAttribute("src", video.snippet.thumbnails.medium.url);
		} else {
			// add i to list
			deleted.push(i);
			continue;
		}
		videoLink.appendChild(thumbnail);

		var info = document.createElement("div");
		info.classList.add("video-info");

		var title = document.createElement("h3");
		title.innerHTML = video.snippet.title;

		var description = document.createElement("p");
		description.innerHTML = video.snippet.description;

		info.appendChild(title);
		info.appendChild(description);

		videoLink.appendChild(info);

		videoContainer.appendChild(videoLink);
	}
	for (var i = 0; i < deleted.length; i++) {
		videos.splice(deleted[i], 1);
	}
}

getVideos();

const random = document.querySelector("#random");
random.addEventListener("click", function () {
	var randomVideo = list[Math.floor(Math.random() * list.length)];
	window.location.href =
		"https://www.youtube.com/watch?v=" +
		randomVideo.snippet.resourceId.videoId;
});
