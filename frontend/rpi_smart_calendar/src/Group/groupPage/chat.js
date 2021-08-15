"use strict";

var BACKEND_URL = window.location.hostname;

var formatter = new Intl.DateTimeFormat("en-US");

function parseDate(str) {
  // TODO: this may be a hack
  let offset = new Date().getTimezoneOffset() * 60 * 1000;
  let date = new Date(Date.parse(str) + offset);
  return date;
}

function loadGroups() {
	let xhr = new XMLHttpRequest();
	xhr.open("GET", `http://${BACKEND_URL}/group/`);
	xhr.timeout = 10000;
	xhr.responseType = 'json';
	xhr.withCredentials = true;
	xhr.send();
	xhr.onerror = function() {
		alert("send failed on frontend side.");
	}
	xhr.onload = function() {
		if (xhr.status != 200) {
			alert("send failed on backend side.");
		} else {
			loadGroups2(xhr);
		}
	}
}

function loadGroups2(xhr) {
	let groups = xhr.response;
	let container = document.getElementsByClassName("group_container")[0];
	for (let i = 0; i < groups.data.length; i++) {
		let btn = document.createElement("button");
		if (i == 0) {
			btn.className = "btn group active";
		}
		else {
			btn.className = "btn group";
		}
		let course = document.createElement("h5");
		course.innerHTML = groups.data[i];
		btn.appendChild(course);
		container.appendChild(btn);
		
		loadMessages(groups.data[0]);
	}


	let btns = document.getElementsByClassName("group");
	console.log(btns);
	console.log(btns.length);
	for (let i = 0; i < btns.length; i++) {
		console.log(btns[i]);
		btns[i].addEventListener("click", function (event) {
			let current = document.getElementsByClassName("active");
			let past = current[0].getElementsByTagName("h5")[0].innerHTML;
			current[0].className = current[0].className.replace(" active", "");
			this.className += " active";

			if (past !== this.innerText){
				loadMessages(this.getElementsByTagName("h5")[0].innerHTML);
			}
		});
	}
}

function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

function loadMessages(course) {
	let msg_container = document.getElementById("msgs");
	let currentUser = getCookie("username");
	msg_container.innerHTML = "";

	let xhr = new XMLHttpRequest();
	xhr.open("GET", `http://${BACKEND_URL}/group/${course}/message`, false);
	xhr.withCredentials = true;
	xhr.send();
	let resJson = JSON.parse(xhr.response);
	let data = resJson.data;

	for (let i = 0; i < data.length; i++) {
		let message = data[i];

		if (message.sender.username === currentUser) {
			let new_msg = document.createElement("div");
			new_msg.className = "msg";

			let img_div = document.createElement("div");
			img_div.className = "right_img";
			let img = document.createElement("img");
			img.src = "https://image.flaticon.com/icons/png/512/149/149071.png";
			img_div.appendChild(img);

			let msg_div = document.createElement("div");
			msg_div.className = "sent_msg";
			let msg = document.createElement("p");
			msg.innerHTML = message.text;
			msg_div.appendChild(msg);


			let timeHTML = document.createElement("div");
			timeHTML.className = "time_right";
			let sendTime = parseDate(message.time);
			timeHTML.innerHTML = formatter.format(sendTime);
			msg_div.appendChild(timeHTML);

			new_msg.appendChild(img_div);
			new_msg.appendChild(msg_div);

			msg_container.appendChild(new_msg);

			textbox.value = "";
			msg_container.scrollTop = msg_container.scrollHeight;
		}
		else {
			let new_msg = document.createElement("div");
			new_msg.className = "msg";

			let img_div = document.createElement("div");
			img_div.className = "left_img";
			let img = document.createElement("img");
			img.src = "https://image.flaticon.com/icons/png/512/149/149071.png";
			img_div.appendChild(img);

			let msg_div = document.createElement("div");
			msg_div.className = "received_msg";
			let sender = document.createElement("span");
			sender.innerHTML = message.sender.username;
			let msg = document.createElement("p");
			msg.innerHTML = message.text;
			msg_div.appendChild(sender);
			msg_div.appendChild(msg);


			let time = document.createElement("div");
			time.className = "time_left";
			time.innerHTML = formatter.format(parseDate(message.time));
			msg_div.appendChild(time);

			new_msg.appendChild(img_div);
			new_msg.appendChild(msg_div);

			msg_container.appendChild(new_msg);

			textbox.value = "";
			msg_container.scrollTop = msg_container.scrollHeight;
		}
	}
}

function send() {
	let currentGroup = document.getElementsByClassName("btn group active")[0].innerText;
	console.log(currentGroup);

	let new_msg = document.createElement("div");
	new_msg.className = "msg";

	let img_div = document.createElement("div");
	img_div.className = "right_img";
	let img = document.createElement("img");
	img.src = "https://image.flaticon.com/icons/png/512/149/149071.png";
	img_div.appendChild(img);

	let msg_div = document.createElement("div");
	msg_div.className = "sent_msg";
	let msg = document.createElement("p");
	// let textbox = document.getElementById("textbox");
	if (textbox.value !== "") {
		msg.innerHTML = textbox.value;
		msg_div.appendChild(msg);
	
	
		let time = document.createElement("div");
		time.className = "time_right";
		time.innerHTML = formatter.format(new Date());
		msg_div.appendChild(time);
	
		new_msg.appendChild(img_div);
		new_msg.appendChild(msg_div);
	
		let payload = new FormData();
		payload.set("text", textbox.value);
	
		let msg_container = document.getElementById("msgs");
		msg_container.appendChild(new_msg);
		textbox.value = "";
		msg_container.scrollTop = msg_container.scrollHeight;
	
		let xhr = new XMLHttpRequest();
		xhr.open("POST", `http://${BACKEND_URL}/group/${currentGroup}/receive`);
		xhr.timeout = 10000;
		xhr.responseType = 'json';
		xhr.withCredentials = true;
		xhr.send(payload);
	
		xhr.onerror = function() {
			alert("send failed on frontend side.");
		}
		xhr.onload = function() {
			if (xhr.status != 200) {
				alert("send failed on backend side.");
			}
		}
	}
}



window.onload = function () {
	console.log("loading");

	let button = document.getElementById("send_btn");
	let textbox = document.getElementById("textbox");

	loadGroups();



	button.addEventListener('click', send);

	textbox.addEventListener('keyup', function (event) {
		if (event.code === 'Enter') {
			event.preventDefault();
			send();
		}
	});
}

function onReturnBtnClick() {
	window.location.replace("/");
}